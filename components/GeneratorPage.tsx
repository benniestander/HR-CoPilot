
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Stepper from './Stepper';

import CompanyProfileSetup from './CompanyProfileSetup';
import GuidedQuestionnaire from './GuidedQuestionnaire';
import PolicyPreview from './PolicyPreview';
import { generatePolicyStream, generateFormStream } from '../services/geminiService';
import type { Policy, Form, CompanyProfile, FormAnswers, GeneratedDocument, AppStatus, Source, PolicyType, FormType } from '../types';
import { CheckIcon, LoadingIcon, EditIcon } from './Icons';
import { useDataContext } from '../contexts/DataContext';
import { useAuthContext } from '../contexts/AuthContext';
import { useUIContext } from '../contexts/UIContext';

interface GeneratorPageProps {
    selectedItem: Policy | Form;
    initialData: GeneratedDocument | null;
    userProfile: CompanyProfile;
    onDocumentGenerated: (doc: GeneratedDocument, originalId?: string, shouldNavigate?: boolean) => Promise<GeneratedDocument | undefined>;
    onBack: () => void;
}

const policyLoadingMessages = [
    "Analyzing your company profile...",
    "Consulting the Basic Conditions of Employment Act...",
    "Reviewing specific industry regulations...",
    "Drafting compliant legal clauses...",
    "Finalizing formatting and structure..."
];

const formLoadingMessages = [
    "Loading standard HR template...",
    "Applying your customization details...",
    "Ensuring legal compliance...",
    "Formatting for professional use..."
];

const GeneratorPage: React.FC<GeneratorPageProps> = ({ selectedItem, initialData, userProfile, onDocumentGenerated, onBack }) => {
    const { user } = useAuthContext();
    const { handleDeductCredit, getDocPrice } = useDataContext();
    const { isPrePaid, setIsPrePaid, setToastMessage } = useUIContext();

    const isPolicy = selectedItem.kind === 'policy';
    const isProfileSufficient = userProfile && userProfile.companyName && (!isPolicy || userProfile.industry);

    const STEPS = ["Profile", "Customize", "Finalize"];
    const [currentStep, setCurrentStep] = useState(() => {
        if (initialData) return 3;
        if (isProfileSufficient) return 2;
        return 1;
    });

    const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
        initialData?.companyProfile || (isProfileSufficient ? userProfile : null)
    );
    const [questionAnswers, setQuestionAnswers] = useState<FormAnswers>(initialData?.questionAnswers || {});
    const [generatedDocument, setGeneratedDocument] = useState<string>(initialData?.content || '');
    const [sources, setSources] = useState<Source[]>(initialData?.sources || []);
    const [status, setStatus] = useState<AppStatus>(initialData ? 'success' : 'idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [finalizedDoc, setFinalizedDoc] = useState<GeneratedDocument | null>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeducting, setIsDeducting] = useState(false);

    // Manage document ID locally to handle transition from Temp ID -> Real DB UUID
    const [docId, setDocId] = useState<string | undefined>(initialData?.id);

    const [hasPaidSession, setHasPaidSession] = useState(isPrePaid);

    useEffect(() => {
        if (isPrePaid) {
            setIsPrePaid(false);
        }
    }, []);

    const handleProfileSubmit = (profile: CompanyProfile) => {
        setCompanyProfile(profile);
        setCurrentStep(2);
    };

    const handleGenerate = useCallback(async () => {
        if (!selectedItem || !companyProfile || !user) return;

        let deductedAmount = 0;

        // 1. Handle PAYG Credit Deduction (CRIT-3 Safe Logic)
        if (user.plan === 'payg' && !initialData && !hasPaidSession) {
            setIsDeducting(true);

            const price = getDocPrice(selectedItem);

            if (price > 0) {
                const success = await handleDeductCredit(price, `Generated: ${selectedItem.title}`);
                setIsDeducting(false);
                if (!success) {
                    return;
                }
                deductedAmount = price;
                setHasPaidSession(true);
            } else {
                setIsDeducting(false);
            }
        }

        setCurrentStep(3);
        setStatus('loading');
        setGeneratedDocument('');
        setSources([]);
        setErrorMessage(null);

        const allAnswers: FormAnswers = { ...companyProfile, ...questionAnswers };

        try {
            let fullText = '';
            let finalSources: Source[] = [];
            if (selectedItem.kind === 'policy') {
                const stream = generatePolicyStream(selectedItem.type, allAnswers);
                for await (const chunk of stream) {
                    if (chunk.text) {
                        fullText += chunk.text;
                        setGeneratedDocument(prev => prev + chunk.text);
                    }
                    // Handle Grounding Metadata from Edge Function Chunk
                    if (chunk.groundingMetadata?.groundingChunks) {
                        const newSources = chunk.groundingMetadata.groundingChunks;
                        const uniqueNewSources: Source[] = newSources
                            .filter((s: any) => s.web?.uri)
                            .map((s: any) => ({ web: { uri: s.web!.uri!, title: s.web!.title || s.web!.uri! } }));

                        finalSources = [...finalSources, ...uniqueNewSources].reduce((acc, current) => {
                            if (!acc.find(item => item.web?.uri === current.web?.uri)) {
                                acc.push(current);
                            }
                            return acc;
                        }, [] as Source[]);

                        setSources(finalSources);
                    }
                }
            } else {
                const stream = generateFormStream(selectedItem.type, allAnswers);
                for await (const chunk of stream) {
                    if (chunk) {
                        fullText += chunk;
                        setGeneratedDocument(prev => prev + chunk);
                    }
                }
            }
            setStatus('success');

            const newDoc: GeneratedDocument = {
                id: docId || `${selectedItem.type}-${Date.now()}`,
                title: selectedItem.title,
                kind: selectedItem.kind,
                type: selectedItem.type,
                content: fullText,
                createdAt: new Date().toISOString(),
                companyProfile,
                questionAnswers,
                outputFormat: selectedItem.kind === 'form' ? selectedItem.outputFormat : 'word',
                sources: finalSources,
                version: initialData?.version || 0
            };
            setFinalizedDoc(newDoc);

            try {
                const savedDoc = await onDocumentGenerated(newDoc, docId, false);
                if (savedDoc) {
                    setFinalizedDoc(savedDoc);
                    setDocId(savedDoc.id);
                    setToastMessage("Auto-saved to documents.");
                }
            } catch (err) {
                console.warn("Auto-save failed:", err);
            }

        } catch (error: any) {
            console.error('Failed to generate document:', error);
            setStatus('error');
            setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');

            // CRIT-3 FIX: Compensating Transaction (Refund)
            if (deductedAmount > 0) {
                try {
                    await handleDeductCredit(-deductedAmount, `Refund: Generation Failed (${selectedItem.title})`);
                    setHasPaidSession(false);
                    setToastMessage("Generation failed. Your credits have been refunded.");
                } catch (refundError) {
                    console.error("Refund failed:", refundError);
                    setToastMessage("Generation failed. Please contact support regarding your credit refund.");
                }
            }
        }
    }, [selectedItem, companyProfile, questionAnswers, initialData, user, handleDeductCredit, hasPaidSession, docId, onDocumentGenerated, setToastMessage, getDocPrice]);

    const handleContentChange = (newContent: string) => {
        if (finalizedDoc) {
            setFinalizedDoc(prev => prev ? ({ ...prev, content: newContent }) : null);
        }
    };

    const handleSaveDocument = async () => {
        if (finalizedDoc) {
            setIsSaving(true);
            try {
                await onDocumentGenerated(finalizedDoc, docId, true);
            } catch (error) {
                console.error("Error saving document:", error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <CompanyProfileSetup
                            item={selectedItem}
                            initialProfile={userProfile}
                            onProfileSubmit={handleProfileSubmit}
                            onBack={onBack}
                        />
                    </motion.div>
                );

            case 2:
                if (!companyProfile) {
                    setCurrentStep(1);
                    return null;
                }
                if (isDeducting) {
                    return (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md">
                            <LoadingIcon className="w-12 h-12 animate-spin text-primary mb-4" />
                            <h3 className="text-xl font-bold text-secondary">Processing Payment...</h3>
                            <p className="text-gray-600">Please wait while we secure your document generation.</p>
                        </div>
                    )
                }
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <GuidedQuestionnaire
                            item={selectedItem}
                            companyProfile={companyProfile}
                            initialAnswers={questionAnswers}
                            onAnswersChange={setQuestionAnswers}
                            onGenerate={handleGenerate}
                        />
                    </motion.div>
                );

            case 3:
                if (!companyProfile) {
                    setCurrentStep(1);
                    return null;
                }
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <PolicyPreview
                            policyText={generatedDocument}
                            status={status}
                            onRetry={handleGenerate}
                            isForm={selectedItem.kind === 'form'}
                            outputFormat={selectedItem.kind === 'form' ? selectedItem.outputFormat : 'word'}
                            sources={sources}
                            errorMessage={errorMessage}
                            loadingMessages={selectedItem.kind === 'policy' ? policyLoadingMessages : formLoadingMessages}
                            onContentChange={handleContentChange}
                        />
                        {status === 'success' && (
                            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white/40 gap-6">
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                                    <button onClick={onBack} disabled={isSaving} className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 whitespace-nowrap">
                                        Discard
                                    </button>
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        disabled={isSaving}
                                        className="text-xs font-black uppercase tracking-[0.2em] text-primary hover:text-secondary flex items-center disabled:opacity-50 whitespace-nowrap transition-colors"
                                    >
                                        <EditIcon className="w-4 h-4 mr-2" />
                                        Refine Answers
                                    </button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveDocument}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto bg-primary text-white font-black text-xs uppercase tracking-[0.25em] py-5 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <><LoadingIcon className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" /> Saving...</> : <><CheckIcon className="w-4 h-4 mr-3" /> Secure to Vault</>}
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} isStepClickable={!!companyProfile && !isSaving && !isDeducting} />
            <div className="mt-8">
                <AnimatePresence mode="wait">
                    {renderStepContent()}
                </AnimatePresence>
            </div>

        </div>
    );
};

export default GeneratorPage;
