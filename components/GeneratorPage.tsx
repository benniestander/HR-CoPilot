
import React, { useState, useCallback, useEffect } from 'react';
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
import { POLICIES, FORMS } from '../constants';

interface GeneratorPageProps {
    selectedItem: Policy | Form;
    initialData: GeneratedDocument | null;
    userProfile: CompanyProfile;
    onDocumentGenerated: (doc: GeneratedDocument, originalId?: string) => Promise<void>;
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
    const { handleDeductCredit } = useDataContext();
    const { isPrePaid, setIsPrePaid } = useUIContext();
    
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
    
    // Initialize hasPaidSession with true if we came from Dashboard with isPrePaid flag
    const [hasPaidSession, setHasPaidSession] = useState(isPrePaid);

    // Reset global pre-paid flag so if they navigate away and back, they don't skip payment next time
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

        // 1. Handle PAYG Credit Deduction (Fallback Logic)
        // If NOT prepaid in Dashboard (e.g., direct link or edge case) and not previously paid in session:
        if (user.plan === 'payg' && !initialData && !hasPaidSession) {
            setIsDeducting(true);
            let price = 0;
            if (selectedItem.kind === 'policy') {
                price = POLICIES[selectedItem.type as PolicyType]?.price || 0;
            } else {
                price = FORMS[selectedItem.type as FormType]?.price || 0;
            }

            if (price > 0) {
                const success = await handleDeductCredit(price, `Generated: ${selectedItem.title}`);
                setIsDeducting(false);
                if (!success) {
                    return; 
                }
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
                    const newSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                    if (newSources) {
                        const uniqueNewSources: Source[] = newSources
                            .filter(s => s.web?.uri)
                            .map(s => ({ web: { uri: s.web!.uri!, title: s.web!.title || s.web!.uri! } }));
                        
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
                    fullText += chunk;
                    setGeneratedDocument(prev => prev + chunk);
                }
            }
            setStatus('success');
            
            const newDoc: GeneratedDocument = {
                id: initialData?.id || `${selectedItem.type}-${Date.now()}`,
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

        } catch (error: any) {
            console.error('Failed to generate document:', error);
            setStatus('error');
            setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
        }
    }, [selectedItem, companyProfile, questionAnswers, initialData, user, handleDeductCredit, hasPaidSession]);

    const handleSaveDocument = async () => {
        if (finalizedDoc) {
            setIsSaving(true);
            try {
                await onDocumentGenerated(finalizedDoc, initialData?.id);
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
                return <CompanyProfileSetup 
                            item={selectedItem}
                            initialProfile={userProfile}
                            onProfileSubmit={handleProfileSubmit} 
                            onBack={onBack} 
                        />;
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
                    <GuidedQuestionnaire
                        item={selectedItem}
                        companyProfile={companyProfile}
                        initialAnswers={questionAnswers}
                        onAnswersChange={setQuestionAnswers}
                        onGenerate={handleGenerate}
                    />
                );
            case 3:
                 if (!companyProfile) { 
                    setCurrentStep(1);
                    return null;
                }
                return (
                    <div>
                        <PolicyPreview
                            policyText={generatedDocument}
                            status={status}
                            onRetry={handleGenerate}
                            isForm={selectedItem.kind === 'form'}
                            outputFormat={selectedItem.kind === 'form' ? selectedItem.outputFormat : 'word'}
                            sources={sources}
                            errorMessage={errorMessage}
                            loadingMessages={selectedItem.kind === 'policy' ? policyLoadingMessages : formLoadingMessages}
                        />
                        {status === 'success' && (
                             <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-md border border-gray-200 gap-4">
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                                    <button onClick={onBack} disabled={isSaving} className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 whitespace-nowrap">
                                        Cancel & Start Over
                                    </button>
                                    <button 
                                        onClick={() => setCurrentStep(2)} 
                                        disabled={isSaving}
                                        className="text-sm font-bold text-primary hover:underline flex items-center disabled:opacity-50 whitespace-nowrap"
                                    >
                                        <EditIcon className="w-4 h-4 mr-1" />
                                        Edit Details & Regenerate
                                    </button>
                                </div>
                                <button
                                    onClick={handleSaveDocument}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <><LoadingIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /> Saving...</> : <><CheckIcon className="w-5 h-5 mr-2" /> Save Document</>}
                                </button>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} isStepClickable={!!companyProfile && !isSaving && !isDeducting} />
            <div className="mt-8">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default GeneratorPage;
