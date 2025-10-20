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
    "M19 14H5a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 01-2-2z", "M6 18a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"
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
    "M4 6.5A2.5 2.5 0 016.5 4H12v16H6.5A2.5 2.5 0 014 17.5v-11zM8 9H6v2h2V9zm2 0h2v2h-2V9z"
  ]} />
);

// FIX: Add all missing icons
export const ResignationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M14 4a2 2 0 00-2-2H6a2 2 0 00-4 2v16a2 2 0 002 2h6a2 2 0 002-2V4z",
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

export const FormsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z",
    "M9 7h6m-6 4h6m-6 4h4"
  ]} />
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

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0124 36c-5.222 0-9.612-3.87-11.08-9.023l-6.571 4.82C9.656 39.663 16.318 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.16-4.087 5.571l6.19 5.238C42.612 34.869 44 30.013 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

export const ComplianceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <DuotoneIcon className={className} paths={[
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "M9 12l2 2 4-4"
  ]} />
);