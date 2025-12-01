
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { updatePolicy } from '../services/geminiService';
import type { GeneratedDocument, PolicyUpdateResult, CompanyProfile, PolicyDraft } from '../types';
import { LoadingIcon, UpdateIcon, CheckIcon, HistoryIcon, CreditCardIcon, FileUploadIcon, FileIcon, EditIcon, InfoIcon } from './Icons';
import ConfirmationModal from './ConfirmationModal';
import SemanticLoader from './SemanticLoader';
import { useDataContext } from '../contexts/DataContext';
import { useUIContext } from '../contexts/UIContext';
import { useAuthContext } from '../contexts/AuthContext';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

const INTERNAL_UPDATE_COST_CENTS = 2500; // R25.00
const EXTERNAL_UPDATE_COST_CENTS = 5000; // R50.00

// --- HIGH-4: Web Worker for Diffing (Performance Fix) ---
const WORKER_CODE = `
self.onmessage = function(e) {
    const { original, updated } = e.data;
    
    // Improved tokenizer for smoother diffing
    const tokenize = (text) => text.split(/(\\s+)/); 
    
    const originalTokens = tokenize(original);
    const updatedTokens = tokenize(updated);
    
    const diff = [];
    let i = 0;
    let j = 0;
    
    while (i < originalTokens.length || j < updatedTokens.length) {
        if (i >= originalTokens.length && j >= updatedTokens.length) break;

        if (i >= originalTokens.length) {
            diff.push({ type: 'added', text: updatedTokens.slice(j).join('') });
            break;
        }
        if (j >= updatedTokens.length) {
            diff.push({ type: 'removed', text: originalTokens.slice(i).join('') });
            break;
        }

        if (originalTokens[i] === updatedTokens[j]) {
            diff.push({ type: 'same', text: originalTokens[i] });
            i++;
            j++;
        } else {
            let foundMatch = false;
            // Increased lookahead for better synchronization on large docs
            const lookaheadLimit = 100; 
            
            for (let k = 1; k < lookaheadLimit; k++) {
                if (j + k < updatedTokens.length && originalTokens[i] === updatedTokens[j + k]) {
                    diff.push({ type: 'added', text: updatedTokens.slice(j, j + k).join('') });
                    j += k;
                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch) {
                diff.push({ type: 'removed', text: originalTokens[i] });
                i++;
            }
        }
    }
    
    self.postMessage(diff);
};
`;

const DiffViewer: React.FC<{ originalText: string; updatedText: string }> = ({ originalText, updatedText }) => {
    const [diff, setDiff] = useState<{ type: 'added' | 'removed' | 'same'; text: string }[]>([]);
    const [isCalculating, setIsCalculating] = useState(true);

    useEffect(() => {
        setIsCalculating(true);
        const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);

        worker.onmessage = (e) => {
            setDiff(e.data);
            setIsCalculating(false);
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
        };

        worker.postMessage({ original: originalText, updated: updatedText });

        return () => {
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
        };
    }, [originalText, updatedText]);

    if (isCalculating) {
        return (
            <div className="flex items-center justify-center h-40 bg-gray-50 border border-gray-200 rounded-md">
                <LoadingIcon className="w-6 h-6 animate-spin text-primary mr-3" />
                <span className="text-gray-500">Calculating differences (processed in background)...</span>
            </div>
        );
    }

    return (
        <div className="font-serif text-base border border-gray-200 rounded-md bg-white p-6 whitespace-pre-wrap break-words overflow-y-auto h-full leading-relaxed shadow-inner">
            {diff.map((part, index) => {
                if (part.type === 'same') {
                    return <span key={index}>{part.text}</span>;
                }
                if (part.type === 'added') {
                    return (
                        <span key={index} className="bg-green-100 text-green-800 font-semibold decoration-clone px-0.5 rounded-sm">
                            {part.text}
                        </span>
                    );
                }
                if (part.type === 'removed') {
                    return (
                        <span key={index} className="bg-red-100 text-red-800 line-through decoration-red-500 opacity-70 px-0.5 rounded-sm">
                            {part.text}
                        </span>
                    );
                }
                return null;
            })}
        </div>
    );
};

interface PolicyUpdaterProps {
  onBack: () => void;
}

type HistoryItem = { version: number; createdAt: string; content: string };

const analysisMessages = [
    "Reading document content...",
    "Comparing against latest South African Labour Law...",
    "Identifying non-compliant sections...",
    "Generating improvement suggestions...",
    "Drafting explanation of changes..."
];

const PolicyUpdater: React.FC<PolicyUpdaterProps> = ({ onBack }) => {
  const { user } = useAuthContext();
  const { generatedDocuments, handleDocumentGenerated, handleDeductCredit, policyDrafts, handleSaveDraft, handleDeleteDraft } = useDataContext();
  const { setToastMessage, navigateTo } = useUIContext();
  const [step, setStep] = useState<'select' | 'chooseMethod' | 'review'>('select');
  
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
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(undefined);
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [confirmation, setConfirmation] = useState<{
      title: string;
      message: React.ReactNode;
      confirmText?: string;
      cancelText?: string;
      onConfirm: () => void;
    } | null>(null);

  const selectedDocument = useMemo(() => {
    if (selectedDocId.startsWith('external-')) {
        return externalDocument;
    }
    return generatedDocuments.find(d => d.id === selectedDocId);
  }, [selectedDocId, generatedDocuments, externalDocument]);

  useEffect(() => {
      if (updateResult?.changes) {
          if (selectedChangeIndices.size === 0) {
              const allIndices = new Set(updateResult.changes.map((_, i) => i));
              setSelectedChangeIndices(allIndices);
          }
      }
  }, [updateResult]);

  const reconstructedPolicyText = useMemo(() => {
      if (!selectedDocument || !updateResult) return '';
      let text = selectedDocument.content;
      updateResult.changes.forEach((change, index) => {
          if (selectedChangeIndices.has(index) && change.originalText && change.updatedText) {
              text = text.replace(change.originalText, change.updatedText);
          }
      });
      const allSelected = selectedChangeIndices.size === updateResult.changes.length;
      if (allSelected) {
          return updateResult.updatedPolicyText;
      }
      return text;
  }, [selectedDocument, updateResult, selectedChangeIndices]);

  const extractTextFromDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
      const mammothLib = (mammoth as any).default || mammoth;
      if (!mammothLib || !mammothLib.extractRawText) {
          throw new Error("Docx parser (mammoth) failed to load.");
      }
      const result = await mammothLib.extractRawText({ arrayBuffer });
      return result.value;
  };

  const extractTextFromText = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = (e) => reject(new Error("Failed to read text file"));
          reader.readAsText(file);
      });
  };

  const extractTextFromRtf = async (file: File): Promise<string> => {
      const text = await extractTextFromText(file);
      let clean = text.replace(/\{\\\*[\s\S]*?\}/g, "");
      clean = clean.replace(/\\par/g, "\n");
      clean = clean.replace(/\\[a-z0-9]+/g, " ");
      clean = clean.replace(/[{}]/g, "");
      clean = clean.replace(/\\'([0-9a-fA-F]{2})/g, (match, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
      });
      return clean.trim();
  };

  const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
      const pdfJs: any = pdfjsLib;
      const lib = pdfJs.default || pdfJs;
      
      if (lib.GlobalWorkerOptions && !lib.GlobalWorkerOptions.workerSrc) {
          lib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      }
      
      const getDocument = lib.getDocument;
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
          const name = file.name.toLowerCase();

          const isPdf = file.type === 'application/pdf' || name.endsWith('.pdf');
          const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || name.endsWith('.docx');
          const isMd = name.endsWith('.md');
          const isTxt = name.endsWith('.txt');
          const isRtf = file.type === 'application/rtf' || name.endsWith('.rtf');
          const isDoc = name.endsWith('.doc');

          if (isPdf) {
              extractedText = await extractTextFromPdf(arrayBuffer);
          } else if (isDocx) {
              extractedText = await extractTextFromDocx(arrayBuffer);
          } else if (isRtf) {
              extractedText = await extractTextFromRtf(file);
          } else if (isMd || isTxt) {
              extractedText = await extractTextFromText(file);
          } else if (isDoc) {
              try {
                  extractedText = await extractTextFromDocx(arrayBuffer);
              } catch (e) {
                  console.warn("Mammoth failed on .doc, falling back to raw text extraction", e);
                  const rawText = await extractTextFromText(file);
                  extractedText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, '');
                  if (extractedText.length < 50) {
                       throw new Error(`This .doc file seems to be in an older binary format that cannot be read by the browser. Please open it in Word and save as .docx, then try again.`);
                  }
                  setToastMessage("Warning: Reading legacy .doc format. Some formatting may be lost.");
              }
          } else {
              throw new Error('Unsupported file format. Please upload a PDF, Word (.docx/.doc), RTF, or Text file.');
          }

          // HIGH-5 FIX: Defensive Validation for Empty Text (Scanned PDFs)
          if (!extractedText || extractedText.trim().length < 50) {
              throw new Error('Could not extract sufficient text from the file. It might be an image-based scan (OCR required) or an encrypted document.');
          }

          const tempDoc: GeneratedDocument = {
              id: `external-${Date.now()}`,
              title: file.name.replace(/\.[^/.]+$/, ""),
              kind: 'policy',
              type: 'master',
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
          setCurrentDraftId(undefined);
          setStep('chooseMethod');
          setStatus('idle');

      } catch (err: any) {
          console.error("File read error:", err);
          setError(err.message);
          setStatus('error');
          setToastMessage(`Error reading file: ${err.message}`);
      } finally {
          if (fileInputRef.current) fileInputRef.current.value = '';
      }
  };

  const executeUpdate = async () => {
    if (!selectedDocument || !updateMethod) return;
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

    if (currentDraftId) {
        executeUpdate();
        return;
    }

    if (user?.plan === 'payg') {
        const balance = Number(user.creditBalance || 0);
        if (balance < cost) {
            setConfirmation({
                title: "Insufficient Credit",
                message: (
                    <div className="text-center">
                        <p className="text-red-600 font-semibold mb-2">You do not have enough credit.</p>
                        <p className="mb-4">
                            {isExternal ? 'External' : 'Ingcweti AI'} Policy Updates cost <strong className="text-secondary">R{(cost / 100).toFixed(2)}</strong>, but you only have <strong>R{(balance / 100).toFixed(2)}</strong> available.
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
            title: isExternal ? "Confirm External Policy Update" : "Confirm Ingcweti AI Update",
            message: (
                <div className="text-center">
                    <p className="mb-4">
                        Using the Ingcweti AI Updater {isExternal && 'for an external document'} costs <strong className="text-secondary">R{(cost / 100).toFixed(2)}</strong>.
                    </p>
                    <p className="text-sm text-gray-600">
                        This amount will be deducted from your credit balance.
                    </p>
                </div>
            ),
            confirmText: "Confirm & Update",
            onConfirm: async () => {
                const success = await handleDeductCredit(cost, `Ingcweti AI Policy Update: ${selectedDocument.title}`);
                if (success) {
                    executeUpdate();
                } else {
                    setConfirmation(null);
                }
            }
        });
    } else {
        executeUpdate();
    }
  };
  
  const handleSaveDraftClick = async () => {
      if (!selectedDocument || !updateResult) return;
      setIsSaving(true);
      try {
          await handleSaveDraft({
              id: currentDraftId,
              originalDocId: selectedDocument.id,
              originalDocTitle: selectedDocument.title,
              originalContent: selectedDocument.content,
              updateResult: updateResult,
              selectedIndices: Array.from(selectedChangeIndices),
              manualInstructions: manualInstructions || undefined
          });
      } finally {
          setIsSaving(false);
      }
  };

  const handleConfirmAndSave = async () => {
    if (!updateResult || !selectedDocument) return;
    setIsSaving(true);
    const isExternal = selectedDocument.id.startsWith('external-');
    let newDoc: GeneratedDocument;
    const finalContent = reconstructedPolicyText;

    if (isExternal) {
        newDoc = {
            ...selectedDocument,
            id: `imported-${Date.now()}`,
            content: finalContent,
            version: 1,
            history: [],
            createdAt: new Date().toISOString()
        };
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
        await handleDocumentGenerated(newDoc, isExternal ? undefined : selectedDocument.id);
        if (currentDraftId) {
            await handleDeleteDraft(currentDraftId);
        }
    } catch (error: any) {
        setToastMessage(`Failed to save update: ${error.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleResumeDraft = (draft: PolicyDraft) => {
      const doc: GeneratedDocument = {
          id: draft.originalDocId,
          title: draft.originalDocTitle,
          kind: 'policy',
          type: 'master',
          content: draft.originalContent,
          createdAt: draft.createdAt,
          companyProfile: { companyName: 'Draft Document', industry: 'Unknown' },
          questionAnswers: {},
          version: 1,
          history: [],
          outputFormat: 'word'
      };

      if (draft.originalDocId.startsWith('external-')) {
          setExternalDocument(doc);
      }

      setSelectedDocId(draft.originalDocId);
      setUpdateResult(draft.updateResult);
      setManualInstructions(draft.manualInstructions || '');
      setSelectedChangeIndices(new Set(draft.selectedIndices));
      setCurrentDraftId(draft.id);
      
      setUpdateMethod(draft.manualInstructions ? 'manual' : 'ai');
      setStatus('success');
      setStep('review');
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
            setIsSaving(true); 
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
          setSelectedChangeIndices(new Set());
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
                        onChange={(e) => { setSelectedDocId(e.target.value); setCurrentDraftId(undefined); }}
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

          <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
              <h3 className="text-lg font-bold text-secondary mb-4 flex items-center">
                  <FileUploadIcon className="w-5 h-5 mr-2 text-primary" />
                  External Policy
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                  Upload an existing policy (PDF, Word, or Text) created by a lawyer or consultant. We will scan it for compliance.
              </p>
              
              <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".pdf,.docx,.doc,.rtf,.md,.txt" 
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

      {policyDrafts.length > 0 && (
          <div className="mt-8 border-t pt-8">
              <h3 className="text-xl font-bold text-secondary mb-4 flex items-center">
                  <EditIcon className="w-6 h-6 mr-2 text-amber-500" />
                  In Progress Updates (Drafts)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policyDrafts.map(draft => (
                      <div 
                          key={draft.id}
                          onClick={() => handleResumeDraft(draft)}
                          className="p-4 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-secondary">{draft.originalDocTitle}</h4>
                              <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">Draft</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {draft.manualInstructions ? `Manual Instruction: ${draft.manualInstructions}` : 'Ingcweti AI Compliance Review'}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                              Last updated: {new Date(draft.updatedAt || draft.createdAt).toLocaleString()}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );

  const renderChooseMethodStep = () => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-secondary mb-1">Update: <span className="text-primary">{selectedDocument?.title}</span></h2>
      <p className="text-gray-600 mb-6">How would you like to update this document?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${updateMethod === 'ai' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
          onClick={() => setUpdateMethod('ai')}
        >
          <h3 className="text-lg font-bold text-secondary">Automated Ingcweti AI Compliance Review</h3>
          <p className="text-sm text-gray-600 mt-2">Let our Ingcweti AI analyze your entire document for compliance with the latest South African labour laws and suggest improvements.</p>
        </div>

        <div 
          className={`p-6 border-2 rounded-lg transition-all ${updateMethod === 'manual' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
        >
          <div className="cursor-pointer" onClick={() => setUpdateMethod('manual')}>
            <h3 className="text-lg font-bold text-secondary">Update with My Instructions</h3>
            <p className="text-sm text-gray-600 mt-2">Provide specific instructions for the Ingcweti AI on what you want to change, add, or remove.</p>
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
      
      {user?.plan === 'payg' && (
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-center text-sm text-blue-800">
              <CreditCardIcon className="w-5 h-5 mr-2" />
              <span>
                  Update Cost: <strong>R{((selectedDocument?.id.startsWith('external-') ? EXTERNAL_UPDATE_COST_CENTS : INTERNAL_UPDATE_COST_CENTS) / 100).toFixed(2)}</strong> (Deducted from credit)
              </span>
          </div>
      )}
        
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
      return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <SemanticLoader messages={analysisMessages} />
        </div>
      );
    }
    if (status === 'error') {
      return <div className="text-center text-red-600 bg-red-50 p-6 rounded-md"><h3 className="text-lg font-semibold mb-2">An Error Occurred</h3><p className="mb-4">{error}</p><button onClick={handleUpdateClick} className="bg-primary text-white font-semibold py-2 px-4 rounded-md">Retry</button></div>;
    }
    if (status === 'success' && updateResult) {
      const allSelected = selectedChangeIndices.size === updateResult.changes.length;
      return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-secondary">Compliance Review Complete</h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    Our Ingcweti AI has analyzed your policy against current South African labour laws. Review the recommended changes below.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <button 
                    onClick={() => setShowFullPreview(!showFullPreview)} 
                    className="flex items-center text-primary font-semibold hover:underline bg-white px-4 py-2 rounded-md border border-primary/30 hover:bg-primary/5 transition-colors mb-4 sm:mb-0"
                >
                    {showFullPreview ? 'Hide Document Preview' : 'View Full Document Preview'}
                </button>
                <button 
                    onClick={toggleAllChanges} 
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    {allSelected ? 'Deselect All' : 'Select All Changes'}
                </button>
            </div>

            {showFullPreview && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-inner mb-8 h-[500px]">
                     <DiffViewer originalText={selectedDocument?.content || ''} updatedText={reconstructedPolicyText} />
                </div>
            )}

            <div className="space-y-6 max-w-4xl mx-auto">
                {updateResult.changes.length > 0 ? (
                    updateResult.changes.map((change, index) => {
                        const isSelected = selectedChangeIndices.has(index);
                        return (
                            <div 
                                key={index} 
                                className={`border rounded-lg p-6 transition-all duration-200 min-w-0 ${
                                    isSelected ? 'border-primary bg-white shadow-md ring-1 ring-primary/20' : 'border-gray-200 bg-gray-50 opacity-80'
                                }`}
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-secondary break-words min-w-0 whitespace-pre-wrap">{change.changeDescription}</h3>
                                        <div className="mt-2 inline-flex items-start text-sm text-blue-800 bg-blue-50 p-2 rounded-md border border-blue-100 max-w-full">
                                            <InfoIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                                            <span className="break-words">{change.reason}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-shrink-0">
                                         <label className="flex items-center cursor-pointer select-none">
                                            <div className="relative">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only" 
                                                    checked={isSelected} 
                                                    onChange={() => toggleChangeSelection(index)} 
                                                />
                                                <div className={`block w-14 h-8 rounded-full transition-colors shadow-inner ${isSelected ? 'bg-primary' : 'bg-gray-300'}`}></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow transition-transform ${isSelected ? 'transform translate-x-6' : ''}`}></div>
                                            </div>
                                            <div className={`ml-3 text-sm font-bold ${isSelected ? 'text-primary' : 'text-gray-500'}`}>
                                                {isSelected ? 'APPROVED' : 'IGNORED'}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 border-t border-gray-100 pt-4">
                                    {change.originalText && (
                                        <div className="bg-red-50/50 p-3 rounded border border-red-100 min-w-0">
                                            <p className="text-xs font-bold text-red-700 mb-2 uppercase tracking-wide flex items-center">
                                                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Original
                                            </p>
                                            <p className="text-gray-600 whitespace-pre-wrap break-words">{change.originalText}</p>
                                        </div>
                                    )}
                                    <div className={`bg-green-50/50 p-3 rounded border border-green-100 min-w-0 ${!change.originalText ? 'md:col-span-2' : ''}`}>
                                        <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> New Compliant Wording
                                        </p>
                                        <p className="text-gray-900 whitespace-pre-wrap break-words">{change.updatedText}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 border rounded-md bg-green-50 border-green-200 text-center">
                        <CheckIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-800">Good News!</h3>
                        <p className="text-green-700 mt-2">No major compliance issues were found based on your request.</p>
                    </div>
                )}
            </div>

            <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky bottom-4 z-10">
                 <button onClick={() => { setUpdateResult(null); setStatus('idle'); setStep('chooseMethod'); }} disabled={isSaving} className="text-sm font-semibold text-gray-600 hover:text-primary disabled:opacity-50">Go Back & Edit</button>
                 <div className="flex space-x-4">
                     <button 
                        onClick={handleSaveDraftClick} 
                        disabled={isSaving} 
                        className="bg-amber-500 text-white font-bold py-3 px-6 rounded-md hover:bg-amber-600 transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                     >
                        {isSaving ? <><LoadingIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /> Saving...</> : 'Save as Draft'}
                     </button>
                     <button 
                        onClick={handleConfirmAndSave} 
                        disabled={isSaving} 
                        className="bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                     >
                        {isSaving ? <><LoadingIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /> Saving...</> : <><CheckIcon className="w-5 h-5 mr-2" /> Confirm & Save Changes</>}
                     </button>
                 </div>
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
