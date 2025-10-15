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
  // Form Icons
  JobApplicationIcon,
  LeaveApplicationIcon,
  FinalWrittenWarningIcon,
  ExitInterviewIcon,
  GrievanceFormIcon,
  EmployeeDetailsIcon,
  JobDescriptionIcon,
  MaternityLeaveIcon,
  DisciplinaryReportIcon,
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
  ConfidentialityAgreementIcon,
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

const commonQuestions = [
  { id: 'companyName', label: 'Company Name', type: 'text' as const, placeholder: 'e.g., ABC (Pty) Ltd' },
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
    questions: [
      ...commonQuestions,
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
    questions: [
      ...commonQuestions,
      { id: 'hrContactPerson', label: 'HR Contact Person/Department', type: 'text', placeholder: 'e.g., The HR Manager' },
    ],
  },
  'grievance': {
    kind: 'policy',
    type: 'grievance',
    title: 'Grievance Procedure',
    description: 'Create a fair process for employees to raise and resolve workplace issues.',
    icon: GrievanceIcon,
    questions: [
        ...commonQuestions,
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
    questions: [
        ...commonQuestions,
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
    questions: [
        ...commonQuestions,
        { id: 'ceoName', label: 'CEO/Managing Director Name', type: 'text', placeholder: 'e.g., Jane Doe' }
    ],
  },
  'byod': {
    kind: 'policy',
    type: 'byod',
    title: 'Bring Your Own Device',
    description: 'Set guidelines for employees using personal devices (laptops, phones) for work.',
    icon: ByodIcon,
    questions: [
        ...commonQuestions,
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
    questions: [
        ...commonQuestions,
        { id: 'usageRestrictions', label: 'Usage Restrictions', type: 'textarea', placeholder: 'e.g., Personal calls are limited to break times.' }
    ],
  },
  'certification': {
    kind: 'policy',
    type: 'certification',
    title: 'Certification Policy',
    description: 'Outline requirements and support for employee professional certifications.',
    icon: CertificationIcon,
    questions: [
        ...commonQuestions,
        { id: 'reimbursementPolicy', label: 'Reimbursement Details', type: 'text', placeholder: 'e.g., 100% reimbursement on passing the exam.' }
    ],
  },
  'code-of-ethics': {
    kind: 'policy',
    type: 'code-of-ethics',
    title: 'Code of Ethics Policy',
    description: 'Establish principles of conduct, integrity, and ethical behaviour for all employees.',
    icon: CodeOfEthicsIcon,
    questions: [
        ...commonQuestions,
        { id: 'reportingChannel', label: 'Ethics Reporting Channel', type: 'text', placeholder: 'e.g., Ethics Hotline or HR Manager' }
    ],
  },
  'communication-retention': {
    kind: 'policy',
    type: 'communication-retention',
    title: 'Communication Retention',
    description: 'Define how electronic communications (email, messages) are stored and for how long.',
    icon: CommunicationRetentionIcon,
    questions: [
        ...commonQuestions,
        { id: 'retentionPeriod', label: 'Data Retention Period (Years)', type: 'number', placeholder: 'e.g., 5' }
    ],
  },
  'data-usage-popia': {
    kind: 'policy',
    type: 'data-usage-popia',
    title: 'Data Usage Policy (POPIA)',
    description: 'Ensure compliance with the Protection of Personal Information Act (POPIA).',
    icon: DataUsageIcon,
    questions: [
        ...commonQuestions,
        { id: 'infoOfficer', label: 'Information Officer Name', type: 'text', placeholder: 'e.g., John Smith' }
    ],
  },
  'electronic-communications': {
    kind: 'policy',
    type: 'electronic-communications',
    title: 'Electronic Communications',
    description: 'Govern the use of company email, internet, and other electronic systems.',
    icon: ElectronicCommunicationsIcon,
    questions: [
        ...commonQuestions,
        { id: 'monitoringStatement', label: 'Monitoring Clause', type: 'textarea', placeholder: 'e.g., The company reserves the right to monitor all electronic communications.' }
    ],
  },
  'resignation': {
    kind: 'policy',
    type: 'resignation',
    title: 'Resignation Policy',
    description: 'Detail the formal procedure for employees leaving the company, including notice periods.',
    icon: ResignationIcon,
    questions: [
        ...commonQuestions,
        { id: 'noticePeriodWeeks', label: 'Standard Notice Period (Weeks)', type: 'number', placeholder: 'e.g., 4' }
    ],
  },
  'security': {
    kind: 'policy',
    type: 'security',
    title: 'Security Policy',
    description: 'Establish rules for physical and digital security to protect company assets.',
    icon: SecurityIcon,
    questions: [
        ...commonQuestions,
        { id: 'accessControl', label: 'Access Control Manager', type: 'text', placeholder: 'e.g., Head of Security' }
    ],
  },
  'sexual-harassment': {
    kind: 'policy',
    type: 'sexual-harassment',
    title: 'Sexual Harassment Policy',
    description: 'Define and prohibit sexual harassment, and outline reporting and investigation procedures.',
    icon: SexualHarassmentIcon,
    questions: [
        ...commonQuestions,
        { id: 'confidentialContact', label: 'Confidential Reporting Contact', type: 'text', placeholder: 'e.g., Designated HR representative' }
    ],
  },
  'standby': {
    kind: 'policy',
    type: 'standby',
    title: 'Standby Policy',
    description: 'Outline compensation and expectations for employees required to be on standby.',
    icon: StandbyIcon,
    questions: [
        ...commonQuestions,
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
    questions: [
        ...commonQuestions,
        { id: 'personalCallRule', label: 'Personal Call Rule', type: 'text', placeholder: 'e.g., Permitted for emergencies only.' }
    ],
  },
  'time-off': {
    kind: 'policy',
    type: 'time-off',
    title: 'Time Off Procedure',
    description: 'Define the process for requesting and approving unpaid time off or special leave.',
    icon: TimeOffIcon,
    questions: [
        ...commonQuestions,
        { id: 'approvalAuthority', label: 'Approval Authority', type: 'text', placeholder: 'e.g., Department Manager' }
    ],
  },
  'travel': {
    kind: 'policy',
    type: 'travel',
    title: 'Travel Policy',
    description: 'Govern procedures and reimbursements for business-related travel.',
    icon: TravelIcon,
    questions: [
        ...commonQuestions,
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
    questions: [
        ...commonQuestions,
        { id: 'itManager', label: 'IT Manager', type: 'text', placeholder: 'e.g., IT Department Head' }
    ],
  },
  'visitor': {
    kind: 'policy',
    type: 'visitor',
    title: 'Visitor Policy',
    description: 'Establish procedures for managing non-employees visiting company premises.',
    icon: VisitorIcon,
    questions: [
        ...commonQuestions,
        { id: 'receptionContact', label: 'Reception/Front Desk Contact', type: 'text', placeholder: 'e.g., The Receptionist' }
    ],
  },
  'remote-hybrid-work': {
    kind: 'policy',
    type: 'remote-hybrid-work',
    title: 'Remote & Hybrid Work Policy',
    description: 'Defines expectations for remote working arrangements including security and communication protocols.',
    icon: RemoteWorkIcon,
    questions: [
        ...commonQuestions,
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
    questions: [
        ...commonQuestions,
        { id: 'eeoOfficerName', label: 'EEO / Diversity Officer', type: 'text', placeholder: 'e.g., Head of HR' }
    ],
  },
  'attendance-punctuality': {
    kind: 'policy',
    type: 'attendance-punctuality',
    title: 'Attendance & Punctuality Policy',
    description: 'Defines expectations on work hours, attendance, punctuality, and consequences for violations.',
    icon: AttendancePunctualityIcon,
    questions: [
        ...commonQuestions,
        { id: 'lateArrivalPolicy', label: 'Consequence for late arrival', type: 'text', placeholder: 'e.g., Verbal warning after 3 instances' }
    ],
  },
  'employee-conduct': {
    kind: 'policy',
    type: 'employee-conduct',
    title: 'Employee Conduct & Behavior Policy',
    description: 'Covers professional behavior, dress code, communication standards, and conflict resolution.',
    icon: EmployeeConductIcon,
    questions: [
        ...commonQuestions,
        { id: 'dressCodeSummary', label: 'Briefly describe the dress code', type: 'textarea', placeholder: 'e.g., Business casual. No jeans or t-shirts.' }
    ],
  },
  'data-protection-privacy': {
    kind: 'policy',
    type: 'data-protection-privacy',
    title: 'Data Protection & Privacy Policy',
    description: 'Covers handling and protection of employee and customer data comprehensively.',
    icon: DataProtectionPrivacyIcon,
    questions: [
        ...commonQuestions,
        { id: 'dataBreachContact', label: 'Who to contact in case of a data breach?', type: 'text', placeholder: 'e.g., The Information Officer' }
    ],
  },
  'disciplinary-action': {
    kind: 'policy',
    type: 'disciplinary-action',
    title: 'Disciplinary Action Policy',
    description: 'Details grounds for discipline and the process for addressing misconduct or performance issues.',
    icon: DisciplinaryActionIcon,
    questions: [
        ...commonQuestions,
        { id: 'appealProcessContact', label: 'Who manages disciplinary appeals?', type: 'text', placeholder: 'e.g., The CEO' }
    ],
  },
  'whistleblower': {
    kind: 'policy',
    type: 'whistleblower',
    title: 'Whistleblower Policy',
    description: 'Provides a safe, confidential channel for reporting unethical or illegal activities without retaliation.',
    icon: WhistleblowerIcon,
    questions: [
        ...commonQuestions,
        { id: 'whistleblowerHotline', label: 'Anonymous reporting channel/hotline', type: 'text', placeholder: 'e.g., ethics@company.com or 0800-123-456' }
    ],
  },
  'compensation-benefits': {
    kind: 'policy',
    type: 'compensation-benefits',
    title: 'Compensation & Benefits Policy',
    description: 'Clarifies salary, bonuses, benefits, and pay review procedures.',
    icon: CompensationBenefitsIcon,
    questions: [
        ...commonQuestions,
        { id: 'payrollContact', label: 'Who to contact for payroll queries?', type: 'text', placeholder: 'e.g., The Payroll Department' }
    ],
  },
  'performance-management': {
    kind: 'policy',
    type: 'performance-management',
    title: 'Performance Management Policy',
    description: 'Sets criteria for employee performance reviews, goal setting, and career development.',
    icon: PerformanceManagementIcon,
    questions: [
        ...commonQuestions,
        { id: 'reviewFrequency', label: 'How often are performance reviews conducted?', type: 'text', placeholder: 'e.g., Annually' }
    ],
  },
  'workplace-wellness': {
    kind: 'policy',
    type: 'workplace-wellness',
    title: 'Workplace Wellness Policy',
    description: 'Includes emergency protocols, wellness programs, and mental health support.',
    icon: WorkplaceWellnessIcon,
    questions: [
        ...commonQuestions,
        { id: 'wellnessProgramManager', label: 'Who manages wellness initiatives?', type: 'text', placeholder: 'e.g., The HR Manager' }
    ],
  },
  'it-cybersecurity': {
    kind: 'policy',
    type: 'it-cybersecurity',
    title: 'IT & Cybersecurity Policy',
    description: 'Covers secure use of company technology, password protocols, and cyber threat awareness.',
    icon: ItCybersecurityIcon,
    questions: [
        ...commonQuestions,
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
    questions: [
        ...commonQuestions,
        { id: 'socialMediaApprovalContact', label: 'Who approves official social media posts?', type: 'text', placeholder: 'e.g., Marketing Department' }
    ],
  },
  'confidentiality': {
    kind: 'policy',
    type: 'confidentiality',
    title: 'Confidentiality Policy',
    description: 'Protects sensitive company information and proprietary data.',
    icon: ConfidentialityIcon,
    questions: [
        ...commonQuestions,
        { id: 'confidentialInfoExamples', label: 'Examples of confidential information', type: 'textarea', placeholder: 'e.g., Client lists, financial data, trade secrets.' }
    ],
  },
  'employee-separation': {
    kind: 'policy',
    type: 'employee-separation',
    title: 'Employee Separation & Exit Policy',
    description: 'Formalizes offboarding procedures, notice periods, and exit interviews.',
    icon: EmployeeSeparationIcon,
    questions: [
        ...commonQuestions,
        { id: 'exitInterviewContact', label: 'Who conducts exit interviews?', type: 'text', placeholder: 'e.g., The HR Department' }
    ],
  },
  'anti-harassment-discrimination': {
    kind: 'policy',
    type: 'anti-harassment-discrimination',
    title: 'Harassment & Anti-Discrimination Policy',
    description: 'Enforces a zero-tolerance stance on all forms of harassment and discrimination.',
    icon: AntiHarassmentDiscriminationIcon,
    questions: [
        ...commonQuestions,
        { id: 'harassmentReportingContact', label: 'Primary contact for reporting harassment?', type: 'text', placeholder: 'e.g., Designated HR Manager' }
    ],
  },
  'company-vehicle': {
    kind: 'policy',
    type: 'company-vehicle',
    title: 'Company Vehicle Use Policy',
    description: 'Rules and procedures for employees provided with a company vehicle.',
    icon: CompanyVehicleIcon,
    questions: [
        ...commonQuestions,
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
    questions: [
        ...commonQuestions,
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
    questions: [
      ...commonQuestions,
      { id: 'eeManager', label: 'Senior Manager for Employment Equity', type: 'text', placeholder: 'e.g., Jane Doe, HR Director' }
    ],
  },
  'coida': {
    kind: 'policy',
    type: 'coida',
    title: 'COIDA Policy',
    description: "Details procedures for reporting and managing injuries on duty and occupational diseases, in compliance with COIDA.",
    icon: CoidaIcon,
    questions: [
      ...commonQuestions,
      { id: 'iodContact', label: 'Person responsible for IOD reporting', type: 'text', placeholder: 'e.g., The Safety Officer' }
    ],
    industries: ['Construction', 'Manufacturing', 'Agriculture'],
  },
  'uif': {
    kind: 'policy',
    type: 'uif',
    title: 'UIF Policy',
    description: "Explains the employer's and employee's obligations regarding Unemployment Insurance Fund (UIF) contributions.",
    icon: UifIcon,
    questions: [
      ...commonQuestions,
      { id: 'payrollContact', label: 'Who manages payroll and UIF submissions?', type: 'text', placeholder: 'e.g., Finance Department' }
    ],
  },
  'recruitment-selection': {
    kind: 'policy',
    type: 'recruitment-selection',
    title: 'Recruitment and Selection Policy',
    description: "Ensures a fair, transparent, and non-discriminatory hiring process that aligns with the EEA.",
    icon: RecruitmentSelectionIcon,
    questions: [
      ...commonQuestions,
      { id: 'recruitmentContact', label: 'Primary contact for recruitment', type: 'text', placeholder: 'e.g., The HR Manager' }
    ],
  },
  'working-hours': {
    kind: 'policy',
    type: 'working-hours',
    title: 'Working Hours Policy',
    description: "Defines standard working hours, overtime procedures, and rest periods in compliance with the BCEA.",
    icon: WorkingHoursIcon,
    questions: [
      ...commonQuestions,
      { id: 'standardHours', label: 'Standard working hours', type: 'text', placeholder: 'e.g., 8:00 AM to 5:00 PM' }
    ],
  },
  'training-development': {
    kind: 'policy',
    type: 'training-development',
    title: 'Training and Development Policy',
    description: "Demonstrates commitment to employee growth by outlining the approach to skills development and training.",
    icon: TrainingDevelopmentIcon,
    questions: [
      ...commonQuestions,
      { id: 'trainingApprover', label: 'Who approves training requests?', type: 'text', placeholder: 'e.g., Department Head' }
    ],
  },
  'anti-bribery-corruption': {
    kind: 'policy',
    type: 'anti-bribery-corruption',
    title: 'Anti-bribery and Corruption Policy',
    description: "Prohibits illegal or unethical practices that could damage the company's integrity and reputation.",
    icon: AntiBriberyCorruptionIcon,
    questions: [
      ...commonQuestions,
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
    questions: [
      ...commonQuestions,
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
    questions: [
      ...commonQuestions,
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
    questions: [
      ...commonQuestions,
      { id: 'terminationNoticeWeeks', label: 'Standard notice period for termination (weeks)', type: 'number', placeholder: 'e.g., 4' }
    ],
  },
  'retrenchment': {
    kind: 'policy',
    type: 'retrenchment',
    title: 'Retrenchment Policy',
    description: "Dictates the fair procedure for dismissal based on operational requirements, as per the LRA.",
    icon: RetrenchmentIcon,
    questions: [
      ...commonQuestions,
      { id: 'consultationManager', label: 'Who manages the retrenchment consultation?', type: 'text', placeholder: 'e.g., The HR Director' }
    ],
  },
  'deductions': {
    kind: 'policy',
    type: 'deductions',
    title: 'Deductions Policy',
    description: 'Outline lawful and agreed-upon deductions from an employee\'s salary, compliant with the BCEA.',
    icon: DeductionsIcon,
    questions: [
      ...commonQuestions,
      { id: 'deductionsContact', label: 'Who to contact for deduction queries?', type: 'text', placeholder: 'e.g., Payroll Department' }
    ],
  },
  'anti-bullying': {
    kind: 'policy',
    type: 'anti-bullying',
    title: 'Anti-Bullying Policy',
    description: 'Establish a zero-tolerance stance on workplace bullying and outline a clear reporting procedure.',
    icon: AntiBullyingIcon,
    questions: [
      ...commonQuestions,
      { id: 'confidentialContact', label: 'Confidential Reporting Contact', type: 'text', placeholder: 'e.g., Designated HR representative' }
    ],
  },
  'it-access-security': {
    kind: 'policy',
    type: 'it-access-security',
    title: 'IT Access & Security Policy',
    description: 'Define rules for accessing company systems and data, ensuring security and POPIA compliance.',
    icon: ItAccessSecurityIcon,
    questions: [
      ...commonQuestions,
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
    questions: [
      ...commonQuestions,
      { id: 'ceoName', label: 'CEO/Managing Director Name', type: 'text', placeholder: 'e.g., Jane Doe' },
      {
        id: 'includedPolicies',
        label: 'Select policies to include in the handbook',
        type: 'checkbox',
        options: [
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
    questions: [
      ...commonQuestions,
      { id: 'disclosureContact', label: 'Who should employees disclose potential conflicts to?', type: 'text', placeholder: 'e.g., Their immediate manager or HR' }
    ],
  },
  'records-retention-destruction': {
    kind: 'policy',
    type: 'records-retention-destruction',
    title: 'Records Retention & Destruction Policy',
    description: 'Define how long to store records and how to securely destroy them, ensuring POPIA compliance.',
    icon: RecordsRetentionIcon,
    questions: [
      ...commonQuestions,
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
    questions: [
      ...commonQuestions,
      { id: 'compensationPhilosophy', label: 'Briefly describe your compensation philosophy', type: 'textarea', placeholder: 'e.g., To offer competitive market-related salaries that attract and retain talent.' }
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
    questions: [...commonQuestions, { id: 'position', label: 'Position Applied For', type: 'text' }],
    outputFormat: 'word',
  },
  'employee-details': {
    kind: 'form',
    type: 'employee-details',
    title: 'Employee Details Form',
    description: 'Collect and maintain essential employee personal, contact, and emergency information.',
    icon: EmployeeDetailsIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'leave-application': {
    kind: 'form',
    type: 'leave-application',
    title: 'Leave Application Form',
    description: 'A formal request form for employees applying for any type of leave (annual, sick, etc.).',
    icon: LeaveApplicationIcon,
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
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'exit-interview': {
    kind: 'form',
    type: 'exit-interview',
    title: 'Exit Interview Form',
    description: 'A questionnaire to gather feedback from departing employees about their experience.',
    icon: ExitInterviewIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'grievance-form': {
    kind: 'form',
    type: 'grievance-form',
    title: 'Grievance Lodging Form',
    description: 'A structured form for employees to formally report a workplace grievance.',
    icon: GrievanceFormIcon,
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
    questions: [...commonQuestions, { id: 'jobTitle', label: 'Job Title', type: 'text' }, { id: 'department', label: 'Department', type: 'text' }],
    outputFormat: 'word',
  },
  'leave-application-maternity': {
    kind: 'form',
    type: 'leave-application-maternity',
    title: 'Maternity Leave Application',
    description: 'A specific form for applying for maternity leave in compliance with the BCEA.',
    icon: MaternityLeaveIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'disciplinary-enquiry-report': {
    kind: 'form',
    type: 'disciplinary-enquiry-report',
    title: 'Disciplinary Enquiry Report',
    description: 'A form to document the proceedings and outcome of a formal disciplinary hearing.',
    icon: DisciplinaryReportIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'suspension-notice': {
    kind: 'form',
    type: 'suspension-notice',
    title: 'Notice of Suspension',
    description: 'A formal notice to an employee of their precautionary suspension pending an investigation.',
    icon: SuspensionNoticeIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'appeal-form': {
    kind: 'form',
    type: 'appeal-form',
    title: 'Disciplinary Appeal Form',
    description: 'Allows an employee to formally appeal the outcome of a disciplinary action.',
    icon: AppealFormIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'expense-claim': {
    kind: 'form',
    type: 'expense-claim',
    title: 'Expense Claim Form',
    description: 'For employees to claim reimbursement for business-related expenses.',
    icon: ExpenseClaimIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'excel',
  },
  'employee-training-agreement': {
    kind: 'form',
    type: 'employee-training-agreement',
    title: 'Employee Training Agreement',
    description: 'An agreement outlining the terms of company-sponsored training, including any payback clauses.',
    icon: TrainingAgreementIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'reference-check': {
    kind: 'form',
    type: 'reference-check',
    title: 'Reference Check Form',
    description: 'A structured questionnaire for conducting and recording reference checks for candidates.',
    icon: ReferenceCheckIcon,
    questions: [...commonQuestions, { id: 'candidateName', label: 'Candidate Name', type: 'text' }],
    outputFormat: 'word',
  },
  'retrenchment-notice': {
    kind: 'form',
    type: 'retrenchment-notice',
    title: 'Notice of Retrenchment',
    description: 'A formal notice of termination of employment due to operational requirements.',
    icon: RetrenchmentNoticeIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'job-advertisement': {
    kind: 'form',
    type: 'job-advertisement',
    title: 'Job Advertisement Template',
    description: 'A template to create compelling and compliant job advertisements.',
    icon: JobAdvertisementIcon,
    questions: [...commonQuestions, { id: 'jobTitle', label: 'Job Title', type: 'text' }],
    outputFormat: 'word',
  },
  'interview-guide': {
    kind: 'form',
    type: 'interview-guide',
    title: 'Interview Guide',
    description: 'A structured guide with suggested questions to ensure a fair and consistent interview process.',
    icon: InterviewGuideIcon,
    questions: [...commonQuestions, { id: 'position', label: 'Position', type: 'text' }],
    outputFormat: 'word',
  },
  'candidate-evaluation': {
    kind: 'form',
    type: 'candidate-evaluation',
    title: 'Candidate Evaluation Scorecard',
    description: 'A scorecard to objectively assess and compare candidates after an interview.',
    icon: CandidateEvaluationIcon,
    questions: [...commonQuestions, { id: 'position', label: 'Position', type: 'text' }],
    outputFormat: 'excel',
  },
  'onboarding-checklist': {
    kind: 'form',
    type: 'onboarding-checklist',
    title: 'Onboarding Checklist',
    description: 'A checklist to ensure a smooth and comprehensive onboarding process for new hires.',
    icon: OnboardingChecklistIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'confidentiality-agreement': {
    kind: 'form',
    type: 'confidentiality-agreement',
    title: 'Confidentiality Agreement',
    description: 'A legal agreement to protect the company\'s sensitive information.',
    icon: ConfidentialityAgreementIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'restraint-of-trade': {
    kind: 'form',
    type: 'restraint-of-trade',
    title: 'Restraint of Trade Agreement',
    description: 'An agreement to prevent an ex-employee from competing with the business for a specified period.',
    icon: RestraintOfTradeIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'performance-review': {
    kind: 'form',
    type: 'performance-review',
    title: 'Performance Review Form',
    description: 'A structured form to document employee performance reviews, goals, and development plans.',
    icon: PerformanceReviewIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'salary-bank-details': {
    kind: 'form',
    type: 'salary-bank-details',
    title: 'Salary & Bank Details Form',
    description: 'A form for new hires to provide banking details and authorize salary payments.',
    icon: SalaryBankIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'overtime-claim': {
    kind: 'form',
    type: 'overtime-claim',
    title: 'Overtime Claim Form',
    description: 'For employees to formally claim payment for overtime hours worked.',
    icon: OvertimeClaimIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'excel',
  },
  'employment-contract': {
    kind: 'form',
    type: 'employment-contract',
    title: 'Employment Contract',
    description: 'Generate a legally compliant permanent employment contract for a new hire.',
    icon: EmploymentContractIcon,
    questions: [
      ...employeeAndManagerQuestions,
      { id: 'jobTitle', label: 'Job Title', type: 'text' },
      { id: 'startDate', label: 'Start Date', type: 'text', placeholder: 'e.g., 1 November 2024' },
      { id: 'probationPeriod', label: 'Probation Period (Months)', type: 'number', placeholder: 'e.g., 3' },
      { id: 'grossSalary', label: 'Gross Monthly Salary (ZAR)', type: 'text', placeholder: 'e.g., 25000' },
      { id: 'workingHours', label: 'Normal Working Hours', type: 'text', placeholder: 'e.g., 08:00 to 17:00, Monday to Friday' },
      { id: 'annualLeaveDays', label: 'Annual Leave Days', type: 'number', placeholder: 'e.g., 15' },
      { id: 'noticePeriod', label: 'Notice Period (Weeks)', type: 'number', placeholder: 'e.g., 4' },
    ],
    outputFormat: 'word',
  },
  'permission-for-deductions': {
    kind: 'form',
    type: 'permission-for-deductions',
    title: 'Permission for Salary Deduction',
    description: 'A form for an employee to authorize a specific deduction from their salary, as required by the BCEA.',
    icon: PermissionForDeductionsIcon,
    questions: [
      ...employeeAndManagerQuestions,
      { id: 'deductionAmount', label: 'Total Amount to be Deducted (ZAR)', type: 'text' },
      { id: 'deductionReason', label: 'Reason for Deduction', type: 'textarea', placeholder: 'e.g., For loss of company property (laptop)' },
      { id: 'repaymentSchedule', label: 'Repayment Schedule', type: 'textarea', placeholder: 'e.g., R500 per month for 3 months, starting on [date]' },
    ],
    outputFormat: 'word',
  },
  'workplace-skills-plan': {
    kind: 'form',
    type: 'workplace-skills-plan',
    title: 'Workplace Skills Plan (WSP)',
    description: 'A template to structure a Workplace Skills Plan for submission to your relevant SETA.',
    icon: SkillsDevelopmentIcon,
    questions: [
      ...commonQuestions,
      { id: 'sdlNumber', label: 'Skills Development Levy (SDL) Number', type: 'text' },
      { id: 'setaName', label: 'Name of your SETA', type: 'text', placeholder: 'e.g., Services SETA' },
      { id: 'reportingPeriod', label: 'Reporting Period', type: 'text', placeholder: 'e.g., 1 April 2024 - 31 March 2025' },
    ],
    outputFormat: 'word',
  },
  'annual-training-report': {
    kind: 'form',
    type: 'annual-training-report',
    title: 'Annual Training Report (ATR)',
    description: 'A template for an Annual Training Report, documenting training completed in the previous year for SETA submission.',
    icon: SkillsDevelopmentIcon,
    questions: [
      ...commonQuestions,
      { id: 'sdlNumber', label: 'Skills Development Levy (SDL) Number', type: 'text' },
      { id: 'setaName', label: 'Name of your SETA', type: 'text', placeholder: 'e.g., Services SETA' },
      { id: 'reportingPeriod', label: 'Reporting Period', type: 'text', placeholder: 'e.g., 1 April 2023 - 31 March 2024' },
    ],
    outputFormat: 'word',
  },
   // Newly Added Forms
  'staff-grooming-checklist': {
    kind: 'form',
    type: 'staff-grooming-checklist',
    title: 'Staff Grooming Checklist',
    description: 'Ensure staff meet presentation standards with this daily or weekly grooming checklist.',
    icon: ChecklistIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'warehouse-master-cleaning-checklist': {
    kind: 'form',
    type: 'warehouse-master-cleaning-checklist',
    title: 'Warehouse Master Cleaning Checklist',
    description: 'A comprehensive checklist for deep cleaning and maintaining warehouse hygiene.',
    icon: CleaningIcon,
    questions: [...commonQuestions, { id: 'supervisorName', label: 'Supervisor Name', type: 'text' }],
    outputFormat: 'excel',
  },
  'master-cleaning-schedule': {
    kind: 'form',
    type: 'master-cleaning-schedule',
    title: 'Master Cleaning Schedule',
    description: 'A general-purpose schedule for daily, weekly, and monthly cleaning tasks in any area.',
    icon: CleaningIcon,
    questions: [...commonQuestions, { id: 'area', label: 'Area/Department', type: 'text' }],
    outputFormat: 'excel',
  },
  'food-dispatch-checklist': {
    kind: 'form',
    type: 'food-dispatch-checklist',
    title: 'Food Dispatch Checklist',
    description: 'Ensure food safety standards are met before dispatching orders with this checklist.',
    icon: FoodSafetyIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'attendance-register': {
    kind: 'form',
    type: 'attendance-register',
    title: 'Attendance Register',
    description: 'A monthly register to track employee attendance, arrival, and departure times.',
    icon: RegisterIcon,
    questions: [...commonQuestions, { id: 'monthYear', label: 'Month and Year', type: 'text', placeholder: 'e.g., October 2024' }],
    outputFormat: 'excel',
  },
  'warehouse-cleaning-checklist': {
    kind: 'form',
    type: 'warehouse-cleaning-checklist',
    title: 'Warehouse Cleaning Checklist',
    description: 'A focused checklist for routine cleaning tasks within a warehouse environment.',
    icon: CleaningIcon,
    questions: [...commonQuestions, { id: 'supervisorName', label: 'Supervisor Name', type: 'text' }],
    outputFormat: 'excel',
  },
  'refrigerator-temperature-logsheet': {
    kind: 'form',
    type: 'refrigerator-temperature-logsheet',
    title: 'Refrigerator Temperature Logsheet',
    description: 'A logsheet for recording refrigerator temperatures to ensure food safety compliance.',
    icon: TemperatureIcon,
    questions: [...commonQuestions, { id: 'fridgeId', label: 'Refrigerator ID/Name', type: 'text' }],
    outputFormat: 'excel',
  },
  'food-safety-training-modules': {
    kind: 'form',
    type: 'food-safety-training-modules',
    title: 'Food Safety Training Modules',
    description: 'A template to structure key food safety training topics for employees.',
    icon: FoodSafetyIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'thermometer-verification-checklist': {
    kind: 'form',
    type: 'thermometer-verification-checklist',
    title: 'Thermometer Verification Checklist',
    description: 'Ensure accuracy of food thermometers with this regular verification checklist.',
    icon: TemperatureIcon,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'cleaning-checklist': {
    kind: 'form',
    type: 'cleaning-checklist',
    title: 'Cleaning Checklist',
    description: 'A versatile checklist for various cleaning duties in any business environment.',
    icon: CleaningIcon,
    questions: [...commonQuestions, { id: 'area', label: 'Area to be Cleaned', type: 'text' }],
    outputFormat: 'word',
  },
  'food-receiving-checklist': {
    kind: 'form',
    type: 'food-receiving-checklist',
    title: 'Food Receiving Checklist',
    description: 'A checklist to ensure incoming food deliveries meet safety and quality standards.',
    icon: FoodSafetyIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'bar-master-cleaning-schedule': {
    kind: 'form',
    type: 'bar-master-cleaning-schedule',
    title: 'Bar Master Cleaning Schedule',
    description: 'A comprehensive cleaning schedule tailored for the daily, weekly, and monthly upkeep of a bar.',
    icon: CleaningIcon,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'bar-cleaning-checklist': {
    kind: 'form',
    type: 'bar-cleaning-checklist',
    title: 'Bar Cleaning Checklist',
    description: 'A daily checklist for maintaining cleanliness and hygiene in a bar area.',
    icon: CleaningIcon,
    questions: [...commonQuestions],
    outputFormat: 'excel',
  },
  'food-safety-training-register': {
    kind: 'form',
    type: 'food-safety-training-register',
    title: 'Food Safety Training Register',
    description: 'Keep a record of all employees who have completed food safety training.',
    icon: TrainingRegisterIcon,
    questions: [...commonQuestions, { id: 'trainingTopic', label: 'Training Topic', type: 'text' }],
    outputFormat: 'excel',
  },
  'leave-register': {
    kind: 'form',
    type: 'leave-register',
    title: 'Leave Register',
    description: 'A register to track all types of leave taken by employees throughout the year.',
    icon: RegisterIcon,
    questions: [...commonQuestions, { id: 'year', label: 'Year', type: 'text', placeholder: 'e.g., 2024' }],
    outputFormat: 'excel',
  },
  'voluntary-retrenchment-application': {
    kind: 'form',
    type: 'voluntary-retrenchment-application',
    title: 'Application for Voluntary Retrenchment',
    description: 'A form for an employee to formally apply for voluntary retrenchment.',
    icon: ResignationIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'hr-bundle-package': {
    kind: 'form',
    type: 'hr-bundle-package',
    title: 'Complete HR Bundle Package Template',
    description: 'An overview template describing a complete printable HR bundle for small businesses.',
    icon: BundleIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'employee-handbook-canva': {
    kind: 'form',
    type: 'employee-handbook-canva',
    title: 'Employee Handbook Template (Canva)',
    description: 'Generate the core text content for a comprehensive employee handbook, ready to be designed in Canva.',
    icon: CanvaIcon,
    questions: [...commonQuestions, { id: 'ceoName', label: 'CEO/Managing Director Name', type: 'text' }],
    outputFormat: 'word',
  },
  'anticipated-retrenchment-notice': {
    kind: 'form',
    type: 'anticipated-retrenchment-notice',
    title: 'Notice of Anticipated Retrenchment',
    description: 'A formal notice to employees about a potential retrenchment process (Section 189 notice).',
    icon: LegalNoticeIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'onboarding-checklist-canva': {
    kind: 'form',
    type: 'onboarding-checklist-canva',
    title: 'Employee Onboarding Checklist (Canva)',
    description: 'The text content for a visually appealing onboarding checklist, perfect for styling in Canva.',
    icon: CanvaIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'employee-survey-canva': {
    kind: 'form',
    type: 'employee-survey-canva',
    title: 'Employee Survey Template (Canva)',
    description: 'A template with key questions for an employee satisfaction or engagement survey, ready for Canva.',
    icon: SurveyIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'employee-review-canva': {
    kind: 'form',
    type: 'employee-review-canva',
    title: 'Employee Review Template (Canva)',
    description: 'Generate the content for a modern performance review form, easily editable in Canva.',
    icon: CanvaIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'daily-attendance-canva': {
    kind: 'form',
    type: 'daily-attendance-canva',
    title: 'Daily Employee Attendance (Canva)',
    description: 'The structure for a daily attendance sheet, which can be designed and printed from Canva.',
    icon: CanvaIcon,
    questions: [...commonQuestions, { id: 'date', label: 'Date', type: 'text' }],
    outputFormat: 'excel',
  },
  'verbal-warning-afrikaans': {
    kind: 'form',
    type: 'verbal-warning-afrikaans',
    title: 'Verbale Waarskuwingssjabloon',
    description: "'n Sjabloon vir die dokumentering van 'n verbale waarskuwing wat aan 'n werknemer gegee is.",
    icon: AfrikaansIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'fixed-contract-ending-notice': {
    kind: 'form',
    type: 'fixed-contract-ending-notice',
    title: 'Notice of Fixed-Term Contract Ending',
    description: 'A formal notice to an employee that their fixed-term contract is approaching its end date.',
    icon: LegalNoticeIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'consultation-meeting-notice': {
    kind: 'form',
    type: 'consultation-meeting-notice',
    title: 'Notice of a Consultation Meeting',
    description: 'A formal invitation to an employee for a consultation meeting (e.g., for retrenchment, changes to terms).',
    icon: LegalNoticeIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'grievance-investigation-notice': {
    kind: 'form',
    type: 'grievance-investigation-notice',
    title: 'Notice of Grievance Investigation',
    description: 'Inform an employee that their grievance has been received and an investigation will commence.',
    icon: GrievanceIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'disciplinary-hearing-notice': {
    kind: 'form',
    type: 'disciplinary-hearing-notice',
    title: 'Notice of Disciplinary Hearing',
    description: 'A formal notice to an employee to attend a disciplinary hearing, outlining the charges.',
    icon: LegalNoticeIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'incapacity-inquiry-general-notice': {
    kind: 'form',
    type: 'incapacity-inquiry-general-notice',
    title: 'Notice of Incapacity Inquiry (General)',
    description: 'A general notice for an inquiry into an employee\'s capacity to perform their duties.',
    icon: LegalNoticeIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'incapacity-inquiry-ill-health-notice': {
    kind: 'form',
    type: 'incapacity-inquiry-ill-health-notice',
    title: 'Notice of Incapacity Inquiry (Ill Health)',
    description: 'A specific notice for an inquiry related to an employee\'s ill health or injury.',
    icon: HealthSafetyIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'poor-performance-inquiry-notice': {
    kind: 'form',
    type: 'poor-performance-inquiry-notice',
    title: 'Notice of Poor Work Performance Inquiry',
    description: 'A formal notice for an inquiry to address issues of poor work performance.',
    icon: PerformanceManagementIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'postponement-of-hearing-notice': {
    kind: 'form',
    type: 'postponement-of-hearing-notice',
    title: 'Notice of Postponement of Hearing',
    description: 'A formal notice to inform relevant parties that a disciplinary hearing has been postponed.',
    icon: LegalNoticeIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'observation-report': {
    kind: 'form',
    type: 'observation-report',
    title: 'Observation Report Template',
    description: 'A form to officially document observations of an employee\'s performance or conduct.',
    icon: JobDescriptionIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'staff-meeting-template': {
    kind: 'form',
    type: 'staff-meeting-template',
    title: 'Staff Meeting Minutes Template',
    description: 'A structured template for recording the minutes of a staff meeting.',
    icon: MeetingMinutesIcon,
    questions: [...commonQuestions, { id: 'meetingDate', label: 'Meeting Date', type: 'text' }],
    outputFormat: 'word',
  },
  'verbal-warning': {
    kind: 'form',
    type: 'verbal-warning',
    title: 'Verbal Warning Template',
    description: 'A template for documenting a verbal warning issued to an employee.',
    icon: DisciplinaryIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'written-warning': {
    kind: 'form',
    type: 'written-warning',
    title: 'Written Warning Template',
    description: 'A standard form for a first written warning for misconduct or poor performance.',
    icon: DisciplinaryIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'medical-report-template': {
    kind: 'form',
    type: 'medical-report-template',
    title: 'Medical Report Template',
    description: 'A form to be completed by a medical practitioner regarding an employee\'s fitness for work.',
    icon: HealthSafetyIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'grievance-decision-form': {
    kind: 'form',
    type: 'grievance-decision-form',
    title: 'Grievance Decision Form',
    description: 'A form to formally document the outcome and decision of a grievance hearing.',
    icon: GrievanceIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'poor-performance-meeting-minutes': {
    kind: 'form',
    type: 'poor-performance-meeting-minutes',
    title: 'Poor Performance Meeting Minutes',
    description: 'A template to record the minutes of a meeting addressing an employee\'s poor performance.',
    icon: MeetingMinutesIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'final-warning-hearing-held': {
    kind: 'form',
    type: 'final-warning-hearing-held',
    title: 'Final Written Warning (Post-Hearing)',
    description: 'A final warning form issued after a disciplinary hearing has been conducted.',
    icon: FinalWrittenWarningIcon,
    questions: employeeAndManagerQuestions,
    outputFormat: 'word',
  },
  'incident-investigation-report': {
    kind: 'form',
    type: 'incident-investigation-report',
    title: 'Accident/Incident Investigation Report',
    description: 'A detailed report form for investigating the root cause of a workplace accident or incident.',
    icon: IncidentReportIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  'incident-report': {
    kind: 'form',
    type: 'incident-report',
    title: 'Accident/Incident Report Form',
    description: 'A form for the initial reporting of any accident or incident that occurs in the workplace.',
    icon: IncidentReportIcon,
    questions: [...commonQuestions],
    outputFormat: 'word',
  },
  // New forms from list
  'certificate-of-service': {
    kind: 'form',
    type: 'certificate-of-service',
    title: 'Certificate of Service',
    description: 'Generate a BCEA-compliant Certificate of Service for a departing employee.',
    icon: CertificateOfServiceIcon,
    questions: [
      ...employeeAndManagerQuestions,
      { id: 'employeePosition', label: 'Employee\'s Position at Termination', type: 'text' },
      { id: 'employeeStartDate', label: 'Employment Start Date', type: 'text', placeholder: 'e.g., 1 January 2020' },
      { id: 'employeeEndDate', label: 'Employment End Date', type: 'text', placeholder: 'e.g., 31 October 2024' },
      { id: 'reasonForTermination', label: 'Reason for Termination', type: 'text', placeholder: 'e.g., Resignation', tip: 'As per the BCEA, the reason for termination is only included if the employee requests it.' },
    ],
    outputFormat: 'word',
  },
  'termination-letter': {
    kind: 'form',
    type: 'termination-letter',
    title: 'Termination Letter Template',
    description: 'A formal letter for concluding an employment relationship, outlining final details.',
    icon: TerminationOfEmploymentIcon,
    questions: [
      ...employeeAndManagerQuestions,
      { id: 'terminationDate', label: 'Date of Termination', type: 'text', placeholder: 'e.g., 31 October 2024' },
      { id: 'noticePeriod', label: 'Notice Period Served', type: 'text', placeholder: 'e.g., 4 weeks' },
      { id: 'reasonForTermination', label: 'Reason for Termination', type: 'textarea', placeholder: 'e.g., Dismissal for misconduct following a disciplinary hearing.' },
    ],
    outputFormat: 'word',
  },
  'resignation-acceptance-letter': {
    kind: 'form',
    type: 'resignation-acceptance-letter',
    title: 'Resignation Acceptance Letter',
    description: 'Formally acknowledge an employee\'s resignation and confirm their last working day.',
    icon: ReferenceCheckIcon,
    questions: [
      ...employeeAndManagerQuestions,
      { id: 'resignationDateReceived', label: 'Date Resignation was Received', type: 'text', placeholder: 'e.g., 1 October 2024' },
      { id: 'lastWorkingDay', label: 'Confirmed Last Working Day', type: 'text', placeholder: 'e.g., 31 October 2024' },
    ],
    outputFormat: 'word',
  },
  'payroll-processing-checklist': {
    kind: 'form',
    type: 'payroll-processing-checklist',
    title: 'Payroll Processing Checklist',
    description: 'A checklist to ensure accurate and compliant payroll processing, covering all statutory requirements.',
    icon: PayrollProcessingIcon,
    questions: [
      ...commonQuestions,
      { id: 'payPeriod', label: 'Payroll Month/Year', type: 'text', placeholder: 'e.g., October 2024' },
      { id: 'processedBy', label: 'Payroll Processed By', type: 'text', placeholder: 'e.g., Jane Doe' },
    ],
    outputFormat: 'excel',
  },
};


export const INDUSTRIES: string[] = [
  'Retail',
  'Construction',
  'Agriculture',
  'Technology',
  'Hospitality',
  'Manufacturing',
  'Professional Services',
];

const createGenericTemplate = (title: string, intro: string, customSection: string) => `
# ${title} for [companyName]

## 1. Introduction
This policy outlines the procedures and regulations regarding ${intro} for employees at [companyName].

## 2. Scope
This policy applies to all permanent and fixed-term contract employees of the company.

## 3. General Principles
The company is committed to applying this policy in a fair and consistent manner.
${customSection}

[customClauses]
`;

export const BASE_TEMPLATES: Record<PolicyType, string> = {
  'leave': `
# Leave Policy for [companyName]

## 1. Introduction
This policy outlines the procedures and regulations regarding various types of leave for employees at [companyName], in accordance with the Basic Conditions of Employment Act (BCEA) of South Africa.

## 2. Annual Leave
- Employees are entitled to [annualLeaveDays] days of paid annual leave per leave cycle.
- Leave must be applied for at least one month in advance using the official leave form.
- Management reserves the right to decline leave requests based on operational requirements.

## 3. Sick Leave
- During each 36-month sick leave cycle, an employee is entitled to paid sick leave equal to the number of days they would normally work during a 6-week period.
- For an absence of more than two consecutive days, a medical certificate from a registered medical practitioner is required.

## 4. Family Responsibility Leave
- Employees who have worked for more than four months are entitled to 3 days of paid family responsibility leave per year.
- This leave can be taken when an employee's child is born, when an employee's child is sick, or in the event of the death of a close family member.

[customClauses]
`,
  'disciplinary': `
# Disciplinary Code and Procedure for [companyName]

## 1. Purpose
The purpose of this code is to regulate standards of conduct and performance of employees at [companyName] and to ensure that all employees are treated fairly and consistently.

## 2. Principles
- Discipline is a corrective, not punitive, measure.
- The procedure will be conducted in line with the principles of natural justice.
- No employee will be dismissed for a first offence, except in cases of gross misconduct.

## 3. Disciplinary Actions
Actions may include, but are not limited to:
- Verbal Warning
- Written Warning
- Final Written Warning
- Dismissal

## 4. Procedure
- The company will conduct a thorough investigation before any formal disciplinary action is taken.
- The employee has the right to be represented by a fellow employee or trade union representative.
- The employee has the right to state their case and present evidence.

[customClauses]

For any queries, please contact [hrContactPerson].
`,
'grievance': `
# Grievance Procedure for [companyName]

## 1. Objective
This procedure provides a formal channel for employees to raise and resolve workplace grievances fairly, quickly, and effectively.

## 2. Procedure
### Step 1: Informal Discussion
Employees are encouraged to first discuss the grievance with their [firstStepContact].

### Step 2: Formal Grievance
If the matter is not resolved, the employee should submit a formal written grievance to their Department Head.

### Step 3: Grievance Hearing
A formal hearing will be held, where the employee can state their case. The employee may be accompanied by a fellow employee.

### Step 4: Escalation
If the employee is not satisfied with the outcome, they may escalate the matter to the [escalationContact].

[customClauses]
`,
'health-and-safety': `
# Health and Safety Policy for [companyName]

## 1. Policy Statement
[companyName] is committed to providing a safe and healthy working environment for all its employees, contractors, and visitors, in compliance with the Occupational Health and Safety Act (OHS Act).

## 2. Responsibilities
- **Management:** To ensure a safe workplace, provide necessary training, and implement safety procedures.
- **Employees:** To take reasonable care of their own health and safety and that of others, and to comply with all safety rules.

## 3. Hazard Identification and Risk Assessment
The company will regularly conduct risk assessments to identify and mitigate potential hazards in the workplace.

## 4. Safety Officer
The designated Safety Officer is [safetyOfficerName], who is responsible for overseeing the implementation of this policy. If no officer is named, management assumes this responsibility.

[customClauses]
`,
  'master': createGenericTemplate('Master HR Policy', 'the master HR policies', 'This document serves as the primary source for all company HR policies. It will be reviewed annually.'),
  'byod': createGenericTemplate('Bring Your Own Device (BYOD) Policy', 'the use of personal electronic devices for work purposes', 'For support, contact the [itSupportContact].'),
  'cell-phone': createGenericTemplate('Cell Phone Policy', 'the use of company-provided and personal cell phones during work hours', 'Usage is restricted as follows: [usageRestrictions]'),
  'certification': createGenericTemplate('Certification Policy', 'obtaining and maintaining professional certifications', 'The company provides reimbursement as follows: [reimbursementPolicy]'),
  'code-of-ethics': createGenericTemplate('Code of Ethics', 'the expected standards of conduct and integrity', 'Violations should be reported to the [reportingChannel].'),
  'communication-retention': createGenericTemplate('Communication Retention Policy', 'the retention of electronic communications', 'Data will be retained for a period of [retentionPeriod] years.'),
  'data-usage-popia': createGenericTemplate('Data Usage (POPIA) Policy', 'the protection of personal information in compliance with POPIA', 'The appointed Information Officer is [infoOfficer].'),
  'electronic-communications': createGenericTemplate('Electronic Communications Policy', 'the acceptable use of company electronic systems', 'Please note: [monitoringStatement]'),
  'resignation': createGenericTemplate('Resignation Policy', 'the formal procedure for voluntary termination of employment', 'A standard notice period of [noticePeriodWeeks] weeks is required.'),
  'security': createGenericTemplate('Security Policy', 'physical and information security measures', 'Contact [accessControl] for matters related to access control.'),
  'sexual-harassment': createGenericTemplate('Sexual Harassment Policy', 'our zero-tolerance stance on sexual harassment', 'To report an incident, please contact [confidentialContact].'),
  'standby': createGenericTemplate('Standby Policy', 'the requirements and compensation for being on standby', 'The standby allowance is [standbyAllowance].'),
  'telephone-usage': createGenericTemplate('Telephone Usage Policy', 'the use of company telephones', 'Personal calls are [personalCallRule].'),
  'time-off': createGenericTemplate('Time Off Procedure', 'requesting unpaid time off', 'All requests must be approved by the [approvalAuthority].'),
  'travel': createGenericTemplate('Business Travel Policy', 'procedures for business-related travel', 'All expense claims should be submitted to the [expenseContact].'),
  'company-property': createGenericTemplate('Company Property Policy', 'the use and care of company-owned hardware and software', 'For assistance, please contact the [itManager].'),
  'visitor': createGenericTemplate('Visitor Policy', 'the procedure for managing visitors on company premises', 'All visitors must sign in with the [receptionContact].'),
  'remote-hybrid-work': createGenericTemplate('Remote & Hybrid Work Policy', 'guidelines for remote and hybrid work arrangements', 'Core collaboration hours are [coreHours]. For questions, please contact the [remoteWorkContact].'),
  'eeo-diversity': createGenericTemplate('EEO & Diversity Policy', 'equal employment opportunity and diversity', 'Our EEO Officer is [eeoOfficerName].'),
  'attendance-punctuality': createGenericTemplate('Attendance & Punctuality Policy', 'employee attendance and punctuality', 'Regarding late arrivals: [lateArrivalPolicy].'),
  'employee-conduct': createGenericTemplate('Employee Conduct & Behavior Policy', 'the standards of employee conduct', 'Our dress code is: [dressCodeSummary].'),
  'data-protection-privacy': createGenericTemplate('Data Protection & Privacy Policy', 'the protection of personal and company data', 'In case of a data breach, contact [dataBreachContact].'),
  'disciplinary-action': createGenericTemplate('Disciplinary Action Policy', 'the process for disciplinary action', 'Appeals should be directed to [appealProcessContact].'),
  'whistleblower': createGenericTemplate('Whistleblower Policy', 'reporting of unethical or illegal activities', 'Anonymous reports can be made via [whistleblowerHotline].'),
  'compensation-benefits': createGenericTemplate('Compensation & Benefits Policy', 'employee compensation and benefits', 'For payroll questions, contact [payrollContact].'),
  'performance-management': createGenericTemplate('Performance Management Policy', 'employee performance evaluation', 'Performance reviews are conducted [reviewFrequency].'),
  'workplace-wellness': createGenericTemplate('Workplace Wellness Policy', 'promoting employee health and wellness', 'Our wellness programs are managed by [wellnessProgramManager].'),
  'it-cybersecurity': createGenericTemplate('IT & Cybersecurity Policy', 'the secure use of IT resources', 'Our password policy is: [passwordPolicySummary].'),
  'social-media': createGenericTemplate('Social Media Policy', 'the use of social media by employees', 'Official posts must be approved by [socialMediaApprovalContact].'),
  'confidentiality': createGenericTemplate('Confidentiality Policy', 'the protection of confidential information', 'Examples of confidential data include: [confidentialInfoExamples].'),
  'employee-separation': createGenericTemplate('Employee Separation & Exit Policy', 'the process for employee departures', 'Exit interviews are conducted by [exitInterviewContact].'),
  'anti-harassment-discrimination': createGenericTemplate('Harassment & Anti-Discrimination Policy', 'our commitment to a harassment-free workplace', 'Reports should be made to [harassmentReportingContact].'),
  'company-vehicle': createGenericTemplate('Company Vehicle Use Policy', 'the use of company-provided vehicles', 'The fleet is managed by [vehicleManager].'),
  'expense-reimbursement': createGenericTemplate('Expense Reimbursement Policy', 'reimbursement for business expenses', 'Claims are typically processed within [reimbursementTimeframe] days.'),
  'employment-equity': createGenericTemplate('Employment Equity Policy', 'our commitment to promoting equal opportunity and eliminating unfair discrimination in line with the Employment Equity Act', 'The senior manager responsible for Employment Equity is [eeManager].'),
  'coida': createGenericTemplate('COIDA Policy', 'the procedures for reporting and managing injuries on duty and occupational diseases', 'For assistance, please contact [iodContact].'),
  'uif': createGenericTemplate('UIF Policy', 'our obligations regarding Unemployment Insurance Fund (UIF) contributions', 'All payroll and UIF matters are handled by [payrollContact].'),
  'recruitment-selection': createGenericTemplate('Recruitment and Selection Policy', 'ensuring a fair, transparent, and non-discriminatory hiring process', 'All recruitment queries should be directed to [recruitmentContact].'),
  'working-hours': createGenericTemplate('Working Hours Policy', 'standard working hours, overtime, and rest periods', 'Standard hours are [standardHours].'),
  'training-development': createGenericTemplate('Training and Development Policy', 'our commitment to employee growth and skills development', 'Training requests are approved by [trainingApprover].'),
  'anti-bribery-corruption': createGenericTemplate('Anti-Bribery and Corruption Policy', 'our zero-tolerance approach to bribery and corruption', 'Suspected incidents must be reported to [briberyReportContact].'),
  'dress-code': createGenericTemplate('Dress Code Policy', 'the expected standard of workplace attire', 'The general dress code is: [dressCodeSummary].'),
  'alcohol-drug': createGenericTemplate('Alcohol and Drug Policy', 'our rules regarding substance use to ensure a safe workplace', 'For assistance with substance abuse issues, contact [substanceAbuseContact].'),
  'termination-of-employment': createGenericTemplate('Termination of Employment Policy', 'the legally compliant procedures for ending an employment contract', 'The standard notice period is [terminationNoticeWeeks] weeks.'),
  'retrenchment': createGenericTemplate('Retrenchment Policy', 'the fair procedure for dismissal based on operational requirements', 'The consultation process will be managed by [consultationManager].'),
  'deductions': createGenericTemplate(
    'Deductions Policy',
    'salary deductions to ensure compliance with the Basic Conditions of Employment Act (BCEA)',
    'The company will only make deductions from an employee\'s salary that are required by law (e.g., PAYE, UIF) or have been agreed to in writing by the employee. For any queries, please contact the [deductionsContact].'
  ),
  'anti-bullying': createGenericTemplate(
    'Anti-Bullying Policy',
    'our zero-tolerance stance on bullying in the workplace',
    '[companyName] is committed to providing a work environment free from bullying. Bullying is defined as repeated, unreasonable behaviour directed towards an employee or group of employees, that creates a risk to health and safety. All complaints will be investigated promptly and confidentially. To report an incident, contact [confidentialContact].'
  ),
  'it-access-security': createGenericTemplate(
    'IT Access and Security Policy',
    'the secure access and use of company IT resources and data',
    'All employees are responsible for safeguarding their access credentials and must adhere to the company\'s password and data security protocols. Unauthorised access or misuse of company systems is strictly prohibited and may result in disciplinary action. For support, contact [itSupportContact].'
  ),
  'employee-handbook': '', // This is dynamically generated, no base template needed
  'conflict-of-interest': createGenericTemplate(
    'Conflict of Interest Policy',
    'the identification and management of potential conflicts of interest',
    'Employees must avoid any activity or interest that might interfere with their objectivity in performing company duties. All potential conflicts must be disclosed to [disclosureContact] for review. Failure to disclose a conflict of interest may result in disciplinary action.'
  ),
  'records-retention-destruction': createGenericTemplate(
    'Records Retention and Destruction Policy',
    'the management, retention, and secure destruction of company and employee records in compliance with POPIA',
    `All company records must be retained for the period specified in our Records Retention Schedule, with a standard period of [retentionPeriod] years for general employee files unless otherwise required by law. After the retention period, records must be securely destroyed. The Information Officer, [infoOfficer], is responsible for overseeing this policy.`
  ),
  'salary-structure-guide': createGenericTemplate(
    'Salary Structure Guide',
    'our approach to employee compensation',
    `This guide outlines the principles of our salary structure, which is designed to be fair, equitable, and competitive. Our philosophy is: [compensationPhilosophy]. The structure consists of salary bands based on job roles, responsibilities, and market data. This policy does not constitute a contract of employment.`
  ),
};

export const FORM_BASE_TEMPLATES: Record<FormType, string> = {
  'job-application': `
# Job Application Form - [companyName]

## Position Applied For: [position]

### Personal Information
- **Full Name:** _________________________
- **Contact Number:** _________________________
- **Email Address:** _________________________
- **Residential Address:** _________________________

### Employment History
(Please start with your most recent employer)

**1. Employer:** _________________________
   - **Position Held:** _________________________
   - **Dates of Employment:** From ___________ to ___________
   - **Reason for Leaving:** _________________________

**2. Employer:** _________________________
   - **Position Held:** _________________________
   - **Dates of Employment:** From ___________ to ___________
   - **Reason for Leaving:** _________________________

### Declaration
I, the undersigned, declare that the information provided in this application is true and correct to the best of my knowledge.

**Signature:** _________________________
**Date:** _________________________
`,
  'employee-details': `
# Employee Details Form
## [companyName]

Please complete all sections of this form and return it to the HR Department. This information will be kept confidential and is essential for payroll, communication, and emergency purposes.

### Section 1: Personal Details
| | |
|---|---|
| **Full Name (as per ID):** | |
| **Surname:** | |
| **First Name(s):** | |
| **ID Number:** | |
| **Date of Birth:** | |
| **Gender:** | |
| **Nationality:** | |

### Section 2: Contact Information
| | |
|---|---|
| **Residential Address:** | |
| **Postal Code:** | |
| **Personal Email Address:** | |
| **Mobile Number:** | |
| **Home Telephone Number:** | |

### Section 3: Emergency Contact
Please provide details of a person we can contact in case of an emergency.
| | |
|---|---|
| **Full Name:** | |
| **Relationship to you:** | |
| **Primary Contact Number:** | |
| **Alternative Contact Number:** | |

### Section 4: Banking Details
For salary payment purposes. Please attach a copy of your bank statement or confirmation letter.
| | |
|---|---|
| **Bank Name:** | |
| **Account Holder Name:** | |
| **Account Number:** | |
| **Branch Name:** | |
| **Branch Code:** | |
| **Account Type:** | |

### Declaration
I, the undersigned, confirm that the information provided in this form is accurate and complete. I undertake to inform the company of any changes to these details.

**Employee Signature:** _________________________
**Date:** _________________________
`,
  'leave-application': `
# Leave Application Form
## [companyName]

| | |
|---|---|
| **Employee Name:** | |
| **Employee Number:** | |
| **Department:** | |
| **Date of Application:** | |

### Leave Details
- **Type of Leave:** ( ) Annual ( ) Sick ( ) Family Responsibility ( ) Unpaid ( ) Other: _________
- **Start Date:** _________________________
- **End Date:** _________________________
- **Total Number of Days:** _________________

**Reason for Leave Request:**
________________________________________________________________
________________________________________________________________

---

**Employee Signature:** _________________________
**Date:** _________________________

---
### For Office Use Only
- **Approved / Declined by [approvingManager]:** _________________________
- **Signature:** _________________________
- **Date:** _________________________
`,
'final-written-warning': `
# Final Written Warning

**To:** [employeeName]
**From:** [companyName], represented by [managerName]
**Date:** _________________________

**Subject: Final Written Warning for Misconduct / Poor Performance**

This letter serves as a final written warning concerning your conduct/performance related to:
(Describe the incident/issue in detail)
________________________________________________________________
________________________________________________________________

This issue was previously discussed with you on the following dates:
1. Verbal Warning: ______________
2. First Written Warning: ______________

This conduct is in breach of the company's Disciplinary Code. Should any further transgression occur, it may lead to your dismissal from the company.

A copy of this warning will be placed in your employee file. You have the right to appeal this decision within 5 working days.

**Employee Signature:** _________________________
(Signing acknowledges receipt, not necessarily agreement)

**Manager Signature:** _________________________
`,
'exit-interview': `
# Exit Interview Questionnaire
## [companyName]

Thank you for taking the time to provide your feedback. Your responses will be kept confidential and used to improve our work environment.

| | |
|---|---|
| **Employee Name:** | |
| **Position:** | |
| **Date of Interview:** | |

1. **What was your primary reason for leaving [companyName]?**
   ________________________________________________________________

2. **What did you like most about your job and working here?**
   ________________________________________________________________

3. **What did you like least about your job and working here?**
   ________________________________________________________________

4. **Do you feel you had the resources and support to succeed in your role?**
   ________________________________________________________________

5. **Would you recommend [companyName] to others as a place to work? Why or why not?**
   ________________________________________________________________

**Thank you for your valuable input.**
`,
'grievance-form': `
# Grievance Lodging Form
## [companyName]

This form is to be used to formally lodge a grievance in accordance with the company's Grievance Procedure.

| | |
|---|---|
| **Employee Name:** | |
| **Position:** | |
| **Department:** | |
| **Date of Submission:** | |

**Submitted to:** [grievanceRecipient]

### Details of the Grievance
(Please describe the nature of your grievance in as much detail as possible. Include dates, times, locations, and any individuals involved.)
________________________________________________________________
________________________________________________________________
________________________________________________________________
________________________________________________________________

### Desired Outcome
(What resolution are you seeking to resolve this grievance?)
________________________________________________________________
________________________________________________________________

I confirm that the information provided is accurate to the best of my knowledge.

**Employee Signature:** _________________________
`,
'job-description': `
# Job Description: [jobTitle]
## [companyName] - [department] Department

### Job Summary
A brief, one-paragraph summary of the role's main purpose and responsibilities.
________________________________________________________________
________________________________________________________________

### Key Responsibilities
- Responsibility 1: _________________________
- Responsibility 2: _________________________
- Responsibility 3: _________________________
- Responsibility 4: _________________________

### Qualifications and Skills
- Qualification/Skill 1: _________________________
- Qualification/Skill 2: _________________________
- Qualification/Skill 3: _________________________

### Reporting Structure
Reports to: _________________________
`,
'leave-application-maternity': `
# Maternity Leave Application Form
## [companyName]

This form is for employees applying for maternity leave in terms of the Basic Conditions of Employment Act.

| | |
|---|---|
| **Employee Name:** | [employeeName] |
| **Department:** | _________________________ |
| **Expected Date of Birth:** | _________________________ |

### Leave Period
- **Proposed Start Date of Leave:** _________________________
- **Proposed End Date of Leave:** _________________________

Please attach a medical certificate confirming the expected date of birth.

**Employee Signature:** _________________________
**Date:** _________________________

---
### For Office Use Only
- **Approved by [managerName]:** _________________________
- **Signature:** _________________________
- **Date:** _________________________
`,
'disciplinary-enquiry-report': `
# Disciplinary Enquiry Report
## [companyName]

| | |
|---|---|
| **Employee Name:** | [employeeName] |
| **Date of Enquiry:** | _________________________ |
| **Chairperson:** | [managerName] |
| **Employee Representative:** | _________________________ |

### Allegations
(Summary of the charges against the employee)
________________________________________________________________

### Summary of Evidence
(Briefly list the evidence presented by the company and the employee)
________________________________________________________________

### Finding
(State whether the employee was found guilty or not guilty of the charges)
________________________________________________________________

### Sanction
(Detail the disciplinary action to be taken, e.g., written warning, dismissal)
________________________________________________________________

**Chairperson Signature:** _________________________
**Date:** _________________________
`,
'suspension-notice': `
# Notice of Precautionary Suspension

**To:** [employeeName]
**From:** [managerName], [companyName]
**Date:** _________________________

**Subject: Precautionary Suspension**

This letter confirms that you are placed on precautionary suspension with full pay, effective immediately, pending an investigation into allegations of serious misconduct.

The allegations are:
________________________________________________________________

During your suspension, you are not required to report for duty and should not enter company premises without prior permission.

You will be contacted regarding the investigation in due course.

**Manager Signature:** _________________________
`,
'appeal-form': `
# Disciplinary Appeal Form
## [companyName]

| | |
|---|---|
| **Employee Name:** | [employeeName] |
| **Date of Original Sanction:** | _________________________ |
| **Original Sanction:** | _________________________ |

### Grounds for Appeal
(Please state clearly the reasons for your appeal. E.g., procedural unfairness, new evidence, sanction too harsh)
________________________________________________________________
________________________________________________________________
________________________________________________________________

**Employee Signature:** _________________________
**Date:** _________________________
`,
'expense-claim': `
# Expense Claim Form
## [companyName]

| | |
|---|---|
| **Employee Name:** | [employeeName] |
| **Department:** | _________________________ |
| **Claim Period:** | From ____________ to ____________ |

### Expense Details
*Please attach all original receipts.*

| Date | Description | Amount (ZAR) |
|---|---|---|
| | | |
| | | |
| | | |
| **Total:** | | |

**Employee Signature:** _________________________
**Date:** _________________________

---
**Manager Approval ([managerName]):** _________________________
**Date:** _________________________
`,
'employee-training-agreement': `
# Employee Training Agreement
## [companyName]

This agreement is between [companyName] and [employeeName].

1.  **Training Course:** _________________________
2.  **Total Cost:** R_________________________
3.  **Payback Clause:** The employee agrees that if they resign within ______ months of completing the training, they will repay a pro-rata portion of the training cost to the company.

**Employee Signature:** _________________________
**Date:** _________________________

**Manager Signature ([managerName]):** _________________________
**Date:** _________________________
`,
'reference-check': `
# Reference Check Form
## [companyName]

| | |
|---|---|
| **Candidate Name:** | [candidateName] |
| **Referee Name & Company:** | _________________________ |
| **Date of Check:** | _________________________ |

### Questions
1.  **In what capacity did you work with the candidate?**
    ________________________________________________________________
2.  **What were their key strengths?**
    ________________________________________________________________
3.  **What was their reason for leaving?**
    ________________________________________________________________
4.  **Would you re-hire them?** ( ) Yes ( ) No

**Reference provided by:** _________________________
**Check conducted by:** _________________________
`,
'retrenchment-notice': `
# Notice of Termination of Employment (Retrenchment)

**To:** [employeeName]
**From:** [managerName], [companyName]
**Date:** _________________________

This letter serves to confirm that following the consultation process, your position has been declared redundant.

Your employment with [companyName] will terminate on **_________________________**.

You will receive your final salary, outstanding leave pay, and a severance package as discussed.

We thank you for your service and wish you the best for the future.

**Manager Signature:** _________________________
`,
'job-advertisement': `
# Job Advertisement: [jobTitle]
## [companyName] - Location

**About Us:**
[companyName] is a leading company in the [industry] sector. We are looking for a talented [jobTitle] to join our team.

**The Role:**
(Briefly describe the main purpose and responsibilities of the job)
________________________________________________________________

**Requirements:**
- Qualification/Skill 1
- Qualification/Skill 2

**To Apply:**
Please send your CV to _________________________.
`,
'interview-guide': `
# Interview Guide: [position]
## [companyName]

### Candidate: _________________________
### Interviewer(s): _________________________
### Date: _________________________

---
### Introduction (2 mins)
- Welcome candidate, introduce interviewer(s).
- Briefly outline the role and company.

### General Questions (10 mins)
1.  Tell us about your relevant experience for this role.
2.  What do you know about [companyName]?
3.  What are your key strengths?

### Behavioural Questions (15 mins)
1.  Describe a challenging situation you faced and how you handled it.
2.  Give an example of a time you worked effectively as part of a team.

### Candidate Questions (5 mins)
- "Do you have any questions for us?"

---
### Interviewer Notes:
________________________________________________________________
`,
'candidate-evaluation': `
# Candidate Evaluation Scorecard
## [companyName] - [position]

### Candidate: _________________________
### Interviewer: _________________________

*Score each category from 1 (Poor) to 5 (Excellent)*

| Criteria | Score (1-5) | Comments |
|---|---|---|
| **Relevant Experience** | | |
| **Technical Skills** | | |
| **Communication Skills** | | |
| **Team Fit / Culture** | | |
| **Overall Impression** | | |
| **Total Score:** | | |

**Recommendation:** ( ) Hire ( ) Do Not Hire ( ) Second Interview
`,
'onboarding-checklist': `
# New Employee Onboarding Checklist
## [companyName]

| | |
|---|---|
| **Employee Name:** | [employeeName] |
| **Start Date:** | _________________________ |
| **Manager:** | [managerName] |

### Week 1 Checklist
| Task | Completed (Y/N) |
|---|---|
| **HR:** Signed contract & submitted forms | |
| **IT:** Set up computer & email access | |
| **Manager:** Team introductions | |
| **Manager:** Review of Job Description | |
| **Buddy:** Office tour & lunch | |
`,
'confidentiality-agreement': `
# Confidentiality Agreement (NDA)

This agreement is between **[companyName]** and **[employeeName]**.

The employee agrees not to disclose any confidential information, including trade secrets, client lists, and financial data, obtained during their employment, both during and after the employment period.

Breach of this agreement may lead to disciplinary action, including dismissal and legal proceedings.

**Employee Signature:** _________________________
**Date:** _________________________
`,
'restraint-of-trade': `
# Restraint of Trade Agreement

This agreement is between **[companyName]** and **[employeeName]**.

For a period of ______ months after termination of employment, the employee agrees not to:
1.  Work for a direct competitor within a ______ km radius.
2.  Solicit clients or employees of [companyName].

This agreement is acknowledged as reasonable to protect the legitimate business interests of [companyName].

**Employee Signature:** _________________________
**Date:** _________________________
`,
'performance-review': `
# Performance Review
## [companyName]

| | |
|---|---|
| **Employee Name:** | [employeeName] |
| **Review Period:** | _________________________ |
| **Manager:** | [managerName] |

### Section 1: Review of Past Goals
(Assess achievement of goals set in the previous review)
________________________________________________________________

### Section 2: Strengths & Accomplishments
________________________________________________________________

### Section 3: Areas for Development
________________________________________________________________

### Section 4: Goals for Next Review Period
1. Goal 1: _________________________
2. Goal 2: _________________________

**Employee Comments:**
________________________________________________________________

**Employee Signature:** _________________________
**Date:** _________________________
**Manager Signature:** _________________________
**Date:** _________________________
`,
'salary-bank-details': `
# Salary & Bank Details Authorization Form
## [companyName]

Please complete to ensure correct salary payment.

### Employee Details
- **Full Name:** _________________________
- **ID Number:** _________________________

### Banking Details
*Please attach proof of banking.*
| | |
|---|---|
| **Bank Name:** | |
| **Account Holder Name:** | |
| **Account Number:** | |
| **Branch Code:** | |
| **Account Type:** | |

### Authorization
I, the undersigned, authorize [companyName] to deposit my salary into the above account.

**Signature:** _________________________
**Date:** _________________________
`,
'overtime-claim': `
# Overtime Claim Form
## [companyName]

| | |
|---|---|
| **Employee Name:** | [employeeName] |
| **Claim Period:** | From ____________ to ____________ |

### Overtime Hours Worked
*Overtime must be pre-approved by your manager.*

| Date | Time From | Time To | Total Hours | Reason |
|---|---|---|---|---|
| | | | | |
| | | | | |
| **Total Hours Claimed:** | | | | |

**Employee Signature:** _________________________
**Date:** _________________________

---
**Manager Approval ([managerName]):** _________________________
**Date:** _________________________
`,
'employment-contract': `
# Contract of Employment

Entered into between:

**[companyName]**
("The Employer")

and

**[employeeName]**
("The Employee")

### 1. Commencement and Position
1.1. This contract will commence on **[startDate]**.
1.2. The Employee is appointed to the position of **[jobTitle]**.

### 2. Probation
2.1. A probation period of **[probationPeriod]** months will apply.

### 3. Remuneration
3.1. The Employee's gross monthly salary will be **ZAR [grossSalary]**.

### 4. Hours of Work
4.1. Normal working hours are from **[workingHours]**.

### 5. Leave
5.1. The Employee is entitled to **[annualLeaveDays]** days of annual leave per annum.
5.2. Sick leave and family responsibility leave will be as per the Basic Conditions of Employment Act.

### 6. Termination
6.1. The required notice period for termination by either party is **[noticePeriod]** weeks.

Signed at _________________________ on this ______ day of ______________ 20____.

**For the Employer:** _________________________
Name: [managerName]

**Employee:** _________________________
Name: [employeeName]
`,
'permission-for-deductions': `
# Employee Authorisation for Salary Deduction

| | |
|---|---|
| **Employee Name:** | [employeeName] |
| **Date:** | _________________________ |

I, the undersigned, hereby voluntarily authorize [companyName] to deduct the following amount from my salary:

- **Total Amount:** ZAR [deductionAmount]
- **Reason for Deduction:** [deductionReason]
- **Repayment Schedule:** [repaymentSchedule]

I confirm that I have been consulted on this matter and agree to this deduction.

**Employee Signature:** _________________________

**For the Employer ([managerName]):** _________________________
`,
'workplace-skills-plan': `
# Workplace Skills Plan (WSP)
## [companyName]

| | |
|---|---|
| **Company Legal Name:** | [companyName] |
| **SDL Number:** | [sdlNumber] |
| **SETA:** | [setaName] |
| **Reporting Period:** | [reportingPeriod] |

### Section 1: Skills Priorities
(List the key skills priorities for the upcoming year based on business goals)
1. _________________________
2. _________________________

### Section 2: Planned Training Interventions
| Training Programme / Course | Number of Staff |
|---|---|
| | |
| | |
| | |

**Submitted by:** _________________________
**Date:** _________________________
`,
'annual-training-report': `
# Annual Training Report (ATR)
## [companyName]

| | |
|---|---|
| **Company Legal Name:** | [companyName] |
| **SDL Number:** | [sdlNumber] |
| **SETA:** | [setaName] |
| **Reporting Period:** | [reportingPeriod] |

### Section 1: Training Completed
(Report on the training that was conducted in the past year)
| Training Programme / Course | Number of Staff Trained |
|---|---|
| | |
| | |
| | |

**Submitted by:** _________________________
**Date:** _________________________
`,
// Templates for newly added forms
'staff-grooming-checklist': `
# Staff Grooming Checklist
## [companyName]

**Employee Name:** [employeeName]
**Date:** _________________
**Checked by:** [managerName]

| Item | Compliant (Yes/No) | Comments |
|---|---|---|
| Uniform clean and ironed | | |
| Shoes clean and appropriate | | |
| Hair neat and tidy | | |
| Good personal hygiene | | |
| Name tag visible | | |

**Employee Signature:** _________________________
**Manager Signature:** _________________________
`,
'warehouse-master-cleaning-checklist': `
# Warehouse Master Cleaning Checklist
## [companyName]

**Area:** _________________
**Month/Year:** _________________

| Task | Frequency | Responsible |
|---|---|---|
| Sweep all floors | Daily | |
| Mop all floors | Weekly | |
| Clean and sanitize restrooms | Daily | |
| Empty all trash receptacles | Daily | |
| Dust shelving and racking | Monthly | |
| Clean loading bay doors | Monthly | |
| High-level dusting (cobwebs) | Quarterly | |

**Verified by Supervisor ([supervisorName]):** _________________________
**Date:** _________________________
`,
'master-cleaning-schedule': `
# Master Cleaning Schedule - [area]
## [companyName]

| Task | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
|---|---|---|---|---|---|---|---|
| **Daily Tasks** | | | | | | | |
| Task 1 | | | | | | | |
| Task 2 | | | | | | | |
| **Weekly Tasks** | | | | | | | |
| Task 3 (e.g., on Mon) | | | | | | | |
| Task 4 (e.g., on Wed) | | | | | | | |
| **Monthly Tasks** | | | | | | | |
| Task 5 (e.g., 1st of month) | | | | | | | |

**Completed by (Name/Signature):** _________________________
`,
'food-dispatch-checklist': `
# Food Dispatch Checklist
## [companyName]

**Order Number:** _________________
**Date:** _________________
**Checked by:** _________________

| Item | Check | Comments |
|---|---|---|
| Correct product and quantity | [ ] | |
| Packaging is intact and clean | [ ] | |
| "Best Before" / "Use By" date is valid | [ ] | |
| Correct delivery address and details | [ ] | |
| Vehicle temperature correct (if applicable) | [ ] | |

**Signature:** _________________________
`,
'attendance-register': `
# Attendance Register - [monthYear]
## [companyName]

| Employee Name | 1 | 2 | 3 | 4 | 5 | ... | 31 |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

**Key:** P = Present, A = Absent, L = Leave, S = Sick
`,
'warehouse-cleaning-checklist': `
# Daily Warehouse Cleaning Checklist
## [companyName]

**Date:** _________________
**Shift:** _________________
**Cleaned by:** _________________

| Area | Task | Done |
|---|---|---|
| Floors | Swept and cleared of debris | [ ] |
| Spills | All spills cleaned immediately | [ ] |
| Trash | Bins emptied | [ ] |
| Restrooms | Stocked and sanitized | [ ] |

**Supervisor Signature:** _________________________
`,
'refrigerator-temperature-logsheet': `
# Refrigerator Temperature Log - [fridgeId]
## [companyName]

**Month:** _________________
**Acceptable Range:** 1°C - 5°C

| Date | Time | Temp (°C) | Corrective Action | Checked by |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

**Manager Review Signature:** _________________________
`,
'food-safety-training-modules': `
# Food Safety Training Modules Overview
## [companyName]

This document outlines the core modules for our food safety training program.

### Module 1: Introduction to Food Safety
- The importance of food safety
- Types of food hazards (Biological, Chemical, Physical)

### Module 2: Personal Hygiene
- Handwashing procedures
- Illness policy and reporting

### Module 3: Temperature Control
- The "Danger Zone"
- Correct cooking, cooling, and reheating temperatures

### Module 4: Cross-Contamination Prevention
- Cleaning and sanitizing surfaces
- Storing food safely

**Acknowledgement of Training Content:**
I have received and understood the content of these training modules.

**Employee Name:** _________________________
**Signature:** _________________________
**Date:** _________________________
`,
'thermometer-verification-checklist': `
# Thermometer Verification Log
## [companyName]

**Method:** Ice Point (0°C) / Boiling Point (100°C)

| Date | Thermometer ID | Verification Temp (°C) | Reading (°C) | Pass/Fail | Action Taken | Verified By |
|---|---|---|---|---|---|---|
| | | | | | | |
| | | | | | | |

**Manager Signature:** _________________________
`,
'cleaning-checklist': `
# Cleaning Checklist - [area]
## [companyName]

**Date:** _________________
**Completed by:** _________________

| Task | Done | Notes |
|---|---|---|
| Empty bins | [ ] | |
| Wipe all surfaces | [ ] | |
| Sweep/vacuum floor | [ ] | |
| Mop floor | [ ] | |
| Clean windows/glass | [ ] | |

**Supervisor Signature:** _________________________
`,
'food-receiving-checklist': `
# Food Receiving Checklist
## [companyName]

**Supplier:** _________________
**Date:** _________________
**Checked by:** _________________

| Item | Check | Comments |
|---|---|---|
| Vehicle is clean and temperature correct | [ ] | |
| Packaging is intact, not damaged | [ ] | |
| No signs of pests | [ ] | |
| Food is within temperature specs | [ ] | |
| "Use By" dates are acceptable | [ ] | |

**Signature:** _________________________
`,
'bar-master-cleaning-schedule': `
# Bar Master Cleaning Schedule
## [companyName]

| Task | Daily | Weekly | Monthly |
|---|---|---|---|
| Wipe down bar tops & surfaces | ✓ | | |
| Clean beer lines | | ✓ | |
| Empty and clean ice machine | | ✓ | |
| Clean and sanitize speed rails | ✓ | | |
| Deep clean refrigerators | | | ✓ |
| Mop floors | ✓ | | |

**Manager Signature:** _________________________
`,
'bar-cleaning-checklist': `
# Bar Closing Cleaning Checklist
## [companyName]

**Date:** _________________
**Closed by:** _________________

| Task | Done |
|---|---|
| Wipe down bar and all surfaces | [ ] |
| Clean and sanitize sinks | [ ] |
| Wash all bar mats | [ ] |
| Empty trash and recycling | [ ] |
| Restock glassware and supplies | [ ] |
| Sweep and mop floor behind the bar | [ ] |

**Signature:** _________________________
`,
'food-safety-training-register': `
# Food Safety Training Register - [trainingTopic]
## [companyName]

**Date of Training:** _________________
**Trainer:** _________________

| Employee Name (Please Print) | Signature |
|---|---|
| | |
| | |
| | |

`,
'leave-register': `
# Leave Register - [year]
## [companyName]

| Employee Name | Leave Type | From Date | To Date | Total Days |
|---|---|---|---|---|
| | | | | |
`,
'voluntary-retrenchment-application': `
# Application for Voluntary Retrenchment
## [companyName]

**To:** [managerName] / HR Department
**From:** [employeeName]
**Date:** _________________

I, [employeeName], hereby wish to apply for voluntary retrenchment from my position as _________________________ at [companyName].

I understand that this application is subject to management approval and that, if accepted, my termination of employment will be subject to the terms discussed.

**Employee Signature:** _________________________
`,
'hr-bundle-package': `
# Complete HR Bundle Package Overview
## [companyName]

This document outlines the contents of the standard HR Bundle provided by [companyName].

### Included Documents:
- Employment Contract Template
- Disciplinary Code & Procedure
- Grievance Policy
- Leave Application Form
- Warning Templates (Verbal, Written, Final)
- Employee Details Form
- Exit Interview Form

This bundle provides the essential documents for compliant HR management.

**Issued to:** _________________________
**Date:** _________________________
`,
'employee-handbook-canva': `
# Employee Handbook Content for [companyName]
## Text for Canva Template

### Welcome from the CEO
A welcome message from [ceoName].

### Our Mission and Values
[Insert Mission and Values here]

### Key Policies (Summarized)
- Code of Conduct
- Leave Policy
- Health and Safety
- Disciplinary Procedure

**(Note: This generator provides the core text. Copy and paste this content into your branded Canva template for a professional finish.)**
`,
'anticipated-retrenchment-notice': `
# Notice of Anticipated Retrenchment (Section 189(3) Notice)
## [companyName]

**To:** All Affected Employees
**Date:** _________________

This notice serves to inform you that [companyName] is contemplating dismissals for operational requirements (retrenchment). We hereby invite you to consult with us on this matter.

The first consultation meeting will be held on:
**Date:** _________________
**Time:** _________________
**Venue:** _________________

**Management Representative:** _________________________
`,
'onboarding-checklist-canva': `
# Employee Onboarding Checklist Content
## For [companyName] - Text for Canva Template

**Employee:** [employeeName]
**Manager:** [managerName]

### First Day
- [ ] Office Tour
- [ ] Team Introductions
- [ ] Set up Workstation & IT Access
- [ ] Review Job Description

### First Week
- [ ] Explain Key Policies
- [ ] First 1-on-1 with Manager
- [ ] Assign First Task/Project

**(Note: Copy and paste this list into a visually appealing Canva checklist template.)**
`,
'employee-survey-canva': `
# Employee Survey Questions
## For [companyName] - Text for Canva Template

### Instructions
Please rate the following statements on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree).

- I feel valued at [companyName].
- I have the resources I need to do my job effectively.
- I see opportunities for growth and development here.
- I would recommend [companyName] as a great place to work.

### Open-ended Questions
- What do we do well?
- What could we improve?

**(Note: Use this text as the basis for a professional survey designed in Canva.)**
`,
'employee-review-canva': `
# Employee Performance Review Content
## For [companyName] - Text for Canva Template

**Employee:** [employeeName]
**Manager:** [managerName]

### Key Accomplishments
(Manager to complete)

### Areas for Development
(Manager to complete)

### Employee Comments
(Employee to complete)

### Goals for Next Period
(Collaboratively set)

**(Note: This provides the structure. Format it into a branded, professional review document in Canva.)**
`,
'daily-attendance-canva': `
# Daily Attendance Sheet
## For [companyName] - Text for Canva Template

**Date:** [date]

| Employee Name | Time In | Time Out | Signature |
|---|---|---|---|
| | | | |
| | | | |

**(Note: This is the basic structure. Use Canva to add your logo and branding for a printable daily sheet.)**
`,
'verbal-warning-afrikaans': `
# Rekord van Verbale Waarskuwing
## [companyName]

**Werknemer:** [employeeName]
**Bestuurder:** [managerName]
**Datum:** _________________

Hierdie dokument bevestig dat 'n verbale waarskuwing aan bogenoemde werknemer uitgereik is vir die volgende oortreding:
_________________________

Die vereiste verbetering is bespreek.

**Werknemer Handtekening:** _________________________
(Erken ontvangs)

**Bestuurder Handtekening:** _________________________
`,
'fixed-contract-ending-notice': `
# Notice of Fixed-Term Contract Expiry

**To:** [employeeName]
**From:** [managerName], [companyName]
**Date:** _________________

This letter serves to inform you that your fixed-term contract of employment with [companyName] will end on its scheduled expiry date of **_________________________**.

Your final salary and any outstanding leave pay will be paid to you.

We thank you for your contribution.

**Manager Signature:** _________________________
`,
'consultation-meeting-notice': `
# Notice of Consultation Meeting

**To:** [employeeName]
**From:** [managerName]
**Date:** _________________

You are hereby invited to attend a consultation meeting to discuss [Reason for meeting, e.g., proposed changes to your role, a potential retrenchment situation].

**Date:** _________________
**Time:** _________________
**Venue:** _________________

You have the right to be represented by a fellow employee.

**Manager Signature:** _________________________
`,
'grievance-investigation-notice': `
# Notice of Grievance Investigation

**To:** [employeeName]
**From:** [managerName]
**Date:** _________________

This notice confirms receipt of your grievance lodged on _________________.

Please be advised that the company will now commence a formal investigation into the matter. You will be kept informed of the progress and may be required for further meetings.

**Manager Signature:** _________________________
`,
'disciplinary-hearing-notice': `
# Notice to Attend a Disciplinary Hearing

**To:** [employeeName]
**From:** [managerName]
**Date:** _________________

You are required to attend a disciplinary hearing to answer to the following allegations of misconduct:
1. _________________________
2. _________________________

The hearing will be held on:
**Date:** _________________
**Time:** _________________
**Venue:** _________________
**Chairperson:** _________________________

You have the right to representation by a fellow employee.

**Manager Signature:** _________________________
`,
'incapacity-inquiry-general-notice': `
# Notice of Incapacity Inquiry

**To:** [employeeName]
**From:** [managerName]
**Date:** _________________

You are requested to attend an inquiry to investigate your capacity to meet the required work standards.
The purpose is to explore solutions to assist you in performing your duties.

**Date:** _________________
**Time:** _________________
**Venue:** _________________

**Manager Signature:** _________________________
`,
'incapacity-inquiry-ill-health-notice': `
# Notice of Incapacity Inquiry (Ill Health)

**To:** [employeeName]
**From:** [managerName]
**Date:** _________________

This is to invite you to an inquiry to discuss your prolonged absence from work due to ill health and to investigate your capacity to perform your duties.

**Date:** _________________
**Time:** _________________
**Venue:** _________________

You may be represented by a fellow employee.

**Manager Signature:** _________________________
`,
'poor-performance-inquiry-notice': `
# Notice of Poor Work Performance Inquiry

**To:** [employeeName]
**From:** [managerName]
**Date:** _________________

You are required to attend an inquiry to address concerns regarding your work performance, specifically related to:
_________________________

**Date:** _________________
**Time:** _________________
**Venue:** _________________

**Manager Signature:** _________________________
`,
'postponement-of-hearing-notice': `
# Notice of Postponement of Disciplinary Hearing

**To:** [employeeName]
**From:** [managerName]
**Date:** _________________

Please be advised that the disciplinary hearing scheduled for _________________ has been postponed.

The hearing will now take place on:
**New Date:** _________________
**Time:** _________________
**Venue:** _________________

**Manager Signature:** _________________________
`,
'observation-report': `
# Observation Report
## [companyName]

**Employee:** [employeeName]
**Observer:** [managerName]
**Date of Observation:** _________________

### Factual Observations
(Detail specific, factual observations of conduct or performance without judgement or opinion.)
________________________________________________________________
________________________________________________________________

**Observer Signature:** _________________________
**Date:** _________________________
`,
'staff-meeting-template': `
# Staff Meeting Minutes
## [companyName]

**Date:** [meetingDate]
**Attendees:** _________________________
**Apologies:** _________________________

### Agenda Items
1.  _________________________
2.  _________________________

### Discussion & Decisions
(Record key discussion points and decisions made for each agenda item.)
________________________________________________________________

### Action Items
| Task | Responsible Person | Deadline |
|---|---|---|
| | | |

**Minutes taken by:** _________________________
`,
'verbal-warning': `
# Record of Verbal Warning
## [companyName]

**Employee:** [employeeName]
**Manager:** [managerName]
**Date:** _________________

This serves to document that a verbal warning was issued to the above employee regarding the following transgression:
_________________________

The required standard of conduct/performance was clarified.

**Employee Signature:** _________________________
(Acknowledges receipt)

**Manager Signature:** _________________________
`,
'written-warning': `
# Written Warning

**To:** [employeeName]
**From:** [managerName]
**Date:** _________________

**Subject: Written Warning**

This is a formal written warning for the following misconduct / poor performance:
________________________________________________________________

This is a breach of company rules. Further instances may lead to more serious disciplinary action. This warning is valid for ____ months.

**Employee Signature:** _________________________
(Acknowledges receipt)

**Manager Signature:** _________________________
`,
'medical-report-template': `
# Confidential Medical Report Request
## [companyName]

**To be completed by the Medical Practitioner regarding:**
**Employee Name:** [employeeName]

Dear Doctor,
Could you please provide a report on the employee's fitness for work, considering their role as _________________________.

1.  **Nature of illness/injury:** _________________________
2.  **Prognosis and likely duration of absence:** _________________________
3.  **Is the employee able to perform their duties? (If not, specify limitations):** _________________________

**Practitioner's Signature:** _________________________
**Date:** _________________________
`,
'grievance-decision-form': `
# Grievance Outcome Form
## [companyName]

**Regarding Grievance Lodged by:** [employeeName]
**Date of Decision:** _________________
**Decision Maker:** [managerName]

### Summary of Grievance
________________________________________________________________

### Findings and Decision
(Detail the outcome of the investigation and the final decision.)
________________________________________________________________

The employee has the right to appeal this decision.

**Signature:** _________________________
`,
'poor-performance-meeting-minutes': `
# Minutes of Poor Performance Meeting
## [companyName]

**Employee:** [employeeName]
**Manager:** [managerName]
**Date:** _________________

### Issues Discussed
(Detail the specific areas of poor performance addressed.)
________________________________________________________________

### Employee's Response
________________________________________________________________

### Agreed Action Plan
(List the steps to be taken for improvement and set a review date.)
1. _________________________
**Review Date:** _________________

**Employee Signature:** _________________________
**Manager Signature:** _________________________
`,
'final-warning-hearing-held': `
# Final Written Warning (Following a Disciplinary Hearing)
## [companyName]

**To:** [employeeName]
**From:** [managerName] (Chairperson of Hearing)
**Date:** _________________

This serves as a final written warning following the disciplinary hearing held on _________________, where you were found guilty of misconduct.

Should any further transgression occur, it will likely lead to the termination of your employment. This warning is valid for 12 months.

**Chairperson Signature:** _________________________
**Employee Signature (Receipt):** _________________________
`,
'incident-investigation-report': `
# Accident / Incident Investigation Report
## [companyName]

**Date of Investigation:** _________________
**Investigator:** _________________

### Incident Details
**Date of Incident:** _________________
**Person(s) Involved:** _________________
**Description:** _________________________

### Root Cause Analysis
(What were the underlying causes of the incident?)
________________________________________________________________

### Recommended Corrective Actions
1. _________________________
2. _________________________

**Investigator Signature:** _________________________
`,
'incident-report': `
# Accident / Incident Report Form
## [companyName]

**To be completed immediately after any workplace incident.**

**Person Reporting:** _________________________
**Date of Incident:** _________________
**Time:** _________________
**Location:** _________________

**Person(s) Involved:**
_________________________

**Detailed Description of what happened:**
________________________________________________________________
________________________________________________________________

**Witnesses (if any):**
_________________________

**Signature:** _________________________
**Date:** _________________________
`,
'certificate-of-service': `
# Certificate of Service
## [companyName]

This is to certify that:

**[employeeName]**

Was employed by **[companyName]**

From: **[employeeStartDate]**
To: **[employeeEndDate]**

The employee's position upon termination of service was:
**[employeePosition]**

Reason for termination of service: **[reasonForTermination]**

---
**Signed by:**

_________________________
**[managerName]**
(Manager/Director)
**Date:** _________________
`,
'termination-letter': `
# Letter of Termination

**Date:** _________________

**To:**
[employeeName]
[Employee Address]

**From:**
[managerName]
[companyName]

**Subject: Notice of Termination of Employment**

Dear [employeeName],

This letter serves to confirm the termination of your employment with [companyName], effective **[terminationDate]**.

This decision is based on: [reasonForTermination].

You will be required to serve your contractual notice period of **[noticePeriod]**. Your last working day will be **[terminationDate]**.

Details regarding your final salary, outstanding leave pay, and other statutory payments will be provided to you separately.

We wish you the best in your future endeavours.

Sincerely,

_________________________
**[managerName]**
For [companyName]
`,
'resignation-acceptance-letter': `
# Acceptance of Resignation

**Date:** _________________

**To:**
[employeeName]

**From:**
[managerName]
[companyName]

**Subject: Acknowledgement and Acceptance of Resignation**

Dear [employeeName],

This letter is to formally acknowledge receipt of your letter of resignation on **[resignationDateReceived]**.

We accept your resignation and confirm that your last day of employment with [companyName] will be **[lastWorkingDay]**.

We will be in contact shortly to arrange a handover process and an exit interview.

We thank you for your service and wish you well for the future.

Sincerely,

_________________________
**[managerName]**
For [companyName]
`,
'payroll-processing-checklist': `
# Payroll Processing Checklist
## [companyName] - [payPeriod]

| Task | Status (Done/NA) | Notes |
|---|---|---|
| **PRE-PROCESSING** | | |
| Confirm all new hires are on the system | | |
| Confirm all terminations are processed | | |
| Verify and input all leave taken | | |
| Verify and input all approved overtime | | |
| Verify all salary changes/increases | | |
| Check for any ad-hoc deductions/allowances | | |
| **PROCESSING** | | |
| Run provisional payroll | | |
| Reconcile payroll with previous month | | |
| Get final payroll report approved | | |
| Process final payroll | | |
| **POST-PROCESSING** | | |
| Distribute payslips to employees | | |
| Submit EMP201 (PAYE, SDL, UIF) to SARS | | |
| Submit UIF Declaration to Dept. of Labour | | |
| Make payments to third parties (e.g., medical aid) | | |

**Processed by:** [processedBy]
**Date:** _________________

**Reviewed by:** _________________
**Date:** _________________
`,
};

export const FORM_ENRICHMENT_PROMPTS: Partial<Record<FormType, string>> = {
  'job-application': "Add a POPIA consent clause at the end, before the signature. It should state: 'By submitting this application, you consent to [companyName] processing your personal information for recruitment purposes in accordance with the Protection of Personal Information Act (POPIA).'",
  'employee-details': "Add a note under the declaration stating: 'Please inform the HR Department of any changes to these details as soon as possible. Your personal information is kept confidential and managed in line with the company's POPIA policy.'",
  'leave-application': "Add a clear note for the employee: 'Please note that submission of this form is a request and is not an approval of leave. Leave is only confirmed once this form has been signed by your manager and returned to you.'",
  'final-written-warning': "Make the section on the employee's rights more prominent. Add a 'Your Rights' section that clearly states: 'You have the right to appeal this decision within five (5) working days. Please refer to the company's Disciplinary Policy for the full appeal procedure.' Also clarify that signing the form acknowledges receipt, not necessarily agreement with the content.",
  'exit-interview': "Add a confidentiality statement at the top of the form, such as: 'Thank you for your contribution to [companyName]. Your honest feedback is valuable and will be kept confidential. It will be used solely for the purpose of improving our employee experience.'",
  'grievance-form': "Include a procedural note for the employee: 'Upon submission, the HR Department will acknowledge receipt of your grievance within two (2) working days and will outline the next steps in the Grievance Procedure.'",
  'job-description': "Add a concluding sentence to the 'Key Responsibilities' section: 'This job description is not exhaustive and may be amended from time to time to meet the changing needs of the business. The employee may be required to perform other related duties as assigned.'",
  'leave-application-maternity': "Add a 'Notes for Employee' section with these crucial points: 1. As per the BCEA, you must submit this application at least four weeks before your intended start date. 2. Maternity benefits are claimed from the Unemployment Insurance Fund (UIF), not the company. HR will provide you with the necessary UI-2.3 and other forms to submit to the Department of Labour.",
  'disciplinary-enquiry-report': "Include a concluding statement: 'A copy of this report will be placed in the employee's personnel file. The employee will be provided with a copy for their own records.'",
  'suspension-notice': "Emphasise that the suspension is precautionary. Add the line: 'Please note that this is a precautionary suspension on full pay and does not constitute a finding of guilt. The purpose is to allow for a fair and unimpeded investigation into the allegations.'",
  'appeal-form': "Provide guidance on what information to include. Add a note: 'To ensure a fair appeal, please provide clear and detailed reasons for your appeal. You may attach additional pages or new evidence to this form if necessary.'",
  'expense-claim': "Add a compliance note: 'All claims must be submitted in accordance with the company's Expense Reimbursement Policy. Please ensure original, itemised receipts are attached for all expenses claimed.'",
  'employee-training-agreement': "Add a clause regarding successful completion: 'This agreement is contingent upon the employee's successful completion of the training course. The company reserves the right to review the terms of this agreement should the employee fail to complete the training.'",
  'reference-check': "Add a compliance reminder for the person conducting the check: 'Important: Before conducting this reference check, ensure you have a signed consent form from the candidate authorizing you to do so, in compliance with POPIA.'",
  'retrenchment-notice': "Include a note about employee support: 'We understand that this is a difficult time. We would like to remind you that confidential counselling and support services are available through our Employee Assistance Programme (EAP). Please contact HR for details.'",
  'job-advertisement': "Add an Employment Equity statement at the end of the advertisement: '[companyName] is an equal opportunity employer. In accordance with our Employment Equity Plan, preference may be given to candidates from the designated groups.'",
  'interview-guide': "Add a 'Legal Reminder for Interviewers' section: 'Ensure all questions are strictly job-related and non-discriminatory. Avoid questions about age, marital status, family status, race, religion, or any other protected characteristic under the Employment Equity Act.'",
  'candidate-evaluation': "Add a note on objectivity: 'This evaluation must be based on objective, job-related criteria demonstrated during the interview process. This ensures a fair, consistent, and legally defensible selection decision.'",
  'onboarding-checklist': "Add a welcome statement at the top: 'Welcome to the team! This checklist is designed to help you have a smooth and successful start at [companyName].'",
  'confidentiality-agreement': "Explicitly state that the obligation continues after employment ends. Add a clause like: 'This obligation of confidentiality shall remain in effect indefinitely, even after the termination of your employment with [companyName].'",
  'restraint-of-trade': "Add a statement of acknowledgement: 'The employee acknowledges that the terms of this restraint are fair and reasonably necessary to protect the company's legitimate business interests.'",
  'performance-review': "Frame the review as a two-way discussion. Add an introductory note: 'This performance review is a collaborative process and a two-way conversation. It is an opportunity to discuss your achievements, challenges, and career aspirations at [companyName].'",
  'salary-bank-details': "Include a security and privacy note: 'This information is strictly confidential and will be used solely for payroll purposes in accordance with the Protection of Personal Information Act (POPIA).'",
  'overtime-claim': "Add a note about payment rates and policy: 'Approved overtime will be compensated in accordance with the company's Working Hours Policy and the rates prescribed by the Basic Conditions of Employment Act (BCEA).'",
  'employment-contract': "Add a clause stating that the contract is subject to the company's policies and procedures, which may be amended from time to time. Also include a POPIA consent clause for processing employee information for HR and payroll purposes.",
  'permission-for-deductions': "Add a legal note for the employee: 'Please note: As per the Basic Conditions of Employment Act, deductions from your salary (other than statutory deductions) are only lawful with your written consent. The total deduction cannot exceed 25% of your total remuneration in cash. By signing this form, you confirm that you agree to this deduction freely and voluntarily.'",
  'workplace-skills-plan': "Add an introductory paragraph explaining the purpose of the WSP, which is to outline the company's plan to develop its employees' skills in line with its operational needs and the National Skills Development Strategy. Mention that its submission is a requirement for claiming back a portion of the Skills Development Levy (SDL).",
  'annual-training-report': "Add an introductory paragraph explaining that the ATR is a factual report on the training and skills development that took place during the specified period. It must be submitted along with the WSP to the relevant SETA.",
  'staff-grooming-checklist': "Add a reference note: 'This checklist is a summary of our grooming standards. For full details, please refer to the company's Dress Code and Personal Appearance Policy.'",
  'warehouse-master-cleaning-checklist': "Add a Health & Safety note: 'Safety First: Always use the required Personal Protective Equipment (PPE) when handling cleaning chemicals. Report any safety hazards to your supervisor immediately.'",
  'master-cleaning-schedule': "Add a compliance note: 'Consistent completion of this schedule is essential for maintaining a clean, safe, and hygienic work environment for all employees and visitors.'",
  'food-dispatch-checklist': "Add a compliance statement: 'Accurate completion of this checklist is critical for ensuring product quality and compliance with food safety regulations (e.g., R638).'",
  'attendance-register': "Add a note regarding its purpose: 'This register is the official record for calculating monthly payroll and tracking attendance. Please ensure it is completed accurately and daily.'",
  'warehouse-cleaning-checklist': "Add a safety reminder: 'Always use the correct cleaning chemicals for the task and wear the appropriate Personal Protective Equipment (PPE).'",
  'refrigerator-temperature-logsheet': "Add a critical instruction: 'Important: If any temperature reading is outside the acceptable range (1°C - 5°C), you must report it to a supervisor immediately and document the corrective action taken.'",
  'food-safety-training-modules': "Add a record-keeping instruction: 'Upon completion of the training, a signed copy of the acknowledgement must be placed in the employee's personnel file as a record of training.'",
  'thermometer-verification-checklist': "Add a note on importance: 'Regular verification of thermometers is a critical control point for ensuring food safety. Any thermometer that fails verification must be removed from service immediately.'",
  'cleaning-checklist': "Add a note for the supervisor: 'Supervisor's Check: Please ensure all tasks have been completed to the required standard before signing off.'",
  'food-receiving-checklist': "Add a critical instruction: 'Do not accept any delivery that does not meet these standards. Immediately notify your supervisor of any rejected deliveries.'",
  'bar-master-cleaning-schedule': "Add a note about hygiene: 'Maintaining this cleaning schedule is essential for customer safety and compliance with health and liquor licensing regulations.'",
  'bar-cleaning-checklist': "Add a note for the closing staff: 'Completing this checklist thoroughly ensures the bar is ready for the next shift and maintains our standard of hygiene.'",
  'food-safety-training-register': "Add a purpose statement: 'This register serves as the official record of food safety training and must be available for inspection by health officials.'",
  'leave-register': "Add a note on its use: 'This register provides an overview for workforce planning and should be reconciled monthly against individual leave application forms.'",
  'voluntary-retrenchment-application': "Add a disclaimer: 'Please note: Submission of this form is an expression of interest and does not guarantee acceptance. The company will review all applications based on operational requirements.'",
  'hr-bundle-package': "Add a disclaimer: 'This template provides a general overview. The actual documents within the bundle must be customized with your company's specific details before implementation.'",
  'employee-handbook-canva': "Add a crucial instruction: 'This generated text is a starting point. It is essential that you review and customize the content to accurately reflect your company's specific policies, procedures, and culture before finalizing your design in Canva.'",
  'anticipated-retrenchment-notice': "Clarify the legal context: 'This notice is issued in terms of Section 189(3) of the Labour Relations Act, 66 of 1995. It is the first step in a formal consultation process and is not a notice of termination.'",
  'onboarding-checklist-canva': "Add a welcome note for the content: 'Welcome to the team! Use this checklist to create a visually engaging onboarding experience in Canva that ensures every new hire feels prepared and supported.'",
  'employee-survey-canva': "Add a note about anonymity: 'To encourage honest feedback, consider making the survey anonymous. This text can be used to create a printable or digital survey in Canva.'",
  'employee-review-canva': "Add a note on best practice: 'For a constructive review, focus on specific examples and collaborative goal-setting. Use this content to build a professional-looking review form in Canva.'",
  'daily-attendance-canva': "Add a note on its use: 'This attendance sheet is a key document for payroll. Use Canva to add your company logo and create a printable, professional-looking register.'",
  'verbal-warning-afrikaans': "Add a note in Afrikaans clarifying its purpose: 'Hierdie dokument is 'n formele rekord en die eerste stap in die progressiewe dissiplinêre proses. Die doel is regstellend, nie bestraffend nie.' (This document is a formal record and the first step in the progressive disciplinary process. The purpose is corrective, not punitive.)",
  'fixed-contract-ending-notice': "Add a procedural note: 'Please ensure all company property (e.g., laptop, keys, ID card) is returned to the HR department on or before your last day of employment.'",
  'consultation-meeting-notice': "Clarify the purpose of the meeting: 'The goal of this consultation is to engage in a meaningful, joint consensus-seeking process regarding the matter at hand.'",
  'grievance-investigation-notice': "Add a note about the process: 'The investigation will be conducted in a fair, impartial, and confidential manner. You will be kept informed of the progress and notified of the outcome.'",
  'disciplinary-hearing-notice': "Add a critical instruction: 'You must prepare for the hearing and may bring any evidence or witnesses you wish to present. Failure to attend without a valid reason may result in the hearing proceeding in your absence.'",
  'incapacity-inquiry-general-notice': "Distinguish from a disciplinary hearing: 'Please note that this is an inquiry to investigate challenges you may be facing, not a disciplinary hearing. The objective is to understand the situation and explore possible supportive solutions.'",
  'incapacity-inquiry-ill-health-notice': "Add a note on medical information: 'You may be requested to provide relevant medical information to help the company understand your condition and explore potential accommodations. This information will be kept strictly confidential.'",
  'poor-performance-inquiry-notice': "Clarify the objective: 'The purpose of this inquiry is to address the performance concerns in a constructive manner and to develop a plan to support you in meeting the required standards. This is not a disciplinary hearing.'",
  'postponement-of-hearing-notice': "Add a note for the employee: 'Please acknowledge receipt of this notice. All your rights regarding the hearing remain reserved until the new date.'",
  'observation-report': "Add a guidance note for the observer: 'This report must contain only objective, factual observations of conduct or performance (i.e., what you saw and heard). Avoid subjective opinions, interpretations, or assumptions.'",
  'staff-meeting-template': "Add a best-practice note: 'Action Items should be specific, measurable, assigned to an individual, realistic, and time-bound (SMART). Minutes should be distributed to all attendees within 48 hours.'",
  'verbal-warning': "Clarify the purpose: 'This document serves as a formal record that a verbal warning was issued. It is the first step in the disciplinary process, and its purpose is corrective, not punitive.'",
  'written-warning': "Add context: 'This written warning is valid for a period of six (6) months. Should similar misconduct or performance issues occur during this period, more serious disciplinary action, such as a final written warning, may be taken.'",
  'medical-report-template': "Add a note for the doctor: 'This information is required to assess the employee's fitness for work and to determine if any reasonable accommodations can be made in the workplace, as per the Labour Relations Act. All information will be kept confidential.'",
  'grievance-decision-form': "Add a note on further recourse: 'If you are not satisfied with this outcome, you may have the right to refer the matter to the CCMA. Please refer to your Grievance Policy for the full procedure.'",
  'poor-performance-meeting-minutes': "Add a follow-up note: 'The agreed-upon action plan will be monitored. A follow-up meeting has been scheduled for [Review Date] to assess progress.'",
  'final-warning-hearing-held': "Clarify the severity: 'A final written warning is the last step before a dismissal may be considered for any future transgressions of the company's code of conduct. This warning is valid for twelve (12) months.'",
  'incident-investigation-report': "State the primary goal: 'The primary purpose of this investigation is not to assign blame, but to identify the root cause(s) of the incident and to implement effective corrective actions to prevent a recurrence.'",
  'incident-report': "Add an urgency note: 'This form must be completed as soon as is reasonably possible after an incident occurs to ensure that the details are recorded accurately. It is the first step in the company's safety and incident management procedure.'",
  'certificate-of-service': "Add a compliance note: 'As per the Basic Conditions of Employment Act (BCEA), an employer is legally required to provide a Certificate of Service to an employee upon termination of employment.'",
  'termination-letter': "Add a procedural note: 'Please ensure all company property is returned on or before your last day. You will also be provided with the necessary UI-19 form for UIF purposes.'",
  'resignation-acceptance-letter': "Add a note on next steps: 'The HR department will contact you to schedule an exit interview and to provide details regarding the final handover of your duties and company property.'",
  'payroll-processing-checklist': "Add a compliance reminder: 'Ensure you are using the latest SARS tax tables and UIF/SDL contribution thresholds for the current financial year. Deadlines for EMP201 submissions and payments are critical to avoid penalties.'",
};