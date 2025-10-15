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

export const AlcoholDrugIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 16a4 4 0 100-8 4 4 0 000 8zM4.22 4.22l15.56 15.56"
  ]} />
);

export const AntiBriberyCorruptionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 16a4 4 0 100-8 4 4 0 000 8zM4.22 4.22l15.56 15.56"
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
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M7 12h10M4.22 4.22l15.56 15.56"
  ]} />
);

export const AttendancePunctualityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 7v5l3 2"
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
    "M19 14H5a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 01-2 2z", "M6 18a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"
  ]} />
);

export const CompensationBenefitsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M10 7H4v10h6", "M12 5a3 3 0 013 3v8a3 3 0 01-3 3h-2v- romanzo-2V7h2a3 3 0 013-3v1a2 2 0 100 4v2a2 2 0 100 4v1a3 3 0 01-3 3H5m14-3a3 3 0 100-6 3 3 0 000 6z"
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
    "M21 14H3a1 1 0 00-1 1v2a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1z",
    "M12 3.236l8.364 4.182A2 2 0 0121 9.236V12h-3v-2.764l-6-3-6 3V12H3V9.236a2 2 0 01.636-1.818L12 3.236zM13 14v-2a1 1 0 00-2 0v2h2z"
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
    "M14 4a2 2 0 00-2-2H6a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2v-5",
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
    "M12 21a2 2 0 01-2-2v-2H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-3v2a2 2 0 01-2 2z",
    "M10 9a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-2 4a3 3 0 00-3 1h6a3 3 0 00-3-1z"
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

export const MasterPolicyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M20 6.5a2.5 2.5 0 00-2.5-2.5H8a1 1 0 000 2h9.5A.5.5 0 0118 6.5v11a.5.5 0 01-.5.5H8a1 1 0 000 2h9.5A2.5 2.5 0 0020 17.5v-11z",
    "M4 19.5A2.5 2.5 0 016.5 17H14V4H6.5A2.5 2.5 0 004 6.5v13zM8 9h4M8 12h2"
  ]} />
);

export const PerformanceManagementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 4h16v16H4z", "M17 15l-4-4-3 3-4-4"
  ]} />
);

export const RecruitmentSelectionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M11 18a7 7 0 100-14 7 7 0 000 14z", "M16 16l5 5m-11-8a3 3 0 100-6 3 3 0 000 6z"
  ]} />
);

export const RemoteWorkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M3 9.5V20a1 1 0 001 1h5v-5a2 2 0 012-2h2a2 2 0 012 2v5h5a1 1 0 001-1V9.5", "M22 9.5l-10-7-10 7"
  ]} />
);

export const ResignationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M14 4a2 2 0 00-2-2H6a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2v-5",
    "M17 14l4-4-4-4m3 4H9"
  ]} />
);

export const RetrenchmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 19v-2a3 3 0 00-3-3h-2.5", "M7 19v-2a3 3 0 013-3h2M12 11a3 3 0 100-6 3 3 0 000 6zm-7-2a3 3 0 100-6 3 3 0 000 6zm14 0a3 3 0 100-6 3 3 0 000 6z"
  ]} />
);

export const SecurityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 8.5V6a6 6 0 10-12 0v2.5", "M12 13a3 3 0 00-3 3v2a3 3 0 006 0v-2a3 3 0 00-3-3zm0 2a1 1 0 110 2 1 1 0 010-2zM6 9h12v1a6 6 0 01-12 0V9z"
  ]} />
);

export const SexualHarassmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M7 7a4 4 0 10-8 0 4 4 0 008 0zm14 0a4 4 0 10-8 0 4 4 0 008 0zM4 14a2 2 0 00-2 2v3h4v-3a2 2 0 00-2-2zm16 0a2 2 0 00-2 2v3h4v-3a2 2 0 00-2-2z",
    "M12 3v18m-4 0h8"
  ]} />
);

export const SocialMediaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M7 11v10H3V11h4zM5 9a2 2 0 100-4 2 2 0 000 4z", "M21 11h-4v10h4V11zm-2 5a2 2 0 01-2-2v-1h-2v1a4 4 0 004 4v1h-4v-2h2v-1h-2v-1h2v-1h-2V11h2v1h2v1a2 2 0 01-2 2z"
  ]} />
);

export const StandbyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 7v5l3 2"
  ]} />
);

export const TelephoneUsageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72",
    "M15.5 11.5c0 .8-.5 1.5-1.3 1.5h-1.4a.2.2 0 00-.2.2v1.4c0 .8-.5 1.3-1.3 1.3h-1.5a2.8 2.8 0 01-3-2.8V9.8a2.8 2.8 0 012.8-3h1.5c.8 0 1.3.5 1.3 1.3v1.4c0 .1.1.2.2.2h1.4c.8 0 1.5.7 1.5 1.5z"
  ]} />
);

export const TerminationOfEmploymentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M6 3h8l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z",
    "M12 3v18m-4-9h8"
  ]} />
);

export const TimeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M5 8h14a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a1 1 0 011-1z",
    "M16 4h-2a1 1 0 00-1-1H11a1 1 0 00-1 1H8a1 1 0 00-1 1v3h10V5a1 1 0 00-1-1z"
  ]} />
);

export const TrainingDevelopmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 12v-1.38a2 2 0 01.64-1.5L12 3l7.36 6.12A2 2 0 0120 10.62V12", "M22 13h-3v8h-2v-5H7v5H5v-8H2v7h20v-7z"
  ]} />
);

export const TravelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z",
    "M16.5 13.5L10 10l-1.5 4.5 4.5 1.5 3.5-2.5zM8 8l8 8"
  ]} />
);

export const UifIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 12a4 4 0 100-8 4 4 0 000 8zM16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2",
    "M13 3.05A9 9 0 0121 11c0 2.22-1.21 4.15-3 5.19"
  ]} />
);

export const VisitorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 12a4 4 0 100-8 4 4 0 000 8z", "M16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2h12zm4-6h-2v2h2v-2zm0-4h-2v2h2v-2zm0 8h-2v2h2v-2z"
  ]} />
);

export const WhistleblowerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M14 8a2 2 0 01-2-2V4a2 2 0 014 0v2a2 2 0 01-2 2z", "M12 10H6a4 4 0 00-4 4v0a4 4 0 004 4h12a4 4 0 004-4v-1"
  ]} />
);

export const WorkingHoursIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 7v5l3 2"
  ]} />
);

export const WorkplaceWellnessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", "M16 9h-3V6h-2v3H8v2h3v3h2v-3h3V9z"
  ]} />
);


// --- Form Icons ---

export const FormsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2z",
    "M14 2H8a2 2 0 00-2 2v2h10V4a2 2 0 00-2-2z"
  ]} />
);

export const JobApplicationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 12a2 2 0 100-4 2 2 0 000 4zm-4 4h8v-1a4 4 0 00-8 0v1z"
  ]} />
);

export const EmployeeDetailsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 12a2 2 0 100-4 2 2 0 000 4zm-4 4h8v-1a4 4 0 00-8 0v1z"
  ]} />
);

export const LeaveApplicationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 14h2a2 2 0 002-2V7a2 2 0 00-2-2h-3.33a2 2 0 01-1.42-.59L13.5 3.5a2 2 0 00-2.82 0L10.09 4.4A2 2 0 018.67 5H5a2 2 0 00-2 2v5a2 2 0 002 2h2",
    "M17 21H7a2 2 0 01-2-2v-5h14v5a2 2 0 01-2 2zM12 18a1 1 0 100-2 1 1 0 000 2z"
  ]} />
);

export const FinalWrittenWarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 2L2 22h20L12 2z",
    "M11 10h2v5h-2v-5zm0 7h2v2h-2v-2z"
  ]} />
);

export const ExitInterviewIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M14 4a2 2 0 00-2-2H6a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2v-5",
    "M17 14l4-4-4-4m3 4H9"
  ]} />
);

export const GrievanceFormIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 21a2 2 0 01-2-2v-2H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-3v2a2 2 0 01-2 2z",
    "M10 9a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-2 4a3 3 0 00-3 1h6a3 3 0 00-3-1z"
  ]} />
);

export const JobDescriptionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M8 8h8m-8 4h8m-8 4h4"
  ]} />
);

export const MaternityLeaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 13a4 4 0 100-8 4 4 0 000 8z",
    "M17.5 13a5.5 5.5 0 11-11 0c0 2.94 2.47 6.42 5.5 9 3.03-2.58 5.5-6.06 5.5-9z"
  ]} />
);

export const DisciplinaryReportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M6 3h8l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z", "M13 3v6h6M12 12l-4 4m4 0l-4-4"
  ]} />
);

export const SuspensionNoticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 12a4 4 0 100-8 4 4 0 000 8zM16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2",
    "M18 11h-2v6h2v-6zm4 0h-2v6h2v-6z"
  ]} />
);

export const AppealFormIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M12 16V8m-4 4l4-4 4 4"
  ]} />
);

export const ExpenseClaimIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z", "M12 16a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 110-4 2 2 0 010 4zM10 7h4"
  ]} />
);

export const TrainingAgreementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M15.5 12.5a3.5 3.5 0 11-5 0 3.5 3.5 0 015 0zm-3-1.5L10 13.5m0-3l2.5 2.5"
  ]} />
);

export const ReferenceCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M9 12l2 2 4-4"
  ]} />
);

export const RetrenchmentNoticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M15 11H9v2h6v-2z"
  ]} />
);

export const JobAdvertisementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 3h16a2 2 0 012 2v2a2 2 0 01-2 2h-4v4a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h4V5a2 2 0 01-2-2z", "M18 19l3-3m-3 0l3 3m-9-4l-3 3m0-3l3 3"
  ]} />
);

export const InterviewGuideIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M8 8h8m-8 4h8m-8 4h4"
  ]} />
);

export const CandidateEvaluationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M12 11l-1 2h2l-1-2zm-4 4l1-2h2l-1 2H8zm8 0l1-2h2l-1 2h-2z"
  ]} />
);

export const OnboardingChecklistIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M8 9h8m-8 4h8m-8 4h4m-1-4l2 2 4-4"
  ]} />
);

export const ConfidentialityAgreementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 15a3 3 0 00-3 3h6a3 3 0 00-3-3zm1-3a1 1 0 10-2 0v1h2v-1zM10 7h4"
  ]} />
);

export const RestraintOfTradeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 12a4 4 0 100-8 4 4 0 000 8zM16 20v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2",
    "M3 13h18v2H3v-2z"
  ]} />
);

export const PerformanceReviewIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M4 4h16v16H4z", "M17 15l-4-4-3 3-4-4"
  ]} />
);

export const SalaryBankIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M2 21h20M4 10h16v9H4zM2 9l10-7 10 7", "M12 15a1 1 0 100-2 1 1 0 000 2z"
  ]} />
);

export const OvertimeClaimIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 7v5l3 2m-4-3h2v-2h-2v2zm-2 2h2V9h-2v2z"
  ]} />
);


// --- Generic Icons ---

export const ChecklistIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M8 9h8m-8 4h8m-8 4h4m-1-4l2 2 4-4"
  ]} />
);

export const CleaningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M20 9.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5", "M22 9.5l-2-6-8-2-8 2-2 6"
  ]} />
);

export const FoodSafetyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
  ]} />
);

export const TemperatureIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 12a4 4 0 100-8 4 4 0 000 8z", "M12 10V2m0 18a4 4 0 004-4h-8a4 4 0 004 4z"
  ]} />
);

export const TrainingRegisterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M12 12a2 2 0 100-4 2 2 0 000 4zm-4 4h8v-1a4 4 0 00-8 0v1z"
  ]} />
);

export const RegisterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M8 8h8m-8 4h8m-8 4h4"
  ]} />
);

export const CanvaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22a10 10 0 100-20 10 10 0 000 20z",
    "M15 15a3 3 0 10-6 0 3 3 0 006 0z"
  ]} />
);

export const LegalNoticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M21 14H3a1 1 0 00-1 1v2a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1z",
    "M12 3.236l8.364 4.182A2 2 0 0121 9.236V12h-3v-2.764l-6-3-6 3V12H3V9.236a2 2 0 01.636-1.818L12 3.236zM13 14v-2a1 1 0 00-2 0v2h2z"
  ]} />
);

export const AfrikaansIcon: React.FC<{ className?: string, viewBox?: string }> = ({ className, viewBox = "0 0 512 512" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="currentColor" className={className}>
        <path d="M0 85.337h512v119.326H0z" fill="#007749"/>
        <path d="M0 307.337h512v119.326H0z" fill="#002395"/>
        <path d="M0 204.663h512v102.674H0z" fill="#fff"/>
        <path d="M0 0h512v85.337H0z" fill="#ffb612"/>
        <path d="M0 426.663h512V512H0z" fill="#de3831"/>
    </svg>
);

export const MeetingMinutesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M8 8h8m-8 4h8m-8 4h4"
  ]} />
);

export const BundleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2z",
    "M14 2H8a2 2 0 00-2 2v2h10V4a2 2 0 00-2-2z"
  ]} />
);

export const SurveyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z", "M8 17v-4m4 4v-8m4 8v-2"
  ]} />
);

export const IncidentReportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 2L2 22h20L12 2z",
    "M11 10h2v5h-2v-5zm0 7h2v2h-2v-2z"
  ]} />
);

// --- Utility Icons ---

export const LoadingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const TipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <OutlineIcon className={className} path="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124M10.5 18.75v-5.25a2.25 2.25 0 00-2.25-2.25H3.75M10.5 18.75H7.5a2.25 2.25 0 01-2.25-2.25v-5.25a2.25 2.25 0 012.25-2.25h5.25a2.25 2.25 0 012.25 2.25v5.25a2.25 2.25 0 01-2.25 2.25H10.5" />
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M4.5 12.75l6 6 9-13.5" />
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
);

export const WordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
);

export const ExcelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
);

export const HelpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <OutlineIcon className={className} path="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M43.611 20.083H24v8.017h11.002c-0.482 2.536-2.162 4.7-4.582 6.225v5.242h6.753c3.95-3.646 6.22-8.995 6.22-15.484 0-1.636-0.14-3.23-0.404-4.8z"/>
      <path fill="#34A853" d="M24 44c5.997 0 11.03-1.99 14.706-5.405l-6.753-5.242c-1.99 1.33-4.532 2.112-7.953 2.112-6.138 0-11.33-4.138-13.188-9.675l-6.953 5.405c3.55 7.02 10.965 11.8 19.947 11.8z"/>
      <path fill="#FBBC05" d="M10.812 28.118c-0.613-1.83-0.958-3.785-0.958-5.83s0.345-4 0.958-5.83V11.053l-6.953-5.405c-2.31 4.39-3.612 9.53-3.612 15.09s1.302 10.7 3.612 15.09l6.953-5.405z"/>
      <path fill="#EA4335" d="M24 10.732c3.242 0 6.02 1.115 8.253 3.24l5.98-5.98C35.022 4.14 29.98 2 24 2 15.035 2 7.62 6.78 4.06 13.808l6.752 5.242c1.858-5.536 7.05-9.318 13.188-9.318z"/>
    </svg>
  );