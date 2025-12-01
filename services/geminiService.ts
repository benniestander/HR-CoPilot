import { supabase } from './supabase';
import type { FormAnswers, PolicyUpdateResult } from '../types';

const INDUSTRY_SPECIFIC_GUIDANCE: Record<string, Record<string, string>> = {
  'Professional Services': {
    'confidentiality': "Place a strong emphasis on client confidentiality, professional ethics, and the secure handling of sensitive client documents and data. Reference professional body codes of conduct where applicable.",
    'conflict-of-interest': "Include a detailed process for declaring and managing potential conflicts of interest, which is critical in consulting, legal, and financial advisory roles.",
    'travel': "If client travel is frequent, create a comprehensive section covering booking procedures, expense claims, per diems, and maintaining professional conduct while representing the firm.",
    'electronic-communications': "Define clear rules for professional communication with clients via email and other platforms, including disclaimers and record-keeping requirements.",
    'expense-reimbursement': "Detail the procedure for distinguishing between billable and non-billable expenses, client rebilling processes, and any specific markup policies on expenses."
  }
};

// Helper to stream from Edge Function
async function* streamFromEdgeFunction(model: string, prompt: string) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) throw new Error("Authentication required");

    const response = await fetch(`${(import.meta as any).env.VITE_SUPABASE_URL}/functions/v1/generate-content`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, prompt, stream: true })
    });

    if (!response.ok) {
        throw new Error(`AI Service Error: ${response.statusText}`);
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        // Emulate the structure expected by the UI if needed, or just yield text
        yield { text }; 
    }
}

// Simple non-streaming call
async function callEdgeFunction(model: string, prompt: string, isJson: boolean = false) {
    const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { model, prompt, stream: false }
    });

    if (error) throw error;
    return data;
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

  // Use Proxy Stream
  for await (const chunk of streamFromEdgeFunction(model, prompt)) {
    yield chunk; // Chunk structure { text: string } matches what GeneratorPage expects mostly
  }
};

export const generateFormStream = async function* (type: string, answers: FormAnswers) {
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
  
    for await (const chunk of streamFromEdgeFunction(model, prompt)) {
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

    // Note: Edge function should handle the JSON response properly
    // We might need to ask the edge function to force JSON mode if the model supports it
    // For now, we assume the prompt engineering + edge function proxy returns the response object
    const response = await callEdgeFunction(model, prompt);
    
    // The Edge function returns the full Gemini response object. We need to extract text.
    const text = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error("No response from Ingcweti AI");
    
    // Clean markdown code blocks if present
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonStr) as PolicyUpdateResult;
};

export const explainPolicyTypeStream = async function* (title: string) {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the purpose and key components of a "${title}" in the context of South African HR law. Keep it brief and informative for a business owner.`;
    
    for await (const chunk of streamFromEdgeFunction(model, prompt)) {
        if (chunk.text) yield chunk.text;
    }
}

export const explainFormTypeStream = async function* (title: string) {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the purpose of a "${title}" form in South African HR management. Keep it brief.`;
    
    for await (const chunk of streamFromEdgeFunction(model, prompt)) {
        if (chunk.text) yield chunk.text;
    }
}