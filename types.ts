
import type React from 'react';

export type PolicyType =
  | 'leave'
  | 'disciplinary'
  | 'grievance'
  | 'health-and-safety'
  | 'master'
  | 'byod'
  | 'cell-phone'
  | 'certification'
  | 'code-of-ethics'
  | 'communication-retention'
  | 'data-usage-popia'
  | 'electronic-communications'
  | 'resignation'
  | 'security'
  | 'sexual-harassment'
  | 'standby'
  | 'telephone-usage'
  | 'time-off'
  | 'travel'
  | 'company-property'
  | 'visitor'
  | 'remote-hybrid-work'
  | 'eeo-diversity'
  | 'attendance-punctuality'
  | 'employee-conduct'
  | 'data-protection-privacy'
  | 'disciplinary-action'
  | 'whistleblower'
  | 'compensation-benefits'
  | 'performance-management'
  | 'workplace-wellness'
  | 'it-cybersecurity'
  | 'social-media'
  | 'confidentiality'
  | 'employee-separation'
  | 'anti-harassment-discrimination'
  | 'company-vehicle'
  | 'expense-reimbursement'
  | 'employment-equity'
  | 'coida'
  | 'uif'
  | 'recruitment-selection'
  | 'working-hours'
  | 'training-development'
  | 'anti-bribery-corruption'
  | 'dress-code'
  | 'alcohol-drug'
  | 'termination-of-employment'
  | 'retrenchment'
  // New policies
  | 'deductions'
  | 'anti-bullying'
  | 'it-access-security'
  | 'employee-handbook'
  // New policies from list
  | 'conflict-of-interest'
  | 'records-retention-destruction'
  | 'salary-structure-guide';

export type FormType =
  | 'job-application'
  | 'leave-application'
  | 'final-written-warning'
  | 'exit-interview'
  | 'grievance-form'
  | 'employee-details'
  | 'job-description'
  | 'leave-application-maternity'
  | 'disciplinary-enquiry-report'
  | 'suspension-notice'
  | 'appeal-form'
  | 'expense-claim'
  | 'employee-training-agreement'
  | 'reference-check'
  | 'retrenchment-notice'
  | 'job-advertisement'
  | 'interview-guide'
  | 'candidate-evaluation'
  | 'onboarding-checklist'
  | 'confidentiality-agreement'
  | 'restraint-of-trade'
  | 'performance-review'
  | 'salary-bank-details'
  | 'overtime-claim'
  // New Forms
  | 'employment-contract'
  | 'permission-for-deductions'
  | 'workplace-skills-plan'
  | 'annual-training-report'
  | 'staff-grooming-checklist'
  | 'warehouse-master-cleaning-checklist'
  | 'master-cleaning-schedule'
  | 'food-dispatch-checklist'
  | 'attendance-register'
  | 'warehouse-cleaning-checklist'
  | 'refrigerator-temperature-logsheet'
  | 'food-safety-training-modules'
  | 'thermometer-verification-checklist'
  | 'cleaning-checklist'
  | 'food-receiving-checklist'
  | 'bar-master-cleaning-schedule'
  | 'bar-cleaning-checklist'
  | 'food-safety-training-register'
  | 'leave-register'
  | 'voluntary-retrenchment-application'
  | 'hr-bundle-package'
  | 'employee-handbook-canva'
  | 'anticipated-retrenchment-notice'
  | 'onboarding-checklist-canva'
  | 'employee-survey-canva'
  | 'employee-review-canva'
  | 'daily-attendance-canva'
  | 'verbal-warning-afrikaans'
  | 'fixed-contract-ending-notice'
  | 'consultation-meeting-notice'
  | 'grievance-investigation-notice'
  | 'disciplinary-hearing-notice'
  | 'incapacity-inquiry-general-notice'
  | 'incapacity-inquiry-ill-health-notice'
  | 'poor-performance-inquiry-notice'
  | 'postponement-of-hearing-notice'
  | 'observation-report'
  | 'staff-meeting-template'
  | 'verbal-warning'
  | 'written-warning'
  | 'medical-report-template'
  | 'grievance-decision-form'
  | 'poor-performance-meeting-minutes'
  | 'final-warning-hearing-held'
  | 'incident-investigation-report'
  | 'incident-report'
  // New forms from list
  | 'certificate-of-service'
  | 'termination-letter'
  | 'resignation-acceptance-letter'
  | 'payroll-processing-checklist';

export type InputType = 'text' | 'number' | 'textarea' | 'select' | 'checkbox';

export interface Question {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  tip?: string;
  conditional?: (answers: FormAnswers) => boolean;
  options?: Array<{ id: string; label: string; }>;
}

interface Document {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: Question[];
}

export interface Policy extends Document {
  kind: 'policy';
  type: PolicyType;
  industries?: string[];
}

export interface Form extends Document {
  kind: 'form';
  type: FormType;
  outputFormat?: 'word' | 'excel';
}

export type CompanyProfile = {
  companyName: string;
  industry: string; // Industry is mandatory for policies, but we can make it optional at type level and enforce in logic
}

export type FormAnswers = Record<string, any>;

export type AppStatus = 'idle' | 'loading' | 'success' | 'error';

export interface Source {
  web?: {
    uri: string;
    title: string;
  };
}

// Types for the Policy Updater feature
export interface PolicyUpdateChange {
  changeDescription: string;
  reason: string;
  originalText?: string;
  updatedText: string;
}

export interface PolicyUpdateResult {
  updatedPolicyText: string;
  changes: PolicyUpdateChange[];
}
