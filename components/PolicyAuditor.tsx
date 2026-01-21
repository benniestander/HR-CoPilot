import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auditPolicy } from '../services/geminiService';
import {
    FileUploadIcon,
    LoadingIcon,
    CheckIcon,
    InfoIcon,
    ComplianceIcon,
    FileIcon,
    AlertIcon,
    ArrowRightIcon,
    ShieldCheckIcon
} from './Icons';
import { useUIContext } from '../contexts/UIContext';

interface AuditResult {
    score: number;
    summary: string;
    red_flags: Array<{
        issue: string;
        law: string;
        impact: 'High' | 'Medium' | 'Low';
        correction: string;
    }>;
    positive_findings?: Array<{
        finding: string;
        law: string;
        benefit: string;
    }>;
    disclaimer: string;
}

interface PolicyAuditorProps {
    onBack: () => void;
}

const PolicyAuditor: React.FC<PolicyAuditorProps> = ({ onBack }) => {
    const { setToastMessage } = useUIContext();
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<AuditResult | null>(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const allowedExtensions = ['pdf', 'docx'];
            const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

            if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                setToastMessage("Unsupported format. Please use PDF or DOCX.");
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            setFile(selectedFile);
        }
    };

    const runAudit = async () => {
        if (!file) return;

        setStatus('analyzing');
        setProgress(10);

        // Simulated progress steps for better UX
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + 5;
            });
        }, 1000);

        try {
            const auditData = await auditPolicy(file);
            // auditData is the full DB record, we want the audit_result jsonb
            setResult(auditData.audit_result);
            setStatus('complete');
            setProgress(100);
            clearInterval(interval);
        } catch (error: any) {
            console.error("Audit failed:", error);
            setStatus('error');
            setToastMessage(`Audit Error: ${error.message}`);
            clearInterval(interval);
        }
    };

    const handleDownloadReport = () => {
        if (!result) return;

        const dateStr = new Date().toLocaleDateString();
        const docTitle = `Legal_Audit_Report_${file?.name.split('.')[0] || 'Policy'}`;

        const highFlags = result.red_flags.filter(f => f.impact === 'High');
        const medFlags = result.red_flags.filter(f => f.impact === 'Medium');
        const lowFlags = result.red_flags.filter(f => f.impact === 'Low');

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #1a365d; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">HR COMPLIANCE AUDIT REPORT</h1>
                <p style="color: #64748b; font-size: 14px;">Generated on: ${dateStr}</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid ${result.score > 80 ? '#10b981' : result.score > 50 ? '#f59e0b' : '#ef4444'}">
                    <h2 style="margin: 0;">Overall Compliance Score: ${result.score}%</h2>
                    <p style="font-weight: bold; color: ${result.score > 80 ? '#059669' : result.score > 50 ? '#d97706' : '#dc2626'}">
                        Verdict: ${result.score > 80 ? 'EXCELLENT' : result.score > 50 ? 'ACTION REQUIRED' : 'CRITICAL NON-COMPLIANCE'}
                    </p>
                </div>

                <h3>Executive Summary</h3>
                <p style="line-height: 1.6;">${result.summary}</p>

                ${result.red_flags.length > 0 ? `
                    <h3 style="color: #dc2626; border-top: 1px solid #e2e8f0; pt: 20px; mt: 30px;">Identified Risks & Red Flags</h3>
                    ${result.red_flags.map(flag => `
                        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #fee2e2; border-radius: 8px; background-color: #fffafb;">
                            <p style="margin: 0; font-weight: bold; color: #b91c1c;">[${flag.impact} IMPACT] ${flag.issue}</p>
                            <p style="margin: 5px 0; font-size: 12px; color: #64748b;">RELEVANT LAW: ${flag.law}</p>
                            <p style="margin-top: 10px; font-style: italic; color: #1e293b; font-size: 14px;"><strong>Correction Required:</strong> ${flag.correction}</p>
                        </div>
                    `).join('')}
                ` : ''}

                ${result.positive_findings && result.positive_findings.length > 0 ? `
                    <h3 style="color: #047857; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">Compliant Aspects</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        ${result.positive_findings.map(found => `
                            <div style="padding: 10px; background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 6px;">
                                <p style="margin: 0; font-weight: bold; color: #166534; font-size: 13px;">${found.law}</p>
                                <p style="margin: 5px 0; font-size: 13px;">${found.finding}</p>
                                <p style="margin: 0; font-size: 11px; color: #64748b;">${found.benefit}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div style="margin-top: 50px; padding: 20px; border-top: 2px solid #e2e8f0; font-size: 10px; color: #94a3b8; font-style: italic;">
                    <p><strong>LEGAL DISCLAIMER:</strong> ${result.disclaimer}</p>
                    <p>&copy; ${new Date().getFullYear()} HR CoPilot. This report is generated by an AI Senior Labour Consultant and should be reviewed by a human professional.</p>
                </div>
            </div>
        `;

        const styledHtml = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="UTF-8"><title>${docTitle}</title>
            <style>@page { size: A4; margin: 1in; }</style></head>
            <body>${htmlContent}</body></html>
        `;

        const blob = new Blob([styledHtml], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${docTitle}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'High': return 'text-red-600 bg-red-50 border-red-100';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'Low': return 'text-blue-600 bg-blue-50 border-blue-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black text-secondary tracking-tight">AI Policy Auditor</h1>
                    <p className="text-gray-500 mt-2 font-medium">Scan your documents for South African Labour Law compliance.</p>
                </div>
                <button
                    onClick={onBack}
                    className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>

            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-[3rem] border-2 border-dashed border-gray-200 p-16 text-center group hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.docx"
                        />

                        <div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                            <FileUploadIcon className="w-10 h-10 text-primary" />
                        </div>

                        {file ? (
                            <div>
                                <h3 className="text-2xl font-black text-secondary mb-2">{file.name}</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for Scan</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); runAudit(); }}
                                    className="mt-10 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center mx-auto"
                                >
                                    Start Legal Audit
                                    <ArrowRightIcon className="w-5 h-5 ml-3" />
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-2xl font-black text-secondary mb-2">Upload HR Policy or Contract</h3>
                                <p className="text-gray-500 font-medium">Drag & drop your <strong>PDF</strong> or <strong>DOCX</strong> file here.</p>
                                <p className="text-gray-400 text-xs mt-2 font-medium italic">Note: Legacy .doc files are not supported. Please save as .docx first.</p>
                                <div className="mt-8 flex flex-wrap justify-center gap-4">
                                    <span className="bg-gray-50 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">BCEA Check</span>
                                    <span className="bg-gray-50 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">LRA Check</span>
                                    <span className="bg-gray-50 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">POPIA Screen</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {status === 'analyzing' && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-secondary rounded-[3.5rem] p-16 text-center text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-primary shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <div className="relative z-10">
                            <div className="bg-white/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse">
                                <LoadingIcon className="w-10 h-10 text-primary animate-spin" />
                            </div>
                            <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">AI Counselor is Reviewing...</h2>
                            <p className="text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] mb-12">Consulting SA Labour Law Library • {progress}%</p>

                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mb-2">
                                        <CheckIcon className="w-4 h-4 text-green-400" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-left opacity-50">Act 75 of 1997</p>
                                    <p className="text-xs font-bold text-left">BCEA Standards</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
                                        <CheckIcon className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-left opacity-50">Act 66 of 1995</p>
                                    <p className="text-xs font-bold text-left">LRA Compliance</p>
                                </div>
                            </div>
                        </div>

                        {/* Aesthetic background animation */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-0 opacity-50" />
                    </motion.div>
                )}

                {status === 'complete' && result && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 pb-20"
                    >
                        {/* Summary Card */}
                        <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl flex flex-col md:flex-row items-center gap-12">
                            <div className="relative w-48 h-48 flex-shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-50" />
                                    <motion.circle
                                        cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                                        strokeDasharray={552.92}
                                        strokeDashoffset={552.92 * (1 - result.score / 100)}
                                        className={`${result.score > 80 ? 'text-emerald-500' : result.score > 50 ? 'text-amber-500' : 'text-red-500'}`}
                                        initial={{ strokeDashoffset: 552.92 }}
                                        animate={{ strokeDashoffset: 552.92 * (1 - result.score / 100) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-secondary tracking-tighter">{result.score}%</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Score</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <ComplianceIcon className="w-5 h-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Auditor Verdict</span>
                                </div>
                                <h2 className="text-3xl font-black text-secondary leading-tight mb-4">{result.score > 80 ? 'Excellent Compliance' : result.score > 50 ? 'Action Required' : 'Critical Non-Compliance'}</h2>
                                <p className="text-gray-500 font-medium leading-relaxed">{result.summary}</p>
                            </div>
                        </div>

                        {/* Red Flags Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-6">
                                <h3 className="text-xl font-black text-secondary tracking-tight">Identified Red Flags ({result.red_flags.length})</h3>
                                <span className={`${result.red_flags.length > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'} px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest`}>
                                    {result.red_flags.length > 0 ? 'Action Required' : 'No Critical Issues'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {result.red_flags.map((flag, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-primary/30 transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${getImpactColor(flag.impact)}`}>
                                                <AlertIcon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest border px-3 py-1 rounded-lg ${getImpactColor(flag.impact)}`}>
                                                        {flag.impact} Impact
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                                                        {flag.law}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-black text-secondary mb-3">{flag.issue}</h4>

                                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-4">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">SLC Recommendation:</p>
                                                    <p className="text-sm font-medium text-gray-600 leading-relaxed italic">"{flag.correction}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Positive Findings Section */}
                        {result.positive_findings && result.positive_findings.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-6">
                                    <h3 className="text-xl font-black text-secondary tracking-tight">Compliant Aspects ({result.positive_findings.length})</h3>
                                    <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                                        Legally Secure
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {result.positive_findings.map((finding, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{finding.law}</p>
                                                <h4 className="font-bold text-secondary text-sm mb-1">{finding.finding}</h4>
                                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{finding.benefit}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 flex gap-4">
                            <InfoIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <p className="text-[10px] font-medium text-amber-800 leading-relaxed italic">
                                <strong>LEGAL DISCLAIMER:</strong> {result.disclaimer}
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-col md:flex-row gap-4 pt-8">
                            <button
                                onClick={onBack}
                                className="flex-1 bg-white border-2 border-gray-100 py-6 rounded-3xl font-black text-secondary uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center"
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={handleDownloadReport}
                                className="flex-1 bg-secondary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-secondary/20 flex items-center justify-center"
                            >
                                Download Legal Report
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PolicyAuditor;
