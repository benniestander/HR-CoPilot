import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { FormAnswers, PolicyUpdateResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const INDUSTRY_SPECIFIC_GUIDANCE: Record<string, Record<string, string>> = {
  'Professional Services': {
    'confidentiality': "Place a strong emphasis on client confidentiality, professional ethics, and the secure handling of sensitive client documents and data. Reference professional body codes of conduct where applicable.",
    'conflict-of-interest': "Include a detailed process for declaring and managing potential conflicts of interest, which is critical in consulting, legal, and financial advisory roles.",
    'travel': "If client travel is frequent, create a comprehensive section covering booking procedures, expense claims, per diems, and maintaining professional conduct while representing the firm.",
    'electronic-communications': "Define clear rules for professional communication with clients via email and other platforms, including disclaimers and record-keeping requirements.",
    'expense-reimbursement': "Detail the procedure for distinguishing between billable and non-billable expenses, client rebilling processes, and any specific markup policies on expenses."
  }
};

export const generatePolicyStream = async function* (type: string, answers: FormAnswers) {
  const model = 'gemini-2.5-flash';
  const industry = answers.industry || 'General';
  const companyName = answers.companyName || 'the Company';
  
  let specificGuidance = "";
  if (INDUSTRY_SPECIFIC_GUIDANCE[industry] && INDUSTRY_SPECIFIC_GUIDANCE[industry][type]) {
      specificGuidance = `\n\nIndustry Specific Instruction for ${industry}: ${INDUSTRY_SPECIFIC_GUIDANCE[industry][type]}`;
  }

  const prompt = `Generate a comprehensive HR Policy for "${type}".
  Company Name: ${companyName}
  Industry: ${industry}
  Details: ${JSON.stringify(answers)}
  ${specificGuidance}
  
  Ensure it complies with South African Labour Law (BCEA, LRA, EEA, POPIA).
  Use a professional yet accessible tone.
  Format with Markdown.`;

  const response = await ai.models.generateContentStream({
    model,
    contents: prompt,
    config: {
        responseMimeType: 'text/plain',
    }
  });

  for await (const chunk of response) {
    yield chunk;
  }
};

export const generateFormStream = async function* (type: string, answers: FormAnswers) {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate a professional HR Form for "${type}".
    Company Name: ${answers.companyName}
    Details: ${JSON.stringify(answers)}
    
    Ensure it is ready to use and complies with South African standards.
    Format with Markdown.`;
  
    const response = await ai.models.generateContentStream({
      model,
      contents: prompt,
    });
  
    for await (const chunk of response) {
        if (chunk.text) yield chunk.text;
    }
};

export const updatePolicy = async (content: string, instructions?: string): Promise<PolicyUpdateResult> => {
    const model = 'gemini-2.5-flash'; 
    const prompt = `Analyze the following HR policy document against current South African Labour Law.
    
    Current Document Content:
    ${content}
    
    User Instructions: ${instructions || "Ensure compliance and suggest improvements."}
    
    Return a JSON object with:
    1. updatedPolicyText: The full text of the updated policy.
    2. changes: An array of objects, each with:
       - changeDescription: What was changed.
       - reason: Why it was changed (referencing specific Acts if applicable).
       - originalText: The snippet that was changed (optional).
       - updatedText: The new snippet.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as PolicyUpdateResult;
};

export const explainPolicyTypeStream = async function* (title: string) {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the purpose and key components of a "${title}" in the context of South African HR law. Keep it brief and informative for a business owner.`;
    
    const response = await ai.models.generateContentStream({
        model,
        contents: prompt
    });

    for await (const chunk of response) {
        if (chunk.text) yield chunk.text;
    }
}

export const explainFormTypeStream = async function* (title: string) {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the purpose of a "${title}" form in South African HR management. Keep it brief.`;
    
    const response = await ai.models.generateContentStream({
        model,
        contents: prompt
    });

    for await (const chunk of response) {
        if (chunk.text) yield chunk.text;
    }
}
