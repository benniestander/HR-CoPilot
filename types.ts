import type React from 'react';

// ... (Existing types remain unchanged)

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
  | 'salary-structure-guide'
  | 'workplace-language'
  | 'family-responsibility-leave';

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
  | 'payroll-processing-checklist'
  | 'confidentiality-ip-agreement';

export type InputType = 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';

export interface Question {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  tip?: string;
  conditional?: (answers: FormAnswers) => boolean;
  options?: Array<{ id: string; label: string; }>;
  required?: boolean;
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
  price: number; // Price in cents
}

export interface Form extends Document {
  kind: 'form';
  type: FormType;
  outputFormat?: 'word' | 'excel';
  price: number; // Price in cents
}

export type CompanyProfile = {
  companyName: string;
  industry: string;
  address?: string;
  companyUrl?: string;
  summary?: string;
  companySize?: string;
}

export type Transaction = {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number; // in cents, positive for deposits, negative for deductions
  userId?: string; // Added for admin transaction log
  userEmail?: string; // Added for admin transaction log
};

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // Percentage (0-100) or Fixed Amount in Cents
  maxUses: number | null;
  usedCount: number;
  expiryDate: string | null; // ISO string
  active: boolean;
  applicableTo: 'all' | 'plan:pro' | 'plan:payg'; // Target audience
  createdAt: string;
};

export type User = {
  uid: string;
  email: string;
  profile: CompanyProfile;
  name?: string;
  contactNumber?: string;
  photoURL?: string;
  plan: 'payg' | 'pro';
  creditBalance: number; // in cents
  transactions: Transaction[];
  createdAt: string; // ISO string
  isAdmin?: boolean;
};

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

export interface PolicyDraft {
  id: string;
  originalDocId: string;
  originalDocTitle: string;
  originalContent: string;
  updateResult: PolicyUpdateResult;
  selectedIndices: number[];
  manualInstructions?: string;
  updatedAt: string;
  createdAt: string;
}

export interface ComplianceChecklistItem {
  name: string;
  reason: string;
}

export interface ComplianceChecklistResult {
  policies: ComplianceChecklistItem[];
  forms: ComplianceChecklistItem[];
}

// Type for storing generated documents in state for the dashboard
export interface GeneratedDocument {
  id: string;
  title: string;
  kind: 'policy' | 'form';
  type: PolicyType | FormType;
  content: string; // The generated markdown/text
  createdAt: string; // ISO string for simplicity
  companyProfile: CompanyProfile;
  questionAnswers: FormAnswers;
  outputFormat?: 'word' | 'excel';
  sources?: Source[];
  version: number;
  history?: Array<{
    version: number;
    createdAt: string;
    content: string;
  }>;
}

export type AdminActionLog = {
  id: string;
  timestamp: string; // ISO String
  adminEmail: string;
  action: string; // e.g., "Updated User Profile", "Adjusted Credit"
  targetUserId: string;
  targetUserEmail: string;
  details?: Record<string, any>; // e.g., { from: 'payg', to: 'pro' } or { amount: 5000, reason: 'Goodwill gesture' }
};

export type AdminNotification = {
  id: string;
  timestamp: string; // ISO String
  type: 'new_user' | 'payment_failed' | 'important_update' | 'password_reset_request';
  message: string;
  isRead: boolean;
  relatedUserId?: string;
};

export type UserFile = {
  id: string;
  name: string;
  notes: string;
  size: number;
  storagePath: string;
  createdAt: string; // ISO string
};

// PRICING TYPES
export type AppSetting = {
  key: string;
  value: any;
  description?: string;
};

export type DocumentPrice = {
  docType: PolicyType | FormType;
  price: number; // in cents
  category: 'policy' | 'form';
};

// INVOICE REQUEST TYPE
export interface InvoiceRequest {
    id: string; // Notification ID
    date: string;
    userId: string;
    userEmail: string; // Extracted from message or fetched
    type: 'pro' | 'payg';
    amount: number; // in cents
    reference: string;
    description: string;
}