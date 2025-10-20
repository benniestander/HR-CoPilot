

import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { POLICIES, FORM_BASE_TEMPLATES, FORMS, FORM_ENRICHMENT_PROMPTS } from '../constants';
import type { PolicyType, FormType, FormAnswers, PolicyUpdateResult, ComplianceChecklistResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const INDUSTRY_SPECIFIC_PROMPTS: Record<string, Partial<Record<PolicyType, string>>> = {
  'Construction': {
    'health-and-safety': "Incorporate specific clauses relating to the Construction Regulations of the OHS Act. This must include Personal Protective Equipment (PPE) requirements, site safety inductions, and mandatory incident reporting procedures.",
    'working-hours': "Address project-based work schedules, the management of overtime during critical project phases, and adherence to the Sectoral Determination for the building industry.",
    'coida': "Emphasize the high-risk nature of the industry and the critical importance of immediate reporting of any Injury on Duty (IOD) to facilitate COIDA claims.",
    'alcohol-drug': "Include a strict zero-tolerance policy, especially regarding the operation of heavy machinery and working at heights. Mention the company's right to conduct lawful testing."
  },
  'Manufacturing': {
    'health-and-safety': "Focus on machine guarding, lockout-tagout procedures, handling of hazardous materials (if applicable), and the specific PPE required for a factory environment.",
    'working-hours': "Detail rules for shift work, including night shifts and rotating schedules, ensuring full compliance with BCEA regulations for such arrangements.",
    'alcohol-drug': "Implement a zero-tolerance policy for employees operating machinery and mention the right to conduct testing where lawful and appropriate to ensure safety.",
    'company-property': "Add clauses related to the proper use and maintenance of factory machinery and tools."
  },
  'Hospitality': {
    'working-hours': "Address irregular hours, work on weekends and public holidays, and split shifts, ensuring payment rates align with the relevant Sectoral Determination.",
    'dress-code': "Be specific about uniform standards, personal hygiene (especially for food and beverage staff), and maintaining a professional appearance when interacting with guests.",
    'leave': "Clarify how leave is calculated and managed for employees who do not work a standard Monday-to-Friday week.",
    'employee-conduct': "Include clauses on professional interaction with guests, handling of customer complaints, and the importance of maintaining the establishment's reputation."
  },
  'Technology': {
    'remote-hybrid-work': "Provide detailed expectations for remote work, covering data security protocols, availability during core hours, and the proper use and care of company-issued equipment.",
    'confidentiality': "Strengthen clauses on protecting intellectual property, source code, client data, and proprietary information. Clearly state the consequences of data breaches.",
    'it-cybersecurity': "Elaborate on password policies, two-factor authentication (2FA), acceptable use of company networks, and the protocol for reporting suspected phishing or security threats.",
    'byod': "Detail the mandatory security requirements for personal devices connecting to the company network, such as encryption, antivirus software, and mobile device management (MDM) if applicable."
  },
  'Retail': {
    'working-hours': "Cover variable work hours based on store needs, including weekends, public holidays, and extended hours during peak seasons, aligning with the retail Sectoral Determination.",
    'employee-conduct': "Incorporate clauses on customer service excellence, cash handling procedures, point-of-sale (POS) usage, and policies regarding staff purchases and discounts.",
    'security': "Address procedures for managing shoplifting, internal theft, handling of cash floats, and end-of-day closing and security protocols.",
    'dress-code': "Define the dress code or uniform requirements clearly to ensure a professional and consistent brand image for customer-facing staff."
  },
  'Agriculture': {
    'health-and-safety': "Focus on safety protocols for operating farm machinery (e.g., tractors), handling pesticides and chemicals, and managing risks associated with livestock and extreme weather.",
    'working-hours': "Address the nature of seasonal work, piece-work systems (if used), and the legal requirements for any on-site accommodation provided to farmworkers, referencing the relevant Sectoral Determination.",
    'leave': "Explain how leave entitlement and calculation differs for seasonal workers compared to permanent staff.",
    'coida': "Highlight the importance of reporting all farm-related injuries, from minor cuts to major incidents, to ensure proper COIDA compliance."
  },
  'Professional Services': {
    'confidentiality': "Place a strong emphasis on client confidentiality, professional ethics, and the secure handling of sensitive client documents and data. Reference professional body codes of conduct where applicable.",
    'conflict-of-interest': "Include a detailed process for declaring and managing potential conflicts of interest, which is critical in consulting, legal, and financial advisory roles.",
    'travel': "If client travel is frequent, create a comprehensive section covering booking procedures, expense claims, per diems, and maintaining professional conduct while representing the firm.",
    'electronic-communications': "Define clear rules for professional communication with clients via email and other platforms, including disclaimers and record-keeping requirements."
  }
};


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
  
  const industryInstructions = INDUSTRY_SPECIFIC_PROMPTS[industry]?.[policyType] || '';

  let userContext = '';
  const policyQuestions = POLICIES[policyType].questions;

  // Create a context string from user answers to specific questions for the policy
  const specificAnswers = { ...answers };
  delete specificAnswers.companyName;
  delete specificAnswers.industry;
  delete specificAnswers.companyVoice; // Remove voice from context

  if (policyType === 'employee-handbook') {
    const includedPolicies = specificAnswers.includedPolicies as Record<string, boolean> || {};
    const selectedPolicyTitles = Object.entries(includedPolicies)
        .filter(([, isSelected]) => isSelected)
        .map(([policyId]) => {
            const policyData = POLICIES[policyId as PolicyType];
            return policyData ? policyData.title : policyId; // Fallback to id if not found
        });

    if (selectedPolicyTitles.length > 0) {
        userContext += `- The handbook must be a comprehensive document containing detailed sections for the following policies: **${selectedPolicyTitles.join(', ')}**.\n`;
    } else {
        userContext += '- The user has not selected any specific policies to include. Please generate a standard employee handbook structure including a welcome message and general code of conduct.\n';
    }
    // Remove it from specificAnswers so it's not processed again
    delete specificAnswers.includedPolicies;
  }

  for (const key in specificAnswers) {
    if (Object.prototype.hasOwnProperty.call(specificAnswers, key)) {
      const question = policyQuestions.find(q => q.id === key);
      if (question && answers[key]) {
          userContext += `- Regarding "${question.label}", the user specified: ${answers[key]}\n`;
      }
    }
  }

  const systemInstruction = "You are an expert South African HR consultant and legal drafter specializing in creating compliant HR policies for small businesses. Your primary goal is to generate legally sound, comprehensive, and practical documents based on current South African labour law. When using Google Search for grounding, you MUST prioritize information from official South African government websites (e.g., those with a .gov.za domain, like the Department of Employment and Labour) and reputable South African legal publications or law firms. This is critical for accuracy and authority. You must generate the full policy in Markdown format. Ensure the final document is well-structured, professional, and ready for use.";

  const promptIntro = policyType === 'employee-handbook' 
    ? `Please generate a comprehensive **"${policyTitle}"** for a South African company named **"${answers.companyName}"**, which operates in the **"${industry}"** industry.`
    : `Please generate a comprehensive **"${policyTitle}"** for a South African company named **"${answers.companyName}"**, which operates in the **"${industry}"** industry.`;

  const handbookInstructions = policyType === 'employee-handbook'
    ? "The handbook must be a cohesive, well-structured document, not just a list of separate policies. It should include an introduction, a welcome message from the CEO/MD, and then the detailed policy sections."
    : "";


  const fullPrompt = `
${promptIntro}

**The tone of the document must be "${companyVoice}".** Adapt the language and phrasing to reflect this voice throughout the document.

${handbookInstructions}

The policy must be fully compliant with current South African legislation. Focus your search on the latest versions and any recent amendments to key acts like the Basic Conditions of Employment Act (BCEA), the Labour Relations Act (LRA), the Employment Equity Act (EEA), and the Protection of Personal Information Act (POPIA), as applicable to the policy.

When performing your search, use specific queries like "latest amendments to BCEA South Africa" or "standard employee handbook clauses South Africa". This will help ground the policy in the most current and authoritative information available.

${industryInstructions ? `**For a company in the "${industry}" industry, it is essential that you specifically address the following points:**\n- ${industryInstructions}\n` : ''}

${userContext ? `**In addition, integrate the following specific details provided by the user:**\n${userContext}` : ''}

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

export async function updatePolicy(
  currentPolicyText: string,
): Promise<PolicyUpdateResult> {
  const systemInstruction = `You are an expert South African HR consultant and legal drafter specializing in reviewing and updating HR policies for small businesses to ensure compliance with the latest South African labour law. Your goal is to return a JSON object containing the updated policy and a detailed log of changes.
- You MUST only update what is legally necessary or outdated to comply with current South African legislation (e.g., BCEA, LRA, POPIA).
- You MUST preserve the original tone, structure, and wording as much as possible. Do not rewrite entire sections unless essential for compliance.
- For each change, you MUST provide a concise reason, citing the relevant legislation where possible.
- The output MUST be a valid JSON object matching the provided schema. Do not include any markdown formatting or introductory text outside of the JSON structure.`;
  
  const prompt = `
Please review the following South African HR policy. Identify any sections that are outdated or non-compliant with current labour laws. Provide an updated version of the policy and a list of all changes made.

**Current Policy Text:**
---
${currentPolicyText}
---
`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      updatedPolicyText: {
        type: Type.STRING,
        description: 'The full, updated text of the policy in Markdown format.',
      },
      changes: {
        type: Type.ARRAY,
        description: 'An array of objects detailing each change made to the policy.',
        items: {
          type: Type.OBJECT,
          properties: {
            changeDescription: {
              type: Type.STRING,
              description: 'A brief summary of what was changed, e.g., "Updated leave days calculation".',
            },
            reason: {
              type: Type.STRING,
              description: 'The educational reason for the change, citing relevant SA legislation (e.g., "This aligns with the latest amendment to the BCEA regarding parental leave.").',
            },
            originalText: {
              type: Type.STRING,
              description: 'The original text snippet that was changed or removed. Omit if the change is a pure addition.',
            },
            updatedText: {
              type: Type.STRING,
              description: 'The new text snippet that was added or that replaced the original.',
            },
          },
          required: ['changeDescription', 'reason', 'updatedText'],
        },
      },
    },
    required: ['updatedPolicyText', 'changes'],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    // The response.text is a JSON string.
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as PolicyUpdateResult;

  } catch (error) {
    console.error("Error calling Gemini API for policy update:", error);
    throw new Error("Failed to update policy from AI. Please check the input and try again.");
  }
}

export async function generateComplianceChecklist(
  businessDescription: string,
): Promise<ComplianceChecklistResult> {
  const systemInstruction = `You are an expert South African HR consultant. Your task is to analyze a business description and recommend a checklist of essential HR policies and forms for legal compliance in South Africa. You must provide clear, concise reasons for each recommendation, tailored to the business described. Your output must be a valid JSON object that adheres strictly to the provided schema.`;

  const prompt = `
Based on the following business description, please generate a list of recommended HR policies and forms that are essential for a small business in South Africa.

**Business Description:**
---
${businessDescription}
---

For each recommended policy and form, provide a short, practical reason why it is important for this specific business. Focus on the most critical documents for legal compliance and good practice.
`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      policies: {
        type: Type.ARRAY,
        description: 'A list of recommended HR policies.',
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'The full name of the policy, e.g., "Disciplinary Code and Procedure".'
            },
            reason: {
              type: Type.STRING,
              description: 'A brief, tailored explanation of why this policy is recommended for this specific business.'
            }
          },
          required: ['name', 'reason'],
        },
      },
      forms: {
        type: Type.ARRAY,
        description: 'A list of recommended HR forms.',
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'The full name of the form, e.g., "Leave Application Form".'
            },
            reason: {
              type: Type.STRING,
              description: 'A brief, tailored explanation of why this form is recommended for this specific business.'
            }
          },
          required: ['name', 'reason'],
        },
      },
    },
    required: ['policies', 'forms'],
  };
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ComplianceChecklistResult;

  } catch (error) {
    console.error("Error calling Gemini API for compliance checklist:", error);
    throw new Error("Failed to generate compliance checklist from AI. Please try again.");
  }
}