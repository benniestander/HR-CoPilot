
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { FormAnswers, PolicyUpdateResult } from '../types';

// Robust safe access for env vars in Vite
// Assigning import.meta to a variable first prevents parsing ambiguity
const meta = import.meta as any;
const API_KEY = meta.env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.API_KEY : '');

if (!API_KEY) {
    console.warn("Gemini API Key is missing. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const INDUSTRY_SPECIFIC_GUIDANCE: Record<string, Record<string, string>> = {
  'Professional Services': {
    'confidentiality': "Place a strong emphasis on client confidentiality, professional ethics, and the secure handling of sensitive client documents and data. Reference professional body codes of conduct where applicable.",
    'conflict-of-interest': "Include a detailed process for declaring and managing potential conflicts of interest, which is critical in consulting, legal, and financial advisory roles.",
    'travel': "If client travel is frequent, create a comprehensive section covering booking procedures, expense claims, per diems, and maintaining professional conduct while representing the firm.",
    'electronic-communications': "Define clear rules for professional communication with clients via email and other platforms, including disclaimers and record-keeping requirements.",
    'expense-reimbursement': "Detail the procedure for distinguishing between billable and non-billable expenses, client rebilling processes, and any specific markup policies on expenses."
  }
};

/**
 * Helper to retry async functions with exponential backoff
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        if (retries === 0) throw error;
        
        // Retry on specific error codes (503 Service Unavailable, 429 Too Many Requests)
        const isRetryable = error.status === 503 || error.status === 429 || error.message?.includes('fetch failed');
        
        if (isRetryable) {
            console.warn(`Gemini API Error. Retrying in ${delay}ms... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        
        throw error;
    }
}

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

  // We can't easily retry streams mid-flight, but we can retry the initial connection
  const response = await withRetry(() => ai.models.generateContentStream({
    model,
    contents: prompt,
    config: {
        responseMimeType: 'text/plain',
    }
  })) as AsyncIterable<GenerateContentResponse>;

  for await (const chunk of response) {
    yield chunk;
  }
};

export const generateFormStream = async function* (type: string, answers: FormAnswers) {
    const model = 'gemini-2.5-flash';
    
    // Dynamic Fallback Prompt if no specific template exists (Generic Handler)
    const prompt = `Generate a professional HR Form for "${type}".
    Company Name: ${answers.companyName}
    Details: ${JSON.stringify(answers)}
    
    Context:
    This form is for South African HR compliance.
    
    Instructions:
    1. Create a clean, structured form using Markdown tables and clear headings.
    2. Include sections for Employee Details, Date, Signatures, and the specific content required for a "${type}".
    3. Ensure it looks professional and is ready to print.
    `;
  
    const response = await withRetry(() => ai.models.generateContentStream({
      model,
      contents: prompt,
    })) as AsyncIterable<GenerateContentResponse>;
  
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

    const response = await withRetry(() => ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    })) as GenerateContentResponse;

    const text = response.text;
    if (!text) throw new Error("No response from Ingcweti AI");
    return JSON.parse(text) as PolicyUpdateResult;
};

export const explainPolicyTypeStream = async function* (title: string) {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the purpose and key components of a "${title}" in the context of South African HR law. Keep it brief and informative for a business owner.`;
    
    const response = await withRetry(() => ai.models.generateContentStream({
        model,
        contents: prompt
    })) as AsyncIterable<GenerateContentResponse>;

    for await (const chunk of response) {
        if (chunk.text) yield chunk.text;
    }
}

export const explainFormTypeStream = async function* (title: string) {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the purpose of a "${title}" form in South African HR management. Keep it brief.`;
    
    const response = await withRetry(() => ai.models.generateContentStream({
        model,
        contents: prompt
    })) as AsyncIterable<GenerateContentResponse>;

    for await (const chunk of response) {
        if (chunk.text) yield chunk.text;
    }
}
