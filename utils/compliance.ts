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
    phase: 1 | 2 | 3; // 1: Statutory, 2: Risk Mitigator, 3: Good Governance
    priority: 'critical' | 'recommended'; // Mapped for backward compatibility/UI styling
    status: 'completed' | 'missing';
    reason: string;
}

export const calculateComplianceScore = (
  profile: CompanyProfile,
  documents: GeneratedDocument[]
): ComplianceStatus => {
  const roadmap = getComplianceRoadmap(profile, documents);
  
  // Phase 1 and Phase 2 are considered "Critical/Mandatory" for a high score.
  // Phase 1 is Statutory (Must Have), Phase 2 is Risk Mitigator (Operational Necessity).
  const mandatoryItems = roadmap.filter(i => i.phase === 1 || i.phase === 2);
  const completedMandatory = mandatoryItems.filter(i => i.status === 'completed');
  
  const score = mandatoryItems.length > 0 
    ? Math.round((completedMandatory.length / mandatoryItems.length) * 100) 
    : 0;

  // Determine Next Recommendation - prioritizing Phase 1, then Phase 2
  let nextRecommendation = null;
  const firstMissing = mandatoryItems.sort((a, b) => a.phase - b.phase).find(i => i.status === 'missing');
  
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

    const addItem = (id: PolicyType | FormType, phase: 1 | 2 | 3, reason: string) => {
        if (roadmap.find(r => r.id === id)) return; // Deduplicate

        const isPolicy = id in POLICIES;
        const itemDef = isPolicy ? POLICIES[id as PolicyType] : FORMS[id as FormType];
        
        // Skip if definition not found (safety check)
        if (!itemDef) return;

        roadmap.push({
            id,
            title: itemDef.title,
            type: isPolicy ? 'policy' : 'form',
            phase,
            priority: phase === 1 ? 'critical' : (phase === 2 ? 'critical' : 'recommended'),
            status: generatedTypes.has(id) ? 'completed' : 'missing',
            reason
        });
    };

    // --- PHASE 1: STATUTORY REQUIREMENTS (Inspector Ready) ---
    // Failure to produce these can result in fines/orders.
    addItem('employment-contract', 1, "BCEA (Sec 29): Mandatory particulars of employment must be signed for every employee.");
    addItem('paia-manual', 1, "PAIA: All private bodies must have a manual explaining how the public can access records.");
    addItem('data-protection-privacy', 1, "POPIA: Requires an Information Officer and internal accountability measures.");
    addItem('coida', 1, "COIDA: Essential for registering with the Compensation Fund (Letter of Good Standing).");
    addItem('uif', 1, "UIA: Mandatory registration for any employee working more than 24 hours a month.");
    addItem('health-and-safety', 1, "OHSA (Sec 8): General duty to provide a safe working environment.");

    // Designated Employers (50+ employees) specifics
    let isLarge = false;
    if (profile.companySize) {
        if (profile.companySize === '51-200' || profile.companySize === '201-500' || profile.companySize === '500+') {
            isLarge = true;
        }
    }
    if (isLarge) {
        addItem('employment-equity', 1, "EEA: Designated employers must have an EE Plan and submit annual reports.");
    }

    // --- PHASE 2: CRITICAL RISK MITIGATORS (CCMA Defence) ---
    // Prevent financial liability during disputes.
    addItem('disciplinary', 2, "LRA (Sched 8): Defines misconduct categories and sanctions to ensure fair dismissal.");
    addItem('grievance', 2, "LRA: Critical defence against 'constructive dismissal' claims by proving a resolution channel existed.");
    addItem('anti-harassment-discrimination', 2, "EEA (2022 Code): Prevents vicarious liability for employee harassment/bullying.");
    // Mapping "IT & Electronic Communications" to electronic-communications policy
    addItem('electronic-communications', 2, "RICA: Written consent is required to intercept/monitor employee communications.");

    // --- PHASE 3: GOOD GOVERNANCE (Clarity & Culture) ---
    // Operational efficiency and best practice.
    addItem('leave', 3, "Clarify rules not in the BCEA (e.g., application notice periods, specific evidence requirements).");
    addItem('recruitment-selection', 3, "Ensure consistent, non-discriminatory hiring practices.");
    
    // Industry Specific Recommendations (Phase 3)
    if (profile.industry) {
        switch (profile.industry) {
            case 'Construction':
            case 'Manufacturing':
            case 'Agriculture':
            case 'Mining':
                addItem('alcohol-drug', 3, "Zero-tolerance policy is essential for safety-sensitive environments.");
                addItem('incident-report', 3, "Standardizes reporting for workplace accidents.");
                addItem('company-vehicle', 3, "Regulates use of company transport and heavy machinery.");
                break;
            case 'Technology':
            case 'Professional Services':
            case 'Finance':
                addItem('confidentiality', 3, "Crucial for protecting client data and intellectual property.");
                addItem('remote-hybrid-work', 3, "Defines productivity expectations and data security for off-site work.");
                addItem('byod', 3, "Protects company data on personal devices.");
                addItem('social-media', 3, "Protects brand reputation online.");
                addItem('conflict-of-interest', 3, "Critical for maintaining professional objectivity.");
                break;
            case 'Retail':
            case 'Hospitality':
                addItem('working-hours', 3, "Essential for managing shifts, overtime, and public holiday pay.");
                addItem('dress-code', 3, "Maintains professional standards for customer-facing staff.");
                addItem('attendance-punctuality', 3, "Critical for shift-based operations.");
                break;
            case 'Transport':
                addItem('company-vehicle', 3, "Strict rules for drivers and vehicle usage are mandatory.");
                addItem('alcohol-drug', 3, "Safety critical requirement for drivers.");
                addItem('travel', 3, "Manages allowances and rules for long-distance trips.");
                break;
            case 'Health':
                addItem('confidentiality', 3, "Patient confidentiality is a legal requirement.");
                break;
        }
    }

    if (isLarge) {
        addItem('workplace-skills-plan', 3, "Required for claiming mandatory grant levies.");
        addItem('whistleblower', 3, "Good governance practice for larger entities.");
    }

    return roadmap.sort((a, b) => {
        // Sort by Phase (1 -> 2 -> 3) -> Status (Missing first)
        if (a.phase !== b.phase) return a.phase - b.phase;
        if (a.status === 'missing' && b.status !== 'missing') return -1;
        if (a.status !== 'missing' && b.status === 'missing') return 1;
        return 0;
    });
};