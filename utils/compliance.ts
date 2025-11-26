
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

export interface RoadmapItem {
    id: PolicyType | FormType;
    title: string;
    type: 'policy' | 'form';
    priority: 'critical' | 'recommended';
    status: 'completed' | 'missing';
    reason: string;
}

// Define baseline mandatory documents for ANY South African business
const UNIVERSAL_MANDATORY: (PolicyType | FormType)[] = [
  'employment-contract', // Form
  'disciplinary',        // Policy
  'grievance',           // Policy
  'leave',               // Policy
  'health-and-safety',   // Policy (OHS Act requires all employers to provide safe environment)
  'uif',                 // Policy
  'termination-of-employment' // Policy
];

const UNIVERSAL_RECOMMENDED: (PolicyType | FormType)[] = [
    'sexual-harassment',
    'electronic-communications',
    'recruitment-selection',
    'job-description', // Form
    'leave-application' // Form
];

export const calculateComplianceScore = (
  profile: CompanyProfile,
  documents: GeneratedDocument[]
): ComplianceStatus => {
  const roadmap = getComplianceRoadmap(profile, documents);
  const mandatoryItems = roadmap.filter(i => i.priority === 'critical');
  const completedMandatory = mandatoryItems.filter(i => i.status === 'completed');
  
  const score = mandatoryItems.length > 0 
    ? Math.round((completedMandatory.length / mandatoryItems.length) * 100) 
    : 0;

  // Determine Next Recommendation
  let nextRecommendation = null;
  const firstMissing = mandatoryItems.find(i => i.status === 'missing');
  
  if (firstMissing) {
      nextRecommendation = {
          type: firstMissing.id,
          title: firstMissing.title,
          isForm: firstMissing.type === 'form',
          reason: firstMissing.reason
      };
  }

  return {
      score,
      totalMandatory: mandatoryItems.length,
      completedMandatory: completedMandatory.length,
      missingMandatory: mandatoryItems.filter(i => i.status === 'missing').map(i => i.id),
      nextRecommendation
  };
};

export const getComplianceRoadmap = (
    profile: CompanyProfile,
    documents: GeneratedDocument[]
): RoadmapItem[] => {
    const generatedTypes = new Set(documents.map(d => d.type));
    const roadmap: RoadmapItem[] = [];

    const addItem = (id: PolicyType | FormType, priority: 'critical' | 'recommended', customReason?: string) => {
        if (roadmap.find(r => r.id === id)) return; // Deduplicate

        const isPolicy = id in POLICIES;
        const itemDef = isPolicy ? POLICIES[id as PolicyType] : FORMS[id as FormType];
        
        if (!itemDef) return;

        roadmap.push({
            id,
            title: itemDef.title,
            type: isPolicy ? 'policy' : 'form',
            priority,
            status: generatedTypes.has(id) ? 'completed' : 'missing',
            reason: customReason || getReasonForRecommendation(id, profile.industry)
        });
    };

    // 1. Universal Requirements
    UNIVERSAL_MANDATORY.forEach(id => addItem(id, 'critical'));
    UNIVERSAL_RECOMMENDED.forEach(id => addItem(id, 'recommended'));

    // 2. Industry Specifics
    if (profile.industry) {
        switch (profile.industry) {
            case 'Construction':
            case 'Manufacturing':
            case 'Agriculture':
                addItem('coida', 'critical', "High-risk industries must have clear injury-on-duty protocols (COIDA).");
                addItem('alcohol-drug', 'critical', "Zero-tolerance policy is essential for safety-sensitive environments.");
                addItem('incident-report', 'critical', "Mandatory for recording workplace accidents.");
                addItem('company-vehicle', 'recommended', "Essential if staff use company transport or heavy machinery.");
                break;
            case 'Technology':
            case 'Professional Services':
                addItem('confidentiality', 'critical', "Crucial for protecting client data and intellectual property.");
                addItem('data-protection-privacy', 'critical', "Mandatory for POPIA compliance when handling personal information.");
                addItem('remote-hybrid-work', 'recommended', "Clarifies expectations for off-site work.");
                addItem('byod', 'recommended', "Protects company data on personal devices.");
                break;
            case 'Retail':
            case 'Hospitality':
                addItem('working-hours', 'critical', "Essential for managing shifts, overtime, and public holiday pay.");
                addItem('dress-code', 'recommended', "Maintains professional standards for customer-facing staff.");
                addItem('attendance-punctuality', 'recommended', "Critical for shift-based operations.");
                break;
        }
    }

    // 3. Size Specifics
    let isLarge = false;
    if (profile.companySize) {
        if (profile.companySize === '51-200' || profile.companySize === '201-500' || profile.companySize === '500+') {
            isLarge = true;
        }
    }

    if (isLarge) {
        addItem('employment-equity', 'critical', "Mandatory for designated employers (over 50 staff) under the EEA.");
        addItem('workplace-skills-plan', 'critical', "Required for claiming mandatory grant levies.");
        addItem('sexual-harassment', 'critical', "Code of Good Practice requires strict policies for larger organizations.");
        addItem('whistleblower', 'recommended', "Good governance practice for larger entities.");
    }

    return roadmap.sort((a, b) => {
        // Sort by: Priority (Critical first) -> Status (Missing first)
        if (a.priority === 'critical' && b.priority !== 'critical') return -1;
        if (a.priority !== 'critical' && b.priority === 'critical') return 1;
        if (a.status === 'missing' && b.status !== 'missing') return -1;
        if (a.status !== 'missing' && b.status === 'missing') return 1;
        return 0;
    });
};

function getReasonForRecommendation(type: string, industry?: string): string {
    const mapping: Record<string, string> = {
        'employment-contract': "Section 29 of the BCEA requires written particulars of employment for every staff member.",
        'disciplinary': "Essential for legally managing misconduct and preventing unfair dismissal disputes at the CCMA.",
        'grievance': "Employees must have a formal, recorded channel to raise complaints or dissatisfaction.",
        'leave': "Clarifies annual, sick, and family responsibility leave rules to prevent abuse and payroll disputes.",
        'health-and-safety': "The OHS Act requires every employer to provide and maintain a safe working environment.",
        'uif': "Employers must contribute to the Unemployment Insurance Fund and clarify these deductions.",
        'termination-of-employment': "Ensures all dismissals or resignations follow fair procedure and notice periods.",
        'sexual-harassment': "Protects the company from liability by establishing a zero-tolerance approach.",
        'electronic-communications': "Regulates the use of email and internet to prevent liability and misuse.",
        'recruitment-selection': "Ensures hiring practices are fair and non-discriminatory (EEA compliance).",
    };
    return mapping[type] || "Recommended for comprehensive HR governance and risk management.";
}
