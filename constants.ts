import {
  ExpenseReimbursementIcon,
  MasterPolicyIcon,
  FormsIcon,
  LeaveIcon,
  DisciplinaryIcon,
  GrievanceIcon,
  HealthSafetyIcon,
  UifIcon,
  TerminationOfEmploymentIcon,
  RecruitmentSelectionIcon,
  SexualHarassmentIcon,
  ElectronicCommunicationsIcon,
  CompanyVehicleIcon,
  ConfidentialityIcon,
  DataProtectionPrivacyIcon,
  RemoteWorkIcon,
  ByodIcon,
  WorkingHoursIcon,
  DressCodeIcon,
  AttendancePunctualityIcon,
  EmploymentEquityIcon,
  TrainingDevelopmentIcon,
  WhistleblowerIcon,
  AlcoholDrugIcon,
  IncidentReportIcon,
  JobDescriptionIcon,
  LeaveApplicationIcon,
} from './components/Icons';
import type { Policy, Form, Question, PolicyType, FormType } from './types';

export const INDUSTRIES = [
  'Agriculture',
  'Construction',
  'Education',
  'Finance',
  'Health',
  'Hospitality',
  'Manufacturing',
  'Mining',
  'Professional Services',
  'Retail',
  'Technology',
  'Transport',
  'Other'
];

export const commonQuestions: Question[] = [
  { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
];

export const commonPolicyMetadataQuestions: Question[] = [
  { id: 'responsiblePerson', label: 'Responsible Person (Role)', type: 'text', placeholder: 'e.g., HR Manager' },
];

export const POLICIES: Record<string, Policy> = {
  'expense-reimbursement': {
    kind: 'policy',
    type: 'expense-reimbursement',
    title: 'Expense Reimbursement Policy',
    description: 'Procedures for claiming business-related expenses.',
    icon: ExpenseReimbursementIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'reimbursementTimeframe', label: 'Typical timeframe for reimbursement (days)', type: 'number', placeholder: 'e.g., 14' },
      { id: 'receiptThreshold', label: 'Minimum amount requiring receipt (R)', type: 'number', placeholder: 'e.g., 50', tip: 'Expenses below this amount may not strictly require a slip, though recommended.' }
    ],
  },
  'disciplinary': { kind: 'policy', type: 'disciplinary', title: 'Disciplinary Code', description: 'Rules and procedures for discipline.', icon: DisciplinaryIcon, price: 3500, questions: commonQuestions },
  'grievance': { kind: 'policy', type: 'grievance', title: 'Grievance Procedure', description: 'Handling employee complaints.', icon: GrievanceIcon, price: 3500, questions: commonQuestions },
  'leave': { kind: 'policy', type: 'leave', title: 'Leave Policy', description: 'Annual, sick, and family leave rules.', icon: LeaveIcon, price: 3500, questions: commonQuestions },
  'health-and-safety': { kind: 'policy', type: 'health-and-safety', title: 'Health & Safety Policy', description: 'Workplace safety guidelines.', icon: HealthSafetyIcon, price: 3500, questions: commonQuestions },
  'uif': { kind: 'policy', type: 'uif', title: 'UIF Policy', description: 'Unemployment Insurance Fund details.', icon: UifIcon, price: 2500, questions: commonQuestions },
  'termination-of-employment': { kind: 'policy', type: 'termination-of-employment', title: 'Termination Policy', description: 'Procedures for ending employment.', icon: TerminationOfEmploymentIcon, price: 3500, questions: commonQuestions },
  'sexual-harassment': { kind: 'policy', type: 'sexual-harassment', title: 'Sexual Harassment Policy', description: 'Zero-tolerance approach to harassment.', icon: SexualHarassmentIcon, price: 3500, questions: commonQuestions },
  'electronic-communications': { kind: 'policy', type: 'electronic-communications', title: 'Electronic Communications Policy', description: 'Email and internet usage rules.', icon: ElectronicCommunicationsIcon, price: 3500, questions: commonQuestions },
  'recruitment-selection': { kind: 'policy', type: 'recruitment-selection', title: 'Recruitment Policy', description: 'Fair hiring practices.', icon: RecruitmentSelectionIcon, price: 3500, questions: commonQuestions },
  'company-vehicle': { kind: 'policy', type: 'company-vehicle', title: 'Company Vehicle Policy', description: 'Rules for using company cars.', icon: CompanyVehicleIcon, price: 3500, questions: commonQuestions },
  'confidentiality': { kind: 'policy', type: 'confidentiality', title: 'Confidentiality Policy', description: 'Protecting company information.', icon: ConfidentialityIcon, price: 3500, questions: commonQuestions },
  'data-protection-privacy': { kind: 'policy', type: 'data-protection-privacy', title: 'Data Protection (POPIA) Policy', description: 'Compliance with POPIA.', icon: DataProtectionPrivacyIcon, price: 3500, questions: commonQuestions },
  'remote-hybrid-work': { kind: 'policy', type: 'remote-hybrid-work', title: 'Remote Work Policy', description: 'Guidelines for working from home.', icon: RemoteWorkIcon, price: 3500, questions: commonQuestions },
  'byod': { kind: 'policy', type: 'byod', title: 'BYOD Policy', description: 'Bring Your Own Device rules.', icon: ByodIcon, price: 3500, questions: commonQuestions },
  'working-hours': { kind: 'policy', type: 'working-hours', title: 'Working Hours Policy', description: 'Shifts, overtime, and breaks.', icon: WorkingHoursIcon, price: 3500, questions: commonQuestions },
  'dress-code': { kind: 'policy', type: 'dress-code', title: 'Dress Code Policy', description: 'Attire standards.', icon: DressCodeIcon, price: 2500, questions: commonQuestions },
  'attendance-punctuality': { kind: 'policy', type: 'attendance-punctuality', title: 'Attendance Policy', description: 'Rules for attendance and punctuality.', icon: AttendancePunctualityIcon, price: 3500, questions: commonQuestions },
  'employment-equity': { kind: 'policy', type: 'employment-equity', title: 'Employment Equity Policy', description: 'Promoting diversity and equity.', icon: EmploymentEquityIcon, price: 4500, questions: commonQuestions },
  'training-development': { kind: 'policy', type: 'training-development', title: 'Training & Development Policy', description: 'Employee skills development.', icon: TrainingDevelopmentIcon, price: 3500, questions: commonQuestions },
  'whistleblower': { kind: 'policy', type: 'whistleblower', title: 'Whistleblower Policy', description: 'Reporting unethical conduct.', icon: WhistleblowerIcon, price: 3500, questions: commonQuestions },
  'alcohol-drug': { kind: 'policy', type: 'alcohol-drug', title: 'Substance Abuse Policy', description: 'Alcohol and drug regulations.', icon: AlcoholDrugIcon, price: 3500, questions: commonQuestions },
};

export const FORMS: Record<string, Form> = {
  'employment-contract': { kind: 'form', type: 'employment-contract', title: 'Employment Contract', description: 'Standard employment agreement.', icon: FormsIcon, price: 2500, questions: commonQuestions, outputFormat: 'word' },
  'incident-report': { kind: 'form', type: 'incident-report', title: 'Incident Report', description: 'Form for reporting workplace incidents.', icon: IncidentReportIcon, price: 1500, questions: commonQuestions, outputFormat: 'word' },
  'job-description': { kind: 'form', type: 'job-description', title: 'Job Description Template', description: 'Template for defining roles.', icon: JobDescriptionIcon, price: 1500, questions: commonQuestions, outputFormat: 'word' },
  'leave-application': { kind: 'form', type: 'leave-application', title: 'Leave Application Form', description: 'Standard leave request form.', icon: LeaveApplicationIcon, price: 1500, questions: commonQuestions, outputFormat: 'word' },
};

export const POLICY_CATEGORIES = [
  {
    title: 'All Policies',
    items: Object.values(POLICIES)
  }
];

export const FORM_CATEGORIES = [
  {
    title: 'All Forms',
    items: Object.values(FORMS)
  }
];
