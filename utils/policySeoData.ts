import { PolicyType, FormType } from '../types';

export interface PolicySEOData {
    slug: string;
    title: string;
    h1: string;
    metaDescription: string;
    keywords: string[];
    summary: string;
    whyItMatters: string;
    legalContext: string;
    keyClauses: string[];
    faqs: Array<{ q: string; a: string }>;
    relatedSlugs: string[];
}

export const CORE_POLICY_SEO: Record<string, PolicySEOData> = {
    'disciplinary-code': {
        slug: 'disciplinary-code-template-south-africa',
        title: 'Disciplinary Code Template South Africa | BCEA & LRA Compliant',
        h1: 'Disciplinary Code & Procedure Template',
        metaDescription: 'Download a legally-vetted Disciplinary Code for your SA business. Vetted by labour law experts for BCEA and LRA compliance. Instant 3-minute generation.',
        keywords: ['disciplinary code template', 'SA labour law disciplinary', 'BCEA disciplinary procedure', 'employee conduct rules SA'],
        summary: 'A robust Disciplinary Code is the backbone of any South African business. It provides clear guidelines for employee behavior and ensures that the employer follows fair procedure as required by the Labour Relations Act (LRA).',
        whyItMatters: 'Without a formal disciplinary code, any dismissal can be challenged at the CCMA on the grounds of procedural unfairness. This document protects you from costly legal disputes.',
        legalContext: 'Governed by the Code of Good Practice: Dismissal, which forms part of the LRA. It requires "substantive" and "procedural" fairness in all disciplinary actions.',
        keyClauses: [
            'Standard of Conduct expectations',
            'Classification of offences (Minor, Serious, Very Serious)',
            'Progressive discipline guidelines (Verbal to Final Warning)',
            'Disciplinary hearing protocols',
            'Rights of the employee (Representation, Interpretation)'
        ],
        faqs: [
            { q: 'Is a disciplinary code required by law in SA?', a: 'While the LRA doesn\'t explicitly say you must have a written code, it does say you must have clear rules. A written code is the only reliable way to prove rules were communicated.' },
            { q: 'Can I dismiss an employee for first-time theft?', a: 'Yes, theft is generally classified as a "very serious" offence that justifies dismissal on the first instance, provided fair procedure is followed.' }
        ],
        relatedSlugs: ['employment-contract-template', 'grievance-procedure-template', 'sexual-harassment-policy']
    },
    'employment-contract': {
        slug: 'employment-contract-template-south-africa',
        title: 'Permanent Employment Contract Template SA | BCEA Compliant',
        h1: 'Standard Employment Contract Template',
        metaDescription: 'Generate a professional South African employment contract in minutes. Fully BCEA compliant with clauses for probation, leave, and termination.',
        keywords: ['employment contract template SA', 'permanent contract South Africa', 'BCEA compliant contract', 'employee agreement template'],
        summary: 'A standard contract of employment that covers all mandatory provisions of the Basic Conditions of Employment Act (BCEA). Suitable for permanent staff across all SA industries.',
        whyItMatters: 'Section 29 of the BCEA requires every employer to provide written particulars of employment. Failing to do so can result in Labour Department fines.',
        legalContext: 'Compliant with the Basic Conditions of Employment Act (BCEA) 75 of 1997 and the Labour Relations Act.',
        keyClauses: [
            'Job description and duties',
            'Remuneration and benefits detailed breakdown',
            'Leave entitlements (Annual, Sick, Family)',
            'Termination and notice periods',
            'Probationary period clause'
        ],
        faqs: [
            { q: 'What is the minimum notice period in South Africa?', a: 'Under the BCEA, 1 week for first 6 months, 2 weeks for 6-12 months, and 4 weeks after 1 year of employment.' },
            { q: 'Do I have to pay for overtime?', a: 'Yes, unless the employee earns above the BCEA threshold or it is specifically contracted otherwise (within legal limits).' }
        ],
        relatedSlugs: ['disciplinary-code-template', 'leave-policy-template', 'confidentiality-agreement-template']
    },
    'data-protection-privacy': {
        slug: 'popia-policy-template-south-africa',
        title: 'POPIA Policy Template | South African Data Protection Compliance',
        h1: 'POPIA & Data Protection Policy',
        metaDescription: 'Make your business POPIA compliant today. Our template covers data processing, security, and employee obligations as required by the Information Regulator.',
        keywords: ['POPIA policy template', 'data protection SA', 'information officer duties', 'POPI Act compliance'],
        summary: 'The Protection of Personal Information Act (POPIA) requires every South African entity to have a policy governing how they collect, process, and store personal data.',
        whyItMatters: 'Non-compliance with POPIA can lead to fines of up to R10 million or imprisonment. It is essential for protecting client and employee trust.',
        legalContext: 'Based on the POPI Act of 2013. Aligns with the 8 Conditions for Lawful Processing.',
        keyClauses: [
            'Purpose of data collection',
            'Security safeguards and breach protocols',
            'Retention and destruction schedules',
            'Subject access request procedures',
            'Information Officer appointment details'
        ],
        faqs: [
            { q: 'Does every company need a POPIA policy?', a: 'Yes, if you process any personal information (including employee IDs or client emails), you must comply with POPIA.' },
            { q: 'Who should be the Information Officer?', a: 'By default, the CEO or MD, but they can delegate this role to a senior manager.' }
        ],
        relatedSlugs: ['paia-manual-template', 'confidentiality-agreement-template', 'it-security-policy']
    }
};

export const generateGenericSEOData = (type: string, title: string, description: string): PolicySEOData => {
    const baseSlug = type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
        slug: `${baseSlug}-template-south-africa`,
        title: `${title} Template | South African HR Resources`,
        h1: `${title} Template`,
        metaDescription: description + " Legally-vetted for South African businesses. Instant download.",
        keywords: [type + ' template', 'HR policy SA', title.toLowerCase() + ' South Africa'],
        summary: description,
        whyItMatters: `A professional ${title} ensures consistency and clarity in your workplace transactions.`,
        legalContext: 'Vetted for compliance with South African Labour Law benchmarks.',
        keyClauses: [
            'Scope and Application',
            'Procedures and Guidelines',
            'Compliance and Reporting',
            'Review and Amendments'
        ],
        faqs: [
            { q: `Why is a ${title} important?`, a: `It sets clear expectations and prevents misunderstandings between employers and employees.` },
            { q: 'Is this template editable?', a: 'Yes, all our documents are provided in editable formats to suit your specific business needs.' }
        ],
        relatedSlugs: ['disciplinary-code-template-south-africa', 'employment-contract-template-south-africa']
    };
};
