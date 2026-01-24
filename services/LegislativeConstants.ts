/**
 * HR CoPilot Legislative Constants
 * --------------------------------
 * This file serves as the 'Legal Lighthouse' source of truth for all numerical 
 * and legislative values used in the Brain's diagnostic context.
 * 
 * Update these values when the Department of Employment and Labour 
 * publishes new Government Gazettes.
 */

export const LEGISLATIVE_CONSTANTS = {
    // Current BCEA Earnings Threshold (Subject to annual change)
    // As of April 2024: R254,371.67 per annum
    BCEA_EARNINGS_THRESHOLD_ANNUAL: 254371.67,

    // National Minimum Wage (Rands per hour)
    // As of March 2024: R27.58
    NATIONAL_MINIMUM_WAGE_HOURLY: 27.58,

    // Domestic Worker Minimum Wage (Usually aligned with NMW now)
    DOMESTIC_WORKER_MINIMUM_WAGE_HOURLY: 27.58,

    // UI-19 Contribution Limit (Monthly)
    UIF_CONTRIBUTION_CEILING: 17712.00,

    // 2025 Constitutional Court Judgments
    VAN_WYK_PARENTAL_LEAVE_MONTHS: 4,
    VAN_WYK_PARENTAL_LEAVE_DAYS: 10,

    // Employment Equity Act 2025 Amendments
    EEA_DESIGNATED_EMPLOYER_THRESHOLD: 50,

    // Regulatory Versions (Metadata tracking)
    BRAIN_VERSION: "3.2.0",
    LATEST_COMPLIANCE_AUDIT: "2026-01-24"
};

export type LegislativeConstants = typeof LEGISLATIVE_CONSTANTS;
