
import type { CompanyProfile, GeneratedDocument, PolicyType, FormType } from '../types';
import { POLICIES, FORMS } from '../constants';

interface ComplianceStatus {
  score: number;
  totalMandatory: number;
  completedMandatory: number;
  missingMandatory: (PolicyType | FormType)[];
  nextRecommendation: {
    type: PolicyType | FormType;
    title: string;
    reason: string;
    isForm: boolean;
  } | null;
}

// Define baseline mandatory documents for ANY South African business
const UNIVERSAL_MANDATORY: (PolicyType | FormType)[] = [
  'employment-contract', // Form
  'disciplinary',        // Policy
  'grievance',           // Policy
  'leave',               // Policy
  'health-and-safety'    // Policy (OHS Act requires all employers to provide safe environment)
];

export const calculateComplianceScore = (
  profile: CompanyProfile,
  documents: GeneratedDocument[]
): ComplianceStatus => {
  const mandatorySet = new Set<(PolicyType | FormType)>(UNIVERSAL_MANDATORY);

  // 1. Add Industry Specific Requirements
  if (profile.industry) {
    switch (profile.industry) {
      case 'Construction':
      case 'Manufacturing':
      case 'Agriculture':
        mandatorySet.add('coida');
        mandatorySet.add('alcohol-drug');
        mandatorySet.add('incident-report');
        break;
      case 'Technology':
      case 'Professional Services':
        mandatorySet.add('confidentiality');
        mandatorySet.add('data-protection-privacy'); // POPIA is critical here
        break;
      case 'Retail':
      case 'Hospitality':
        mandatorySet.add('working-hours'); // Shifts are complex here
        mandatorySet.add('dress-code');
        break;
    }
  }

  // 2. Add Size Specific Requirements
  // Parse size string "1-10", "500+" etc.
  let isLarge = false;
  if (profile.companySize) {
      if (profile.companySize === '51-200' || profile.companySize === '201-500' || profile.companySize === '500+') {
          isLarge = true;
      }
  }

  if (isLarge) {
      mandatorySet.add('employment-equity');
      mandatorySet.add('workplace-skills-plan');
      mandatorySet.add('sexual-harassment'); // Code of good practice requires this more strictly for larger orgs
  } else {
      // For smaller companies, these are still highly recommended, but maybe secondary logic later
      // For now, we stick to the strict "Mandatory" set to keep the score achievable
  }

  const mandatoryList = Array.from(mandatorySet);
  
  // 3. Check what exists
  // We check if the document type exists in the user's generated list
  const generatedTypes = new Set(documents.map(d => d.type));
  
  const missingMandatory = mandatoryList.filter(item => !generatedTypes.has(item));
  const completedMandatory = mandatoryList.length - missingMandatory.length;
  
  const score = mandatoryList.length > 0 
    ? Math.round((completedMandatory / mandatoryList.length) * 100) 
    : 0;

  // 4. Determine Next Recommendation
  let nextRecommendation = null;
  if (missingMandatory.length > 0) {
      // Prioritize: Contract -> Disciplinary -> Health & Safety -> Industry Specifics
      // The array order generally handles this if UNIVERSAL is first
      const nextId = missingMandatory[0];
      const isPolicy = nextId in POLICIES;
      const item = isPolicy ? POLICIES[nextId as PolicyType] : FORMS[nextId as FormType];
      
      if (item) {
          nextRecommendation = {
              type: nextId,
              title: item.title,
              isForm: !isPolicy,
              reason: getReasonForRecommendation(nextId, profile.industry)
          };
      }
  }

  return {
      score,
      totalMandatory: mandatoryList.length,
      completedMandatory,
      missingMandatory,
      nextRecommendation
  };
};

function getReasonForRecommendation(type: string, industry?: string): string {
    const mapping: Record<string, string> = {
        'employment-contract': "Every employee must have a written contract by law.",
        'disciplinary': "Essential for legally managing misconduct and preventing CCMA cases.",
        'grievance': "Required to give employees a formal channel for complaints.",
        'leave': "Necessary to define annual, sick, and family responsibility leave rules.",
        'health-and-safety': "Mandatory under the OHS Act to ensure a safe workplace.",
        'coida': `Critical for ${industry || 'your'} industry to manage injuries on duty.`,
        'data-protection-privacy': "Required for POPIA compliance when handling client data.",
        'employment-equity': "Mandatory for designated employers (over 50 staff).",
    };
    return mapping[type] || "Recommended for full legal compliance.";
}
