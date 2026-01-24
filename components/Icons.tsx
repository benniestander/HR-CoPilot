
import React from 'react';

// This is a base component to create a dual-tone effect using CSS currentColor
// It allows for a consistent, modern, and theme-aware icon style.
const DuotoneIcon: React.FC<{ paths: [string, string], className?: string, viewBox?: string }> =
  ({ paths, className, viewBox = "0 0 24 24" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path opacity="0.4" d={paths[0]} />
      <path d={paths[1]} />
    </svg>
  );

const OutlineIcon: React.FC<{ path: string, className?: string }> = ({ path, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);


// --- Policy Icons ---

// NEW PREMIUM POLICY ICON: Document with a Shield (Protection/Compliance)
export const MasterPolicyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    // Soft Fill: The Document shape
    "M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z",
    // Sharp Detail: The Shield Emblem
    "M12 7a1 1 0 00-1 1v.5a.5.5 0 00.5.5h1a.5.5 0 00.5-.5V8a1 1 0 00-1-1zm0 0c-2.5 0-4 1.5-4 4v2c0 3.5 2.5 5.5 4 6 1.5-.5 4-2.5 4-6v-2c0-2.5-1.5-4-4-4z"
  ]} />
);

// NEW PREMIUM FORM ICON: Document with Input Fields (Interactive/Action)
export const FormsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    // Soft Fill: Document with a folded corner hint
    "M16 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V6l-4-4z",
    // Sharp Detail: Input Boxes and Lines
    "M8 8h8v2H8V8zm0 4h5v2H8v-2zm0 4h8v2H8v-2z"
  ]} />
);

export const AlcoholDrugIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M19 10h-2V7a3 3 0 00-3-3H8a3 3 0 00-3 3v3H3v2h2v7a3 3 0 003 3h8a3 3 0 003-3v-7h2v-2z",
    "M10 9V7h4v2m-4 4h4m-4 4h4"
  ]} />
);

export const AntiBriberyCorruptionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 2a5 5 0 100 10 5 5 0 000-10zm0 3a2 2 0 110 4 2 2 0 010-4z",
    "M19 14h-2.5l-2.5-3-2.5 3H9a2 2 0 00-2 2v6h14v-6a2 2 0 00-2-2zM12 16v2m-2-2h4"
  ]} />
);

export const AntiBullyingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M12 11a3 3 0 100-6 3 3 0 000 6zm-2 4h4v-1a2 2 0 00-4 0v1z"
  ]} />
);

export const AntiHarassmentDiscriminationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M16 11V7a4 4 0 00-8 0v4H6v10h12V11h-2z",
    "M12 11a2 2 0 100-4 2 2 0 000 4zm-2 6h4"
  ]} />
);

export const AttendancePunctualityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z",
    "M12 6v6l4 2"
  ]} />
);

export const ByodIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z",
    "M7 6v12h10V6H7zM3 8a1 1 0 011-1h1v10H4a1 1 0 01-1-1V8zm18 0a1 1 0 00-1-1h-1v10h1a1 1 0 001-1V8z"
  ]} />
);

export const CellPhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z",
    "M7 4v14h10V4H7zm5 14a1 1 0 100-2 1 1 0 000 2zM11 5h2"
  ]} />
);

export const CertificationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 7H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2z",
    "M9 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm4 12a3 3 0 10-6 0 3 3 0 006 0z"
  ]} />
);

export const CodeOfEthicsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 10a2.5 2.5 0 01-5 0h5zm0 0a2.5 2.5 0 005 0h-5zm0 4a2.5 2.5 0 01-5 0h5zm0 0a2.5 2.5 0 005 0h-5z"
  ]} />
);

export const CoidaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M20 7H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z", "M12 4a1 1 0 011 1v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H9a1 1 0 010-2h2V5a1 1 0 011-1z"
  ]} />
);

export const CommunicationRetentionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 7V5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2v-2",
    "M22 7l-8.5 5.5L4 7m12 11a4 4 0 10-8 0 4 4 0 008 0zm-1-1l-2-1.5V14"
  ]} />
);

export const CompanyPropertyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M2 8v11a2 2 0 002 2h16a2 2 0 002-2V8",
    "M22 8l-10-6L2 8v1h20V8zM14 16a2 2 0 10-4 0h4z"
  ]} />
);

export const CompanyVehicleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M19 14H5a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 01-2-2z", "M6 18a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"
  ]} />
);

export const CompensationBenefitsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M10 7H4v10h6", "M12 5a3 3 0 013 3v8a3 3 0 01-3 3h-2v-2V7h2a3 3 0 013-3v1a2 2 0 100 4v2a2 2 0 100 4v1a3 3 0 01-3 3H5m14-3a3 3 0 100-6 3 3 0 000 6z"
  ]} />
);

export const ConfidentialityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 15a3 3 0 00-3 3h6a3 3 0 00-3-3zm1-3a1 1 0 10-2 0v1h2v-1zM10 7h4"
  ]} />
);

export const DataProtectionPrivacyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 8.5V6a6 6 0 10-12 0v2.5", "M12 13a3 3 0 00-3 3v2a3 3 0 006 0v-2a3 3 0 00-3-3zm0 2a1 1 0 110 2 1 1 0 010-2zM6 9h12v1a6 6 0 01-12 0V9z"
  ]} />
);

export const DataUsageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3", "M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5m0-1c0-1.66-4.03-3-9-3S3 2.34 3 4"
  ]} />
);

export const DeductionsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M9 12h6"
  ]} />
);

export const DisciplinaryActionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M20 2h-9L4 9l7 7 9-9V2z",
    "M14 6l-3 3m7 5l-2 2-7-7 2-2 7 7z"
  ]} />
);

export const DisciplinaryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M21 14H3a1 1 0 00-1 1v2a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1z",
    "M12 3.236l8.364 4.182A2 2 0 0121 9.236V12h-3v-2.764l-6-3-6 3V12H3V9.236a2 2 0 01.636-1.818L12 3.236zM13 14v-2a1 1 0 00-2 0v2h2z"
  ]} />
);

export const DressCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17.5 10.5l-3.5-2-2-4h-4l-2 4-3.5 2L8 16h8l-1.5-5.5z", "M16 17H8l-2 4h12l-2-4z"
  ]} />
);

export const EeoDiversityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 19v-2a3 3 0 00-3-3h-2.5", "M7 19v-2a3 3 0 013-3h2M12 11a3 3 0 100-6 3 3 0 000 6zm-7-2a3 3 0 100-6 3 3 0 000 6zm14 0a3 3 0 100-6 3 3 0 000 6z"
  ]} />
);

export const ElectronicCommunicationsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z", "M12 19H4a1 1 0 000 2h16a1 1 0 000-2h-8z"
  ]} />
);

export const EmployeeConductIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 12a4 4 0 100-8 4 4 0 000 8zM16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2",
    "M18 10l-1.5 5h-9L6 10h12z"
  ]} />
);

export const EmployeeSeparationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M14 4a2 2 0 00-2-2H6a2 2 0 00-4 2v16a2 2 0 002 2h6a2 2 0 002-2v-5",
    "M17 14l4-4-4-4m3 4H9"
  ]} />
);

export const EmploymentEquityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M21 6H3m18 0l-2 12H5L3 6", "M12 3L4 6h16L12 3zm0 17a3 3 0 003-3H9a3 3 0 003 3z"
  ]} />
);

export const ExpenseReimbursementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z", "M12 16a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 110-4 2 2 0 010 4zM10 7h4"
  ]} />
);

export const GrievanceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M3 6l9 6 9-6v12H3V6z",
    "M3 6h18"
  ]} />
);

export const HealthSafetyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M14 11h-2v-2a1 1 0 00-2 0v2H8a1 1 0 000 2h2v2a1 1 0 002 0v-2h2a1 1 0 000-2z"
  ]} />
);

export const ItAccessSecurityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z",
    "M12 12a2 2 0 00-2 2v1h4v-1a2 2 0 00-2-2zm0 0a1 1 0 100-2 1 1 0 000 2z"
  ]} />
);

export const ItCybersecurityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5z", "M12 22s5-3 5-7v-3H7v3c0 4 5 7 5 7zm-1-7h2"
  ]} />
);

export const LeaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 14h2a2 2 0 002-2V7a2 2 0 00-2-2h-3.33a2 2 0 01-1.42-.59L13.5 3.5a2 2 0 00-2.82 0L10.09 4.4A2 2 0 018.67 5H5a2 2 0 00-2 2v5a2 2 0 002 2h2",
    "M17 21H7a2 2 0 01-2-2v-5h14v5a2 2 0 01-2 2zM12 18a1 1 0 100-2 1 1 0 000 2z"
  ]} />
);

export const ResignationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M14 4a2 2 0 00-2-2H6a2 2 0 00-4 2v16a2 2 0 002 2h6a2 2 0 002-2v-5",
    "M20 12l-4 4-4-4m4 4V4"
  ]} />
);

export const SecurityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M12 14a2 2 0 00-2 2v1h4v-1a2 2 0 00-2-2zm0-1a1 1 0 100-2 1 1 0 000 2z"
  ]} />
);

export const SexualHarassmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M9.05 14.95l5.9-5.9m-5.9 5.9l5.9 5.9M4.22 4.22l15.56 15.56"
  ]} />
);

export const StandbyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z", "M12 12a3 3 0 100-6 3 3 0 000 6zm-1-2h2v4h-2v-4z"
  ]} />
);

export const TelephoneUsageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M3.68 9.53a12.01 12.01 0 005.79 5.79l2.12-2.12a1 1 0 011.03-.21 10.13 10.13 0 004.85 1.58 1 1 0 011 1.02V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1.02 10.13 10.13 0 001.58 4.85 1 1 0 01-.21 1.03l-2.12 2.12z",
    "M15 6h6m-3-3v6"
  ]} />
);

export const TimeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M5 8h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z",
    "M16 3v4M8 3v4m-4 4h16m-9 4l2 2 4-4"
  ]} />
);

export const TravelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    "M12 2v20m8-14H4m16 8H4"
  ]} />
);

export const VisitorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z",
    "M16 7a4 4 0 10-8 0"
  ]} />
);

export const RemoteWorkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M3 12l2-2m0 0l7-7 9 8-7 8-5-5",
    "M3 21v-8l5-5 4 4"
  ]} />
);

export const WhistleblowerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 8V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2h-2",
    "M14 14l-4-4-4 4m4-4V4m0 16a3 3 0 100-6 3 3 0 000 6z"
  ]} />
);

export const PerformanceManagementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",
    "M8 12l4-4 4 4m-8-4l4 4 4-4"
  ]} />
);

export const WorkplaceWellnessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    "M14 10h-2v-2a1 1 0 00-2 0v2H8a1 1 0 000 2h2v2a1 1 0 002 0v-2h2a1 1 0 000-2z"
  ]} />
);

export const SocialMediaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z",
    "M8 10h8m-8 4h5"
  ]} />
);

export const LanguagePolicyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z",
    "M8 9h8m-8 3h8m-8 3h5"
  ]} />
);

export const UifIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M10 7H4v10h6", "M12 5a3 3 0 013 3v8a3 3 0 01-3 3h-2V5h2a3 3 0 013-3v1a2 2 0 100 4v2a2 2 0 100 4v1a3 3 0 01-3 3H5m14-3a3 3 0 100-6 3 3 0 000 6z"
  ]} />
);

export const RecruitmentSelectionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z",
    "M21 21l-4.35-4.35"
  ]} />
);

export const WorkingHoursIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 7v5l3 2"
  ]} />
);

export const TrainingDevelopmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 19h16M4 15h16M4 11h16M4 7h16",
    "M12 4l4 4-4 4-4-4 4-4z"
  ]} />
);

export const TerminationOfEmploymentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M14.12 9.88l-4.24 4.24m0-4.24l4.24 4.24"
  ]} />
);

export const RetrenchmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 19v-2a3 3 0 00-3-3h-4a3 3 0 00-3 3v2",
    "M12 11a3 3 0 100-6 3 3 0 000 6zm-7-2a3 3 0 100-6 3 3 0 000 6zm14 0a3 3 0 100-6 3 3 0 000 6zM4.22 4.22l15.56 15.56"
  ]} />
);

export const ConflictOfInterestIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 12h16", "M4 12l6-6m-6 6l6 6m10-6l-6-6m6 6l-6 6"
  ]} />
);

export const RecordsRetentionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M9 9h6m-6 4h6"
  ]} />
);

export const SalaryStructureIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 16h16", "M4 12h10m-10-4h16"
  ]} />
);

export const FamilyResponsibilityLeaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
    "M12 18.22l-1.41-1.41C8.21 14.51 7 13.06 7 11.5 7 10.12 8.12 9 9.5 9c.74 0 1.41.33 1.88.88L12 10.5l.62-.62c.47-.55 1.14-.88 1.88-.88 1.38 0 2.5 1.12 2.5 2.5 0 1.56-1.21 2.99-3.59 5.31L12 18.22z"
  ]} />
);

// --- Form Icons ---
export const JobApplicationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 11a2 2 0 100-4 2 2 0 000 4zm-2 4h4v-1a2 2 0 00-4 0v1z"
  ]} />
);

export const LeaveApplicationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M5 8h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z", "M16 3v4M8 3v4m-4 4h16"
  ]} />
);

export const FinalWrittenWarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 7v4m0 4h.01"
  ]} />
);

export const ExitInterviewIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M8 10h.01M12 10h.01M16 10h.01", "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
  ]} />
);

export const EmployeeDetailsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 4h16v16H4z", "M12 11a2 2 0 100-4 2 2 0 000 4zm-2 4h4v-1a2 2 0 00-4 0v1z"
  ]} />
);

export const JobDescriptionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M9 7h6m-6 4h6m-6 4h4"
  ]} />
);

export const MaternityLeaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
  ]} />
);

export const SuspensionNoticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M21 14H3a1 1 0 00-1 1v2a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1z",
    "M12 3.236l8.364 4.182A2 2 0 0121 9.236V12h-3v-2.764l-6-3-6 3V12H3V9.236a2 2 0 01.636-1.818L12 3.236zM13 14v-2a1 1 0 00-2 0v2h2zM9 10h6"
  ]} />
);

export const AppealFormIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 16V8m-4 4l4-4 4 4"
  ]} />
);

export const ExpenseClaimIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M12 12a2 2 0 100-4 2 2 0 000 4z"
  ]} />
);

export const TrainingAgreementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M9 13l3 3 3-3m-3-6v9"
  ]} />
);

export const ReferenceCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M9 12l2 2 4-4"
  ]} />
);

export const RetrenchmentNoticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 14a2 2 0 100-4 2 2 0 000 4zm-4-4a.5.5 0 100-1 .5.5 0 000 1zm8 0a.5.5 0 100-1 .5.5 0 000 1z"
  ]} />
);

export const JobAdvertisementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 8V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2h-2",
    "M14 14l-4-4-4 4m4-4V4m0 16a3 3 0 100-6 3 3 0 000 6z"
  ]} />
);

export const InterviewGuideIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 16a3 3 0 100-6 3 3 0 000 6zm-1-8a1 1 0 100-2 1 1 0 000 2z"
  ]} />
);

export const CandidateEvaluationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
  ]} />
);

export const OnboardingChecklistIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M9 7h6m-6 4h6m-6 4h4"
  ]} />
);

export const RestraintOfTradeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M9 10h6v4H9v-4z"
  ]} />
);

export const PerformanceReviewIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 12l4-4-4-4-4 4 4 4z"
  ]} />
);

export const SalaryBankIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 10v10h16V10", "M2 10l10-6 10 6"
  ]} />
);

export const OvertimeClaimIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 7v5l3 2m-4 3h2v2h-2v-2zm4 0h2v2h-2v-2z"
  ]} />
);

export const EmploymentContractIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M9 17h6"
  ]} />
);

export const PermissionForDeductionsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M9 12h6"
  ]} />
);

export const SkillsDevelopmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 2a5 5 0 00-5 5c0 2.05.74 3.9 2 5.38V16h6v-3.62c1.26-1.48 2-3.33 2-5.38a5 5 0 00-5-5z",
    "M9 21h6v-2H9v2z"
  ]} />
);

export const CertificateOfServiceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 16a3 3 0 100-6 3 3 0 000 6z"
  ]} />
);

export const PayrollProcessingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M9 8h6m-6 4h6m-6 4h4"
  ]} />
);

export const ChecklistIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
  ]} />
);

export const CleaningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5M2 12l10 5 10-5"
  ]} />
);

export const FoodSafetyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M12 11l-4 4 1.5 1.5L12 14l4.5 4.5L18 17l-6-6z"
  ]} />
);

export const TemperatureIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z", "M12 19a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
  ]} />
);

export const TrainingRegisterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M9 7h6m-6 4h6m-6 4h4"
  ]} />
);

export const RegisterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 4h16v16H4z", "M9 9h6m-6 4h6"
  ]} />
);

export const CanvaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 16a4 4 0 100-8 4 4 0 000 8z"
  ]} />
);

export const LegalNoticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M21 14H3a1 1 0 00-1 1v2a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1z",
    "M12 3.236l8.364 4.182A2 2 0 0121 9.236V12h-3v-2.764l-6-3-6 3V12H3V9.236a2 2 0 01.636-1.818L12 3.236zM13 14v-2a1 1 0 00-2 0v2h2z"
  ]} />
);

export const AfrikaansIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 18h16", "M12 4L4 18h16L12 4zm0 4l4 8H8l4-8z"
  ]} />
);

export const MeetingMinutesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 7v5l3 2"
  ]} />
);

export const BundleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 8h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8z",
    "M20 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2"
  ]} />
);

export const SurveyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M9 19H5V5h4m5 14h4V9h-4", "M14 19h-4"
  ]} />
);

export const IncidentReportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 2L2 21h20L12 2z", "M12 9v4m0 4h.01"
  ]} />
);

export const CouponIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M15 5V3h-2v2H5a2 2 0 00-2 2v10a2 2 0 002 2h8v2h2v-2h4a2 2 0 002-2V7a2 2 0 00-2-2h-4zm-4 12H7v-2h4v2zm0-4H7v-2h4v2zm0-4H7V7h4v2zm8 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z",
    "M13 3v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2z"
  ]} />
);

// --- UI Icons ---
export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
);

export const LoadingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M12 6v6m0 0v6m0-6h6m-6 0H6" />
);

export const TipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 01-8.486-3.755A5 5 0 017 9.577V3h10v6.577a5 5 0 01-4.657 4.927z" />
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M5 13l4 4L19 7" />
);

export const HelpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.755 4 3.92C16 12.862 14.6 14 12.67 14c-1.217 0-2.07-.487-2.67-1.025A1.5 1.5 0 019 12.5V9zM12 17h.01" />
);

export const UpdateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
);

export const WordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M7 7l2 8h2l2-8"
  ]} />
);

export const ExcelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M10 7l-3 4 3 4m4-8l3 4-3 4"
  ]} />
);

export const PdfIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M12 11h1.5a1.5 1.5 0 000-3H12v3zm0 3v-3h1.5a1.5 1.5 0 010 3H12zM7 11h1.5a1.5 1.5 0 000-3H7v3zm6 3H9.5a1.5 1.5 0 010-3H13v3z"
  ]} />
);

export const TxtIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M7 9h10M7 13h10M7 17h6"
  ]} />
);

export const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25h6m-6 2.25h6M3 7.5l-1.5-1.5M3 12l-1.5-1.5M3 16.5l-1.5-1.5M21 7.5l1.5-1.5M21 12l1.5-1.5M21 16.5l1.5-1.5M5.25 6H18.75a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V8.25a2.25 2.25 0 012.25-2.25z" />
);

export const ComplianceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M9 12l2 2 4-4"
  ]} />
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
);

export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.016h-.008v-.016z" />
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
);

export const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M12 6v6l4 2m8-4a10 10 0 11-20 0 10 10 0 0120 0z" />
);

export const FileAnalyticsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M9 19H5V5h4m5 14h4V9h-4", "M14 19h-4"
  ]} />
);

export const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
);

export const DotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <circle cx="10" cy="10" r="3" />
  </svg>
);

export const ShieldAlertIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M12 8v4m0 4h.01"
  ]} />
);

export const AlertIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
);


export const FileUploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h9.75a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 17.25z" />
);

export const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M6 18L18 6M6 6l12 12" />
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// New Icons for PlanSelectionPage UI
export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
);

export const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
);

export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-1.5 0h12a2.25 2.25 0 012.25 2.25v5.25a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25v-5.25A2.25 2.25 0 015.25 10.5z" />
);

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

export const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M8.25 4.5l7.5 7.5-7.5 7.5" />
);

export const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
);

export const PaperclipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.656-5.656l-3.323 3.323" />
);

export const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M19.5 12h-15" />
);

export const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
);

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
);

export const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M2.25 18L9 11.25l4.5 4.5L21.75 7.5m-3 0h3v3" />
);

