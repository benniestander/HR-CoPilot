
import React, { useState, useEffect, useRef } from 'react';
import { LoadingIcon, CopyIcon, DownloadIcon, CheckIcon, WordIcon, TxtIcon } from './Icons';
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
  .word-document-preview { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.15; color: black; text-align: left; }
  .word-document-preview p { margin-top: 0; margin-bottom: 8pt; }
  .word-document-preview h1, .word-document-preview h2, .word-document-preview h3 { margin-top: 12pt; margin-bottom: 3pt; font-weight: bold; }
  .word-document-preview h1 { font-size: 16pt; }
  .word-document-preview h2 { font-size: 14pt; }
  .word-document-preview h3 { font-size: 12pt; }
  .word-document-preview ul, .word-document-preview ol { margin-top: 0; margin-bottom: 8pt; padding-left: 40px; }
  .word-document-preview table { border-collapse: collapse; width: 100%; margin-bottom: 8pt; }
  .word-document-preview th, .word-document-preview td { border: 1px solid #999; padding: 5pt; text-align: left; }
  .word-document-preview th { background-color: #f2f2f2; font-weight: bold; }
`;

const SourcesUsed: React.FC<{ sources: Source[] }> = ({ sources }) => {
  if (sources.length === 0) return null;
  return (
    <div className="mt-6 pt-6 border-t border-dashed border-gray-300 print-hide">
      <h3 className="text-xl font-bold text-secondary mb-4">Sources Used</h3>
      <ul className="space-y-2">
        {sources.map((source, index) => (
          source.web?.uri && (
            <li key={index} className="text-sm">
              <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-words">
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
        return <div className="text-center text-gray-500"><h3 className="text-lg font-semibold">Your finalized document will appear here.</h3><p>Complete the previous steps to generate your document.</p></div>;
      case 'loading':
        if (loadingMessages && loadingMessages.length > 0) {
            return <SemanticLoader messages={loadingMessages} />;
        }
        return <div className="text-center text-gray-500"><LoadingIcon className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" /><h3 className="text-lg font-semibold">Generating your document...</h3><p>This may take a moment.</p></div>;
      case 'error':
        return <div className="text-center text-red-600 bg-red-50 p-6 rounded-md"><h3 className="text-lg font-semibold mb-2">An Error Occurred</h3><p className="mb-4">{errorMessage || "Couldn't generate document. Please try again."}</p><button onClick={onRetry} className="bg-primary text-white font-semibold py-2 px-4 rounded-md">Retry</button></div>;
      case 'success':
        return (
            <div id="policy-preview-content" className="h-full flex flex-col">
                <div 
                   ref={editorRef}
                   contentEditable={true}
                   suppressContentEditableWarning={true}
                   className="word-document-preview w-full h-full flex-grow p-4 border border-gray-300 rounded-md bg-white text-base overflow-y-auto"
                   style={{minHeight: '400px'}}
                />
               {!isForm && <SourcesUsed sources={sources} />}
               <div className="mt-6 pt-6 border-t border-dashed border-gray-300 print-hide">
                <h3 className="text-xl font-bold text-secondary mb-4">Next Steps</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                  <li><strong>Review & Finalize:</strong> Make any final edits directly in the text box above.</li>
                  <li><strong>Legal Check:</strong> We strongly recommend a qualified labour lawyer reviews this document.</li>
                  <li><strong>Download & Communicate:</strong> Use the download options to get the document and share it with your team.</li>
                </ul>
              </div>
            </div>
        );
    }
  };

  const renderActionButtons = () => {
    if (status !== 'success') return null;
    return (
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <button onClick={handleCopy} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Copy Text">
            {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5 text-gray-600" />}
          </button>
          
          <div ref={downloadMenuRef} className="relative">
            <button onClick={() => setDownloadMenuOpen(p => !p)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200" title="Download Options">
              <DownloadIcon className="w-5 h-5 text-gray-600" />
            </button>
            {isDownloadMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button onClick={() => handleDownload('word')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <WordIcon className="w-5 h-5 mr-3 text-blue-700" /> Download as .doc
                  </button>
                  <button onClick={() => handleDownload('txt')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                     <TxtIcon className="w-5 h-5 mr-3 text-gray-700" /> Download as .txt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
  };

  return (
    <div className={`bg-white p-8 rounded-lg shadow-md border border-gray-200 relative flex flex-col ${status === 'loading' ? 'h-auto' : 'h-full'}`}>
      {renderActionButtons()}
      <div className="h-full flex-grow flex items-center justify-center">
        <div className="w-full h-full">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PolicyPreview;
