
import { GoogleGenAI } from "@google/genai";
import type { FormAnswers, PolicyUpdateResult, CompanyProfile } from '../types';

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

const formatDiagnosticContext = (profile: CompanyProfile): string => {
    let context = "CRITICAL HR DIAGNOSTIC CONTEXT (MUST BE REFLECTED IN POLICY WHERE RELEVANT):\n";
    
    // Part 1: Jurisdictional
    if (profile.bargainingCouncil && profile.bargainingCouncil !== 'No') {
        context += `- JURISDICTION: User falls under a Bargaining Council (${profile.bargainingCouncil}). WARNING: Sectoral Determination/Main Agreement overrides BCEA. Ensure policy aligns with Council rules.\n`;
    }
    if (profile.unionized === 'Yes') {
        context += `- UNIONS: Active Union Recognition. Changes to conditions of employment require consultation. Include consultation clauses where applicable.\n`;
    }
    
    // Part 2: Operational
    if (profile.annualShutdown === 'Yes') {
        context += `- LEAVE: Company has Annual Shutdown (Dec/Jan). Policy MUST mandate employees save leave for this period to avoid double payment liability.\n`;
    }
    if (profile.overtimePayment) {
        context += `- OVERTIME: Structure is '${profile.overtimePayment}'. If 'None/Above Threshold', clarify earnings threshold exclusion. If 'Time Off', specify time-off-in-lieu rules.\n`;
    }
    if (profile.workModel) {
        context += `- REMOTE WORK: Model is '${profile.workModel}'. If Remote/Hybrid, OHSA clause must mention home office safety and IT policy must cover remote data security.\n`;
    }

    // Part 3: Financial
    if (profile.salaryAdvances === 'Yes') {
        context += `- LOANS: Company allows salary advances. Policy MUST enforce written AODs per BCEA Sec 34.\n`;
    }
    if (profile.deductionLiability === 'Yes') {
        context += `- DEDUCTIONS: Policy MUST state employees are liable for negligence (lost laptops/crashes) ONLY if a fair procedure is followed and written consent obtained.\n`;
    }
    if (profile.paidMaternityTraining === 'Yes') {
        context += `- RETENTION: Company funds training/maternity. Include Work-Back/Retention clauses to recover costs if employee resigns shortly after.\n`;
    }
    if (profile.retirementAge && profile.retirementAge !== 'None') {
        context += `- RETIREMENT: Mandatory retirement age is ${profile.retirementAge}. This MUST be explicit to avoid Unfair Dismissal claims.\n`;
    }

    // Part 4: Discipline
    if (profile.criticalOffenses) {
        context += `- DISCIPLINE: Critical 'Cardinal Sins' for this business: ${profile.criticalOffenses}. These should be listed as dismissible offenses in the code.\n`;
    }
    if (profile.probationPeriod) {
        context += `- PROBATION: Probation period is ${profile.probationPeriod}. Policy must mandate performance reviews during this time.\n`;
    }
    if (profile.disciplinaryAuthority) {
        context += `- AUTHORITY: Disciplinary process is handled by ${profile.disciplinaryAuthority}. Workflow must reflect this.\n`;
    }
    if (profile.officeRomanceDisclosure === 'Yes') {
        context += `- CONDUCT: Office romances must be disclosed to HR to prevent conflict of interest/harassment claims.\n`;
    }
    if (profile.familyEmployment === 'Yes') {
        context += `- NEPOTISM: Family members are employed. Policy must explicitly state rules apply equally to all to prevent inconsistency claims.\n`;
    }

    // Part 5: Tech
    if (profile.surveillanceMonitoring === 'Yes') {
        context += `- PRIVACY: Company monitors emails/calls/vehicles. Policy must serve as RICA 'Written Consent'.\n`;
    }
    if (profile.byodPolicy === 'Yes') {
        context += `- BYOD: Staff use personal devices. Policy must claim ownership of company data (e.g., client lists on WhatsApp) on these devices.\n`;
    }
    if (profile.socialMediaRestrictions === 'Yes') {
        context += `- SOCIAL MEDIA: Strict rules required for conduct linking back to employer on personal accounts.\n`;
    }
    if (profile.moonlightingAllowed === 'No') {
        context += `- MOONLIGHTING: Secondary employment strictly prohibited or requires written permission.\n`;
    }

    // Part 6: Health & Incapacity
    if (profile.incapacityApproach === 'Inquiry') {
        context += `- INCAPACITY: Long-term illness must follow an 'Incapacity Inquiry' (LRA Sched 8 Items 10-11), NOT disciplinary procedures.\n`;
    }
    if (profile.substanceAbuseSupport === 'Rehab') {
        context += `- SUBSTANCE ABUSE: Approach is Rehabilitation. Policy must offer support/counselling before dismissal steps.\n`;
    }
    if (profile.drugTestingPolicy && profile.drugTestingPolicy !== 'None') {
        context += `- TESTING: ${profile.drugTestingPolicy} drug/alcohol testing is in place. Policy must include explicit consent clause for testing.\n`;
    }

    return context;
};

export const generatePolicyStream = async function* (type: string, answers: FormAnswers) {
  const model = 'gemini-2.5-flash';
  const industry = answers.industry || 'General';
  const companyName = answers.companyName || 'the Company';
  
  let specificGuidance = "";
  if (INDUSTRY_SPECIFIC_GUIDANCE[industry] && INDUSTRY_SPECIFIC_GUIDANCE[industry][type]) {
      specificGuidance = `\n\nIndustry Specific Instruction for ${industry}: ${INDUSTRY_SPECIFIC_GUIDANCE[industry][type]}`;
  }

  // Inject HR Diagnostic Context
  const diagnosticContext = formatDiagnosticContext(answers as CompanyProfile);

  const prompt = `Generate a comprehensive HR Policy for "${type}".
  Company Name: ${companyName}
  Industry: ${industry}
  
  ${diagnosticContext}
  
  Additional User Details: ${JSON.stringify(answers)}
  ${specificGuidance}
  
  Ensure it complies with South African Labour Law (BCEA, LRA, EEA, POPIA).
  Use a professional yet accessible tone.
  Format with Markdown.

  *** COMPLIANCE CHECKLIST REQUIREMENT ***
  At the very end of the document, you MUST append a "Compliance Checklist" table to confirm that general and specific requirements have been met.
  
  Please use this exact Markdown table format:
  
  ### Compliance Checklist
  | Aspect                | Status | Notes                                                 |
  | --------------------- | ------ | ----------------------------------------------------- |
  | BCEA Alignment        | ✅      | All entitlements/conditions match ss20-25C + Van Wyk. |
  | POPIA                 | ✅      | Retention, access, security covered.                  |
  | Discretionary Clauses | ✅      | Balanced with "unreasonable" safeguards.              |
  | Termination Payments  | ✅      | Pro-rata explicit.                                    |
  | Notice Periods        | ✅      | Escalation added.                                     |
  | Inclusivity           | ✅      | Gender-neutral, comprehensive parental leave.         |
  
  Note: You may add additional rows for specific diagnostic items if relevant (e.g., Remote Work clause confirmed, RICA consent confirmed).
  `;

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
};

export const generateFormStream = async function* (type: string, answers: FormAnswers) {
    const model = 'gemini-2.5-flash';
    
    // Inject HR Diagnostic Context for Forms too (e.g. contracts needing retirement age)
    const diagnosticContext = formatDiagnosticContext(answers as CompanyProfile);

    const prompt = `Generate a professional HR Form for "${type}".
    Company Name: ${answers.companyName}
    
    ${diagnosticContext}
    
    Details: ${JSON.stringify(answers)}
    
    Context:
    This form is for South African HR compliance.
    
    Instructions:
    1. Create a clean, structured form using Markdown tables and clear headings.
    2. Include sections for Employee Details, Date, Signatures, and the specific content required for a "${type}".
    3. Ensure it looks professional and is ready to print.
    `;
  
    const response = await ai.models.generateContentStream({
        model: model,
        contents: prompt
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
};

export const explainPolicyTypeStream = async function* (title: string) {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain the purpose and key components of a "${title}" in the context of South African HR law. Keep it brief and informative for a business owner.`;
    
    const response = await ai.models.generateContentStream({
        model: model,
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
        model: model,
        contents: prompt
    });

    for await (const chunk of response) {
        if (chunk.text) yield chunk.text;
    }
}
