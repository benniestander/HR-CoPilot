import React, { useState, useCallback, useEffect } from 'react';
import Stepper from './Stepper';
import CompanyProfileSetup from './CompanyProfileSetup';
import Questionnaire from './Questionnaire';
import PolicyPreview from './PolicyPreview';
import { generatePolicyStream, generateFormStream } from '../services/geminiService';
import type { Policy, Form, CompanyProfile, FormAnswers, GeneratedDocument, AppStatus, Source } from '../types';
import { marked } from 'https://esm.sh/marked@12';


interface GeneratorPageProps {
    selectedItem: Policy | Form;
    initialData: GeneratedDocument | null;
    onDocumentGenerated: (doc: GeneratedDocument) => void;
    onBack: () => void;
}

const GeneratorPage: React.FC<GeneratorPageProps> = ({ selectedItem, initialData, onDocumentGenerated, onBack }) => {
    const STEPS = ["Profile", "Customize", "Finalize"];
    const [currentStep, setCurrentStep] = useState(initialData ? 3 : 1);

    const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(initialData?.companyProfile || null);
    const [questionAnswers, setQuestionAnswers] = useState<FormAnswers>(initialData?.questionAnswers || {});
    const [generatedDocument, setGeneratedDocument] = useState<string>(initialData?.content || '');
    const [sources, setSources] = useState<Source[]>(initialData?.sources || []);
    const [status, setStatus] = useState<AppStatus>(initialData ? 'success' : 'idle');
    
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

        const allAnswers: FormAnswers = { ...companyProfile, ...questionAnswers };

        try {
            let fullText = '';
            if (selectedItem.kind === 'policy') {
                const stream = generatePolicyStream(selectedItem.type, allAnswers);
                for await (const chunk of stream) {
                    if (chunk.text) {
                        fullText += chunk.text;
                        setGeneratedDocument(prev => prev + chunk.text);
                    }
                    const newSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                    if (newSources) {
                        setSources(prevSources => {
                            const existingUris = new Set(prevSources.map(s => s.web?.uri));
                            const uniqueNewSources: Source[] = newSources
                                .filter(s => s.web?.uri && !existingUris.has(s.web.uri))
                                .map(s => ({ web: { uri: s.web!.uri!, title: s.web!.title || s.web!.uri! } }));
                            return [...prevSources, ...uniqueNewSources];
                        });
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
            
            // Only create a new document if it's not a view/edit session
            if (!initialData) {
                const newDoc: GeneratedDocument = {
                    id: `${selectedItem.type}-${Date.now()}`,
                    title: selectedItem.title,
                    kind: selectedItem.kind,
                    type: selectedItem.type,
                    content: fullText,
                    createdAt: new Date().toISOString(),
                    companyProfile,
                    questionAnswers,
                    outputFormat: selectedItem.kind === 'form' ? selectedItem.outputFormat : 'word',
                    sources: selectedItem.kind === 'policy' ? sources : []
                };
                onDocumentGenerated(newDoc);
            }

        } catch (error) {
            console.error('Failed to generate document:', error);
            setStatus('error');
        }
    }, [selectedItem, companyProfile, questionAnswers, initialData, onDocumentGenerated]);

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
                return <CompanyProfileSetup item={selectedItem} onProfileSubmit={handleProfileSubmit} onBack={onBack} />;
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
                     <PolicyPreview
                        policyText={generatedDocument}
                        status={status}
                        onRetry={handleGenerate}
                        isForm={selectedItem.kind === 'form'}
                        outputFormat={selectedItem.kind === 'form' ? selectedItem.outputFormat : 'word'}
                        sources={sources}
                    />
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
