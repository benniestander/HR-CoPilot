import React, { useState, useMemo } from 'react';
import { generateComplianceChecklist } from '../services/geminiService';
import type { ComplianceChecklistResult, Policy, Form } from '../types';
import { LoadingIcon, DownloadIcon, ComplianceIcon, MasterPolicyIcon, FormsIcon } from './Icons';
import { POLICIES, FORMS } from '../constants';

interface ComplianceChecklistProps {
  onBack: () => void;
  onSelectItem: (item: Policy | Form) => void;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ onBack, onSelectItem }) => {
  const [businessDescription, setBusinessDescription] = useState('');
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
    if (!businessDescription.trim()) return;
    setStatus('loading');
    setError(null);
    setResult(null);
    try {
      const checklistResult = await generateComplianceChecklist(businessDescription);
      setResult(checklistResult);
      setStatus('success');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred while generating the checklist.');
      setStatus('error');
    }
  };
  
  const handleDownload = () => {
    if (!result) return;
    
    const checklistHtml = `
      <!DOCTYPE html><html><head><meta charset="UTF-8"><title>HR Compliance Checklist</title>
      <style>body{font-family:Calibri,sans-serif;font-size:11pt;line-height:1.4}h1,h2{color:#143a67}h1{border-bottom:2px solid #188693;padding-bottom:5px}table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #ccc;padding:8px;text-align:left}.checkbox-col{width:40px}</style></head>
      <body><h1>HR Checklist for ${businessDescription.substring(0, 50)}...</h1><h2>Policies</h2><table><thead><tr><th class="checkbox-col">Done</th><th>Policy</th><th>Reason</th></tr></thead><tbody>
      ${result.policies.map(item => `<tr><td class="checkbox-col">☐</td><td>${item.name}</td><td>${item.reason}</td></tr>`).join('')}
      </tbody></table><h2>Forms</h2><table><thead><tr><th class="checkbox-col">Done</th><th>Form</th><th>Reason</th></tr></thead><tbody>
      ${result.forms.map(item => `<tr><td class="checkbox-col">☐</td><td>${item.name}</td><td>${item.reason}</td></tr>`).join('')}
      </tbody></table></body></html>`;

    const blob = new Blob([checklistHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HR_Compliance_Checklist.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderResults = () => {
    if (status !== 'success' || !result) return null;
    
    const renderItem = (item: { name: string; reason: string }, index: number, type: 'policy' | 'form') => {
      const matchingItem = nameToItemMap.get(item.name.toLowerCase());
      const Icon = type === 'policy' ? MasterPolicyIcon : FormsIcon;

      if (matchingItem) {
        return (
          <button
            key={`${type}-${index}`}
            onClick={() => onSelectItem(matchingItem)}
            className="w-full text-left p-4 border rounded-md bg-white hover:bg-light shadow-sm transition-all flex items-start space-x-4"
          >
            <Icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-secondary">{item.name}</p>
              <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
              <span className="text-sm font-bold text-primary mt-2 inline-block">Generate this {type} →</span>
            </div>
          </button>
        );
      }
      return (
         <div key={`${type}-${index}`} className="p-4 border rounded-md bg-gray-100 flex items-start space-x-4">
            <Icon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
            <div>
                <p className="font-semibold text-gray-700">{item.name}</p>
                <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
            </div>
        </div>
      );
    };

    return (
      <div className="mt-8">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-secondary">Your Actionable Compliance Checklist</h2>
            <p className="text-gray-600 mt-2">Based on your description, here are the essential HR documents. Click any item to generate it.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-right mb-4"><button onClick={handleDownload} className="inline-flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-opacity-90"><DownloadIcon className="w-5 h-5 mr-2" />Download as Word Doc</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Recommended Policies</h3>
                    <div className="space-y-4">{result.policies.map((item, i) => renderItem(item, i, 'policy'))}</div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Recommended Forms</h3>
                    <div className="space-y-4">{result.forms.map((item, i) => renderItem(item, i, 'form'))}</div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
            <ComplianceIcon className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-secondary">HR Compliance Checklist Generator</h2>
            <p className="text-gray-600 mt-2 mb-6 max-w-3xl mx-auto">Describe your business, including your industry, number of employees, and the type of work they do. Our AI will generate a personalized checklist of essential HR documents.</p>
        </div>
        
        <textarea
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          placeholder="e.g., We are a small construction company in Cape Town with 15 employees. Our team includes general labourers, bricklayers, and a site foreman. They work on various building sites and operate heavy machinery."
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm h-40 resize-y focus:ring-primary focus:border-primary"
          aria-label="Business description input"
          disabled={status === 'loading'}
        />

        <div className="mt-6 flex justify-center">
            <button
            onClick={handleGenerate}
            disabled={status === 'loading' || !businessDescription.trim()}
            className="w-full max-w-xs bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
            {status === 'loading' ? (<><LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />Generating...</>) : ('Generate My Checklist')}
            </button>
        </div>

        {status === 'error' && <p className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
      </div>
      
      {renderResults()}
    </div>
  );
};

export default ComplianceChecklist;