
import React, { useState, useEffect, useRef } from 'react';
import { LoadingIcon, CopyIcon, DownloadIcon, CheckIcon, WordIcon, TxtIcon, ShieldCheckIcon } from './Icons';
import SemanticLoader from './SemanticLoader';
import type { AppStatus, Source } from '../types';
import { marked } from 'marked';
import DOMPurify from 'dompurify'; // Ensure this is available via importmap

interface PolicyPreviewProps {
  policyText: string;
  status: AppStatus;
  onRetry: () => void;
  isForm: boolean;
  outputFormat?: 'word' | 'excel';
  sources: Source[];
  errorMessage?: string | null;
  loadingMessages?: string[];
}

const WORD_DOCUMENT_STYLES = `
  .word-document-preview { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.15; color: #1f2937; text-align: left; }
  .word-document-preview p { margin-top: 0; margin-bottom: 10pt; }
  .word-document-preview h1, .word-document-preview h2, .word-document-preview h3 { margin-top: 14pt; margin-bottom: 6pt; font-weight: bold; color: #111827; }
  .word-document-preview h1 { font-size: 18pt; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
  .word-document-preview h2 { font-size: 14pt; }
  .word-document-preview h3 { font-size: 12pt; }
  .word-document-preview ul, .word-document-preview ol { margin-top: 0; margin-bottom: 10pt; padding-left: 40px; }
  .word-document-preview li { margin-bottom: 4pt; }
  .word-document-preview table { border-collapse: collapse; width: 100%; margin-bottom: 12pt; }
  .word-document-preview th, .word-document-preview td { border: 1px solid #d1d5db; padding: 6pt; text-align: left; }
  .word-document-preview th { background-color: #f3f4f6; font-weight: bold; }
  .word-document-preview strong { color: #111827; }
`;

const SourcesUsed: React.FC<{ sources: Source[] }> = ({ sources }) => {
  if (sources.length === 0) return null;
  return (
    <div className="mt-8 pt-6 border-t border-dashed border-gray-300 print-hide">
      <h3 className="text-lg font-bold text-secondary mb-3 flex items-center">
        <ShieldCheckIcon className="w-5 h-5 mr-2 text-primary" />
        Verified Sources
      </h3>
      <ul className="space-y-2">
        {sources.map((source, index) => (
          source.web?.uri && (
            <li key={index} className="text-xs text-gray-600">
              <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline hover:text-primary-dark break-all transition-colors">
                {source.web.title || source.web.uri}
              </a>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

const PolicyPreview: React.FC<PolicyPreviewProps> = ({ policyText, status, onRetry, isForm, outputFormat, sources, errorMessage, loadingMessages }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = WORD_DOCUMENT_STYLES;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);

  useEffect(() => {
    if (status === 'success' && editorRef.current) {
      (async () => {
        const rawHtml = await marked.parse(policyText);
        // Sanitize the HTML to prevent XSS
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        editorRef.current.innerHTML = cleanHtml;
      })();
    } else if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  }, [policyText, status]);

  const handleCopy = () => {
    if (editorRef.current) {
        navigator.clipboard.writeText(editorRef.current.innerText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStyledHtmlForDownload = (contentHtml: string, docTitle: string) => {
    const bodyStyles = WORD_DOCUMENT_STYLES.replace(/\.word-document-preview/g, 'body');
    return `
      <!DOCTYPE html><html><head><meta charset="UTF-8"><title>${docTitle}</title>
      <style>
        @page { size: A4; margin: 1in; }
        ${bodyStyles}
        .print-hide { display: none !important; }
      </style></head><body>${contentHtml}</body></html>
    `;
  };
  
  const handleDownload = async (format: 'word' | 'csv' | 'txt' | 'pdf') => {
    setDownloadMenuOpen(false);
    const textContent = editorRef.current?.innerText || '';
    const htmlContent = editorRef.current?.innerHTML || '';
    const title = `hr_${isForm ? 'form' : 'policy'}_${new Date().toISOString().split('T')[0]}`;
    let blob, filename;

    if (format === 'word') {
      const htmlDoc = getStyledHtmlForDownload(htmlContent, title);
      blob = new Blob([htmlDoc], { type: 'application/msword;charset=utf-8' });
      filename = `${title}.doc`;
    } else {
      // Handle other formats based on text content
      blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
      filename = `${title}.txt`;
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const renderContent = () => {
    switch (status) {
      case 'idle':
        return <div className="text-center text-gray-500 py-12"><h3 className="text-lg font-semibold">Your finalized document will appear here.</h3><p>Complete the previous steps to generate your document.</p></div>;
      case 'loading':
        if (loadingMessages && loadingMessages.length > 0) {
            return <SemanticLoader messages={loadingMessages} />;
        }
        return <div className="text-center text-gray-500 py-12"><LoadingIcon className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" /><h3 className="text-lg font-semibold">Generating your document...</h3><p>This may take a moment.</p></div>;
      case 'error':
        return <div className="text-center text-red-600 bg-red-50 p-6 rounded-md"><h3 className="text-lg font-semibold mb-2">An Error Occurred</h3><p className="mb-4">{errorMessage || "Couldn't generate document. Please try again."}</p><button onClick={onRetry} className="bg-primary text-white font-semibold py-2 px-4 rounded-md">Retry</button></div>;
      case 'success':
        return (
            <div id="policy-preview-content" className="h-full flex flex-col">
                <div className="bg-white shadow-sm border border-gray-200 p-8 md:p-12 min-h-[600px] rounded-sm">
                    <div 
                    ref={editorRef}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    className="word-document-preview w-full h-full outline-none"
                    />
                </div>
               {!isForm && <SourcesUsed sources={sources} />}
               <div className="mt-6 pt-6 border-t border-dashed border-gray-300 print-hide">
                <h3 className="text-lg font-bold text-secondary mb-4">Next Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded border border-blue-100">
                        <strong className="block text-blue-800 mb-1">1. Review</strong>
                        <span className="text-blue-700">Read through the generated content and make any final tweaks directly in the editor above.</span>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                        <strong className="block text-yellow-800 mb-1">2. Verify</strong>
                        <span className="text-yellow-700">While our Ingcweti AI is powerful, we always recommend a final check by a labour law professional.</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-100">
                        <strong className="block text-green-800 mb-1">3. Finalize</strong>
                        <span className="text-green-700">Download the document, print it on your letterhead, and have it signed.</span>
                    </div>
                </div>
              </div>
            </div>
        );
    }
  };

  const renderActionButtons = () => {
    if (status !== 'success') return null;
    return (
        <div className="absolute top-4 right-4 flex space-x-2 z-10 print-hide">
          <button onClick={handleCopy} className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-gray-600 hover:text-primary" title="Copy Text">
            {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5" />}
          </button>
          
          <div ref={downloadMenuRef} className="relative">
            <button onClick={() => setDownloadMenuOpen(p => !p)} className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-gray-600 hover:text-primary" title="Download Options">
              <DownloadIcon className="w-5 h-5" />
            </button>
            {isDownloadMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-100 z-50">
                <div className="py-1">
                  <button onClick={() => handleDownload('word')} className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <WordIcon className="w-5 h-5 mr-3 text-blue-700" /> 
                    <div>
                        <span className="block font-medium">Download as Word</span>
                        <span className="block text-xs text-gray-500">Best for editing (.doc)</span>
                    </div>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={() => handleDownload('txt')} className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                     <TxtIcon className="w-5 h-5 mr-3 text-gray-500" /> 
                     <div>
                        <span className="block font-medium">Download as Text</span>
                        <span className="block text-xs text-gray-500">Plain text format (.txt)</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
  };

  return (
    <div className={`bg-gray-50/50 p-4 md:p-8 rounded-lg border border-gray-200 relative flex flex-col ${status === 'loading' ? 'h-auto' : 'h-full'}`}>
      {renderActionButtons()}
      <div className="h-full flex-grow flex items-center justify-center">
        <div className="w-full h-full max-w-4xl mx-auto">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PolicyPreview;
