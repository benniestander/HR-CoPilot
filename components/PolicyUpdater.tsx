import React, { useState, useMemo } from 'react';
import { updatePolicy } from '../services/geminiService';
import type { GeneratedDocument, PolicyUpdateResult } from '../types';
import { LoadingIcon, UpdateIcon, CheckIcon, HistoryIcon } from './Icons';

// Simple Diffing function (line-based)
const createDiff = (original: string, updated: string) => {
    const originalLines = original.split('\n');
    const updatedLines = updated.split('\n');
    const diff: { type: 'added' | 'removed' | 'same'; line: string }[] = [];
    let i = 0, j = 0;
    while (i < originalLines.length || j < updatedLines.length) {
        if (i < originalLines.length && j < updatedLines.length && originalLines[i] === updatedLines[j]) {
            diff.push({ type: 'same', line: originalLines[i] });
            i++; j++;
        } else {
            const lookahead = updatedLines.indexOf(originalLines[i], j);
            if (i < originalLines.length && (lookahead === -1 || lookahead > j + 5)) {
                diff.push({ type: 'removed', line: originalLines[i] });
                i++;
            } else if (j < updatedLines.length) {
                diff.push({ type: 'added', line: updatedLines[j] });
                j++;
            }
        }
    }
    return diff;
};

const DiffViewer: React.FC<{ originalText: string; updatedText: string }> = ({ originalText, updatedText }) => {
    const diff = createDiff(originalText, updatedText);

    return (
        <div className="font-mono text-sm border border-gray-200 rounded-md bg-white p-2 whitespace-pre-wrap break-words overflow-x-auto">
            {diff.map((item, index) => {
                let lineClass = 'flex w-full px-2 py-0.5';
                let symbol = '';
                let symbolClass = 'text-gray-500';

                if (item.type === 'added') {
                    lineClass += ' bg-green-50';
                    symbol = '+';
                    symbolClass = 'text-green-600 font-bold';
                } else if (item.type === 'removed') {
                    lineClass += ' bg-red-50';
                    symbol = '-';
                    symbolClass = 'text-red-600 font-bold';
                } else {
                    symbol = ' ';
                }

                return (
                    <div key={index} className={lineClass}>
                        <span className={`w-6 text-center flex-shrink-0 select-none ${symbolClass}`}>{symbol}</span>
                        <span className="flex-grow pl-2">{item.line}</span>
                    </div>
                );
            })}
        </div>
    );
};


interface PolicyUpdaterProps {
  onBack: () => void;
  generatedDocuments: GeneratedDocument[];
  onDocumentGenerated: (doc: GeneratedDocument, originalId: string) => void;
}

type HistoryItem = { version: number; createdAt: string; content: string };

const PolicyUpdater: React.FC<PolicyUpdaterProps> = ({ onBack, generatedDocuments, onDocumentGenerated }) => {
  const [step, setStep] = useState<'select' | 'chooseMethod' | 'review'>('select');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [updateMethod, setUpdateMethod] = useState<'ai' | 'manual' | null>(null);
  const [manualInstructions, setManualInstructions] = useState('');
  const [updateResult, setUpdateResult] = useState<PolicyUpdateResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const selectedDocument = useMemo(() => {
    return generatedDocuments.find(d => d.id === selectedDocId);
  }, [selectedDocId, generatedDocuments]);

  const handleUpdate = async () => {
    if (!selectedDocument || !updateMethod) return;
    if (updateMethod === 'manual' && !manualInstructions.trim()) return;

    setStatus('loading');
    setError(null);
    setUpdateResult(null);
    setStep('review');

    try {
      const result = await updatePolicy(
        selectedDocument.content,
        updateMethod === 'manual' ? manualInstructions : undefined
      );
      setUpdateResult(result);
      setStatus('success');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setStatus('error');
    }
  };
  
  const handleConfirmAndSave = () => {
    if (!updateResult || !selectedDocument) return;

    const newDoc: GeneratedDocument = {
      ...selectedDocument,
      content: updateResult.updatedPolicyText,
    };

    onDocumentGenerated(newDoc, selectedDocument.id);
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setIsHistoryModalOpen(true);
  };

  const handleRevertToVersion = (historyItem: HistoryItem) => {
    if (!selectedDocument) return;

    if (window.confirm(`Are you sure you want to revert to Version ${historyItem.version}? Your current version (${selectedDocument.version}) will be archived, and this content will become the new latest version.`)) {
        const revertedDoc: GeneratedDocument = {
            ...selectedDocument,
            content: historyItem.content,
        };
        
        onDocumentGenerated(revertedDoc, selectedDocument.id);
        
        setIsHistoryModalOpen(false);
    }
  };


  const renderSelectStep = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary">Update Your HR Policy</h2>
        <p className="text-gray-600 mt-2 mb-6 max-w-3xl mx-auto">First, select a previously generated document to update or review.</p>
      </div>
      {generatedDocuments.length > 0 ? (
        <div className="max-w-xl mx-auto">
          <label htmlFor="document-select" className="block text-sm font-medium text-gray-700">Select a document:</label>
          <select
            id="document-select"
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white"
          >
            <option value="" disabled>Choose a document...</option>
            {generatedDocuments.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.title} (v{doc.version})</option>
            ))}
          </select>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setStep('chooseMethod')}
              disabled={!selectedDocId}
              className="w-full max-w-xs bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-md">
            <p className="text-gray-700 font-semibold">No documents found.</p>
            <p className="text-sm text-gray-500 mt-1">You need to generate a document before you can update it.</p>
        </div>
      )}
    </div>
  );

  const renderChooseMethodStep = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-secondary mb-1">Update: <span className="text-primary">{selectedDocument?.title}</span></h2>
      <p className="text-gray-600 mb-6">How would you like to update this document?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Review Card */}
        <div 
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${updateMethod === 'ai' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
          onClick={() => setUpdateMethod('ai')}
        >
          <h3 className="text-lg font-bold text-secondary">Automated AI Compliance Review</h3>
          <p className="text-sm text-gray-600 mt-2">Let our AI analyze your entire document for compliance with the latest South African labour laws and suggest improvements.</p>
        </div>

        {/* Manual Input Card */}
        <div 
          className={`p-6 border-2 rounded-lg transition-all ${updateMethod === 'manual' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
        >
          <div className="cursor-pointer" onClick={() => setUpdateMethod('manual')}>
            <h3 className="text-lg font-bold text-secondary">Update with My Instructions</h3>
            <p className="text-sm text-gray-600 mt-2">Provide specific instructions for the AI on what you want to change, add, or remove.</p>
          </div>
          {updateMethod === 'manual' && (
            <textarea
              value={manualInstructions}
              onChange={(e) => setManualInstructions(e.target.value)}
              placeholder="e.g., 'Change the annual leave days to 21.' or 'Add a new section about our social media policy.'"
              className="mt-4 w-full p-2 border rounded-md shadow-sm h-28 resize-y focus:ring-primary focus:border-primary border-gray-300"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </div>
        
      {/* Version History Section */}
      {selectedDocument?.history && selectedDocument.history.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-bold text-secondary mb-4 flex items-center">
            <HistoryIcon className="w-6 h-6 mr-3 text-primary" />
            Version History
          </h3>
          <ul className="space-y-3">
            {selectedDocument.history.map(item => (
              <li key={item.version} className="flex justify-between items-center p-3 bg-light rounded-md border border-gray-200">
                <div>
                  <p className="font-semibold text-secondary">Version {item.version}</p>
                  <p className="text-xs text-gray-500">
                    Saved on {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleViewHistoryItem(item)}
                  className="px-3 py-1.5 text-sm font-semibold text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  View Version
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <button onClick={() => setStep('select')} className="text-sm font-semibold text-gray-600 hover:text-primary">Back to selection</button>
        <button
          onClick={handleUpdate}
          disabled={!updateMethod || (updateMethod === 'manual' && !manualInstructions.trim())}
          className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center"
        >
          <UpdateIcon className="w-5 h-5 mr-2" />
          Analyze & Update
        </button>
      </div>
    </div>
  );
  
  const renderReviewStep = () => {
    if (status === 'loading') {
      return <div className="text-center p-12 bg-white rounded-lg shadow-md"><LoadingIcon className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" /><h3 className="text-lg font-semibold">Analyzing your document...</h3></div>;
    }
    if (status === 'error') {
      return <div className="text-center text-red-600 bg-red-50 p-6 rounded-md"><h3 className="text-lg font-semibold mb-2">An Error Occurred</h3><p className="mb-4">{error}</p><button onClick={handleUpdate} className="bg-primary text-white font-semibold py-2 px-4 rounded-md">Retry</button></div>;
    }
    if (status === 'success' && updateResult) {
      return (
        <div>
            <h2 className="text-3xl font-bold text-secondary mb-6 text-center">Analysis Complete</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                    <h3 className="text-xl font-bold text-secondary mb-4">Visual Comparison</h3>
                    <p className="text-sm text-gray-600 mb-4">See exactly what's changed in your policy. <span className="bg-red-50 px-1 rounded">Red lines</span> are removed, <span className="bg-green-50 px-1 rounded">green lines</span> are added.</p>
                    <div className="flex-grow" style={{ minHeight: '400px', maxHeight: '60vh', overflowY: 'auto' }}>
                        <DiffViewer originalText={selectedDocument?.content || ''} updatedText={updateResult.updatedPolicyText} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                    <h3 className="text-xl font-bold text-secondary mb-4">AI's Summary of Changes</h3>
                    <p className="text-sm text-gray-600 mb-4">Here's why we made these changes, based on your request.</p>
                    <div className="space-y-4 flex-grow" style={{ minHeight: '400px', maxHeight: '60vh', overflowY: 'auto' }}>
                        {updateResult.changes.length > 0 ? (
                            updateResult.changes.map((change, index) => (
                                <div key={index} className="p-4 border-l-4 border-accent bg-accent/10 text-sm rounded-r-md">
                                    <h4 className="font-bold text-secondary">{change.changeDescription}</h4>
                                    <p className="text-gray-700 mt-1"><strong className="font-semibold text-secondary">Reason:</strong> {change.reason}</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 border rounded-md bg-green-50 border-green-200 text-center flex items-center justify-center h-full">
                                <p className="text-green-800 font-semibold">No major changes were needed based on your request.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                 <button onClick={() => { setUpdateResult(null); setStatus('idle'); setStep('chooseMethod'); }} className="text-sm font-semibold text-gray-600 hover:text-primary">Go Back & Edit</button>
                 <button onClick={handleConfirmAndSave} className="bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center">
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Confirm & Save New Version
                 </button>
            </div>
        </div>
      );
    }
    return null;
  }
  
  const renderStep = () => {
    switch (step) {
        case 'select':
            return renderSelectStep();
        case 'chooseMethod':
            return renderChooseMethodStep();
        case 'review':
            return renderReviewStep();
        default:
            return null;
    }
  }
  
  const renderHistoryModal = () => {
    if (!isHistoryModalOpen || !selectedHistoryItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col" style={{ maxHeight: '90vh' }}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-secondary">
                Viewing Version {selectedHistoryItem.version}
              </h2>
              <p className="text-xs text-gray-500">Saved on {new Date(selectedHistoryItem.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 overflow-y-auto bg-gray-50">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
              {selectedHistoryItem.content}
            </pre>
          </div>
           <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-between items-center">
            <button
                onClick={() => handleRevertToVersion(selectedHistoryItem)}
                className="px-4 py-2 rounded-md text-white bg-amber-600 hover:bg-amber-700 transition flex items-center text-sm font-semibold"
            >
                <HistoryIcon className="w-5 h-5 mr-2" />
                Revert to this Version
            </button>
            <button onClick={() => setIsHistoryModalOpen(false)} className="px-6 py-2 rounded-md text-white bg-primary hover:bg-opacity-90 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        Back to Dashboard
      </button>

      {renderStep()}
      {renderHistoryModal()}
    </div>
  );
};

export default PolicyUpdater;
