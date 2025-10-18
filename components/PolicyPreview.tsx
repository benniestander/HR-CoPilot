import React, { useState, useEffect, useRef } from 'react';
import { LoadingIcon, CopyIcon, DownloadIcon, CheckIcon, WordIcon, ExcelIcon, PdfIcon, TxtIcon } from './Icons';
import type { AppStatus, Source } from '../types';
import { GLOSSARY } from '../glossary';
import GlossaryModal from './GlossaryModal';

interface PolicyPreviewProps {
  policyText: string;
  status: AppStatus;
  onRetry: () => void;
  isForm: boolean;
  outputFormat?: 'word' | 'excel';
  sources: Source[];
}

const SourcesUsed: React.FC<{ sources: Source[] }> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-dashed border-gray-300 next-steps-print-hide">
      <h3 className="text-xl font-bold text-secondary mb-4">Sources Used</h3>
      <p className="text-sm text-gray-600 mb-4">
        This document was generated using information from the following web sources for grounding and accuracy. It is recommended to review them for further context.
      </p>
      <ul className="space-y-2">
        {sources.map((source, index) => (
          source.web?.uri && (
            <li key={index} className="text-sm">
              <a
                href={source.web.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-words"
                aria-label={`Source: ${source.web.title || 'Untitled'}`}
              >
                {source.web.title || source.web.uri}
              </a>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};


const PolicyPreview: React.FC<PolicyPreviewProps> = ({ policyText, status, onRetry, isForm, outputFormat, sources }) => {
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(policyText);
  const [selectedTerm, setSelectedTerm] = useState<{ term: string; definition: string } | null>(null);
  const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When the generation is finished, update the editable text.
    if (status === 'success') {
      setEditableText(policyText);
    }
  }, [policyText, status]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCopy = () => {
    const textToCopy = isForm ? editableText : policyText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
  };

  const markdownTableToCsv = (markdown: string): string => {
    if (!markdown) return '';
    const lines = markdown.trim().split('\n');
    const rows = lines
      .map(line => line.split('|').map(cell => cell.trim()).slice(1, -1))
      .filter(row => row.length > 0 && !row.every(cell => /^-+$/.test(cell.replace(/ /g, ''))));
    
    if (rows.length === 0) {
      return markdown; 
    }

    return rows.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  const handlePrintToPdf = () => {
    const previewContainer = document.getElementById('policy-preview-content');
    if (!previewContainer) return;

    let contentToPrint = '';
    const textarea = previewContainer.querySelector('textarea');
    
    if (textarea) {
        // It's a form, get textarea value and wrap in <pre>
        const escapedText = textarea.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        contentToPrint = `<pre style="white-space: pre-wrap; font-family: sans-serif; font-size: 14px;">${escapedText}</pre>`;
    } else {
        // It's a policy, get the rendered HTML
        contentToPrint = previewContainer.innerHTML;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
        doc.open();
        doc.write(`
        <!DOCTYPE html>
        <html>
            <head>
            <title>Print Document</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
                tailwind.config = {
                    theme: {
                        extend: {
                            typography: ({ theme }) => ({
                                DEFAULT: {
                                    css: {
                                        // Custom prose styles for printing if needed
                                    },
                                },
                            }),
                        }
                    }
                }
            </script>
            <style>
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    button { display: none !important; }
                    .next-steps-print-hide { display: none !important; }
                }
            </style>
            </head>
            <body>
                <div class="p-4">
                    <div class="${textarea ? '' : 'prose max-w-none'}">${contentToPrint}</div>
                </div>
            </body>
        </html>
        `);
        doc.close();
    }
    
    iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    };
  };
  
  const handleDownload = (format: 'word' | 'csv' | 'txt' | 'pdf') => {
    setDownloadMenuOpen(false);
    const textToDownload = isForm ? editableText : policyText;

    if (format === 'pdf') {
        handlePrintToPdf();
        return;
    }

    let blob;
    let filename;
    const title = `hr_${isForm ? 'form' : 'policy'}`;

    switch(format) {
      case 'csv':
        const csvContent = markdownTableToCsv(textToDownload);
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        filename = `${title}.csv`;
        break;
      case 'txt':
        blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8;' });
        filename = `${title}.txt`;
        break;
      case 'word':
      default:
        blob = new Blob([textToDownload], { type: 'application/msword;charset=utf-8' });
        filename = `${title}.doc`;
        break;
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

  const highlightTerms = (text: string): React.ReactNode[] => {
    if (!text) return [text];
    
    const terms = Object.keys(GLOSSARY);
    const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
        const lowerCasePart = part.toLowerCase();
        if (terms.includes(lowerCasePart)) {
            return (
                <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedTerm({ term: part, definition: GLOSSARY[lowerCasePart] })}
                    className="text-primary font-semibold underline decoration-dotted hover:bg-primary/10 rounded-sm p-0.5 -m-0.5 transition-colors"
                    aria-label={`View definition for ${part}`}
                >
                    {part}
                </button>
            );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="text-center text-gray-500">
            <h3 className="text-lg font-semibold">{`Your generated ${isForm ? 'form' : 'policy'} will appear here.`}</h3>
            <p>Complete the form on the left and click "Generate" to start.</p>
          </div>
        );
      case 'loading':
        return (
          <div className="text-center text-gray-500">
            <LoadingIcon className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold">Generating your document...</h3>
            <p>This may take a moment. Ingcweti is crafting your document.</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center text-red-600 bg-red-50 p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-2">An Error Occurred</h3>
            <p className="mb-4">We couldn't generate your document. Please try again.</p>
            <button
              onClick={onRetry}
              className="bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90"
            >
              Retry
            </button>
          </div>
        );
      case 'success':
        return (
            <div id="policy-preview-content" className="h-full flex flex-col">
              {isForm ? (
                <textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="w-full h-full flex-grow p-4 border border-gray-300 rounded-md resize-none focus:ring-primary focus:border-primary font-sans text-base"
                  aria-label="Editable document content"
                  style={{minHeight: '400px'}}
                />
              ) : (
                <div 
                   className="w-full h-full flex-grow p-4 border border-gray-300 rounded-md resize-none focus:ring-primary focus:border-primary font-sans text-base overflow-y-auto"
                   aria-label="Document content"
                   style={{minHeight: '400px'}}
                >
                    <div className="whitespace-pre-wrap">{highlightTerms(policyText)}</div>
                </div>
              )}
               {!isForm && <SourcesUsed sources={sources} />}
               <div className="mt-6 pt-6 border-t border-dashed border-gray-300 next-steps-print-hide">
                <h3 className="text-xl font-bold text-secondary mb-4">Next Steps</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                  <li>
                    <strong>Review & Finalize:</strong> Use the download options to get the document in your preferred format for final edits.
                  </li>
                  <li>
                    <strong>Legal Check:</strong> We strongly recommend a qualified labour lawyer reviews this document.
                  </li>
                  <li>
                    <strong>Communicate:</strong> Introduce the new {isForm ? 'form' : 'policy'} to your team and add it to your employee handbook.
                  </li>
                </ul>
              </div>
            </div>
        );
    }
  };

  const downloadOptions = [
    { format: 'word', label: 'Download as .doc', icon: WordIcon, color: 'text-blue-700' },
    { format: 'pdf', label: 'Download as PDF', icon: PdfIcon, color: 'text-red-700' },
    { format: 'txt', label: 'Download as .txt', icon: TxtIcon, color: 'text-gray-700' },
  ];

  if (isForm && outputFormat === 'excel') {
    downloadOptions.push({ format: 'csv', label: 'Download as .csv', icon: ExcelIcon, color: 'text-green-700' });
  }


  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 relative flex flex-col h-full">
      {status === 'success' && (
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <button onClick={handleCopy} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Copy to Clipboard">
            {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5 text-gray-600" />}
          </button>
          
          <div ref={downloadMenuRef} className="relative">
            <button 
              onClick={() => setDownloadMenuOpen(prev => !prev)} 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" 
              title="Download Options"
              aria-haspopup="true"
              aria-expanded={isDownloadMenuOpen}
            >
              <DownloadIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            {isDownloadMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {downloadOptions.map((option) => (
                     <button
                        key={option.format}
                        onClick={() => handleDownload(option.format as any)}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <option.icon className={`w-5 h-5 mr-3 ${option.color}`} />
                        {option.label}
                      </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="h-full flex-grow flex items-center justify-center">
        <div className="w-full h-full">
            {renderContent()}
        </div>
      </div>
       <GlossaryModal
        isOpen={!!selectedTerm}
        onClose={() => setSelectedTerm(null)}
        term={selectedTerm?.term || ''}
        definition={selectedTerm?.definition || ''}
      />
    </div>
  );
};

export default PolicyPreview;