import React, { useState, useMemo } from 'react';
import { generateComplianceChecklist } from '../services/geminiService';
import type { ComplianceChecklistResult, Policy, Form, CompanyProfile, GeneratedDocument } from '../types';
import { LoadingIcon, DownloadIcon, ComplianceIcon, MasterPolicyIcon, FormsIcon } from './Icons';
import { POLICIES, FORMS } from '../constants';

interface ComplianceChecklistProps {
  userProfile: CompanyProfile;
  generatedDocuments: GeneratedDocument[];
  onBack: () => void;
  onSelectItem: (item: Policy | Form) => void;
  onViewDocument: (doc: GeneratedDocument) => void;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ 
  userProfile,
  generatedDocuments,
  onBack, 
  onSelectItem,
  onViewDocument,
}) => {
  const [result, setResult] = useState<ComplianceChecklistResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const nameToItemMap = useMemo(() => {
    const map = new Map<string, Policy | Form>();
    Object.values(POLICIES).forEach(p => map.set(p.title.toLowerCase(), p));
    Object.values(FORMS).forEach(f => map.set(f.title.toLowerCase(), f));
    return map;
  }, []);

  const handleGenerate = async () => {
    setStatus('loading');
    setError(null);
    setResult(null);
    try {
      const checklistResult = await generateComplianceChecklist(userProfile);
      setResult(checklistResult);
      setStatus('success');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred while generating the checklist.');
      setStatus('error');
    }
  };
  
  const handleDownload = () => {
    if (!result) return;

    const isGenerated = (itemName: string) => {
        const matchingItem = nameToItemMap.get(itemName.toLowerCase());
        return generatedDocuments.some(doc => doc.type === matchingItem?.type);
    };

    let content = `# HR Compliance Checklist for ${userProfile.companyName}\n\n`;
    
    content += `## Recommended Policies\n\n`;
    result.policies.forEach(p => {
        content += `- [${isGenerated(p.name) ? 'x' : ' '}] ${p.name}\n`;
        content += `  - *Reason: ${p.reason}*\n\n`;
    });

    content += `## Recommended Forms\n\n`;
    result.forms.forEach(f => {
        content += `- [${isGenerated(f.name) ? 'x' : ' '}] ${f.name}\n`;
        content += `  - *Reason: ${f.reason}*\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HR_Checklist_${userProfile.companyName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleStartOver = () => {
    setResult(null);
    setStatus('idle');
  };

  const renderItem = (item: { name: string; reason: string }, type: 'policy' | 'form') => {
      const matchingItem = nameToItemMap.get(item.name.toLowerCase());
      const generatedDoc = generatedDocuments.find(doc => doc.type === matchingItem?.type);
      const isGenerated = !!generatedDoc;

      return (
        <div key={`${type}-${item.name}`} className="flex items-start space-x-4 p-4 border rounded-md bg-white shadow-sm">
            <input 
                type="checkbox" 
                checked={isGenerated} 
                readOnly 
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                aria-label={isGenerated ? `Completed: ${item.name}` : `Incomplete: ${item.name}`}
            />
            <div className="flex-1">
                <p className="font-semibold text-secondary">{item.name}</p>
                <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
            </div>
            {matchingItem && (
                 <button 
                    onClick={() => isGenerated ? onViewDocument(generatedDoc) : onSelectItem(matchingItem)}
                    className={`flex-shrink-0 px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                        isGenerated 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-primary text-white hover:bg-opacity-90'
                    }`}
                 >
                    {isGenerated ? 'View' : 'Generate'}
                 </button>
            )}
        </div>
      );
    };

  if (status === 'success' && result) {
     return (
        <div>
            <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Back to Dashboard
            </button>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-secondary">Your Actionable Compliance Checklist</h2>
                <p className="text-gray-600 mt-2 max-w-3xl mx-auto">This is your personalized action plan. Click any item to generate it, and watch your progress update automatically.</p>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center mb-6 gap-4">
                    <button onClick={handleStartOver} className="text-sm font-semibold text-gray-600 hover:text-primary">Start Over</button>
                    <button onClick={handleDownload} className="inline-flex items-center px-4 py-2 bg-white text-primary border border-primary font-semibold rounded-md hover:bg-primary/10"><DownloadIcon className="w-5 h-5 mr-2" />Download as Markdown</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2 flex items-center"><MasterPolicyIcon className="w-6 h-6 mr-3 text-primary" />Recommended Policies</h3>
                        <div className="space-y-4">{result.policies.map((item, i) => renderItem(item, 'policy'))}</div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2 flex items-center"><FormsIcon className="w-6 h-6 mr-3 text-primary" />Recommended Forms</h3>
                        <div className="space-y-4">{result.forms.map((item, i) => renderItem(item, 'form'))}</div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // FIX: Refactored to handle idle, loading, and error states in one block to resolve TypeScript control-flow error.
  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
          {status === 'loading' ? (
            <>
              <LoadingIcon className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-secondary">Generating Your Personalized Checklist...</h2>
              <p className="text-gray-600 mt-2">Analyzing your company profile to recommend the best documents for you.</p>
            </>
          ) : (
            <>
              <ComplianceIcon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-secondary">HR Compliance Checklist Generator</h2>
              <p className="text-gray-600 mt-2 mb-6 max-w-3xl mx-auto">Click the button below to generate a personalized checklist of essential HR documents based on your saved company profile.</p>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-center">
            <button
            onClick={handleGenerate}
            disabled={status === 'loading'}
            className="w-full max-w-xs bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
            {status === 'loading' ? (<><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />Generating...</>) : ('Generate My Checklist')}
            </button>
        </div>

        {status === 'error' && <p className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
      </div>
    </div>
  );
};

export default ComplianceChecklist;
