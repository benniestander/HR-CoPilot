// NOTE: This is a TypeScript file. Do not run this in a SQL Editor.
import { GoogleGenAI } from "@google/genai";
import type { FormAnswers, PolicyUpdateResult } from '../types';

// Helper to safely get the API Key without crashing if 'process' is undefined
const getApiKey = () => {
  try {
    // Primary method as per guidelines
    if (process.env.API_KEY) return process.env.API_KEY;
  } catch (e) {
    // Ignore ReferenceError if process is not defined
  }
  
  // Fallback for Vite environments if process.env isn't polyfilled
  try {
    const env = (import.meta as any).env;
    if (env && env.API_KEY) return env.API_KEY;
  } catch (e) {
    // Ignore
  }
  
  return undefined;
};

// Initialize Gemini Client
// We use a dummy key if missing to prevent 'new GoogleGenAI' from throwing on load.
// Actual calls will fail gracefully with the specific error in the functions below.
const ai = new GoogleGenAI({ apiKey: getApiKey() || 'MISSING_API_KEY' });

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
  const apiKey = getApiKey();
  if (!apiKey) {
      throw new Error("Client Configuration Error: Missing API_KEY. Please check your .env file.");
  }

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

  try {
    const response = await ai.models.generateContentStream({
        model: model,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });

    for await (const chunk of response) {
        yield {
            text: chunk.text,
            groundingMetadata: chunk.candidates?.[0]?.groundingMetadata
        };
    }
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate policy. Please check your internet connection.");
  }
};

export const generateFormStream = async function* (type: string, answers: FormAnswers) {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("Client Configuration Error: Missing API_KEY.");
    }

    const model = 'gemini-2.5-flash';
    
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
  
    try {
        const response = await ai.models.generateContentStream({
            model: model,
            contents: prompt
        });

        for await (const chunk of response) {
            if (chunk.text) yield chunk.text;
        }
    } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        throw new Error(error.message || "Failed to generate form.");
    }
};

export const updatePolicy = async (content: string, instructions?: string): Promise<PolicyUpdateResult> => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("Client Configuration Error: Missing API_KEY.");
    }

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

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text;
        
        if (!text) throw new Error("No response from Ingcweti AI");
        
        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonStr) as PolicyUpdateResult;
    } catch (error: any) {
        console.error("Gemini Update Error:", error);
        throw new Error(error.message || "Failed to update policy.");
    }
};

export const explainPolicyTypeStream = async function* (title: string) {
    const apiKey = getApiKey();
    if (!apiKey) {
        yield "Configuration Error: API Key missing.";
        return;
    }

    const model = 'gemini-2.5-flash';
    const prompt = `Explain the purpose and key components of a "${title}" in the context of South African HR law. Keep it brief and informative for a business owner.`;
    
    try {
        const response = await ai.models.generateContentStream({
            model: model,
            contents: prompt
        });

        for await (const chunk of response) {
            if (chunk.text) yield chunk.text;
        }
    } catch (error) {
        console.error("Explanation Error:", error);
        yield "Could not generate explanation at this time.";
    }
}

export const explainFormTypeStream = async function* (title: string) {
    const apiKey = getApiKey();
    if (!apiKey) {
        yield "Configuration Error: API Key missing.";
        return;
    }

    const model = 'gemini-2.5-flash';
    const prompt = `Explain the purpose of a "${title}" form in South African HR management. Keep it brief.`;
    
    try {
        const response = await ai.models.generateContentStream({
            model: model,
            contents: prompt
        });

        for await (const chunk of response) {
            if (chunk.text) yield chunk.text;
        }
    } catch (error) {
        console.error("Explanation Error:", error);
        yield "Could not generate explanation at this time.";
    }
}