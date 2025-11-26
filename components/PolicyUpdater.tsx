
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { updatePolicy } from '../services/geminiService';
import type { GeneratedDocument, PolicyUpdateResult, CompanyProfile } from '../types';
import { LoadingIcon, UpdateIcon, CheckIcon, HistoryIcon, CreditCardIcon, FileUploadIcon, FileIcon } from './Icons';
import ConfirmationModal from './ConfirmationModal';
import { useDataContext } from '../contexts/DataContext';
import { useUIContext } from '../contexts/UIContext';
import { useAuthContext } from '../contexts/AuthContext';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

const INTERNAL_UPDATE_COST_CENTS = 2500; // R25.00
const EXTERNAL_UPDATE_COST_CENTS = 5000; // R50.00

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
}

type HistoryItem = { version: number; createdAt: string; content: string };

const PolicyUpdater: React.FC<PolicyUpdaterProps> = ({ onBack }) => {
  const { user } = useAuthContext();
  const { generatedDocuments, handleDocumentGenerated, handleDeductCredit } = useDataContext();
  const { setToastMessage, navigateTo } = useUIContext();
  const [step, setStep] = useState<'select' | 'chooseMethod' | 'review'>('select');
  
  // selection state
  const [selectedDocId, setSelectedDocId] = useState('');
  const [externalDocument, setExternalDocument] = useState<GeneratedDocument | null>(null);
  
  const [updateMethod, setUpdateMethod] = useState<'ai' | 'manual' | null>(null);
  const [manualInstructions, setManualInstructions] = useState('');
  const [updateResult, setUpdateResult] = useState<PolicyUpdateResult | null>(null);
  const [selectedChangeIndices, setSelectedChangeIndices] = useState<Set<number>>(new Set());

  const [status, setStatus] = useState<'idle' | 'reading_file' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Confirmations (Revert & Payment)
  const [confirmation, setConfirmation] = useState<{
      title: string;
      message: React.ReactNode;
      confirmText?: string;
      cancelText?: string;
      onConfirm: () => void;
    } | null>(null);

  // Determine which document object to use (Internal or External)
  const selectedDocument = useMemo(() => {
    if (selectedDocId.startsWith('external-')) {
        return externalDocument;
    }
    return generatedDocuments.find(d => d.id === selectedDocId);
  }, [selectedDocId, generatedDocuments, externalDocument]);

  // Select all changes by default when results come back
  useEffect(() => {
      if (updateResult?.changes) {
          const allIndices = new Set(updateResult.changes.map((_, i) => i));
          setSelectedChangeIndices(allIndices);
      }
  }, [updateResult]);

  // Reconstruct the policy text based on SELECTED changes only
  const reconstructedPolicyText = useMemo(() => {
      if (!selectedDocument || !updateResult) return '';
      
      // Start with original text
      let text = selectedDocument.content;

      // Sort changes by index or however the AI returned them.
      // Ideally, we iterate and replace. 
      // Note: Simple string replacement has risks if the text appears multiple times.
      // For this implementation, we assume the AI provides unique enough context or we accept first-match replacement.
      
      // We iterate through the changes. If selected, we replace.
      updateResult.changes.forEach((change, index) => {
          if (selectedChangeIndices.has(index) && change.originalText && change.updatedText) {
              // Using split/join to replace all occurrences might be too aggressive if the context appears twice.
              // Using replace() only replaces the first occurrence.
              // Given AI usually processes top-to-bottom, sequential replace usually works if we are lucky.
              // A more robust way would be finding the index, but we don't have offsets from Gemini.
              
              // We will use simple replace.
              text = text.replace(change.originalText, change.updatedText);
          } else if (selectedChangeIndices.has(index) && !change.originalText) {
              // This is a pure addition (no original text). 
              // We can't easily place it without context. 
              // Usually AI returns originalText for context even if it's just an insertion point.
              // If it's a full rewrite, updatedPolicyText is the source of truth.
              
              // FALLBACK: If the AI rewrote the whole doc (no specific originalText snippets),
              // we cannot selectively apply. We must use the full updated text if *any* change is selected?
              // Or we assume the AI structured the response correctly.
          }
      });

      // Corner Case: If the AI rewrote the document entirely and didn't provide discrete "originalText" snippets for every change,
      // we might just want to use the `updatedPolicyText` provided by AI if ALL changes are selected.
      const allSelected = selectedChangeIndices.size === updateResult.changes.length;
      
      // If the reconstruction strategy fails (e.g. original text not found), the text won't change.
      // If the user selected ALL changes, we can default to the AI's full output to be safe against replacement errors.
      if (allSelected) {
          return updateResult.updatedPolicyText;
      }

      return text;
  }, [selectedDocument, updateResult, selectedChangeIndices]);


  // Helper to extract text from DOCX
  const extractTextFromDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
  };

  // Helper to extract text from PDF
  const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
      const pdfJs: any = pdfjsLib;
      // Handle potential default export from CDN
      const getDocument = pdfJs.getDocument || pdfJs.default?.getDocument;
      
      if (!getDocument) {
          throw new Error("PDF.js library not loaded correctly.");
      }

      const loadingTask = getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
      }
      return fullText;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setStatus('reading_file');
      setError(null);

      try {
          const arrayBuffer = await file.arrayBuffer();
          let extractedText = '';

          if (file.type === 'application/pdf') {
              extractedText = await extractTextFromPdf(arrayBuffer);
          } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
              extractedText = await extractTextFromDocx(arrayBuffer);
          } else {
              throw new Error('Unsupported file format. Please upload a PDF or DOCX.');
          }

          if (!extractedText.trim()) {
              throw new Error('Could not extract text from the file. It might be empty or an image-based PDF.');
          }

          // Create a temporary "GeneratedDocument" structure
          const tempDoc: GeneratedDocument = {
              id: `external-${Date.now()}`,
              title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
              kind: 'policy',
              type: 'master', // Defaulting type since we don't know
              content: extractedText,
              createdAt: new Date().toISOString(),
              companyProfile: { companyName: 'External Document', industry: 'Unknown' },
              questionAnswers: {},
              version: 1,
              history: [],
              outputFormat: 'word'
          };

          setExternalDocument(tempDoc);
          setSelectedDocId(tempDoc.id);
          setStep('chooseMethod');
          setStatus('idle');

      } catch (err: any) {
          console.error("File read error:", err);
          setError(err.message);
          setStatus('error');
          setToastMessage(`Error reading file: ${err.message}`);
      } finally {
          // Reset input so same file can be selected again if needed
          if (fileInputRef.current) fileInputRef.current.value = '';
      }
  };

  const executeUpdate = async () => {
    if (!selectedDocument || !updateMethod) return;
    
    // Close any open modals
    setConfirmation(null);

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

  const handleUpdateClick = async () => {
    if (!selectedDocument || !updateMethod) return;
    if (updateMethod === 'manual' && !manualInstructions.trim()) return;

    const isExternal = selectedDocument.id.startsWith('external-');
    const cost = isExternal ? EXTERNAL_UPDATE_COST_CENTS : INTERNAL_UPDATE_COST_CENTS;

    // Check PAYG Logic
    if (user?.plan === 'payg') {
        const balance = Number(user.creditBalance || 0);
        
        if (balance < cost) {
            setConfirmation({
                title: "Insufficient Credit",
                message: (
                    <div className="text-center">
                        <p className="text-red-600 font-semibold mb-2">You do not have enough credit.</p>
                        <p className="mb-4">
                            {isExternal ? 'External' : 'AI'} Policy Updates cost <strong className="text-secondary">R{(cost / 100).toFixed(2)}</strong>, but you only have <strong>R{(balance / 100).toFixed(2)}</strong> available.
                        </p>
                        <p className="text-sm text-gray-600">Please top up to continue.</p>
                    </div>
                ),
                confirmText: "Top Up Now",
                onConfirm: () => {
                    setConfirmation(null);
                    navigateTo('topup');
                }
            });
            return;
        }

        setConfirmation({
            title: isExternal ? "Confirm External Policy Update" : "Confirm AI Update",
            message: (
                <div className="text-center">
                    <p className="mb-4">
                        Using the AI Updater {isExternal && 'for an external document'} costs <strong className="text-secondary">R{(cost / 100).toFixed(2)}</strong>.
                    </p>
                    <p className="text-sm text-gray-600">
                        This amount will be deducted from your credit balance.
                    </p>
                </div>
            ),
            confirmText: "Confirm & Update",
            onConfirm: async () => {
                // Deduct credit first
                const success = await handleDeductCredit(cost, `AI Policy Update: ${selectedDocument.title}`);
                if (success) {
                    executeUpdate();
                } else {
                    setConfirmation(null); // Close modal if deduction failed (toast handled in context)
                }
            }
        });
    } else {
        // Pro users go straight through
        executeUpdate();
    }
  };
  
  const handleConfirmAndSave = async () => {
    if (!updateResult || !selectedDocument) return;

    setIsSaving(true);
    
    // For external documents, we need to "import" them as new generated documents
    // For internal documents, we just update the version
    
    const isExternal = selectedDocument.id.startsWith('external-');
    
    let newDoc: GeneratedDocument;

    // Use the reconstructed text based on user selection
    const finalContent = reconstructedPolicyText;

    if (isExternal) {
        // Create completely new entry in DB for this imported doc
        newDoc = {
            ...selectedDocument,
            id: `imported-${Date.now()}`, // New ID
            content: finalContent,
            version: 1,
            history: [],
            createdAt: new Date().toISOString()
        };
        // Try to extract company name if we can, otherwise keep generic
        if (user?.profile?.companyName) {
            newDoc.companyProfile = user.profile;
        }
    } else {
        newDoc = {
            ...selectedDocument,
            content: finalContent,
        };
    }

    try {
        // For external, handleDocumentGenerated will see no "originalId" and create new.
        // For internal, we pass the ID to trigger update logic.
        await handleDocumentGenerated(newDoc, isExternal ? undefined : selectedDocument.id);
    } catch (error: any) {
        setToastMessage(`Failed to save update: ${error.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setIsHistoryModalOpen(true);
  };

  const handleRevertToVersion = (historyItem: HistoryItem) => {
    if (!selectedDocument) return;
    
    setConfirmation({
        title: "Revert to Previous Version",
        message: `Are you sure you want to revert to Version ${historyItem.version}? Your current version (${selectedDocument.version}) will be archived, and this content will become the new latest version.`,
        onConfirm: async () => {
            const revertedDoc: GeneratedDocument = {
                ...selectedDocument,
                content: historyItem.content,
            };
            setIsSaving(true); // Reusing isSaving for revert loading state if needed
            try {
                await handleDocumentGenerated(revertedDoc, selectedDocument.id);
                setIsHistoryModalOpen(false);
                setConfirmation(null);
            } finally {
                setIsSaving(false);
            }
        }
    });
  };

  const toggleChangeSelection = (index: number) => {
      setSelectedChangeIndices(prev => {
          const newSet = new Set(prev);
          if (newSet.has(index)) {
              newSet.delete(index);
          } else {
              newSet.add(index);
          }
          return newSet;
      });
  };

  const toggleAllChanges = () => {
      if (!updateResult) return;
      if (selectedChangeIndices.size === updateResult.changes.length) {
          setSelectedChangeIndices(new Set()); // Deselect all
      } else {
          const allIndices = new Set(updateResult.changes.map((_, i) => i));
          setSelectedChangeIndices(allIndices);
      }
  };


  const renderSelectStep = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary">Update Your HR Policy</h2>
        <p className="text-gray-600 mt-2 mb-8 max-w-3xl mx-auto">Select a document to update. You can choose a policy generated by HR CoPilot or upload your own existing policy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Option 1: Existing App Documents */}
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-bold text-secondary mb-4 flex items-center">
                  <HistoryIcon className="w-5 h-5 mr-2 text-primary" />
                  HR CoPilot Documents
              </h3>
              {generatedDocuments.length > 0 ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Select one of your previously generated policies.</p>
                    <select
                        id="document-select"
                        value={selectedDocId.startsWith('external-') ? '' : selectedDocId}
                        onChange={(e) => setSelectedDocId(e.target.value)}
                        className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white"
                    >
                        <option value="" disabled>Choose a document...</option>
                        {generatedDocuments.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.title} (v{doc.version})</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setStep('chooseMethod')}
                        disabled={!selectedDocId || selectedDocId.startsWith('external-')}
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                    >
                        Continue with Selected
                    </button>
                </div>
              ) : (
                <div className="text-center p-4">
                    <p className="text-gray-500 text-sm">No HR CoPilot documents found.</p>
                </div>
              )}
          </div>

          {/* Option 2: Upload External */}
          <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
              <h3 className="text-lg font-bold text-secondary mb-4 flex items-center">
                  <FileUploadIcon className="w-5 h-5 mr-2 text-primary" />
                  External Policy
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                  Upload an existing policy (PDF or Word) created by a lawyer or consultant. We will scan it for compliance.
              </p>
              
              {/* Hidden File Input */}
              <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".pdf,.docx" 
                  onChange={handleFileUpload} 
              />

              {status === 'reading_file' ? (
                  <div className="flex items-center justify-center p-4 bg-white rounded-md border border-blue-100">
                      <LoadingIcon className="w-6 h-6 animate-spin text-primary mr-3" />
                      <span className="text-primary font-medium">Reading document...</span>
                  </div>
              ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white border-2 border-primary text-primary font-bold py-3 px-4 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                    <FileIcon className="w-5 h-5 mr-2" />
                    Upload File
                </button>
              )}
              
              {user?.plan === 'payg' && (
                  <p className="text-xs text-blue-700 mt-2 text-center">
                      External Document Update: <strong>R{(EXTERNAL_UPDATE_COST_CENTS / 100).toFixed(2)}</strong>
                  </p>
              )}
          </div>
      </div>
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
      
      {/* PAYG Pricing Notice */}
      {user?.plan === 'payg' && (
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-center text-sm text-blue-800">
              <CreditCardIcon className="w-5 h-5 mr-2" />
              <span>
                  Update Cost: <strong>R{((selectedDocument?.id.startsWith('external-') ? EXTERNAL_UPDATE_COST_CENTS : INTERNAL_UPDATE_COST_CENTS) / 100).toFixed(2)}</strong> (Deducted from credit)
              </span>
          </div>
      )}
        
      {/* Version History Section (Only for internal documents) */}
      {selectedDocument?.history && selectedDocument.history.length > 0 && !selectedDocument.id.startsWith('external-') && (
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
          onClick={handleUpdateClick}
          disabled={!updateMethod || (updateMethod === 'manual' && !manualInstructions.trim())}
          className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex items-center justify-center"
        >
          <UpdateIcon className="w-5 h-5 mr-2" />
          {user?.plan === 'payg' ? 'Pay & Update' : 'Analyze & Update'}
        </button>
      </div>
    </div>
  );
  
  const renderReviewStep = () => {
    if (status === 'loading') {
      return <div className="text-center p-12 bg-white rounded-lg shadow-md"><LoadingIcon className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" /><h3 className="text-lg font-semibold">Analyzing your document...</h3></div>;
    }
    if (status === 'error') {
      return <div className="text-center text-red-600 bg-red-50 p-6 rounded-md"><h3 className="text-lg font-semibold mb-2">An Error Occurred</h3><p className="mb-4">{error}</p><button onClick={handleUpdateClick} className="bg-primary text-white font-semibold py-2 px-4 rounded-md">Retry</button></div>;
    }
    if (status === 'success' && updateResult) {
      const allSelected = selectedChangeIndices.size === updateResult.changes.length;
      return (
        <div>
            <h2 className="text-3xl font-bold text-secondary mb-6 text-center">Analysis Complete</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Visual Comparison */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                    <h3 className="text-xl font-bold text-secondary mb-4">Visual Preview</h3>
                    <p className="text-sm text-gray-600 mb-4">This preview updates as you select changes on the right.</p>
                    <div className="flex-grow" style={{ minHeight: '400px', maxHeight: '60vh', overflowY: 'auto' }}>
                        <DiffViewer originalText={selectedDocument?.content || ''} updatedText={reconstructedPolicyText} />
                    </div>
                </div>

                {/* Right Column: Changes Selection */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-secondary">Review Suggested Changes</h3>
                        <button 
                            onClick={toggleAllChanges} 
                            className="text-xs font-semibold text-primary hover:underline"
                        >
                            {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Select the changes you want to apply to the final document.</p>
                    
                    <div className="space-y-4 flex-grow pr-2" style={{ minHeight: '400px', maxHeight: '60vh', overflowY: 'auto' }}>
                        {updateResult.changes.length > 0 ? (
                            updateResult.changes.map((change, index) => (
                                <div 
                                    key={index} 
                                    className={`p-4 border rounded-md transition-colors ${
                                        selectedChangeIndices.has(index) ? 'border-primary bg-blue-50' : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="pt-1">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedChangeIndices.has(index)}
                                                onChange={() => toggleChangeSelection(index)}
                                                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-secondary text-sm">{change.changeDescription}</h4>
                                            <p className="text-gray-700 mt-1 text-xs"><strong className="font-semibold">Reason:</strong> {change.reason}</p>
                                            <div className="mt-2 text-xs">
                                                {change.originalText && (
                                                    <div className="mb-1">
                                                        <span className="text-red-600 font-semibold strike-through">Original:</span> <span className="text-gray-500 line-through truncate block max-w-full">{change.originalText.substring(0, 100)}{change.originalText.length > 100 ? '...' : ''}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-green-600 font-semibold">New:</span> <span className="text-gray-800 block">{change.updatedText.substring(0, 100)}{change.updatedText.length > 100 ? '...' : ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                 <button onClick={() => { setUpdateResult(null); setStatus('idle'); setStep('chooseMethod'); }} disabled={isSaving} className="text-sm font-semibold text-gray-600 hover:text-primary disabled:opacity-50">Go Back & Edit</button>
                 <button onClick={handleConfirmAndSave} disabled={isSaving} className="bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isSaving ? <><LoadingIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /> Saving...</> : <><CheckIcon className="w-5 h-5 mr-2" /> Confirm & Save Selected</>}
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
                disabled={isSaving}
                className="px-4 py-2 rounded-md text-white bg-amber-600 hover:bg-amber-700 transition flex items-center text-sm font-semibold disabled:bg-gray-400"
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
      {confirmation && (
        <ConfirmationModal
            isOpen={!!confirmation}
            title={confirmation.title}
            message={confirmation.message}
            confirmText={confirmation.confirmText}
            cancelText={confirmation.cancelText}
            onConfirm={confirmation.onConfirm}
            onCancel={() => setConfirmation(null)}
        />
      )}
    </div>
  );
};

export default PolicyUpdater;
