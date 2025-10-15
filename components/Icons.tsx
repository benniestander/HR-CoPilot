import React from 'react';

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor",
};

export const LeaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
  </svg>
);

export const DisciplinaryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const GrievanceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

export const HealthSafetyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286z" />
  </svg>
);

export const MasterPolicyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25" />
  </svg>
);

export const ByodIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

export const CellPhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

export const CertificationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.376-2.11a59.902 59.902 0 0116.258-3.419m-12.882 5.53a59.902 59.902 0 0111.458-3.419m12.882 5.53l3.376-2.11a59.902 59.902 0 00-16.258-3.419m-1.42 16.556a31.113 31.113 0 01-3.262-3.262m3.262 3.262a31.113 31.113 0 003.262-3.262" />
  </svg>
);

export const CodeOfEthicsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.26-6.75.77m13.5 0c1.243.272 2.417.596 3.527.942m-20.552 0c1.11-.346 2.284-.67 3.527-.942m0 0L3 3.75M18.75 4.97l2.25-1.22" />
  </svg>
);

export const CommunicationRetentionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" />
  </svg>
);

export const DataUsageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

export const ElectronicCommunicationsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export const ResignationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

export const SecurityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
  </svg>
);

export const SexualHarassmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a.75.75 0 01-1.06 0l-3.72-3.72A2.25 2.25 0 019 15.118V10.618a2.25 2.25 0 012.25-2.25h3.844c.492 0 .947.19 1.285.505l.332.331M6.75 12c.884-.284 1.5-1.128 1.5-2.097V5.617a2.25 2.25 0 00-2.25-2.25h-3.844a2.25 2.25 0 00-2.25 2.25v4.286c0 1.136.847 2.1 1.98 2.193l3.72 3.72a.75.75 0 001.06 0l3.72-3.72A2.25 2.25 0 009 12.382V7.882" />
  </svg>
);

export const StandbyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const TelephoneUsageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

export const TimeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Zm0 3h.008v.008H12v-.008Zm0 3h.008v.008H12v-.008Zm-3-3h.008v.008H9v-.008Zm0 3h.008v.008H9v-.008Zm-3-3h.008v.008H6v-.008Zm0 3h.008v.008H6v-.008Zm6-6h.008v.008H12v-.008Zm-3 0h.008v.008H9v-.008Zm-3 0h.008v.008H6v-.008Zm9 3h.008v.008H15v-.008Zm0 3h.008v.008H15v-.008Zm-3-6h.008v.008H12v-.008Zm3 0h.008v.008H15v-.008Z" />
  </svg>
);

export const TravelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a17.96 17.96 0 01-12.064 0m12.064 0A17.96 17.96 0 0118 10.18m-2.41 4.19a6 6 0 01-7.38-5.84m2.56-12.064A17.96 17.96 0 0110.18 18m-4.19-2.41a6 6 0 015.84-7.38m-5.84 2.56A17.96 17.96 0 012 10.18m13.59 4.19a17.96 17.96 0 01-12.064 0" />
  </svg>
);

export const CompanyPropertyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
  </svg>
);

export const VisitorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const RemoteWorkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

export const EeoDiversityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-6 3m12 0a9 9 0 10-12 0m12 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-6-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0zM3 13.5a9 9 0 1018 0 9 9 0 00-18 0z" />
  </svg>
);

export const AttendancePunctualityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12L15 13.5 13.5 12" />
  </svg>
);

export const EmployeeConductIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

export const DataProtectionPrivacyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);

export const DisciplinaryActionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L9.75 21.75l3.745-4.012M9.255 9.755L14.25 21.75 12 15.75l-2.745-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3l-6.75 7.5 3 3.75 6.75-7.5-3-3.75z" />
  </svg>
);

export const WhistleblowerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12h3m-3 3h3m-3-6h3" />
  </svg>
);

export const CompensationBenefitsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m8.024-3.75c.018-.217.035-.434.052-.652A6.75 6.75 0 0112 1.5a6.75 6.75 0 016.75 6.75c0 1.622-.56 3.12-1.5 4.25m-11.5 2.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5a6 6 0 1112 0v-6a6 6 0 11-12 0v6z" />
  </svg>
);

export const PerformanceManagementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517L21.75 6M3 21h18" />
  </svg>
);

export const WorkplaceWellnessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const ItCybersecurityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m-6 0V9h6v8.25m-6 0h6m-6-12.75h6m-6 0V3h6v1.5m-6 0h6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);

export const SocialMediaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

export const ConfidentialityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
  </svg>
);

export const EmployeeSeparationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

export const AntiHarassmentDiscriminationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-6 3m12 0a9 9 0 10-12 0m12 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-6-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
  </svg>
);

export const CompanyVehicleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375V18.75m-17.25 4.5h16.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 14.25h17.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l1.5 1.5 3-3" />
  </svg>
);

export const ExpenseReimbursementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5M3.75 8.25h16.5M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5v21" />
  </svg>
);

// Policy Icons
export const EmploymentEquityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.26-6.75.77m13.5 0c1.243.272 2.417.596 3.527.942m-20.552 0c1.11-.346 2.284-.67 3.527-.942m0 0L3 3.75M18.75 4.97l2.25-1.22" /></svg>
);
export const CoidaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m-3-3h6" /></svg>
);
export const UifIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m10.125-3.75a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75h3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5a6 6 0 1012 0v-6a6 6 0 10-12 0v6z" /></svg>
);
export const RecruitmentSelectionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-3.35-3.35" /></svg>
);
export const WorkingHoursIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
export const TrainingDevelopmentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg>
);
export const AntiBriberyCorruptionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 10-8.5 0v3.585a4.504 4.504 0 002.5 4.075l.504.252a4.5 4.5 0 004 0l.504-.252a4.504 4.504 0 002.5-4.075V7.756zM14.25 7.756L12 9.256l-2.25-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" /></svg>
);
export const DressCodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75v6a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25v-6" /></svg>
);
export const AlcoholDrugIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.75l-4.5 4.5v10.5h9V8.25l-4.5-4.5zM12.75 3.75h-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" /></svg>
);
export const TerminationOfEmploymentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2.25-6.75l-10.5 10.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12.75v6a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18.75v-6" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75l-3-3-3 3M10.5 3.75h3" /></svg>
);
export const RetrenchmentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.125-1.584M15 19.128v-3.872M15 19.128l-2.625.372a9.337 9.337 0 01-4.125-1.584M15 15.256l2.625-3.372a9.337 9.337 0 004.125 1.584M15 15.256l-2.625 3.872m0 0l-2.625-3.872a9.337 9.337 0 00-4.125 1.584M9.375 19.128v-3.872M9.375 19.128l2.625.372a9.337 9.337 0 004.125-1.584M3.375 19.128v-3.872M3.375 19.128l2.625.372a9.337 9.337 0 004.125-1.584" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.253l-2.625-3.372a9.337 9.337 0 00-4.125 1.584" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 19.128v-3.872" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.253l-2.625-3.372a9.337 9.337 0 00-4.125 1.584" /></svg>
);


// Form Icons
export const FormsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
);
export const JobApplicationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21c-2.305 0-4.408-.867-6-2.275z" /></svg>
);
export const EmployeeDetailsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zM9 12.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
export const LeaveApplicationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>
);
export const FinalWrittenWarningIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
);
export const ExitInterviewIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3-3m0 0l-3 3m-3-3H9" /></svg>
);
export const GrievanceFormIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
);
export const JobDescriptionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
export const MaternityLeaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.115 5.646a.75.75 0 01.745-1.292l2.67 1.335a.75.75 0 010 1.292l-2.67 1.335a.75.75 0 01-1.04-.646V5.646zM4.75 5.646a.75.75 0 01.745-1.292l2.67 1.335a.75.75 0 010 1.292l-2.67 1.335a.75.75 0 01-1.04-.646V5.646z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.25 8.25 0 005.404-14.586l-1.92-1.371a.75.75 0 00-1.04-.002L12 7.118l-2.443-2.075a.75.75 0 00-1.04.002l-1.92 1.37A8.25 8.25 0 0012 21z" /></svg>
);
export const DisciplinaryReportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3l-6.75 7.5 3 3.75 6.75-7.5-3-3.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12.75h-6" /></svg>
);
export const SuspensionNoticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
);
export const AppealFormIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
);
export const ExpenseClaimIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m10.125-3.75a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75h3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5a6 6 0 1112 0v-6a6 6 0 11-12 0v6z" /></svg>
);
export const TrainingAgreementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
);
export const ReferenceCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" /></svg>
);
export const RetrenchmentNoticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);
export const JobAdvertisementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 01-4.5-4.5V8.25a4.5 4.5 0 014.5-4.5h3.75a4.5 4.5 0 014.5 4.5v.09" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.91a4.5 4.5 0 014.372 4.372" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75L11.25 12l.75-.75-1.5-1.5L9 10.5l.75.75-1.5 1.5.75.75L12 12.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l.375.375a1.5 1.5 0 01-2.122 2.122L12 16.5l-.75.75-1.125-1.125.75-.75-1.125-1.125.75-.75-1.125-1.125.75-.75-1.125-1.125.75-.75-1.125-1.125.75-.75L9 3.375l.75.75 1.125-1.125-.75-.75 1.125-1.125-.75-.75 1.125-1.125-.75-.75 1.125-1.125-.75-.75L15 15z" /></svg>
);
export const InterviewGuideIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
);
export const CandidateEvaluationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>
);
export const OnboardingChecklistIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
export const ConfidentialityAgreementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
);
export const RestraintOfTradeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18" /></svg>
);
export const PerformanceReviewIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517L21.75 6M3 21h18" /></svg>
);
export const SalaryBankIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m-3-3.75l-3 1.5m3-1.5l-3-1.5m3 1.5l3 1.5m-3-1.5l3-1.5M15 5.25l-3 1.5m3-1.5l-3-1.5m3 1.5l3 1.5m-3-1.5l3-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75h18A2.25 2.25 0 0123.25 9v10.5A2.25 2.25 0 0121 21.75H3A2.25 2.25 0 01.75 19.5V9A2.25 2.25 0 013 6.75z" /></svg>
);
export const OvertimeClaimIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m-1.5-1.5h3" /></svg>
);
// New Generic Icons
export const ChecklistIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
export const CleaningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75l-4.5 4.5v10.5h9V8.25l-4.5-4.5zM12.75 3.75h-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75h6" /></svg>
);
export const FoodSafetyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 15.75L12 21.75 3.75 15.75 12 9.75l8.25 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 15.75V9.75L12 3.75 3.75 9.75v6" /></svg>
);
export const TemperatureIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.25a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zM12 12.75v6.75m0-6.75a3.75 3.75 0 01-3.75-3.75c0-1.52.884-2.829 2.14-3.428a.75.75 0 01.92.012 5.23 5.23 0 011.38 3.416A3.75 3.75 0 0112 12.75z" /></svg>
);
export const TrainingRegisterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12h-3.375M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
);
export const RegisterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
);
export const CanvaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.08.932 2.08 2.08s-.932 2.08-2.08 2.08-2.08-.932-2.08-2.08.932-2.08 2.08-2.08zM12 3.75c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zM12 6.83c2.852 0 5.17 2.318 5.17 5.17s-2.318 5.17-5.17 5.17-5.17-2.318-5.17-5.17 2.318-5.17 5.17-5.17z" /></svg>
);
export const LegalNoticeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3l-6.75 7.5 3 3.75 6.75-7.5-3-3.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 11.25h17.25" /></svg>
);
export const AfrikaansIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 5h18v4H3zM3 15h18v4H3z" fill="#007749"/><path d="M3 9h18v6H3z" fill="#fff"/><path d="M0 0h24v24H0z" fill="none"/></svg>
);
export const MeetingMinutesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
);
export const BundleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.126 12.126a3.375 3.375 0 013.375 0m-3.375 0a3.375 3.375 0 00-3.375 0m3.375 0v3.375m0-3.375V8.75m-3.375 3.375h3.375M9.5 8.75v-3.375m0 3.375h3.375m0 0a3.375 3.375 0 010 3.375m0-3.375a3.375 3.375 0 000-3.375M14.5 8.75h3.375m0 0a3.375 3.375 0 010 3.375m0-3.375V5.375m0 3.375H12m2.5 3.375a3.375 3.375 0 01-3.375 0m3.375 0a3.375 3.375 0 003.375 0m-3.375 0v3.375m0-3.375V12.5" /></svg>
);
export const SurveyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0v1.5M3.75 4.5v11.25A2.25 2.25 0 006 18h12a2.25 2.25 0 002.25-2.25V7.5M3.75 4.5h16.5M12 11.25h3.75m-3.75 3h3.75" /></svg>
);
export const IncidentReportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
);

export const LoadingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const TipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-1.125a6.01 6.01 0 001.125-1.5A6.01 6.01 0 0015 9.75M12 18v-5.25m0 0a6.009 6.009 0 01-1.5-1.125a6.009 6.009 0 01-1.125-1.5A6.009 6.009 0 019 9.75M12 18v-5.25M12 12.75h.008v.008H12v-.008z" />
    </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);


export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const WordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const ExcelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 3v18M15 3v18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15h18" />
  </svg>
);

export const HelpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M43.611 20.083H24v8.017h11.002c-0.482 2.536-2.162 4.7-4.582 6.225v5.242h6.753c3.95-3.646 6.22-8.995 6.22-15.484 0-1.636-0.14-3.23-0.404-4.8z"/>
      <path fill="#34A853" d="M24 44c5.997 0 11.03-1.99 14.706-5.405l-6.753-5.242c-1.99 1.33-4.532 2.112-7.953 2.112-6.138 0-11.33-4.138-13.188-9.675l-6.953 5.405c3.55 7.02 10.965 11.8 19.947 11.8z"/>
      <path fill="#FBBC05" d="M10.812 28.118c-0.613-1.83-0.958-3.785-0.958-5.83s0.345-4 0.958-5.83V11.053l-6.953-5.405c-2.31 4.39-3.612 9.53-3.612 15.09s1.302 10.7 3.612 15.09l6.953-5.405z"/>
      <path fill="#EA4335" d="M24 10.732c3.242 0 6.02 1.115 8.253 3.24l5.98-5.98C35.022 4.14 29.98 2 24 2 15.035 2 7.62 6.78 4.06 13.808l6.752 5.242c1.858-5.536 7.05-9.318 13.188-9.318z"/>
    </svg>
  );