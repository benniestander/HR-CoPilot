import React, { useState, useEffect, useRef } from 'react';
import { LoadingIcon, CopyIcon, DownloadIcon, CheckIcon, WordIcon, ExcelIcon, PdfIcon, TxtIcon, CreditCardIcon } from './Icons';
import type { AppStatus, Source } from '../types';
import PaymentModal from './PaymentModal';
import ReactMarkdown from 'https://esm.sh/react-markdown@9?deps=react@^19.2.0';
import rehypeSanitize from 'https://esm.sh/rehype-sanitize@6?deps=react@^19.2.0';
import { marked } from 'https://esm.sh/marked@12';

interface PolicyPreviewProps {
  policyText: string;
  status: AppStatus;
  onRetry: () => void;
  isForm: boolean;
  outputFormat?: 'word' | 'excel';
  sources: Source[];
}

// Define the standard document styles in a constant to be reused.
const WORD_DOCUMENT_STYLES = `
  .word-document-preview {
    font-family: Calibri, sans-serif;
    font-size: 11pt;
    line-height: 1.15;
    color: black;
    text-align: left;
  }
  .word-document-preview p {
    margin-top: 0;
    margin-bottom: 8pt;
  }
  .word-document-preview h1,
  .word-document-preview h2,
  .word-document-preview h3,
  .word-document-preview h4,
  .word-document-preview h5,
  .word-document-preview h6 {
    margin-top: 12pt;
    margin-bottom: 3pt;
    font-weight: bold;
  }
  .word-document-preview h1 { font-size: 16pt; }
  .word-document-preview h2 { font-size: 14pt; }
  .word-document-preview h3 { font-size: 12pt; }
  .word-document-preview ul,
  .word-document-preview ol {
    margin-top: 0;
    margin-bottom: 8pt;
    padding-left: 40px;
  }
  .word-document-preview table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 8pt;
  }
  .word-document-preview th,
  .word-document-preview td {
    border: 1px solid #999;
    padding: 5pt;
    text-align: left;
  }
  .word-document-preview th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
`;

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
  const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(true);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject the Word document styles into the page head for the preview component.
    const styleEl = document.createElement('style');
    styleEl.innerHTML = WORD_DOCUMENT_STYLES;
    document.head.appendChild(styleEl);
    
    // Cleanup function to remove the styles when the component unmounts.
    return () => {
        document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    if (status === 'success') {
      setEditableText(policyText);
      setIsPaid(true); // Payment is disabled, so always true.
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

  const getStyledHtml = async (markdownText: string, docTitle: string) => {
    const markdownHtml = await marked(markdownText);
    // Adapt the preview styles for the downloaded document body.
    const bodyStyles = WORD_DOCUMENT_STYLES.replace(/\.word-document-preview/g, 'body');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${docTitle}</title>
          <style>
            @page {
              size: A4;
              margin: 1in;
            }
            ${bodyStyles}
            .next-steps-print-hide { display: none !important; }
          </style>
        </head>
        <body>
          ${markdownHtml}
        </body>
      </html>
    `;
  };

  const handlePrintToPdf = async () => {
    const textToPrint = isForm ? editableText : policyText;
    const title = `hr_${isForm ? 'form' : 'policy'}`;

    const printHtml = await getStyledHtml(textToPrint, title);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
        doc.open();
        doc.write(printHtml);
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
  
  const handleDownload = async (format: 'word' | 'csv' | 'txt' | 'pdf') => {
    setDownloadMenuOpen(false);
    const textToDownload = isForm ? editableText : policyText;

    if (format === 'pdf') {
        handlePrintToPdf();
        return;
    }

    let blob;
    let filename;
    const title = `hr_${isForm ? 'form' : 'policy'}_${new Date().toISOString().split('T')[0]}`;

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
        const htmlDoc = await getStyledHtml(textToDownload, title);
        blob = new Blob([htmlDoc], { type: 'application/msword;charset=utf-8' });
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
                  readOnly={!isPaid}
                  onContextMenu={!isPaid ? (e) => e.preventDefault() : undefined}
                  className={`w-full h-full flex-grow p-4 border border-gray-300 rounded-md resize-none focus:ring-primary focus:border-primary font-sans text-base ${!isPaid ? 'select-none bg-gray-50' : ''}`}
                  aria-label="Editable document content"
                  style={{minHeight: '400px'}}
                />
              ) : (
                <div 
                   onContextMenu={!isPaid ? (e) => e.preventDefault() : undefined}
                   className={`w-full h-full flex-grow p-4 border border-gray-300 rounded-md resize-none bg-white text-base overflow-y-auto ${!isPaid ? 'select-none' : ''}`}
                   aria-label="Document content"
                   style={{minHeight: '400px'}}
                >
                    <article className="word-document-preview">
                        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{policyText}</ReactMarkdown>
                    </article>
                </div>
              )}
               {!isForm && <SourcesUsed sources={sources} />}
               <div className="mt-6 pt-6 border-t border-dashed border-gray-300 next-steps-print-hide">
                <h3 className="text-xl font-bold text-secondary mb-4">Next Steps</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                  <li>
                    <strong>Review & Finalize:</strong> {isPaid ? "Use the download options to get the document." : "Unlock downloads to get the document in your preferred format."}
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

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setPaymentModalOpen(false);
  };

  const renderActionButtons = () => {
    if (status !== 'success') return null;

    if (isPaid) {
      return (
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
      );
    } else {
      return (
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setPaymentModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-accent text-secondary font-bold rounded-full hover:bg-opacity-90 transition-colors shadow-md"
          >
            <CreditCardIcon className="w-5 h-5 mr-2" />
            Unlock & Download
          </button>
        </div>
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 relative flex flex-col h-full">
      {renderActionButtons()}
      <div className="h-full flex-grow flex items-center justify-center">
        <div className="w-full h-full">
            {renderContent()}
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        amountInCents={4900}
        itemName={`HR ${isForm ? 'Form' : 'Policy'} Document`}
      />
    </div>
  );
};

export default PolicyPreview;