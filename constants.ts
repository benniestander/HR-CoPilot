

import React from 'react';
import {
  LeaveIcon,
  DisciplinaryIcon,
  GrievanceIcon,
  HealthSafetyIcon,
  MasterPolicyIcon,
  ByodIcon,
  CellPhoneIcon,
  CertificationIcon,
  CodeOfEthicsIcon,
  CommunicationRetentionIcon,
  DataUsageIcon,
  ElectronicCommunicationsIcon,
  // FIX: ResignationIcon was missing, it's now added to Icons.tsx
  ResignationIcon,
  // FIX: SecurityIcon was missing, it's now added to Icons.tsx
  SecurityIcon,
  // FIX: SexualHarassmentIcon was missing, it's now added to Icons.tsx
  SexualHarassmentIcon,
  // FIX: StandbyIcon was missing, it's now added to Icons.tsx
  StandbyIcon,
  // FIX: TelephoneUsageIcon was missing, it's now added to Icons.tsx
  TelephoneUsageIcon,
  // FIX: TimeOffIcon was missing, it's now added to Icons.tsx
  TimeOffIcon,
  // FIX: TravelIcon was missing, it's now added to Icons.tsx
  TravelIcon,
  CompanyPropertyIcon,
  // FIX: VisitorIcon was missing, it's now added to Icons.tsx
  VisitorIcon,
  // FIX: RemoteWorkIcon was missing, it's now added to Icons.tsx
  RemoteWorkIcon,
  EeoDiversityIcon,
  AttendancePunctualityIcon,
  EmployeeConductIcon,
  DataProtectionPrivacyIcon,
  DisciplinaryActionIcon,
  // FIX: WhistleblowerIcon was missing, it's now added to Icons.tsx
  WhistleblowerIcon,
  CompensationBenefitsIcon,
  // FIX: PerformanceManagementIcon was missing, it's now added to Icons.tsx
  PerformanceManagementIcon,
  // FIX: WorkplaceWellnessIcon was missing, it's now added to Icons.tsx
  WorkplaceWellnessIcon,
  ItCybersecurityIcon,
  // FIX: SocialMediaIcon was missing, it's now added to Icons.tsx
  SocialMediaIcon,
  LanguagePolicyIcon,
  ConfidentialityIcon,
  EmployeeSeparationIcon,
  AntiHarassmentDiscriminationIcon,
  CompanyVehicleIcon,
  ExpenseReimbursementIcon,
  EmploymentEquityIcon,
  CoidaIcon,
  // FIX: UifIcon was missing, it's now added to Icons.tsx
  UifIcon,
  // FIX: RecruitmentSelectionIcon was missing, it's now added to Icons.tsx
  RecruitmentSelectionIcon,
  // FIX: WorkingHoursIcon was missing, it's now added to Icons.tsx
  WorkingHoursIcon,
  // FIX: TrainingDevelopmentIcon was missing, it's now added to Icons.tsx
  TrainingDevelopmentIcon,
  AntiBriberyCorruptionIcon,
  DressCodeIcon,
  AlcoholDrugIcon,
  // FIX: TerminationOfEmploymentIcon was missing, it's now added to Icons.tsx
  TerminationOfEmploymentIcon,
  // FIX: RetrenchmentIcon was missing, it's now added to Icons.tsx
  RetrenchmentIcon,
  // New Icons for new policies
  DeductionsIcon,
  AntiBullyingIcon,
  ItAccessSecurityIcon,
  // New Policy Icons
  // FIX: ConflictOfInterestIcon was missing, it's now added to Icons.tsx
  ConflictOfInterestIcon,
  // FIX: RecordsRetentionIcon was missing, it's now added to Icons.tsx
  RecordsRetentionIcon,
  // FIX: SalaryStructureIcon was missing, it's now added to Icons.tsx
  SalaryStructureIcon,
  FamilyResponsibilityLeaveIcon,
  // Form Icons
  // FIX: JobApplicationIcon was missing, it's now added to Icons.tsx
  JobApplicationIcon,
  // FIX: LeaveApplicationIcon was missing, it's now added to Icons.tsx
  LeaveApplicationIcon,
  // FIX: FinalWrittenWarningIcon was missing, it's now added to Icons.tsx
  FinalWrittenWarningIcon,
  // FIX: ExitInterviewIcon was missing, it's now added to Icons.tsx
  ExitInterviewIcon,
  // FIX: EmployeeDetailsIcon was missing, it's now added to Icons.tsx
  EmployeeDetailsIcon,
  // FIX: JobDescriptionIcon was missing, it's now added to Icons.tsx
  JobDescriptionIcon,
  // FIX: MaternityLeaveIcon was missing, it's now added to Icons.tsx
  MaternityLeaveIcon,
  // FIX: SuspensionNoticeIcon was missing, it's now added to Icons.tsx
  SuspensionNoticeIcon,
  // FIX: AppealFormIcon was missing, it's now added to Icons.tsx
  AppealFormIcon,
  // FIX: ExpenseClaimIcon was missing, it's now added to Icons.tsx
  ExpenseClaimIcon,
  // FIX: TrainingAgreementIcon was missing, it's now added to Icons.tsx
  TrainingAgreementIcon,
  // FIX: ReferenceCheckIcon was missing, it's now added to Icons.tsx
  ReferenceCheckIcon,
  // FIX: RetrenchmentNoticeIcon was missing, it's now added to Icons.tsx
  RetrenchmentNoticeIcon,
  // FIX: JobAdvertisementIcon was missing, it's now added to Icons.tsx
  JobAdvertisementIcon,
  // FIX: InterviewGuideIcon was missing, it's now added to Icons.tsx
  InterviewGuideIcon,
  // FIX: CandidateEvaluationIcon was missing, it's now added to Icons.tsx
  CandidateEvaluationIcon,
  // FIX: OnboardingChecklistIcon was missing, it's now added to Icons.tsx
  OnboardingChecklistIcon,
  // FIX: RestraintOfTradeIcon was missing, it's now added to Icons.tsx
  RestraintOfTradeIcon,
  // FIX: PerformanceReviewIcon was missing, it's now added to Icons.tsx
  PerformanceReviewIcon,
  // FIX: SalaryBankIcon was missing, it's now added to Icons.tsx
  SalaryBankIcon,
  // FIX: OvertimeClaimIcon was missing, it's now added to Icons.tsx
  OvertimeClaimIcon,
  // FIX: EmploymentContractIcon was missing, it's now added to Icons.tsx
  EmploymentContractIcon,
  // FIX: PermissionForDeductionsIcon was missing, it's now added to Icons.tsx
  PermissionForDeductionsIcon,
  // FIX: SkillsDevelopmentIcon was missing, it's now added to Icons.tsx
  SkillsDevelopmentIcon,
  // New Form Icons
  // FIX: CertificateOfServiceIcon was missing, it's now added to Icons.tsx
  CertificateOfServiceIcon,
  // FIX: PayrollProcessingIcon was missing, it's now added to Icons.tsx
  PayrollProcessingIcon,
  // New Generic Icons
  // FIX: ChecklistIcon was missing, it's now added to Icons.tsx
  ChecklistIcon,
  // FIX: CleaningIcon was missing, it's now added to Icons.tsx
  CleaningIcon,
  // FIX: FoodSafetyIcon was missing, it's now added to Icons.tsx
  FoodSafetyIcon,
  // FIX: TemperatureIcon was missing, it's now added to Icons.tsx
  TemperatureIcon,
  // FIX: TrainingRegisterIcon was missing, it's now added to Icons.tsx
  TrainingRegisterIcon,
  // FIX: RegisterIcon was missing, it's now added to Icons.tsx
  RegisterIcon,
  // FIX: CanvaIcon was missing, it's now added to Icons.tsx
  CanvaIcon,
  // FIX: LegalNoticeIcon was missing, it's now added to Icons.tsx
  LegalNoticeIcon,
  // FIX: AfrikaansIcon was missing, it's now added to Icons.tsx
  AfrikaansIcon,
  // FIX: MeetingMinutesIcon was missing, it's now added to Icons.tsx
  MeetingMinutesIcon,
  // FIX: BundleIcon was missing, it's now added to Icons.tsx
  BundleIcon,
  // FIX: SurveyIcon was missing, it's now added to Icons.tsx
  SurveyIcon,
  // FIX: IncidentReportIcon was missing, it's now added to Icons.tsx
  IncidentReportIcon,
} from './components/Icons';
import type { Policy, PolicyType, Form, FormType } from './types';

const commonQuestions = [
  { id: 'companyName', label: 'Company Name', type: 'text' as const, placeholder: 'e.g., ABC (Pty) Ltd' },
];

const commonPolicyMetadataQuestions = [
  { id: 'effectiveDate', label: 'Effective Date', type: 'date' as const, tip: 'The date from which this policy is active.' },
  { id: 'reviewDate', label: 'Next Review Date', type: 'date' as const, tip: 'This is automatically set to one year from the Effective Date.' },
];

const employeeAndManagerQuestions = [
    ...commonQuestions,
    { id: 'employeeName', label: 'Employee Name', type: 'text' as const, placeholder: 'e.g., John Smith' },
    { id: 'managerName', label: 'Manager/Supervisor Name', type: 'text' as const, placeholder: 'e.g., Jane Doe' },
]

export const POLICIES: Record<PolicyType, Policy> = {
  // Existing Policies
  'leave': {
    kind: 'policy',
    type: 'leave',
    title: 'Leave Policy',
    description: 'Establish clear rules for annual, sick, and family responsibility leave.',
    icon: LeaveIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'annualLeaveDays', label: 'Annual Leave Days', type: 'number', placeholder: 'e.g., 15', tip: 'The BCEA minimum is 21 consecutive days or 1 day for every 17 days worked.' },
      { id: 'sickLeaveCycleDays', label: 'Sick Leave Cycle Days', type: 'number', placeholder: 'e.g., 30', tip: 'A sick leave cycle is 36 months. The minimum is 1 day of sick leave for every 26 days worked.' },
    ],
  },
  'disciplinary': {
    kind: 'policy',
    type: 'disciplinary',
    title: 'Disciplinary Code',
    description: 'Outline procedures for addressing misconduct and poor performance.',
    icon: DisciplinaryIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'hrContactPerson', label: 'HR Contact Person/Department', type: 'text', placeholder: 'e.g., The HR Manager' },
    ],
  },
  'grievance': {
    kind: 'policy',
    type: 'grievance',
    title: 'Grievance Procedure',
    description: 'Create a fair process for employees to raise and resolve workplace issues.',
    icon: GrievanceIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'firstStepContact', label: 'First Point of Contact for Grievances', type: 'text', placeholder: 'e.g., Immediate Supervisor' },
      { id: 'escalationContact', label: 'Escalation Point', type: 'text', placeholder: 'e.g., Department Head' },
    ],
  },
  'health-and-safety': {
    kind: 'policy',
    type: 'health-and-safety',
    title: 'Health & Safety Policy',
    description: 'Commit to a safe working environment compliant with the OHS Act.',
    icon: HealthSafetyIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'safetyOfficerName', label: 'Appointed Safety Officer (if any)', type: 'text', placeholder: 'Leave blank if not applicable' },
    ],
    industries: ['Construction', 'Manufacturing', 'Agriculture', 'Hospitality'],
  },
  'master': {
    kind: 'policy',
    type: 'master',
    title: 'Master Policy',
    description: 'A comprehensive document combining all essential HR policies into a single employee handbook.',
    icon: MasterPolicyIcon,
    price: 10500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'ceoName', label: 'CEO/Managing Director Name', type: 'text', placeholder: 'e.g., Jane Doe' }
    ],
  },
  'byod': {
    kind: 'policy',
    type: 'byod',
    title: 'Bring Your Own Device',
    description: 'Set guidelines for employees using personal devices (laptops, phones) for work.',
    icon: ByodIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'itSupportContact', label: 'IT Support Contact', type: 'text', placeholder: 'e.g., IT Department' }
    ],
    industries: ['Technology', 'Professional Services'],
  },
  'cell-phone': {
    kind: 'policy',
    type: 'cell-phone',
    title: 'Cell Phone Policy',
    description: 'Define rules for personal and company-provided cell phone usage during work hours.',
    icon: CellPhoneIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'usageRestrictions', label: 'Usage Restrictions', type: 'textarea', placeholder: 'e.g., Personal calls are limited to break times.' }
    ],
  },
  'certification': {
    kind: 'policy',
    type: 'certification',
    title: 'Certification Policy',
    description: 'Outline requirements and support for employee professional certifications.',
    icon: CertificationIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'reimbursementPolicy', label: 'Reimbursement Details', type: 'text', placeholder: 'e.g., 100% reimbursement on passing the exam.' }
    ],
  },
  'code-of-ethics': {
    kind: 'policy',
    type: 'code-of-ethics',
    title: 'Code of Ethics Policy',
    description: 'Establish principles of conduct, integrity, and ethical behaviour for all employees.',
    icon: CodeOfEthicsIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'reportingChannel', label: 'Ethics Reporting Channel', type: 'text', placeholder: 'e.g., Ethics Hotline or HR Manager' }
    ],
  },
  'communication-retention': {
    kind: 'policy',
    type: 'communication-retention',
    title: 'Communication Retention',
    description: 'Define how electronic communications (email, messages) are stored and for how long.',
    icon: CommunicationRetentionIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'retentionPeriod', label: 'Data Retention Period (Years)', type: 'number', placeholder: 'e.g., 5' }
    ],
  },
  'data-usage-popia': {
    kind: 'policy',
    type: 'data-usage-popia',
    title: 'Data Usage Policy (POPIA)',
    description: 'Ensure compliance with the Protection of Personal Information Act (POPIA).',
    icon: DataUsageIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'infoOfficer', label: 'Information Officer Name', type: 'text', placeholder: 'e.g., John Smith' }
    ],
  },
  'electronic-communications': {
    kind: 'policy',
    type: 'electronic-communications',
    title: 'Electronic Communications',
    description: 'Govern the use of company email, internet, and other electronic systems.',
    icon: ElectronicCommunicationsIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'monitoringStatement', label: 'Monitoring Clause', type: 'textarea', placeholder: 'e.g., The company reserves the right to monitor all electronic communications.' }
    ],
  },
  'resignation': {
    kind: 'policy',
    type: 'resignation',
    title: 'Resignation Policy',
    description: 'Detail the formal procedure for employees leaving the company, including notice periods.',
    icon: ResignationIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'noticePeriodWeeks', label: 'Standard Notice Period (Weeks)', type: 'number', placeholder: 'e.g., 4' }
    ],
  },
  'security': {
    kind: 'policy',
    type: 'security',
    title: 'Security Policy',
    description: 'Establish rules for physical and digital security to protect company assets.',
    icon: SecurityIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'accessControl', label: 'Access Control Manager', type: 'text', placeholder: 'e.g., Head of Security' }
    ],
  },
  'sexual-harassment': {
    kind: 'policy',
    type: 'sexual-harassment',
    title: 'Sexual Harassment Policy',
    description: 'Define and prohibit sexual harassment, and outline reporting and investigation procedures.',
    icon: SexualHarassmentIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'confidentialContact', label: 'Confidential Reporting Contact', type: 'text', placeholder: 'e.g., Designated HR representative' }
    ],
  },
  'standby': {
    kind: 'policy',
    type: 'standby',
    title: 'Standby Policy',
    description: 'Outline compensation and expectations for employees required to be on standby.',
    icon: StandbyIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'standbyAllowance', label: 'Standby Allowance (per shift/day)', type: 'text', placeholder: 'e.g., R250 per day' }
    ],
    industries: ['Technology', 'Manufacturing', 'Professional Services'],
  },
  'telephone-usage': {
    kind: 'policy',
    type: 'telephone-usage',
    title: 'Telephone Usage Policy',
    description: 'Set guidelines for the use of company landlines for personal and business calls.',
    icon: TelephoneUsageIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'personalCallRule', label: 'Personal Call Rule', type: 'text', placeholder: 'e.g., Permitted for emergencies only.' }
    ],
  },
  'time-off': {
    kind: 'policy',
    type: 'time-off',
    title: 'Time Off Procedure',
    description: 'Define the process for requesting and approving unpaid time off or special leave.',
    icon: TimeOffIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'approvalAuthority', label: 'Approval Authority', type: 'text', placeholder: 'e.g., Department Manager' }
    ],
  },
  'travel': {
    kind: 'policy',
    type: 'travel',
    title: 'Travel Policy',
    description: 'Govern procedures and reimbursements for business-related travel.',
    icon: TravelIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'expenseContact', label: 'Expense Claim Contact', type: 'text', placeholder: 'e.g., Finance Department' }
    ],
    industries: ['Professional Services', 'Construction', 'Manufacturing', 'Retail'],
  },
  'company-property': {
    kind: 'policy',
    type: 'company-property',
    title: 'Use of Company Hardware & Software',
    description: 'Outline the responsible use, care, and return of all company-issued equipment.',
    icon: CompanyPropertyIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'itManager', label: 'IT Manager', type: 'text', placeholder: 'e.g., IT Department Head' }
    ],
  },
  'visitor': {
    kind: 'policy',
    type: 'visitor',
    title: 'Visitor Policy',
    description: 'Establish procedures for managing non-employees visiting company premises.',
    icon: VisitorIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'receptionContact', label: 'Reception/Front Desk Contact', type: 'text', placeholder: 'e.g., The Receptionist' }
    ],
  },
  'remote-hybrid-work': {
    kind: 'policy',
    type: 'remote-hybrid-work',
    title: 'Remote & Hybrid Work Policy',
    description: 'Defines expectations for remote working arrangements including security and communication protocols.',
    icon: RemoteWorkIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'remoteWorkContact', label: 'Remote Work Coordinator', type: 'text', placeholder: 'e.g., HR Manager' },
      { id: 'coreHours', label: 'Core Collaboration Hours', type: 'text', placeholder: 'e.g., 10:00 AM to 3:00 PM' }
    ],
    industries: ['Technology', 'Professional Services'],
  },
  'eeo-diversity': {
    kind: 'policy',
    type: 'eeo-diversity',
    title: 'EEO & Diversity Policy',
    description: 'Promotes nondiscrimination, fairness in hiring and promotions, and supports inclusion.',
    icon: EeoDiversityIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'eeoOfficerName', label: 'EEO / Diversity Officer', type: 'text', placeholder: 'e.g., Head of HR' }
    ],
  },
  'attendance-punctuality': {
    kind: 'policy',
    type: 'attendance-punctuality',
    title: 'Attendance & Punctuality Policy',
    description: 'Defines expectations on work hours, attendance, punctuality, and consequences for violations.',
    icon: AttendancePunctualityIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'lateArrivalPolicy', label: 'Consequence for late arrival', type: 'text', placeholder: 'e.g., Verbal warning after 3 instances' }
    ],
  },
  'employee-conduct': {
    kind: 'policy',
    type: 'employee-conduct',
    title: 'Employee Conduct & Behavior Policy',
    description: 'Covers professional behavior, dress code, communication standards, and conflict resolution.',
    icon: EmployeeConductIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'dressCodeSummary', label: 'Briefly describe the dress code', type: 'textarea', placeholder: 'e.g., Business casual. No jeans or t-shirts.' }
    ],
  },
  'data-protection-privacy': {
    kind: 'policy',
    type: 'data-protection-privacy',
    title: 'Data Protection & Privacy Policy',
    description: 'Covers handling and protection of employee and customer data comprehensively.',
    icon: DataProtectionPrivacyIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'dataBreachContact', label: 'Who to contact in case of a data breach?', type: 'text', placeholder: 'e.g., The Information Officer' }
    ],
  },
  'disciplinary-action': {
    kind: 'policy',
    type: 'disciplinary-action',
    title: 'Disciplinary Action Policy',
    description: 'Details grounds for discipline and the process for addressing misconduct or performance issues.',
    icon: DisciplinaryActionIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'appealProcessContact', label: 'Who manages disciplinary appeals?', type: 'text', placeholder: 'e.g., The CEO' }
    ],
  },
  'whistleblower': {
    kind: 'policy',
    type: 'whistleblower',
    title: 'Whistleblower Policy',
    description: 'Provides a safe, confidential channel for reporting unethical or illegal activities without retaliation.',
    icon: WhistleblowerIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'whistleblowerHotline', label: 'Anonymous reporting channel/hotline', type: 'text', placeholder: 'e.g., ethics@company.com or 0800-123-456' }
    ],
  },
  'compensation-benefits': {
    kind: 'policy',
    type: 'compensation-benefits',
    title: 'Compensation & Benefits Policy',
    description: 'Clarifies salary, bonuses, benefits, and pay review procedures.',
    icon: CompensationBenefitsIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'payrollContact', label: 'Who to contact for payroll queries?', type: 'text', placeholder: 'e.g., The Payroll Department' }
    ],
  },
  'performance-management': {
    kind: 'policy',
    type: 'performance-management',
    title: 'Performance Management Policy',
    description: 'Sets criteria for employee performance reviews, goal setting, and career development.',
    icon: PerformanceManagementIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'reviewFrequency', label: 'How often are performance reviews conducted?', type: 'text', placeholder: 'e.g., Annually' }
    ],
  },
  'workplace-wellness': {
    kind: 'policy',
    type: 'workplace-wellness',
    title: 'Workplace Wellness Policy',
    description: 'Includes emergency protocols, wellness programs, and mental health support.',
    icon: WorkplaceWellnessIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'wellnessProgramManager', label: 'Who manages wellness initiatives?', type: 'text', placeholder: 'e.g., The HR Manager' }
    ],
  },
  'it-cybersecurity': {
    kind: 'policy',
    type: 'it-cybersecurity',
    title: 'IT & Cybersecurity Policy',
    description: 'Covers secure use of company technology, password protocols, and cyber threat awareness.',
    icon: ItCybersecurityIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'passwordPolicySummary', label: 'Summarize the password requirements', type: 'textarea', placeholder: 'e.g., Minimum 8 characters, with uppercase, lowercase, and a number.' }
    ],
    industries: ['Technology', 'Professional Services', 'Retail'],
  },
  'social-media': {
    kind: 'policy',
    type: 'social-media',
    title: 'Social Media Policy',
    description: 'Guidelines on employees’ use of social media related to the company.',
    icon: SocialMediaIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'socialMediaApprovalContact', label: 'Who approves official social media posts?', type: 'text', placeholder: 'e.g., Marketing Department' }
    ],
  },
  'confidentiality': {
    kind: 'policy',
    type: 'confidentiality',
    title: 'Confidentiality Policy',
    description: 'Protects sensitive company information and proprietary data.',
    icon: ConfidentialityIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'confidentialInfoExamples', label: 'Examples of confidential information', type: 'textarea', placeholder: 'e.g., Client lists, financial data, trade secrets.' }
    ],
  },
  'employee-separation': {
    kind: 'policy',
    type: 'employee-separation',
    title: 'Employee Separation & Exit Policy',
    description: 'Formalizes offboarding procedures, notice periods, and exit interviews.',
    icon: EmployeeSeparationIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'exitInterviewContact', label: 'Who conducts exit interviews?', type: 'text', placeholder: 'e.g., The HR Department' }
    ],
  },
  'anti-harassment-discrimination': {
    kind: 'policy',
    type: 'anti-harassment-discrimination',
    title: 'Harassment & Anti-Discrimination Policy',
    description: 'Enforces a zero-tolerance stance on all forms of harassment and discrimination.',
    icon: AntiHarassmentDiscriminationIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'harassmentReportingContact', label: 'Primary contact for reporting harassment?', type: 'text', placeholder: 'e.g., Designated HR Manager' }
    ],
  },
  'company-vehicle': {
    kind: 'policy',
    type: 'company-vehicle',
    title: 'Company Vehicle Use Policy',
    description: 'Rules and procedures for employees provided with a company vehicle.',
    icon: CompanyVehicleIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'vehicleManager', label: 'Who manages the company vehicle fleet?', type: 'text', placeholder: 'e.g., Fleet Manager or Operations Head' }
    ],
    industries: ['Construction', 'Manufacturing', 'Retail', 'Agriculture'],
  },
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
      { id: 'reimbursementTimeframe', label: 'Typical timeframe for reimbursement (days)', type: 'number', placeholder: 'e.g., 14' }
    ],
  },
  // New Policies Added
  'employment-equity': {
    kind: 'policy',
    type: 'employment-equity',
    title: 'Employment Equity Policy',
    description: "Outlines commitment to equal opportunity and eliminating unfair discrimination, as per the Employment Equity Act.",
    icon: EmploymentEquityIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'eeManager', label: 'Senior Manager for Employment Equity', type: 'text', placeholder: 'e.g., Jane Doe, HR Director' }
    ],
  },
  'coida': {
    kind: 'policy',
    type: 'coida',
    title: 'COIDA Policy',
    description: "Details procedures for reporting and managing injuries on duty and occupational diseases, in compliance with COIDA.",
    icon: CoidaIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'iodContact', label: 'Person responsible for IOD reporting', type: 'text', placeholder: 'e.g., The Safety Officer', tip: 'This is the main contact for all COIDA-related matters, including submitting claims.' },
      { 
        id: 'internalReportingDeadline', 
        label: 'Internal deadline for employees to report an injury', 
        type: 'text', 
        placeholder: 'e.g., Within 24 hours of the incident',
        tip: 'Specify the internal timeframe for an employee to report an Injury on Duty (IOD) to their manager or the designated contact person.'
      },
      {
        id: 'returnToWorkCoordinator',
        label: 'Person/Department managing the return-to-work process',
        type: 'text',
        placeholder: 'e.g., The HR Department',
        tip: 'This individual or department coordinates with the employee and their doctor to facilitate a safe return to work after an injury.'
      }
    ],
    industries: ['Construction', 'Manufacturing', 'Agriculture'],
  },
  'uif': {
    kind: 'policy',
    type: 'uif',
    title: 'UIF Policy',
    description: "Explains the employer's and employee's obligations regarding Unemployment Insurance Fund (UIF) contributions.",
    icon: UifIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'payrollContact', label: 'Who manages payroll and UIF submissions?', type: 'text', placeholder: 'e.g., Finance Department' }
    ],
  },
  'recruitment-selection': {
    kind: 'policy',
    type: 'recruitment-selection',
    title: 'Recruitment and Selection Policy',
    description: "Ensures a fair, transparent, and non-discriminatory hiring process that aligns with the EEA.",
    icon: RecruitmentSelectionIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'recruitmentContact', label: 'Primary contact for recruitment', type: 'text', placeholder: 'e.g., The HR Manager' }
    ],
  },
  'working-hours': {
    kind: 'policy',
    type: 'working-hours',
    title: 'Working Hours Policy',
    description: "Defines standard working hours, overtime procedures, and rest periods in compliance with the BCEA.",
    icon: WorkingHoursIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'standardHours', label: 'Standard working hours', type: 'text', placeholder: 'e.g., 8:00 AM to 5:00 PM' }
    ],
  },
  'training-development': {
    kind: 'policy',
    type: 'training-development',
    title: 'Training and Development Policy',
    description: "Demonstrates commitment to employee growth by outlining the approach to skills development and training.",
    icon: TrainingDevelopmentIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'trainingApprover', label: 'Who approves training requests?', type: 'text', placeholder: 'e.g., Department Head' }
    ],
  },
  'anti-bribery-corruption': {
    kind: 'policy',
    type: 'anti-bribery-corruption',
    title: 'Anti-bribery and Corruption Policy',
    description: "Prohibits illegal or unethical practices that could damage the company's integrity and reputation.",
    icon: AntiBriberyCorruptionIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'briberyReportContact', label: 'Who to report suspected bribery to?', type: 'text', placeholder: 'e.g., The CEO or an anonymous hotline' }
    ],
    industries: ['Professional Services', 'Construction'],
  },
  'dress-code': {
    kind: 'policy',
    type: 'dress-code',
    title: 'Dress Code Policy',
    description: "A formal policy on workplace attire, depending on the company's industry and corporate culture.",
    icon: DressCodeIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'dressCodeSummary', label: 'Briefly describe the dress code', type: 'textarea', placeholder: 'e.g., Business casual. No shorts or open-toed shoes.' }
    ],
    industries: ['Hospitality', 'Retail', 'Professional Services'],
  },
  'alcohol-drug': {
    kind: 'policy',
    type: 'alcohol-drug',
    title: 'Alcohol and Drug Policy',
    description: "Outlines rules concerning the use of alcohol and drugs to ensure employee safety and productivity.",
    icon: AlcoholDrugIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'substanceAbuseContact', label: 'Who to contact for assistance?', type: 'text', placeholder: 'e.g., HR or an EAP provider' }
    ],
    industries: ['Construction', 'Manufacturing'],
  },
  'termination-of-employment': {
    kind: 'policy',
    type: 'termination-of-employment',
    title: 'Termination of Employment Policy',
    description: "Covers the legally compliant procedures for ending an employment contract, including termination and resignation.",
    icon: TerminationOfEmploymentIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'terminationNoticeWeeks', label: 'Standard notice period for termination (weeks)', type: 'number', placeholder: 'e.g., 4' }
    ],
  },
  'retrenchment': {
    kind: 'policy',
    type: 'retrenchment',
    title: 'Retrenchment Policy',
    description: "Dictates the fair procedure for dismissal based on operational requirements, as per the LRA.",
    icon: RetrenchmentIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'consultationManager', label: 'Who manages the retrenchment consultation?', type: 'text', placeholder: 'e.g., The HR Director' }
    ],
  },
  'deductions': {
    kind: 'policy',
    type: 'deductions',
    title: 'Deductions Policy',
    description: 'Outline lawful and agreed-upon deductions from an employee\'s salary, compliant with the BCEA.',
    icon: DeductionsIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'deductionsContact', label: 'Who to contact for deduction queries?', type: 'text', placeholder: 'e.g., Payroll Department' }
    ],
  },
  'anti-bullying': {
    kind: 'policy',
    type: 'anti-bullying',
    title: 'Anti-Bullying Policy',
    description: 'Establish a zero-tolerance stance on workplace bullying and outline a clear reporting procedure.',
    icon: AntiBullyingIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'confidentialContact', label: 'Confidential Reporting Contact', type: 'text', placeholder: 'e.g., Designated HR representative' }
    ],
  },
  'it-access-security': {
    kind: 'policy',
    type: 'it-access-security',
    title: 'IT Access & Security Policy',
    description: 'Define rules for accessing company systems and data, ensuring security and POPIA compliance.',
    icon: ItAccessSecurityIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'itSupportContact', label: 'IT Support Contact', type: 'text', placeholder: 'e.g., IT Department' }
    ],
    industries: ['Technology', 'Professional Services'],
  },
  'employee-handbook': {
    kind: 'policy',
    type: 'employee-handbook',
    title: 'Employee Handbook',
    description: 'Combine key HR policies into a single, comprehensive document. Select which sections to include.',
    icon: MasterPolicyIcon,
    price: 10500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'ceoName', label: 'CEO/Managing Director Name', type: 'text', placeholder: 'e.g., Jane Doe' },
      {
        id: 'includedPolicies',
        label: 'Select policies to include in the handbook',
        type: 'checkbox',
        options: [
          { id: 'select-all', label: 'Select All / Deselect All' },
          { id: 'leave', label: 'Leave Policy' },
          { id: 'disciplinary', label: 'Disciplinary Code & Procedure' },
          { id: 'grievance', label: 'Grievance Procedure' },
          { id: 'health-and-safety', label: 'Health & Safety' },
          { id: 'code-of-ethics', label: 'Code of Ethics / Conduct' },
          { id: 'it-cybersecurity', label: 'IT & Cybersecurity Policy' },
          { id: 'confidentiality', label: 'Confidentiality Policy' },
          { id: 'dress-code', label: 'Dress Code Policy' },
        ],
        tip: 'Select the core policies you want to form the main sections of your employee handbook.'
      }
    ],
  },
  'conflict-of-interest': {
    kind: 'policy',
    type: 'conflict-of-interest',
    title: 'Conflict of Interest Policy',
    description: "Govern situations where an employee's personal interests may clash with their professional duties and the company's integrity.",
    icon: ConflictOfInterestIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'disclosureContact', label: 'Who should employees disclose potential conflicts to?', type: 'text', placeholder: 'e.g., Their immediate manager or HR' }
    ],
  },
  'records-retention-destruction': {
    kind: 'policy',
    type: 'records-retention-destruction',
    title: 'Records Retention & Destruction Policy',
    description: 'Define how long to store records and how to securely destroy them, ensuring POPIA compliance.',
    icon: RecordsRetentionIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'infoOfficer', label: 'Information Officer Name', type: 'text', placeholder: 'e.g., John Smith' },
      { id: 'retentionPeriod', label: 'Standard retention period for employee records (years)', type: 'number', placeholder: 'e.g., 5', tip: 'Certain records (e.g., COIDA) may have different legal retention requirements.' }
    ],
  },
  'salary-structure-guide': {
    kind: 'policy',
    type: 'salary-structure-guide',
    title: 'Salary Structure Guide',
    description: "Document the company's approach to compensation, including pay bands, to ensure fairness and transparency.",
    icon: SalaryStructureIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'compensationPhilosophy', label: 'Briefly describe your compensation philosophy', type: 'textarea', placeholder: 'e.g., To offer competitive market-related salaries that attract and retain talent.' }
    ],
  },
  'workplace-language': {
    kind: 'policy',
    type: 'workplace-language',
    title: 'Workplace Language Policy',
    description: 'Establish guidelines on the official language(s) for business communication to ensure clarity and inclusivity.',
    icon: LanguagePolicyIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      {
        id: 'officialLanguage',
        label: 'Official Business Language(s)',
        type: 'text',
        placeholder: 'e.g., English',
        tip: 'Specify the primary language for all official internal and external communications.',
        required: true,
      },
      {
        id: 'otherLanguagesUsage',
        label: 'Usage of Other Languages',
        type: 'textarea',
        placeholder: 'e.g., Other languages are permitted during informal conversations and breaks, provided it does not lead to the exclusion of other team members.',
        tip: 'Outline when and how other languages may be used to foster an inclusive environment.',
      },
    ],
  },
  'family-responsibility-leave': {
    kind: 'policy',
    type: 'family-responsibility-leave',
    title: 'Family Responsibility Leave Policy',
    description: 'Define entitlement and usage conditions for family responsibility leave as per the BCEA.',
    icon: FamilyResponsibilityLeaveIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      {
        id: 'leaveContactPerson',
        label: 'Who should employees submit leave requests to?',
        type: 'text',
        placeholder: 'e.g., Immediate Supervisor or HR Department',
        tip: 'This is the first point of contact for an employee needing to take this type of leave.'
      },
      {
        id: 'proofRequirement',
        label: 'When is proof required?',
        type: 'select',
        options: [
          { id: 'always', label: 'Always require reasonable proof' },
          { id: 'after-2-days', label: 'Only if the employee is absent for more than 2 consecutive days' }
        ],
        tip: 'The BCEA allows employers to request reasonable proof for family responsibility leave. State your company\'s standard practice.'
      }
    ],
  },
};

export const FORMS: Record<FormType, Form> = {
  'job-application': {
    kind: 'form',
    type: 'job-application',
    title: 'Job Application Form',
    description: 'A standard form for candidates to provide personal details, work history, and qualifications.',
    icon: JobApplicationIcon,
    price: 3500,
    questions: [...commonQuestions, { id: 'position', label: 'Position Applied For', type: 'text' }],
    outputFormat: 'word',
  },
  'employee-details': {
    kind: 'form',
    type: 'employee-details',
    title: 'Employee Details Form',
    description: 'Collect and maintain essential employee personal, contact, and emergency information.',
    icon: EmployeeDetailsIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'leave-application': {
    kind: 'form',
    type: 'leave-application',
    title: 'Leave Application Form',
    description: 'A formal request form for employees applying for any type of leave (annual, sick, etc.).',
    icon: LeaveApplicationIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      { id: 'approvingManager', label: 'Default Approving Manager Title', type: 'text', placeholder: 'e.g., Department Head' }
    ],
    outputFormat: 'word',
  },
  'final-written-warning': {
    kind: 'form',
    type: 'final-written-warning',
    title: 'Final Written Warning Form',
    description: 'A formal document issued for serious misconduct or repeated offenses, preceding dismissal.',
    icon: FinalWrittenWarningIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'exit-interview': {
    kind: 'form',
    type: 'exit-interview',
    title: 'Exit Interview Form',
    description: 'A questionnaire to gather feedback from departing employees about their experience.',
    icon: ExitInterviewIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'grievance-form': {
    kind: 'form',
    type: 'grievance-form',
    title: 'Grievance Lodging Form',
    description: 'A structured form for employees to formally report a workplace grievance.',
    icon: GrievanceIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      { id: 'grievanceRecipient', label: 'Title of Grievance Recipient', type: 'text', placeholder: 'e.g., HR Manager' }
    ],
    outputFormat: 'word',
  },
  'job-description': {
    kind: 'form',
    type: 'job-description',
    title: 'Job Description Template',
    description: 'Structure a clear and comprehensive job description for a new role.',
    icon: JobDescriptionIcon,
    price: 3500,
    questions: [...commonQuestions, { id: 'jobTitle', label: 'Job Title', type: 'text' }, { id: 'department', label: 'Department', type: 'text' }],
    outputFormat: 'word',
  },
  'leave-application-maternity': {
    kind: 'form',
    type: 'leave-application-maternity',
    title: 'Maternity Leave Application',
    description: 'A specific form for applying for maternity leave in compliance with the BCEA.',
    icon: MaternityLeaveIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'disciplinary-enquiry-report': {
    kind: 'form',
    type: 'disciplinary-enquiry-report',
    title: 'Disciplinary Enquiry Report',
    description: 'A form to document the proceedings and outcome of a formal disciplinary hearing.',
    icon: DisciplinaryIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'suspension-notice': {
    kind: 'form',
    type: 'suspension-notice',
    title: 'Notice of Suspension',
    description: 'A formal notice to an employee of their precautionary suspension pending an investigation.',
    icon: SuspensionNoticeIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'appeal-form': {
    kind: 'form',
    type: 'appeal-form',
    title: 'Disciplinary Appeal Form',
    description: 'Allows an employee to formally appeal the outcome of a disciplinary action.',
    icon: AppealFormIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'expense-claim': {
    kind: 'form',
    type: 'expense-claim',
    title: 'Expense Claim Form',
    description: 'A formal document for employees to claim reimbursement for business-related expenses.',
    icon: ExpenseClaimIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'employee-training-agreement': {
    kind: 'form',
    type: 'employee-training-agreement',
    title: 'Employee Training Agreement',
    description: 'An agreement outlining the terms of company-sponsored training.',
    icon: TrainingAgreementIcon,
    price: 5000,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'reference-check': {
    kind: 'form',
    type: 'reference-check',
    title: 'Reference Check Form',
    description: 'A structured form to conduct and record reference checks for candidates.',
    icon: ReferenceCheckIcon,
    price: 3500,
    questions: [...commonQuestions, { id: 'candidateName', label: 'Candidate Name', type: 'text' }],
    outputFormat: 'word',
  },
  'retrenchment-notice': {
    kind: 'form',
    type: 'retrenchment-notice',
    title: 'Retrenchment Notice',
    description: 'A formal notice of termination due to operational requirements.',
    icon: RetrenchmentNoticeIcon,
    price: 5000,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'job-advertisement': {
    kind: 'form',
    type: 'job-advertisement',
    title: 'Job Advertisement Template',
    description: 'A template for creating professional and effective job advertisements.',
    icon: JobAdvertisementIcon,
    price: 3500,
    questions: [...commonQuestions, { id: 'jobTitle', label: 'Job Title', type: 'text' }],
    outputFormat: 'word',
  },
  'interview-guide': {
    kind: 'form',
    type: 'interview-guide',
    title: 'Interview Guide Template',
    description: 'A structured guide for conducting consistent and fair interviews.',
    icon: InterviewGuideIcon,
    price: 3500,
    questions: [...commonQuestions, { id: 'position', label: 'Position', type: 'text' }],
    outputFormat: 'word',
  },
  'candidate-evaluation': {
    kind: 'form',
    type: 'candidate-evaluation',
    title: 'Candidate Evaluation Form',
    description: 'A form for interviewers to score and provide feedback on candidates.',
    icon: CandidateEvaluationIcon,
    price: 3500,
    questions: [...commonQuestions, { id: 'candidateName', label: 'Candidate Name', type: 'text' }],
    outputFormat: 'word',
  },
  'onboarding-checklist': {
    kind: 'form',
    type: 'onboarding-checklist',
    title: 'Onboarding Checklist',
    description: 'A checklist to ensure a smooth and comprehensive onboarding process for new hires.',
    icon: OnboardingChecklistIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'confidentiality-agreement': {
    kind: 'form',
    type: 'confidentiality-agreement',
    title: 'Confidentiality Agreement (NDA)',
    description: 'A legal contract to protect sensitive company information.',
    icon: ConfidentialityIcon,
    price: 5000,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'restraint-of-trade': {
    kind: 'form',
    type: 'restraint-of-trade',
    title: 'Restraint of Trade Agreement',
    description: 'An agreement to prevent an employee from competing with the employer after employment ends.',
    icon: RestraintOfTradeIcon,
    price: 5000,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'performance-review': {
    kind: 'form',
    type: 'performance-review',
    title: 'Performance Review Form',
    description: 'A structured form for conducting employee performance evaluations.',
    icon: PerformanceReviewIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'salary-bank-details': {
    kind: 'form',
    type: 'salary-bank-details',
    title: 'Salary & Bank Details Form',
    description: 'A secure form for employees to provide their banking details for salary payments.',
    icon: SalaryBankIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'overtime-claim': {
    kind: 'form',
    type: 'overtime-claim',
    title: 'Overtime Claim Form',
    description: 'A form for employees to claim payment for hours worked overtime.',
    icon: OvertimeClaimIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'excel',
  },
  'employment-contract': {
    kind: 'form',
    type: 'employment-contract',
    title: 'Employment Contract',
    description: 'A standard, legally-binding employment contract for new hires.',
    icon: EmploymentContractIcon,
    price: 5000,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'permission-for-deductions': {
    kind: 'form',
    type: 'permission-for-deductions',
    title: 'Permission for Deductions Form',
    description: 'A form for employees to authorize specific deductions from their salary.',
    icon: PermissionForDeductionsIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'workplace-skills-plan': {
    kind: 'form',
    type: 'workplace-skills-plan',
    title: 'Workplace Skills Plan (WSP)',
    description: 'A document outlining an employer\'s plan for training and skills development for the year.',
    icon: SkillsDevelopmentIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'annual-training-report': {
    kind: 'form',
    type: 'annual-training-report',
    title: 'Annual Training Report (ATR)',
    description: 'A report on the implementation of the Workplace Skills Plan from the previous year.',
    icon: SkillsDevelopmentIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'certificate-of-service': {
    kind: 'form',
    type: 'certificate-of-service',
    title: 'Certificate of Service',
    description: 'A document provided to a departing employee confirming their employment details.',
    icon: CertificateOfServiceIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'termination-letter': {
    kind: 'form',
    type: 'termination-letter',
    title: 'Termination Letter',
    description: 'A formal letter confirming the termination of an employee\'s contract.',
    icon: TerminationOfEmploymentIcon,
    price: 5000,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'resignation-acceptance-letter': {
    kind: 'form',
    type: 'resignation-acceptance-letter',
    title: 'Resignation Acceptance Letter',
    description: 'A formal letter from the employer accepting an employee\'s resignation.',
    icon: ResignationIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'payroll-processing-checklist': {
    kind: 'form',
    type: 'payroll-processing-checklist',
    title: 'Payroll Processing Checklist',
    description: 'A checklist to ensure all steps in the payroll process are completed accurately.',
    icon: PayrollProcessingIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
   'staff-grooming-checklist': {
    kind: 'form',
    type: 'staff-grooming-checklist',
    title: 'Staff Grooming Checklist',
    description: 'A checklist to ensure staff adhere to grooming and uniform standards.',
    icon: ChecklistIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'warehouse-master-cleaning-checklist': {
    kind: 'form',
    type: 'warehouse-master-cleaning-checklist',
    title: 'Warehouse Master Cleaning Checklist',
    description: 'A comprehensive cleaning checklist for warehouse environments.',
    icon: CleaningIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'master-cleaning-schedule': {
    kind: 'form',
    type: 'master-cleaning-schedule',
    title: 'Master Cleaning Schedule',
    description: 'A schedule for regular cleaning tasks across the business.',
    icon: CleaningIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'food-dispatch-checklist': {
    kind: 'form',
    type: 'food-dispatch-checklist',
    title: 'Food Dispatch Checklist',
    description: 'A checklist for ensuring food safety standards during dispatch.',
    icon: FoodSafetyIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'attendance-register': {
    kind: 'form',
    type: 'attendance-register',
    title: 'Attendance Register',
    description: 'A daily register to track employee attendance.',
    icon: RegisterIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'warehouse-cleaning-checklist': {
    kind: 'form',
    type: 'warehouse-cleaning-checklist',
    title: 'Warehouse Cleaning Checklist',
    description: 'A specific checklist for daily/weekly warehouse cleaning tasks.',
    icon: CleaningIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'refrigerator-temperature-logsheet': {
    kind: 'form',
    type: 'refrigerator-temperature-logsheet',
    title: 'Refrigerator Temperature Logsheet',
    description: 'A logsheet for recording refrigerator temperatures to ensure food safety.',
    icon: TemperatureIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'food-safety-training-modules': {
    kind: 'form',
    type: 'food-safety-training-modules',
    title: 'Food Safety Training Modules',
    description: 'Training material content for food safety.',
    icon: FoodSafetyIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'thermometer-verification-checklist': {
    kind: 'form',
    type: 'thermometer-verification-checklist',
    title: 'Thermometer Verification Checklist',
    description: 'A checklist to verify the accuracy of thermometers.',
    icon: TemperatureIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'cleaning-checklist': {
    kind: 'form',
    type: 'cleaning-checklist',
    title: 'Cleaning Checklist',
    description: 'A general-purpose cleaning checklist.',
    icon: CleaningIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'food-receiving-checklist': {
    kind: 'form',
    type: 'food-receiving-checklist',
    title: 'Food Receiving Checklist',
    description: 'A checklist to ensure food safety standards when receiving goods.',
    icon: FoodSafetyIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'bar-master-cleaning-schedule': {
    kind: 'form',
    type: 'bar-master-cleaning-schedule',
    title: 'Bar Master Cleaning Schedule',
    description: 'A comprehensive cleaning schedule specifically for a bar area.',
    icon: CleaningIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'bar-cleaning-checklist': {
    kind: 'form',
    type: 'bar-cleaning-checklist',
    title: 'Bar Cleaning Checklist',
    description: 'A daily/weekly cleaning checklist for a bar.',
    icon: CleaningIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'food-safety-training-register': {
    kind: 'form',
    type: 'food-safety-training-register',
    title: 'Food Safety Training Register',
    description: 'A register to track employee participation in food safety training.',
    icon: TrainingRegisterIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'leave-register': {
    kind: 'form',
    type: 'leave-register',
    title: 'Leave Register',
    description: 'A register for tracking all employee leave taken.',
    icon: RegisterIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'voluntary-retrenchment-application': {
    kind: 'form',
    type: 'voluntary-retrenchment-application',
    title: 'Voluntary Retrenchment Application',
    description: 'A form for employees to apply for voluntary retrenchment.',
    icon: RetrenchmentNoticeIcon,
    price: 5000,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'hr-bundle-package': {
    kind: 'form',
    type: 'hr-bundle-package',
    title: 'HR Bundle Package',
    description: 'A collection of essential HR documents in a single package.',
    icon: BundleIcon,
    price: 10500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'employee-handbook-canva': {
    kind: 'form',
    type: 'employee-handbook-canva',
    title: 'Employee Handbook (Canva)',
    description: 'A professionally designed employee handbook template for Canva.',
    icon: CanvaIcon,
    price: 10500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'anticipated-retrenchment-notice': {
    kind: 'form',
    type: 'anticipated-retrenchment-notice',
    title: 'Anticipated Retrenchment Notice',
    description: 'A notice to employees about potential future retrenchments.',
    icon: LegalNoticeIcon,
    price: 5000,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'onboarding-checklist-canva': {
    kind: 'form',
    type: 'onboarding-checklist-canva',
    title: 'Onboarding Checklist (Canva)',
    description: 'A visually appealing onboarding checklist template for Canva.',
    icon: CanvaIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'employee-survey-canva': {
    kind: 'form',
    type: 'employee-survey-canva',
    title: 'Employee Survey (Canva)',
    description: 'A customizable employee survey template for Canva.',
    icon: SurveyIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'employee-review-canva': {
    kind: 'form',
    type: 'employee-review-canva',
    title: 'Employee Review (Canva)',
    description: 'A performance review template designed for Canva.',
    icon: CanvaIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'daily-attendance-canva': {
    kind: 'form',
    type: 'daily-attendance-canva',
    title: 'Daily Attendance (Canva)',
    description: 'A daily attendance sheet template for Canva.',
    icon: CanvaIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'verbal-warning-afrikaans': {
    kind: 'form',
    type: 'verbal-warning-afrikaans',
    title: 'Verbal Warning (Afrikaans)',
    description: 'A verbal warning form written in Afrikaans.',
    icon: AfrikaansIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'fixed-contract-ending-notice': {
    kind: 'form',
    type: 'fixed-contract-ending-notice',
    title: 'Fixed Contract Ending Notice',
    description: 'A notice informing an employee that their fixed-term contract is ending.',
    icon: LegalNoticeIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'consultation-meeting-notice': {
    kind: 'form',
    type: 'consultation-meeting-notice',
    title: 'Consultation Meeting Notice',
    description: 'A formal notice for a consultation meeting with an employee.',
    icon: LegalNoticeIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'grievance-investigation-notice': {
    kind: 'form',
    type: 'grievance-investigation-notice',
    title: 'Grievance Investigation Notice',
    description: 'A notice to an employee about a grievance investigation.',
    icon: LegalNoticeIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'disciplinary-hearing-notice': {
    kind: 'form',
    type: 'disciplinary-hearing-notice',
    title: 'Disciplinary Hearing Notice',
    description: 'A formal notice to an employee to attend a disciplinary hearing.',
    icon: LegalNoticeIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'incapacity-inquiry-general-notice': {
    kind: 'form',
    type: 'incapacity-inquiry-general-notice',
    title: 'Incapacity Inquiry Notice (General)',
    description: 'A notice for a general incapacity inquiry.',
    icon: LegalNoticeIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'incapacity-inquiry-ill-health-notice': {
    kind: 'form',
    type: 'incapacity-inquiry-ill-health-notice',
    title: 'Incapacity Inquiry Notice (Ill Health)',
    description: 'A notice for an incapacity inquiry related to ill health.',
    icon: LegalNoticeIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'poor-performance-inquiry-notice': {
    kind: 'form',
    type: 'poor-performance-inquiry-notice',
    title: 'Poor Performance Inquiry Notice',
    description: 'A notice for an inquiry into an employee\'s poor performance.',
    icon: LegalNoticeIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'postponement-of-hearing-notice': {
    kind: 'form',
    type: 'postponement-of-hearing-notice',
    title: 'Postponement of Hearing Notice',
    description: 'A notice to postpone a scheduled hearing.',
    icon: LegalNoticeIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'observation-report': {
    kind: 'form',
    type: 'observation-report',
    title: 'Observation Report',
    description: 'A report to document observations of employee performance or conduct.',
    icon: JobDescriptionIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'staff-meeting-template': {
    kind: 'form',
    type: 'staff-meeting-template',
    title: 'Staff Meeting Template',
    description: 'A template for structuring and documenting staff meetings.',
    icon: MeetingMinutesIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'verbal-warning': {
    kind: 'form',
    type: 'verbal-warning',
    title: 'Verbal Warning Form',
    description: 'A form to document a verbal warning issued to an employee.',
    icon: FinalWrittenWarningIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'written-warning': {
    kind: 'form',
    type: 'written-warning',
    title: 'Written Warning Form',
    description: 'A formal document for a first or second written warning.',
    icon: FinalWrittenWarningIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'medical-report-template': {
    kind: 'form',
    type: 'medical-report-template',
    title: 'Medical Report Template',
    description: 'A template for a medical professional to complete regarding an employee\'s fitness for work.',
    icon: HealthSafetyIcon,
    price: 3500,
    questions: [...commonQuestions, { id: 'employeeName', label: 'Employee Name', type: 'text' }],
    outputFormat: 'word',
  },
  'grievance-decision-form': {
    kind: 'form',
    type: 'grievance-decision-form',
    title: 'Grievance Decision Form',
    description: 'A form to communicate the outcome of a grievance investigation.',
    icon: GrievanceIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'poor-performance-meeting-minutes': {
    kind: 'form',
    type: 'poor-performance-meeting-minutes',
    title: 'Poor Performance Meeting Minutes',
    description: 'A template for recording the minutes of a poor performance meeting.',
    icon: MeetingMinutesIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'final-warning-hearing-held': {
    kind: 'form',
    type: 'final-warning-hearing-held',
    title: 'Final Warning (Hearing Held)',
    description: 'A final written warning form to be used after a formal hearing has been conducted.',
    icon: FinalWrittenWarningIcon,
    price: 3500,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'incident-investigation-report': {
    kind: 'form',
    type: 'incident-investigation-report',
    title: 'Incident Investigation Report',
    description: 'A detailed report following the investigation of a workplace incident.',
    icon: IncidentReportIcon,
    price: 5000,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'incident-report': {
    kind: 'form',
    type: 'incident-report',
    title: 'Incident Report Form',
    description: 'A form for employees to report workplace incidents (e.g., accidents, safety breaches).',
    icon: IncidentReportIcon,
    price: 3500,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
};

export const FORM_BASE_TEMPLATES: Partial<Record<FormType, string>> = {
  'job-application': `
# Job Application Form
**Company:** [companyName]
**Position Applied For:** [position]

### Personal Details
- **Full Name:** _________________________
- **ID/Passport Number:** _________________________
- **Contact Number:** _________________________
- **Email Address:** _________________________
- **Residential Address:** _________________________

### Employment History (Most Recent First)
1. **Company:** ____________________ **Position:** ____________________ **Dates:** ____________
2. **Company:** ____________________ **Position:** ____________________ **Dates:** ____________

### Education & Qualifications
- **Highest Qualification:** _________________________
- **Institution:** _________________________
- **Year Completed:** _________________________

### References
Please provide two professional references.
1. **Name:** ____________________ **Company:** ____________________ **Contact:** ____________
2. **Name:** ____________________ **Company:** ____________________ **Contact:** ____________

### Declaration
I, the undersigned, declare that the information provided in this application is true and correct to the best of my knowledge.
**Signature:** _________________________
**Date:** _________________________
`,
  'employee-details': `
# Employee Details Form
**Company:** [companyName]

### Personal Information
- **Full Name:** _________________________
- **ID Number:** _________________________
- **Date of Birth:** _________________________
- **Gender:** _________________________
- **Nationality:** _________________________
- **Tax Number:** _________________________

### Contact Information
- **Residential Address:** _________________________
- **Mobile Number:** _________________________
- **Work Number:** _________________________
- **Personal Email:** _________________________

### Emergency Contact
- **Contact Name:** _________________________
- **Relationship:** _________________________
- **Contact Number:** _________________________

### Declaration
I confirm that the above information is accurate and I will inform HR of any changes.
**Signature:** _________________________
**Date:** _________________________
`,
  'leave-application': `
# Leave Application Form
**Company:** [companyName]

### Employee Details
- **Employee Name:** _________________________
- **Department:** _________________________
- **Position:** _________________________

### Leave Details
- **Type of Leave:** 
  - [ ] Annual 
  - [ ] Sick 
  - [ ] Family Responsibility 
  - [ ] Maternity/Paternity 
  - [ ] Unpaid
- **Start Date:** _________________________
- **End Date:** _________________________
- **Total Days:** _________________________

### Reason for Leave (If applicable)
__________________________________________________

**Employee Signature:** _________________________ **Date:** _________________

---
### For Office Use Only
- **Approved / Rejected**
- **Manager:** [approvingManager]
- **Signature:** _________________________ **Date:** _________________
`,
  'final-written-warning': `
# Final Written Warning
**Company:** [companyName]

- **Employee Name:** [employeeName]
- **Date:** _________________________
- **Issued by:** [managerName]

This serves as a **final written warning** concerning your (misconduct / poor performance).

### Details of Transgression
On (date), you (describe the incident/issue in detail). This is a breach of the company's disciplinary code, specifically section (X).

### Previous Warnings
- Verbal Warning on (date)
- First Written Warning on (date)

### Required Improvement
You are required to (state the expected change in behavior or performance).

### Consequences of Non-Compliance
Failure to meet these requirements or any further breach of the company's code of conduct will result in further disciplinary action, which may include your dismissal.

### Employee's Comments
__________________________________________________

**Employee Signature:** _________________________ **Date:** _________________
(Your signature confirms receipt of this warning, not necessarily agreement with its content)

**Manager Signature:** _________________________ **Date:** _________________
`,
  'exit-interview': `
# Exit Interview Questionnaire
**Company:** [companyName]

- **Employee Name:** _________________________
- **Date of Interview:** _________________________
- **Interviewer:** _________________________

1. **What was your primary reason for leaving the company?**
   __________________________________________________

2. **What did you like most about your job and working here?**
   __________________________________________________

3. **What did you like least about your job and working here?**
   __________________________________________________

4. **Do you feel you were provided with the resources and support to succeed in your role?**
   __________________________________________________

5. **Do you have any suggestions for improving the company, culture, or this role?**
   __________________________________________________
`,
  'grievance-form': `
# Grievance Lodging Form
**Company:** [companyName]
**Recipient:** [grievanceRecipient]

### Employee Details
- **Name:** _________________________
- **Department:** _________________________

### Grievance Details
- **Date of Incident:** _________________________
- **Nature of Grievance:** (Please describe the issue clearly and factually)
  __________________________________________________
  __________________________________________________

- **Desired Outcome/Resolution:**
  __________________________________________________

**Employee Signature:** _________________________ **Date:** _________________
`,
  'job-description': `
# Job Description
**Company:** [companyName]

- **Job Title:** [jobTitle]
- **Department:** [department]
- **Reports to:** _________________________
- **Location:** _________________________

### Job Summary
A brief, one-paragraph summary of the role's purpose.

### Key Responsibilities
- 
- 
- 

### Qualifications & Experience
- 
- 

### Skills & Competencies
- 
- 
`,
  'employment-contract': `
# Contract of Employment
**Between:** [companyName]
**And:** [employeeName]

This document constitutes a contract of permanent employment between the parties mentioned above.

1. **Position:** _________________________
2. **Commencement Date:** _________________________
3. **Place of Work:** _________________________
4. **Remuneration:** R_________ per month.
5. **Working Hours:** _________________________
6. **Leave:** In accordance with the Basic Conditions of Employment Act (BCEA).
7. **Termination:** Notice period of ______ weeks.

**Signed at** _______________ **on this** ______ **day of** __________________ **20__**.

**For the Employer:** _________________________
[managerName]

**Employee:** _________________________
[employeeName]
`,
  'onboarding-checklist': `
| Task                               | Department | Completed (Y/N) | Date | Notes |
|------------------------------------|------------|-------------------|------|-------|
| **Pre-Arrival**                    |            |                   |      |       |
| Prepare workstation & equipment    | IT/Admin   |                   |      |       |
| Set up email and system access     | IT         |                   |      |       |
| Send welcome email to new hire     | HR/Manager |                   |      |       |
| **Day 1**                          |            |                   |      |       |
| Welcome and team introductions     | Manager    |                   |      |       |
| Office tour                        | HR/Manager |                   |      |       |
| Complete HR paperwork              | HR         |                   |      |       |
| Review job description & goals     | Manager    |                   |      |       |
| **Week 1**                         |            |                   |      |       |
| Initial training on key systems    | Manager/Team|                   |      |       |
| Review company policies/handbook   | HR         |                   |      |       |
| First weekly check-in              | Manager    |                   |      |       |
`,
  // Add other templates here... many will be simple headers.
};

export const FORM_ENRICHMENT_PROMPTS: Partial<Record<FormType, string>> = {
  'leave-application': 'Add a note explaining that for sick leave longer than two days, a medical certificate may be required as per the BCEA.',
  'employment-contract': 'Include standard clauses for a permanent employment contract in South Africa, such as probation period, duties, remuneration, and termination. Ensure it refers to the BCEA.',
  'final-written-warning': 'Emphasize that this is a final warning and that further transgression may lead to dismissal. Include a section for the employee to acknowledge receipt and to state whether they agree or disagree with the warning.',
  'grievance-form': 'Add a field for the employee to state the desired outcome or resolution they are seeking.',
};

export const INDUSTRIES = [
  'Technology',
  'Retail',
  'Hospitality',
  'Manufacturing',
  'Construction',
  'Agriculture',
  'Professional Services',
];

export const POLICY_CATEGORIES = [
  {
    title: 'Core Compliance & Legal',
    items: [POLICIES['leave'], POLICIES['disciplinary'], POLICIES['grievance'], POLICIES['health-and-safety'], POLICIES['employment-equity'], POLICIES['coida'], POLICIES['uif'], POLICIES['termination-of-employment'], POLICIES['retrenchment'], POLICIES['working-hours'], POLICIES['employee-separation'], POLICIES['family-responsibility-leave']],
  },
  {
    title: 'Employee Conduct & Workplace Culture',
    items: [POLICIES['employee-conduct'], POLICIES['sexual-harassment'], POLICIES['eeo-diversity'], POLICIES['attendance-punctuality'], POLICIES['dress-code'], POLICIES['alcohol-drug'], POLICIES['anti-bullying'], POLICIES['anti-harassment-discrimination'], POLICIES['conflict-of-interest'], POLICIES['workplace-language']],
  },
  {
    title: 'IT & Digital Workplace',
    items: [POLICIES['it-cybersecurity'], POLICIES['it-access-security'], POLICIES['data-usage-popia'], POLICIES['electronic-communications'], POLICIES['social-media'], POLICIES['remote-hybrid-work'], POLICIES['byod'], POLICIES['cell-phone']],
  },
  {
    title: 'Operations & Finance',
    items: [POLICIES['company-property'], POLICIES['company-vehicle'], POLICIES['travel'], POLICIES['expense-reimbursement'], POLICIES['standby'], POLICIES['telephone-usage'], POLICIES['visitor'], POLICIES['deductions']],
  },
  {
    title: 'Talent Management & Growth',
    items: [POLICIES['recruitment-selection'], POLICIES['performance-management'], POLICIES['training-development'], POLICIES['compensation-benefits'], POLICIES['salary-structure-guide'], POLICIES['certification'], POLICIES['time-off']],
  },
  {
    title: 'Governance & Information Management',
    items: [POLICIES['code-of-ethics'], POLICIES['whistleblower'], POLICIES['confidentiality'], POLICIES['communication-retention'], POLICIES['data-protection-privacy'], POLICIES['records-retention-destruction'], POLICIES['anti-bribery-corruption'], POLICIES['security']],
  },
  {
    title: 'Comprehensive Documents',
    items: [POLICIES['master'], POLICIES['employee-handbook']],
  },
];

export const FORM_CATEGORIES = [
    {
        title: 'Recruitment & Onboarding',
        items: [FORMS['job-application'], FORMS['job-description'], FORMS['job-advertisement'], FORMS['interview-guide'], FORMS['candidate-evaluation'], FORMS['reference-check'], FORMS['employment-contract'], FORMS['onboarding-checklist'], FORMS['confidentiality-agreement'], FORMS['restraint-of-trade']]
    },
    {
        title: 'Employee Administration',
        items: [FORMS['employee-details'], FORMS['salary-bank-details'], FORMS['permission-for-deductions'], FORMS['certificate-of-service']]
    },
    {
        title: 'Leave & Attendance',
        items: [FORMS['leave-application'], FORMS['leave-application-maternity'], FORMS['attendance-register'], FORMS['leave-register'], FORMS['overtime-claim']]
    },
    {
        title: 'Disciplinary, Grievance & Incapacity',
        items: [FORMS['grievance-form'], FORMS['verbal-warning'], FORMS['written-warning'], FORMS['final-written-warning'], FORMS['disciplinary-hearing-notice'], FORMS['suspension-notice'], FORMS['disciplinary-enquiry-report'], FORMS['appeal-form'], FORMS['grievance-investigation-notice'], FORMS['grievance-decision-form'], FORMS['incapacity-inquiry-general-notice'], FORMS['incapacity-inquiry-ill-health-notice']]
    },
    {
        title: 'Performance & Development',
        items: [FORMS['performance-review'], FORMS['poor-performance-inquiry-notice'], FORMS['poor-performance-meeting-minutes'], FORMS['employee-training-agreement'], FORMS['workplace-skills-plan'], FORMS['annual-training-report']]
    },
    {
        title: 'Separation & Offboarding',
        items: [FORMS['exit-interview'], FORMS['termination-letter'], FORMS['resignation-acceptance-letter'], FORMS['retrenchment-notice'], FORMS['voluntary-retrenchment-application'], FORMS['fixed-contract-ending-notice'], FORMS['anticipated-retrenchment-notice']]
    },
    {
        title: 'Operations & Safety',
        items: [FORMS['expense-claim'], FORMS['payroll-processing-checklist'], FORMS['incident-report'], FORMS['incident-investigation-report'], FORMS['staff-meeting-template'], FORMS['medical-report-template'], FORMS['observation-report']]
    },
    {
        title: 'Industry-Specific Checklists (Food & Warehouse)',
        items: [FORMS['staff-grooming-checklist'], FORMS['warehouse-master-cleaning-checklist'], FORMS['master-cleaning-schedule'], FORMS['food-dispatch-checklist'], FORMS['warehouse-cleaning-checklist'], FORMS['refrigerator-temperature-logsheet'], FORMS['thermometer-verification-checklist'], FORMS['cleaning-checklist'], FORMS['food-receiving-checklist'], FORMS['bar-master-cleaning-schedule'], FORMS['bar-cleaning-checklist'], FORMS['food-safety-training-register']]
    },
     {
        title: 'Notices & Warnings (Afrikaans & English)',
        items: [FORMS['verbal-warning-afrikaans'], FORMS['consultation-meeting-notice'], FORMS['postponement-of-hearing-notice'], FORMS['final-warning-hearing-held']]
    },
    {
        title: 'Bundles & Canva Templates',
        items: [FORMS['hr-bundle-package'], FORMS['employee-handbook-canva'], FORMS['onboarding-checklist-canva'], FORMS['employee-survey-canva'], FORMS['employee-review-canva'], FORMS['daily-attendance-canva']]
    }
];