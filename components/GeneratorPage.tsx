import React, { useState, useCallback, useEffect } from 'react';
import Stepper from './Stepper';
import CompanyProfileSetup from './CompanyProfileSetup';
import Questionnaire from './Questionnaire';
import PolicyPreview from './PolicyPreview';
import { generatePolicyStream, generateFormStream } from '../services/geminiService';
import type { Policy, Form, CompanyProfile, FormAnswers, GeneratedDocument, AppStatus, Source } from '../types';
import { marked } from 'https://esm.sh/marked@12';
import { CheckIcon } from './Icons';


interface GeneratorPageProps {
    selectedItem: Policy | Form;
    initialData: GeneratedDocument | null;
    userProfile: CompanyProfile;
    onDocumentGenerated: (doc: GeneratedDocument, originalId?: string) => void;
    onBack: () => void;
}

const GeneratorPage: React.FC<GeneratorPageProps> = ({ selectedItem, initialData, userProfile, onDocumentGenerated, onBack }) => {
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
    
    const isLivePreviewVisible = currentStep === 2 && companyProfile;

    const handleProfileSubmit = (profile: CompanyProfile) => {
        setCompanyProfile(profile);
        setCurrentStep(2);
    };

    const handleGenerate = useCallback(async () => {
        if (!selectedItem || !companyProfile) return;

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
                version: initialData?.version || 0 // Version is handled by parent
            };
            setFinalizedDoc(newDoc);

        } catch (error: any) {
            console.error('Failed to generate document:', error);
            setStatus('error');
            setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
        }
    }, [selectedItem, companyProfile, questionAnswers, initialData]);

    const handleSaveDocument = () => {
        if (finalizedDoc) {
            onDocumentGenerated(finalizedDoc, initialData?.id);
        }
    };

    const LivePreview: React.FC = () => {
      const [liveHtml, setLiveHtml] = useState('');

      useEffect(() => {
        async function updatePreview() {
            if (selectedItem.kind === 'form') {
                let template = selectedItem.title; // simple preview for forms
                const html = await marked.parse(template);
                setLiveHtml(html);
            }
        }
        updatePreview();
      }, [questionAnswers, companyProfile]);
      
      return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200 h-full">
            <h3 className="text-xl font-bold text-secondary mb-4">Live Preview</h3>
            <div className="prose prose-sm max-w-none p-4 border border-dashed border-gray-300 rounded-md bg-white min-h-[200px]">
                <div dangerouslySetInnerHTML={{ __html: liveHtml }} />
                 <p className="text-center text-gray-400 mt-4"><i>Full document will be generated in the final step.</i></p>
            </div>
        </div>
      );
    }

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
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Questionnaire
                            item={selectedItem}
                            companyProfile={companyProfile}
                            answers={questionAnswers}
                            onAnswersChange={setQuestionAnswers}
                            onGenerate={handleGenerate}
                            status={status}
                        />
                        <LivePreview />
                    </div>
                );
            case 3:
                 if (!companyProfile) { // Should not happen, but as a fallback
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
                        />
                        {status === 'success' && (
                             <div className="mt-8 flex justify-between items-center bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <button onClick={onBack} className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                                    Cancel & Start Over
                                </button>
                                <button
                                    onClick={handleSaveDocument}
                                    className="bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center"
                                >
                                    <CheckIcon className="w-5 h-5 mr-2" />
                                    Save Document
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
            <Stepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} isStepClickable={!!companyProfile} />
            <div className="mt-8">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default GeneratorPage;