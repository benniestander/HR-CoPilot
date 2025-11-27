

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
  ResignationIcon,
  SecurityIcon,
  SexualHarassmentIcon,
  StandbyIcon,
  TelephoneUsageIcon,
  TimeOffIcon,
  TravelIcon,
  CompanyPropertyIcon,
  VisitorIcon,
  RemoteWorkIcon,
  EeoDiversityIcon,
  AttendancePunctualityIcon,
  EmployeeConductIcon,
  DataProtectionPrivacyIcon,
  DisciplinaryActionIcon,
  WhistleblowerIcon,
  CompensationBenefitsIcon,
  PerformanceManagementIcon,
  WorkplaceWellnessIcon,
  ItCybersecurityIcon,
  SocialMediaIcon,
  LanguagePolicyIcon,
  ConfidentialityIcon,
  EmployeeSeparationIcon,
  AntiHarassmentDiscriminationIcon,
  CompanyVehicleIcon,
  ExpenseReimbursementIcon,
  EmploymentEquityIcon,
  CoidaIcon,
  UifIcon,
  RecruitmentSelectionIcon,
  WorkingHoursIcon,
  TrainingDevelopmentIcon,
  AntiBriberyCorruptionIcon,
  DressCodeIcon,
  AlcoholDrugIcon,
  TerminationOfEmploymentIcon,
  RetrenchmentIcon,
  // New Icons for new policies
  DeductionsIcon,
  AntiBullyingIcon,
  ItAccessSecurityIcon,
  // New Policy Icons
  ConflictOfInterestIcon,
  RecordsRetentionIcon,
  SalaryStructureIcon,
  FamilyResponsibilityLeaveIcon,
  // Form Icons
  JobApplicationIcon,
  LeaveApplicationIcon,
  FinalWrittenWarningIcon,
  ExitInterviewIcon,
  EmployeeDetailsIcon,
  JobDescriptionIcon,
  MaternityLeaveIcon,
  SuspensionNoticeIcon,
  AppealFormIcon,
  ExpenseClaimIcon,
  TrainingAgreementIcon,
  ReferenceCheckIcon,
  RetrenchmentNoticeIcon,
  JobAdvertisementIcon,
  InterviewGuideIcon,
  CandidateEvaluationIcon,
  OnboardingChecklistIcon,
  RestraintOfTradeIcon,
  PerformanceReviewIcon,
  SalaryBankIcon,
  OvertimeClaimIcon,
  EmploymentContractIcon,
  PermissionForDeductionsIcon,
  SkillsDevelopmentIcon,
  // New Form Icons
  CertificateOfServiceIcon,
  PayrollProcessingIcon,
  // New Generic Icons
  ChecklistIcon,
  CleaningIcon,
  FoodSafetyIcon,
  TemperatureIcon,
  TrainingRegisterIcon,
  RegisterIcon,
  CanvaIcon,
  LegalNoticeIcon,
  AfrikaansIcon,
  MeetingMinutesIcon,
  BundleIcon,
  SurveyIcon,
  IncidentReportIcon,
} from './components/Icons';
import type { Policy, PolicyType, Form, FormType } from './types';

// FIX: Define and export INDUSTRIES
export const INDUSTRIES = ['Agriculture', 'Construction', 'Hospitality', 'Manufacturing', 'Professional Services', 'Retail', 'Technology'];

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
      { id: 'reimbursementTimeframe', label: 'Typical timeframe for reimbursement (days)', type: 'number', placeholder: 'e.g., 14' },
      { id: 'receiptThreshold', label: 'Minimum amount requiring receipt (R)', type: 'number', placeholder: 'e.g., 50' }
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
  // FIX: Complete the 'training-development' policy definition
  'training-development': {
    kind: 'policy',
    type: 'training-development',
    title: 'Training and Development Policy',
    description: "Demonstrates commitment to employee growth by outlining training opportunities and procedures.",
    icon: TrainingDevelopmentIcon,
    price: 3500,
    questions: [
        ...commonQuestions,
        ...commonPolicyMetadataQuestions,
        { id: 'trainingBudget', label: 'Annual Training Budget per Employee (if applicable)', type: 'text', placeholder: 'e.g., R5000' },
        { id: 'approvalProcess', label: 'Who approves training requests?', type: 'text', placeholder: 'e.g., Department Manager' }
    ],
  },
  'anti-bribery-corruption': {
    kind: 'policy',
    type: 'anti-bribery-corruption',
    title: 'Anti-Bribery & Corruption Policy',
    description: 'Establishes a zero-tolerance approach to bribery and corruption in all business dealings.',
    icon: AntiBriberyCorruptionIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'giftPolicy', label: 'Policy on Giving/Receiving Gifts', type: 'textarea', placeholder: 'e.g., All gifts above R500 must be declared.' }
    ],
  },
  'dress-code': {
    kind: 'policy',
    type: 'dress-code',
    title: 'Dress Code Policy',
    description: 'Outlines the expected standards of dress and appearance for the workplace.',
    icon: DressCodeIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'dressCodeStandard', label: 'Describe the dress code', type: 'text', placeholder: 'e.g., Business Casual, Uniform Required' }
    ],
  },
  'alcohol-drug': {
    kind: 'policy',
    type: 'alcohol-drug',
    title: 'Alcohol and Drug Policy',
    description: 'Prohibits the use, possession, or influence of alcohol and illegal drugs in the workplace.',
    icon: AlcoholDrugIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'testingClause', label: 'Does the company reserve the right to conduct testing?', type: 'select', options: [{id: 'yes', label: 'Yes'}, {id: 'no', label: 'No'}] }
    ],
    industries: ['Construction', 'Manufacturing'],
  },
  'termination-of-employment': {
    kind: 'policy',
    type: 'termination-of-employment',
    title: 'Termination of Employment Policy',
    description: 'Details the procedures for ending the employment relationship, covering all forms of termination.',
    icon: TerminationOfEmploymentIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'noticePeriods', label: 'Standard Notice Periods', type: 'textarea', placeholder: 'e.g., 1 week for < 6 months service, 2 weeks for 6-12 months, 4 weeks for > 1 year.' }
    ],
  },
  'retrenchment': {
    kind: 'policy',
    type: 'retrenchment',
    title: 'Retrenchment Policy',
    description: 'Outlines the fair procedure to be followed in the event of retrenchments due to operational requirements.',
    icon: RetrenchmentIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'severancePay', label: 'Severance Pay Calculation', type: 'text', placeholder: 'e.g., One week\'s pay per completed year of service.' }
    ],
  },
  'deductions': {
    kind: 'policy',
    type: 'deductions',
    title: 'Deductions Policy',
    description: 'Specifies lawful and agreed-upon deductions that can be made from an employee\'s salary.',
    icon: DeductionsIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'deductionExamples', label: 'Examples of possible deductions', type: 'textarea', placeholder: 'e.g., Staff loans, training costs, loss/damage to company property.' }
    ],
  },
  'anti-bullying': {
    kind: 'policy',
    type: 'anti-bullying',
    title: 'Anti-Bullying Policy',
    description: 'Defines and prohibits bullying in the workplace and outlines reporting procedures.',
    icon: AntiBullyingIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'reportingContact', label: 'Who should employees report bullying to?', type: 'text', placeholder: 'e.g., HR Manager or a designated senior manager.' }
    ],
  },
  'it-access-security': {
    kind: 'policy',
    type: 'it-access-security',
    title: 'IT Access & Security Policy',
    description: 'Governs access to company IT systems, data security, and password management.',
    icon: ItAccessSecurityIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'passwordReset', label: 'Procedure for password resets', type: 'text', placeholder: 'e.g., Contact the IT Department via email.' }
    ],
  },
  'employee-handbook': {
    kind: 'policy',
    type: 'employee-handbook',
    title: 'Employee Handbook',
    description: 'A comprehensive guide combining multiple key policies into one document for employees.',
    icon: MasterPolicyIcon,
    price: 12500,
    questions: [
      ...commonQuestions,
      {
        id: 'includedPolicies',
        label: 'Select Policies to Include',
        type: 'checkbox',
        tip: 'Choose the policies you want to build into your comprehensive handbook.',
        options: [
          { id: 'select-all', label: 'Select All / Deselect All'},
          { id: 'leave', label: 'Leave Policy' },
          { id: 'disciplinary', label: 'Disciplinary Code' },
          { id: 'grievance', label: 'Grievance Procedure' },
          { id: 'health-and-safety', label: 'Health & Safety' },
          { id: 'electronic-communications', label: 'Electronic Communications' },
          { id: 'dress-code', label: 'Dress Code' },
          { id: 'working-hours', label: 'Working Hours' },
        ]
      },
    ],
  },
  'conflict-of-interest': {
    kind: 'policy',
    type: 'conflict-of-interest',
    title: 'Conflict of Interest Policy',
    description: 'Provides guidelines for employees to identify, declare, and manage potential conflicts of interest.',
    icon: ConflictOfInterestIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'declarationOfficer', label: 'Who to declare conflicts to', type: 'text', placeholder: 'e.g., The Head of Compliance' }
    ],
    industries: ['Professional Services'],
  },
  'records-retention-destruction': {
    kind: 'policy',
    type: 'records-retention-destruction',
    title: 'Records Retention & Destruction Policy',
    description: 'Defines how long various company records are kept and how they are securely destroyed.',
    icon: RecordsRetentionIcon,

    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'retentionPeriodFinancial', label: 'Retention period for financial records (years)', type: 'number', placeholder: 'e.g., 7' }
    ],
  },
  'salary-structure-guide': {
    kind: 'policy',
    type: 'salary-structure-guide',
    title: 'Salary Structure Guide',
    description: 'Explains the company’s approach to compensation, including salary bands, grading, and pay philosophy.',
    icon: SalaryStructureIcon,
    price: 5000,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'payReviewCycle', label: 'How often are salaries reviewed?', type: 'text', placeholder: 'e.g., Annually in June' }
    ],
  },
  'workplace-language': {
    kind: 'policy',
    type: 'workplace-language',
    title: 'Workplace Language Policy',
    description: 'Sets the official language for business communications to ensure clarity and inclusivity.',
    icon: LanguagePolicyIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'officialLanguage', label: 'Official Business Language', type: 'text', placeholder: 'e.g., English' }
    ],
  },
  'family-responsibility-leave': {
    kind: 'policy',
    type: 'family-responsibility-leave',
    title: 'Family Responsibility Leave Policy',
    description: 'Details the entitlement and procedure for taking Family Responsibility Leave as per the BCEA.',
    icon: FamilyResponsibilityLeaveIcon,
    price: 3500,
    questions: [
      ...commonQuestions,
      ...commonPolicyMetadataQuestions,
      { id: 'frlDays', label: 'Days per annual leave cycle', type: 'number', placeholder: '3', tip: 'The BCEA provides for 3 days per cycle.' }
    ],
  },
};

// FIX: Define and export FORMS
export const FORMS: Record<FormType, Form> = {
  'job-application': {
    kind: 'form', type: 'job-application', title: 'Job Application Form',
    description: 'Standard form for candidates to apply for a position.',
    icon: JobApplicationIcon, price: 1500,
    questions: [...commonQuestions, { id: 'positionAppliedFor', label: 'Position Applied For', type: 'text' }],
  },
  'leave-application': {
    kind: 'form', type: 'leave-application', title: 'Leave Application Form',
    description: 'Formal request for employees to apply for any type of leave.',
    icon: LeaveApplicationIcon, price: 1500,
    questions: [...employeeAndManagerQuestions, { id: 'leaveType', label: 'Type of Leave', type: 'select', options: [{id: 'annual', label: 'Annual'}, {id: 'sick', label: 'Sick'}] }],
  },
  'final-written-warning': {
    kind: 'form', type: 'final-written-warning', title: 'Final Written Warning',
    description: 'A formal document issued for serious misconduct or repeated offenses.',
    icon: FinalWrittenWarningIcon, price: 2000,
    questions: [...employeeAndManagerQuestions, { id: 'offenseDetails', label: 'Details of Offense', type: 'textarea' }],
  },
  'exit-interview': {
    kind: 'form', type: 'exit-interview', title: 'Exit Interview Form',
    description: 'Structured questionnaire for departing employees to provide feedback.',
    icon: ExitInterviewIcon, price: 2000,
    questions: [...employeeAndManagerQuestions, { id: 'reasonForLeaving', label: 'Primary Reason for Leaving', type: 'textarea' }],
  },
  'grievance-form': {
    kind: 'form', type: 'grievance-form', title: 'Grievance Form',
    description: 'Allows employees to formally document and submit a workplace grievance.',
    icon: GrievanceIcon, price: 1500,
    questions: [...employeeAndManagerQuestions, { id: 'grievanceDetails', label: 'Details of the Grievance', type: 'textarea' }],
  },
  'employee-details': {
    kind: 'form', type: 'employee-details', title: 'Employee Details Form',
    description: 'Captures essential personal and emergency contact information for new hires.',
    icon: EmployeeDetailsIcon, price: 1500,
    questions: [...commonQuestions, { id: 'employeeName', label: 'Employee Name', type: 'text' }],
  },
  'job-description': {
    kind: 'form', type: 'job-description', title: 'Job Description Template',
    description: 'A structured template to define the roles and responsibilities of a position.',
    icon: JobDescriptionIcon, price: 2000,
    questions: [...commonQuestions, { id: 'jobTitle', label: 'Job Title', type: 'text' }],
  },
  'leave-application-maternity': {
    kind: 'form', type: 'leave-application-maternity', title: 'Maternity Leave Application',
    description: 'Specific form for applying for maternity leave, including required dates.',
    icon: MaternityLeaveIcon, price: 1500,
    questions: [...employeeAndManagerQuestions, { id: 'expectedDueDate', label: 'Expected Due Date', type: 'date' }],
  },
  'disciplinary-enquiry-report': {
    kind: 'form', type: 'disciplinary-enquiry-report', title: 'Disciplinary Enquiry Report',
    description: 'A form to document the proceedings and outcome of a disciplinary hearing.',
    icon: DisciplinaryIcon, price: 2500,
    questions: [...employeeAndManagerQuestions, { id: 'hearingDate', label: 'Date of Hearing', type: 'date' }],
  },
  'suspension-notice': {
    kind: 'form', type: 'suspension-notice', title: 'Notice of Suspension',
    description: 'Formal notification to an employee of their suspension pending an investigation.',
    icon: SuspensionNoticeIcon, price: 2000,
    questions: [...employeeAndManagerQuestions, { id: 'suspensionReason', label: 'Reason for Suspension', type: 'textarea' }],
  },
  'appeal-form': {
    kind: 'form', type: 'appeal-form', title: 'Disciplinary Appeal Form',
    description: 'Allows an employee to formally appeal the outcome of a disciplinary hearing.',
    icon: AppealFormIcon, price: 1500,
    questions: [...employeeAndManagerQuestions, { id: 'appealReason', label: 'Grounds for Appeal', type: 'textarea' }],
  },
  'expense-claim': {
    kind: 'form', type: 'expense-claim', title: 'Expense Claim Form',
    description: 'For employees to claim reimbursement for business-related expenses.',
    icon: ExpenseClaimIcon, price: 1500,
    outputFormat: 'excel',
    questions: [...employeeAndManagerQuestions, { id: 'expenseDate', label: 'Date of Expense', type: 'date' }],
  },
  'employee-training-agreement': {
    kind: 'form', type: 'employee-training-agreement', title: 'Employee Training Agreement',
    description: 'An agreement outlining terms for company-sponsored training, including payback clauses.',
    icon: TrainingAgreementIcon, price: 2500,
    questions: [...employeeAndManagerQuestions, { id: 'courseName', label: 'Name of Training Course', type: 'text' }],
  },
  'reference-check': {
    kind: 'form', type: 'reference-check', title: 'Reference Check Form',
    description: 'A structured form to guide the process of checking a candidate’s references.',
    icon: ReferenceCheckIcon, price: 1500,
    questions: [...commonQuestions, { id: 'candidateName', label: 'Candidate Name', type: 'text' }],
  },
  'retrenchment-notice': {
    kind: 'form', type: 'retrenchment-notice', title: 'Notice of Retrenchment',
    description: 'Formal notification of termination of employment due to operational requirements.',
    icon: RetrenchmentNoticeIcon, price: 2500,
    questions: [...employeeAndManagerQuestions, { id: 'lastDayOfEmployment', label: 'Last Day of Employment', type: 'date' }],
  },
  'job-advertisement': {
    kind: 'form', type: 'job-advertisement', title: 'Job Advertisement Template',
    description: 'A template for creating professional and effective job advertisements.',
    icon: JobAdvertisementIcon, price: 1500,
    questions: [...commonQuestions, { id: 'jobTitle', label: 'Job Title', type: 'text' }],
  },
  'interview-guide': {
    kind: 'form', type: 'interview-guide', title: 'Interview Guide Template',
    description: 'A structured guide with suggested questions to ensure fair and consistent interviews.',
    icon: InterviewGuideIcon, price: 2000,
    questions: [...commonQuestions, { id: 'position', label: 'Position Being Interviewed For', type: 'text' }],
  },
  'candidate-evaluation': {
    kind: 'form', type: 'candidate-evaluation', title: 'Candidate Evaluation Form',
    description: 'A scorecard for interviewers to rate candidates against key criteria.',
    icon: CandidateEvaluationIcon, price: 1500,
    questions: [...commonQuestions, { id: 'candidateName', label: 'Candidate Name', type: 'text' }],
  },
  'onboarding-checklist': {
    kind: 'form', type: 'onboarding-checklist', title: 'Onboarding Checklist',
    description: 'A checklist to ensure a smooth and comprehensive onboarding process for new hires.',
    icon: OnboardingChecklistIcon, price: 2000,
    outputFormat: 'excel',
    questions: [...employeeAndManagerQuestions],
  },
  'confidentiality-agreement': {
    kind: 'form', type: 'confidentiality-agreement', title: 'Confidentiality Agreement (NDA)',
    description: 'A legal agreement to protect sensitive company information.',
    icon: ConfidentialityIcon, price: 2500,
    questions: [...employeeAndManagerQuestions],
  },
  'restraint-of-trade': {
    kind: 'form', type: 'restraint-of-trade', title: 'Restraint of Trade Agreement',
    description: 'An agreement to prevent an employee from competing with the business after employment ends.',
    icon: RestraintOfTradeIcon, price: 3000,
    questions: [...employeeAndManagerQuestions, { id: 'restraintArea', label: 'Geographical Area of Restraint', type: 'text' }],
  },
  'performance-review': {
    kind: 'form', type: 'performance-review', title: 'Performance Review Form',
    description: 'A structured form for conducting employee performance appraisals.',
    icon: PerformanceReviewIcon, price: 2000,
    questions: [...employeeAndManagerQuestions, { id: 'reviewPeriod', label: 'Review Period', type: 'text', placeholder: 'e.g., 2024 Annual Review'}],
  },
  'salary-bank-details': {
    kind: 'form', type: 'salary-bank-details', title: 'Salary & Bank Details Form',
    description: 'A form for employees to provide their banking details for salary payments.',
    icon: SalaryBankIcon, price: 1000,
    questions: [...employeeAndManagerQuestions],
  },
  'overtime-claim': {
    kind: 'form', type: 'overtime-claim', title: 'Overtime Claim Form',
    description: 'Allows employees to formally claim payment for overtime hours worked.',
    icon: OvertimeClaimIcon, price: 1500,
    outputFormat: 'excel',
    questions: [...employeeAndManagerQuestions, { id: 'overtimeDate', label: 'Date Overtime Worked', type: 'date' }],
  },
  'employment-contract': {
    kind: 'form', type: 'employment-contract', title: 'Employment Contract',
    description: 'A legally binding agreement between an employer and an employee.',
    icon: EmploymentContractIcon, price: 7500,
    questions: [...employeeAndManagerQuestions, { id: 'jobTitle', label: 'Job Title', type: 'text' }],
  },
  'permission-for-deductions': {
    kind: 'form', type: 'permission-for-deductions', title: 'Permission for Deductions Form',
    description: 'A form for employees to authorize specific deductions from their salary.',
    icon: PermissionForDeductionsIcon, price: 1500,
    questions: [...employeeAndManagerQuestions, { id: 'deductionReason', label: 'Reason for Deduction', type: 'text' }],
  },
  'workplace-skills-plan': {
    kind: 'form', type: 'workplace-skills-plan', title: 'Workplace Skills Plan (WSP)',
    description: 'A template to help designated employers plan their training for the year.',
    icon: SkillsDevelopmentIcon, price: 3000,
    outputFormat: 'excel',
    questions: [...commonQuestions],
  },
  'annual-training-report': {
    kind: 'form', type: 'annual-training-report', title: 'Annual Training Report (ATR)',
    description: 'A template to report on the training and development that occurred in the previous year.',
    icon: SkillsDevelopmentIcon, price: 3000,
    outputFormat: 'excel',
    questions: [...commonQuestions],
  },
  'verbal-warning': {
    kind: 'form',
    type: 'verbal-warning',
    title: 'Verbal Warning Record',
    description: 'A form to officially document a verbal warning given to an employee.',
    icon: GrievanceIcon,
    price: 1000,
    questions: [...employeeAndManagerQuestions, {id: 'reasonForWarning', label: 'Reason for Warning', type: 'textarea'}]
  },
  'written-warning': {
    kind: 'form',
    type: 'written-warning',
    title: 'Written Warning Form',
    description: 'A formal document to issue a written warning for misconduct or poor performance.',
    icon: FinalWrittenWarningIcon,
    price: 1500,
    questions: [...employeeAndManagerQuestions, {id: 'detailsOfMisconduct', label: 'Details of Misconduct/Poor Performance', type: 'textarea'}]
  },
  // Adding placeholders for all other form types to ensure compilation
  'staff-grooming-checklist': { kind: 'form', type: 'staff-grooming-checklist', title: 'Staff Grooming Checklist', description: 'Checklist for staff appearance.', icon: ChecklistIcon, price: 1000, questions: [...commonQuestions], outputFormat: 'excel' },
  'warehouse-master-cleaning-checklist': { kind: 'form', type: 'warehouse-master-cleaning-checklist', title: 'Warehouse Master Cleaning Checklist', description: 'Comprehensive cleaning checklist for warehouses.', icon: CleaningIcon, price: 1500, questions: [...commonQuestions], outputFormat: 'excel' },
  'master-cleaning-schedule': { kind: 'form', type: 'master-cleaning-schedule', title: 'Master Cleaning Schedule', description: 'A schedule for all cleaning tasks.', icon: CleaningIcon, price: 1500, questions: [...commonQuestions], outputFormat: 'excel' },
  'food-dispatch-checklist': { kind: 'form', type: 'food-dispatch-checklist', title: 'Food Dispatch Checklist', description: 'Checklist for dispatching food items safely.', icon: FoodSafetyIcon, price: 1500, questions: [...commonQuestions], outputFormat: 'excel' },
  'attendance-register': { kind: 'form', type: 'attendance-register', title: 'Attendance Register', description: 'A register to track employee attendance.', icon: RegisterIcon, price: 1000, questions: [...commonQuestions], outputFormat: 'excel' },
  'warehouse-cleaning-checklist': { kind: 'form', type: 'warehouse-cleaning-checklist', title: 'Warehouse Cleaning Checklist', description: 'Daily/weekly cleaning checklist for warehouses.', icon: CleaningIcon, price: 1000, questions: [...commonQuestions], outputFormat: 'excel' },
  'refrigerator-temperature-logsheet': { kind: 'form', type: 'refrigerator-temperature-logsheet', title: 'Refrigerator Temperature Logsheet', description: 'Logsheet for recording fridge temperatures.', icon: TemperatureIcon, price: 1000, questions: [...commonQuestions], outputFormat: 'excel' },
  'food-safety-training-modules': { kind: 'form', type: 'food-safety-training-modules', title: 'Food Safety Training Modules', description: 'Content for food safety training.', icon: FoodSafetyIcon, price: 3000, questions: [...commonQuestions] },
  'thermometer-verification-checklist': { kind: 'form', type: 'thermometer-verification-checklist', title: 'Thermometer Verification Checklist', description: 'Checklist to verify thermometer accuracy.', icon: TemperatureIcon, price: 1000, questions: [...commonQuestions], outputFormat: 'excel' },
  'cleaning-checklist': { kind: 'form', type: 'cleaning-checklist', title: 'General Cleaning Checklist', description: 'A general-purpose cleaning checklist.', icon: CleaningIcon, price: 1000, questions: [...commonQuestions], outputFormat: 'excel' },
  'food-receiving-checklist': { kind: 'form', type: 'food-receiving-checklist', title: 'Food Receiving Checklist', description: 'Checklist for safely receiving food deliveries.', icon: FoodSafetyIcon, price: 1500, questions: [...commonQuestions], outputFormat: 'excel' },
  'bar-master-cleaning-schedule': { kind: 'form', type: 'bar-master-cleaning-schedule', title: 'Bar Master Cleaning Schedule', description: 'Comprehensive cleaning schedule for a bar.', icon: CleaningIcon, price: 1500, questions: [...commonQuestions], outputFormat: 'excel' },
  'bar-cleaning-checklist': { kind: 'form', type: 'bar-cleaning-checklist', title: 'Bar Cleaning Checklist', description: 'Daily/weekly cleaning checklist for a bar.', icon: CleaningIcon, price: 1000, questions: [...commonQuestions], outputFormat: 'excel' },
  'food-safety-training-register': { kind: 'form', type: 'food-safety-training-register', title: 'Food Safety Training Register', description: 'Register to track employee food safety training.', icon: TrainingRegisterIcon, price: 1000, questions: [...commonQuestions], outputFormat: 'excel' },
  'leave-register': { kind: 'form', type: 'leave-register', title: 'Leave Register', description: 'A register to track all employee leave.', icon: RegisterIcon, price: 1000, questions: [...commonQuestions], outputFormat: 'excel' },
  'voluntary-retrenchment-application': { kind: 'form', type: 'voluntary-retrenchment-application', title: 'Voluntary Retrenchment Application', description: 'Form for employees to apply for voluntary retrenchment.', icon: RetrenchmentIcon, price: 2000, questions: [...employeeAndManagerQuestions] },
  'hr-bundle-package': { kind: 'form', type: 'hr-bundle-package', title: 'HR Bundle Package', description: 'A package of essential HR forms and policies.', icon: BundleIcon, price: 15000, questions: [...commonQuestions] },
  'employee-handbook-canva': { kind: 'form', type: 'employee-handbook-canva', title: 'Employee Handbook (Canva Template)', description: 'A visually appealing employee handbook template for Canva.', icon: CanvaIcon, price: 3000, questions: [...commonQuestions] },
  'anticipated-retrenchment-notice': { kind: 'form', type: 'anticipated-retrenchment-notice', title: 'Anticipated Retrenchment Notice (s189)', description: 'Notice to consult on anticipated retrenchments (Section 189).', icon: LegalNoticeIcon, price: 2500, questions: [...commonQuestions] },
  'onboarding-checklist-canva': { kind: 'form', type: 'onboarding-checklist-canva', title: 'Onboarding Checklist (Canva Template)', description: 'A visually appealing onboarding checklist for Canva.', icon: CanvaIcon, price: 1500, questions: [...commonQuestions] },
  'employee-survey-canva': { kind: 'form', type: 'employee-survey-canva', title: 'Employee Survey (Canva Template)', description: 'A visually appealing employee survey template for Canva.', icon: SurveyIcon, price: 1500, questions: [...commonQuestions] },
  'employee-review-canva': { kind: 'form', type: 'employee-review-canva', title: 'Employee Review (Canva Template)', description: 'A visually appealing employee review template for Canva.', icon: CanvaIcon, price: 1500, questions: [...commonQuestions] },
  'daily-attendance-canva': { kind: 'form', type: 'daily-attendance-canva', title: 'Daily Attendance (Canva Template)', description: 'A visually appealing attendance sheet for Canva.', icon: CanvaIcon, price: 1000, questions: [...commonQuestions] },
  'verbal-warning-afrikaans': { kind: 'form', type: 'verbal-warning-afrikaans', title: 'Mondelinge Waarskuwing', description: 'A form to document a verbal warning, in Afrikaans.', icon: AfrikaansIcon, price: 1000, questions: [...employeeAndManagerQuestions] },
  'fixed-contract-ending-notice': { kind: 'form', type: 'fixed-contract-ending-notice', title: 'Fixed-Term Contract Ending Notice', description: 'Notice to inform an employee that their fixed-term contract is ending.', icon: LegalNoticeIcon, price: 2000, questions: [...employeeAndManagerQuestions] },
  'consultation-meeting-notice': { kind: 'form', type: 'consultation-meeting-notice', title: 'Consultation Meeting Notice', description: 'A formal notice to invite an employee to a consultation meeting.', icon: LegalNoticeIcon, price: 1500, questions: [...employeeAndManagerQuestions] },
  'grievance-investigation-notice': { kind: 'form', type: 'grievance-investigation-notice', title: 'Grievance Investigation Notice', description: 'Notice to an employee about a grievance investigation.', icon: LegalNoticeIcon, price: 1500, questions: [...employeeAndManagerQuestions] },
  'disciplinary-hearing-notice': { kind: 'form', type: 'disciplinary-hearing-notice', title: 'Disciplinary Hearing Notice', description: 'Formal notice to an employee to attend a disciplinary hearing.', icon: LegalNoticeIcon, price: 2000, questions: [...employeeAndManagerQuestions] },
  'incapacity-inquiry-general-notice': { kind: 'form', type: 'incapacity-inquiry-general-notice', title: 'Incapacity Inquiry Notice (General)', description: 'A notice for a general incapacity inquiry.', icon: LegalNoticeIcon, price: 2000, questions: [...employeeAndManagerQuestions] },
  'incapacity-inquiry-ill-health-notice': { kind: 'form', type: 'incapacity-inquiry-ill-health-notice', title: 'Incapacity Inquiry Notice (Ill Health)', description: 'A notice for an ill-health incapacity inquiry.', icon: LegalNoticeIcon, price: 2000, questions: [...employeeAndManagerQuestions] },
  'poor-performance-inquiry-notice': { kind: 'form', type: 'poor-performance-inquiry-notice', title: 'Poor Performance Inquiry Notice', description: 'A notice for a poor performance inquiry.', icon: LegalNoticeIcon, price: 2000, questions: [...employeeAndManagerQuestions] },
  'postponement-of-hearing-notice': { kind: 'form', type: 'postponement-of-hearing-notice', title: 'Postponement of Hearing Notice', description: 'A notice to postpone a scheduled hearing.', icon: LegalNoticeIcon, price: 1000, questions: [...employeeAndManagerQuestions] },
  'observation-report': { kind: 'form', type: 'observation-report', title: 'Observation Report', description: 'A form to document observations of employee performance or conduct.', icon: MeetingMinutesIcon, price: 1000, questions: [...employeeAndManagerQuestions] },
  'staff-meeting-template': { kind: 'form', type: 'staff-meeting-template', title: 'Staff Meeting Minutes Template', description: 'A template for recording minutes of staff meetings.', icon: MeetingMinutesIcon, price: 1000, questions: [...commonQuestions] },
  'medical-report-template': { kind: 'form', type: 'medical-report-template', title: 'Medical Report Template', description: 'A template for a medical practitioner to complete regarding an employee\'s fitness for work.', icon: HealthSafetyIcon, price: 1500, questions: [...employeeAndManagerQuestions] },
  'grievance-decision-form': { kind: 'form', type: 'grievance-decision-form', title: 'Grievance Decision Form', description: 'A form to formally document the outcome of a grievance procedure.', icon: GrievanceIcon, price: 1500, questions: [...employeeAndManagerQuestions] },
  'poor-performance-meeting-minutes': { kind: 'form', type: 'poor-performance-meeting-minutes', title: 'Poor Performance Meeting Minutes', description: 'A template for recording minutes of a poor performance meeting.', icon: MeetingMinutesIcon, price: 1500, questions: [...employeeAndManagerQuestions] },
  'final-warning-hearing-held': { kind: 'form', type: 'final-warning-hearing-held', title: 'Final Warning (After Hearing)', description: 'A final written warning issued after a formal hearing has been held.', icon: FinalWrittenWarningIcon, price: 2000, questions: [...employeeAndManagerQuestions] },
  'incident-investigation-report': { kind: 'form', type: 'incident-investigation-report', title: 'Incident Investigation Report', description: 'A comprehensive form to investigate and report on a workplace incident.', icon: IncidentReportIcon, price: 2000, questions: [...commonQuestions] },
  'incident-report': { kind: 'form', type: 'incident-report', title: 'Incident Report Form', description: 'A form for employees to report a workplace incident.', icon: IncidentReportIcon, price: 1500, questions: [...employeeAndManagerQuestions] },
  'certificate-of-service': { kind: 'form', type: 'certificate-of-service', title: 'Certificate of Service', description: 'A document provided to a departing employee confirming their employment details.', icon: CertificateOfServiceIcon, price: 1000, questions: [...employeeAndManagerQuestions] },
  'termination-letter': { kind: 'form', type: 'termination-letter', title: 'Termination Letter', description: 'A formal letter to terminate an employee\'s employment.', icon: TerminationOfEmploymentIcon, price: 2000, questions: [...employeeAndManagerQuestions] },
  'resignation-acceptance-letter': { kind: 'form', type: 'resignation-acceptance-letter', title: 'Resignation Acceptance Letter', description: 'A formal letter to accept an employee\'s resignation.', icon: ResignationIcon, price: 1000, questions: [...employeeAndManagerQuestions] },
  'payroll-processing-checklist': { kind: 'form', type: 'payroll-processing-checklist', title: 'Payroll Processing Checklist', description: 'A checklist to ensure accuracy and completeness in payroll processing.', icon: PayrollProcessingIcon, price: 1500, questions: [...commonQuestions], outputFormat: 'excel' },
};

// FIX: Define and export POLICY_CATEGORIES
export const POLICY_CATEGORIES = [
  {
    title: 'Core HR Policies',
    items: [POLICIES['leave'], POLICIES['disciplinary'], POLICIES['grievance'], POLICIES['health-and-safety'], POLICIES['master']],
  },
  {
    title: 'Employee Conduct & Relations',
    items: [POLICIES['employee-conduct'], POLICIES['sexual-harassment'], POLICIES['anti-harassment-discrimination'], POLICIES['anti-bullying'], POLICIES['dress-code'], POLICIES['social-media']],
  },
  {
    title: 'Operations & Security',
    items: [POLICIES['it-cybersecurity'], POLICIES['it-access-security'], POLICIES['electronic-communications'], POLICIES['company-property'], POLICIES['byod'], POLICIES['cell-phone'], POLICIES['security'], POLICIES['visitor']],
  },
  {
    title: 'Compensation, Benefits & Development',
    items: [POLICIES['compensation-benefits'], POLICIES['salary-structure-guide'], POLICIES['working-hours'], POLICIES['standby'], POLICIES['travel'], POLICIES['expense-reimbursement'], POLICIES['training-development'], POLICIES['certification']],
  },
  {
    title: 'Legal, Compliance & Governance',
    items: [POLICIES['employment-equity'], POLICIES['coida'], POLICIES['uif'], POLICIES['data-usage-popia'], POLICIES['data-protection-privacy'], POLICIES['confidentiality'], POLICIES['whistleblower'], POLICIES['code-of-ethics'], POLICIES['anti-bribery-corruption']],
  },
  {
    title: 'Hiring, Separation & Leave',
    items: [POLICIES['recruitment-selection'], POLICIES['resignation'], POLICIES['employee-separation'], POLICIES['termination-of-employment'], POLICIES['retrenchment'], POLICIES['family-responsibility-leave'], POLICIES['time-off']],
  }
];

// FIX: Define and export FORM_CATEGORIES
export const FORM_CATEGORIES = [
  {
    title: 'Recruitment & Onboarding',
    items: [FORMS['job-application'], FORMS['job-description'], FORMS['job-advertisement'], FORMS['interview-guide'], FORMS['candidate-evaluation'], FORMS['reference-check'], FORMS['onboarding-checklist'], FORMS['employee-details'], FORMS['employment-contract']],
  },
  {
    title: 'Employee Management & Performance',
    items: [FORMS['performance-review'], FORMS['employee-training-agreement'], FORMS['confidentiality-agreement'], FORMS['restraint-of-trade'], FORMS['observation-report'], FORMS['staff-meeting-template']],
  },
  {
    title: 'Leave & Absence',
    items: [FORMS['leave-application'], FORMS['leave-application-maternity'], FORMS['leave-register']],
  },
  {
    title: 'Disciplinary, Grievance & Incapacity',
    items: [FORMS['grievance-form'], FORMS['disciplinary-hearing-notice'], FORMS['verbal-warning'], FORMS['written-warning'], FORMS['final-written-warning'], FORMS['suspension-notice'], FORMS['disciplinary-enquiry-report'], FORMS['appeal-form'], FORMS['poor-performance-inquiry-notice'], FORMS['incapacity-inquiry-ill-health-notice']],
  },
  {
    title: 'Payroll & Compensation',
    items: [FORMS['salary-bank-details'], FORMS['overtime-claim'], FORMS['expense-claim'], FORMS['permission-for-deductions'], FORMS['payroll-processing-checklist']],
  },
  {
    title: 'Termination & Offboarding',
    items: [FORMS['exit-interview'], FORMS['termination-letter'], FORMS['resignation-acceptance-letter'], FORMS['retrenchment-notice'], FORMS['voluntary-retrenchment-application'], FORMS['certificate-of-service']],
  }
];

// FIX: Define and export FORM_BASE_TEMPLATES
export const FORM_BASE_TEMPLATES: Partial<Record<FormType, string>> = {
  'job-application': `
# Job Application Form
**Company:** [companyName]
**Position Applied For:** [positionAppliedFor]

---
### Personal Details
- **Full Name:** [applicantName]
- **Contact Number:** _________________________
- **Email Address:** _________________________
`,
  'leave-application': `
# Leave Application Form
**Company:** [companyName]
**Employee Name:** [employeeName]
**Manager:** [managerName]

---
- **Type of Leave:** [leaveType]
- **Start Date:** _________________________
- **End Date:** _________________________
- **Reason:** _________________________
`
};

// FIX: Define and export FORM_ENRICHMENT_PROMPTS
export const FORM_ENRICHMENT_PROMPTS: Partial<Record<FormType, string>> = {
  'job-application': 'Ensure the form includes sections for Previous Employment History, References, and a declaration that the information provided is true and correct.',
  'leave-application': 'Add sections for "Total Days Requested" and signature lines for both the employee and the approving manager.',
};
