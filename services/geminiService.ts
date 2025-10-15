import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { POLICIES, FORM_BASE_TEMPLATES, FORMS, FORM_ENRICHMENT_PROMPTS } from '../constants';
import type { PolicyType, FormType, FormAnswers } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* generatePolicyStream(
  policyType: PolicyType,
  answers: FormAnswers
): AsyncGenerator<GenerateContentResponse, void, undefined> {
  const policy = POLICIES[policyType];

  if (!policy) {
    throw new Error(`No policy data found for policy type: ${policyType}`);
  }
  
  const policyTitle = policy.title;
  const industry = answers.industry || 'general';
  const companyVoice = answers.companyVoice || 'Formal & Corporate'; // Safety default
  
  let userContext = '';
  const policyQuestions = POLICIES[policyType].questions;

  // Create a context string from user answers to specific questions for the policy
  const specificAnswers = { ...answers };
  delete specificAnswers.companyName;
  delete specificAnswers.industry;
  delete specificAnswers.companyVoice; // Remove voice from context

  for (const key in specificAnswers) {
    if (Object.prototype.hasOwnProperty.call(specificAnswers, key)) {
      const question = policyQuestions.find(q => q.id === key);
      if (question && answers[key]) {
          userContext += `- Regarding "${question.label}", the user specified: ${answers[key]}\n`;
      }
    }
  }

  const systemInstruction = "You are an expert South African HR consultant and legal drafter specializing in creating compliant HR policies for small businesses. Your primary goal is to generate legally sound, comprehensive, and practical documents based on current South African labour law. When using Google Search for grounding, you MUST prioritize information from official South African government websites (e.g., those with a .gov.za domain, like the Department of Employment and Labour) and reputable South African legal publications or law firms. This is critical for accuracy and authority. You must generate the full policy in Markdown format. Ensure the final document is well-structured, professional, and ready for use.";

  const fullPrompt = `
Please generate a comprehensive **"${policyTitle}"** for a South African company named **"${answers.companyName}"**, which operates in the **"${industry}"** industry.

**The tone of the document must be "${companyVoice}".** Adapt the language and phrasing to reflect this voice throughout the policy.

The policy must be fully compliant with current South African legislation. Focus your search on the latest versions and any recent amendments to key acts like the Basic Conditions of Employment Act (BCEA), the Labour Relations Act (LRA), the Employment Equity Act (EEA), and the Protection of Personal Information Act (POPIA), as applicable to the policy.

When performing your search, use specific queries like "latest amendments to BCEA South Africa" or "COIDA compliance requirements for ${industry} industry South Africa". This will help ground the policy in the most current and authoritative information available.

${userContext ? `**Crucially, you must incorporate the following user-provided details into the policy clauses to make them specific and relevant:**\n${userContext}` : ''}

Structure the final document with clear Markdown formatting, including a main title, numbered sections (e.g., "1. Introduction", "2. Scope"), and sub-sections as needed. The language must be professional South African English.
`;
  
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
        tools: [{googleSearch: {}}],
      },
    });

    for await (const chunk of response) {
      yield chunk;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate policy from AI. Please try again.");
  }
}

export async function* generateFormStream(
  formType: FormType,
  answers: FormAnswers
): AsyncGenerator<string, void, undefined> {
  let baseTemplate = FORM_BASE_TEMPLATES[formType];
  const form = FORMS[formType];

  if (!baseTemplate || !form) {
    throw new Error(`No template or form data found for form type: ${formType}`);
  }

  const outputFormat = form.outputFormat || 'word';

  let constructedPrompt = baseTemplate;
  for (const key in answers) {
    constructedPrompt = constructedPrompt.replace(
      new RegExp(`\\[${key}\\]`, 'g'),
      answers[key] || `(Not specified)`
    );
  }
  
  const systemInstruction = "You are an expert South African HR consultant. Your task is to refine a given markdown HR form template. You must ensure the final output is a clean, professional, and user-friendly form suitable for a small business. Your output must be in Markdown format.";

  let formatInstruction = `For a document best used in Word, focus on clear headings, paragraphs, and standard document flow.`;
  if (outputFormat === 'excel') {
      formatInstruction = `Because this document is best used in Excel, ensure the primary output is a single, well-structured, and clean Markdown table that can be easily copied into a spreadsheet. Avoid complex text outside the table where possible.`;
  }

  const enrichmentPrompt = FORM_ENRICHMENT_PROMPTS[formType] || '';

  const enrichmentInstruction = `
Based on the provided form text for a "${form.title}", please perform the following actions:
1.  Review the entire form for clarity, professionalism, and completeness.
2.  Add a brief, one-sentence instruction for the employee at the top of the form (e.g., "Please complete all sections and return to HR.").
3.  Ensure all fields intended for user input are clearly marked with a line of underscores, like this: \`_________________________\`.
4.  If there are sections for signatures, ensure there is a clear line for the signature and a separate line for the date.
5.  **Formatting Guidance:** ${formatInstruction}
6.  ${enrichmentPrompt ? `**Crucially, enhance the form by adding the following context-specific information. Integrate this naturally, for example, in a 'Notes for Employee' or 'Important Information' section to make the form more comprehensive and legally sound for a South African context:**\n*${enrichmentPrompt}*` : 'Your role is to refine and format the existing structure. Do not add new sections or fields beyond what is in the template.'}
7.  The final output must be only the complete, refined Markdown for the form.
`;
  
  const fullPrompt = `${constructedPrompt}\n\n${enrichmentInstruction}`;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
      },
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error calling Gemini API for form generation:", error);
    throw new Error("Failed to generate form from AI. Please try again.");
  }
}


export async function* explainPolicyTypeStream(
  policyTitle: string
): AsyncGenerator<string, void, undefined> {
  
  const systemInstruction = "You are a helpful AI assistant specializing in South African labour law. You explain HR policy concepts in simple, easy-to-understand terms for small business owners. Your output must be in Markdown format.";

  const userPrompt = `
Please explain what a "${policyTitle}" is in the context of a South African small business.
Your response MUST be structured with a single main heading (H1) for the title, like "# Understanding Your ${policyTitle}", followed by sub-sections using H2 headings (like "## Purpose" or "## Key Elements").
Describe its purpose, why it's important, and what key elements it typically includes under these H2 headings.
Use simple, clear language suitable for someone who is not an HR expert. Use bullet points for clarity where appropriate.
**Crucially, keep the entire explanation concise and under 250 words.** It should be a quick, easy-to-read summary.
`;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
      },
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error calling Gemini API for explanation:", error);
    throw new Error("Failed to generate explanation from AI. Please try again.");
  }
}

export async function* explainFormTypeStream(
  formTitle: string
): AsyncGenerator<string, void, undefined> {
  
  const systemInstruction = "You are a helpful AI assistant specializing in South African HR administration. You explain the purpose of HR forms in simple, easy-to-understand terms for small business owners. Your output must be in Markdown format.";

  const userPrompt = `
Please explain the purpose of a "${formTitle}" for a South African small business.
Your response MUST be structured with a single main heading (H1), like "# Understanding the ${formTitle}", followed by sub-sections using H2 headings (like "## What is it for?" or "## When to use it?").
Describe its purpose and what key information it captures.
Use simple, clear language suitable for someone who is not an HR expert. Use bullet points for clarity.
**Crucially, keep the entire explanation concise and under 250 words.** It should be a quick, easy-to-read summary.
`;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
      },
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error calling Gemini API for form explanation:", error);
    throw new Error("Failed to generate explanation from AI. Please try again.");
  }
}