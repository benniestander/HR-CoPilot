import React, { useState, useEffect } from 'react';
import { LoadingIcon, CopyIcon, DownloadIcon, CheckIcon } from './Icons';
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
    <div className="mt-6 pt-6 border-t border-dashed border-gray-300">
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
  
  const handleDownload = () => {
    let blob;
    let filename;
    const title = `hr_${isForm ? 'form' : 'policy'}`;
    const effectiveFormat = isForm ? outputFormat : 'word';
    const textToDownload = isForm ? editableText : policyText;

    if (effectiveFormat === 'excel') {
      const csvContent = markdownTableToCsv(textToDownload);
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      filename = `${title}.csv`;
    } else { // 'word'
      blob = new Blob([textToDownload], { type: 'application/msword;charset=utf-8' });
      filename = `${title}.doc`;
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
            <div className="h-full flex flex-col">
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
                   className="w-full h-full flex-grow p-4 border border-gray-300 rounded-md resize-none focus:ring-primary focus:border-primary font-sans text-base overflow-y-auto whitespace-pre-wrap"
                   aria-label="Document content"
                   style={{minHeight: '400px'}}
                >
                    {highlightTerms(policyText)}
                </div>
              )}
               {!isForm && <SourcesUsed sources={sources} />}
               <div className="mt-6 pt-6 border-t border-dashed border-gray-300">
                <h3 className="text-xl font-bold text-secondary mb-4">Next Steps</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                  <li>
                    <strong>Review & Edit:</strong> You can copy the text or download the file to make final adjustments.
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

  const effectiveFormat = isForm ? outputFormat : 'word';
  const downloadTitle = effectiveFormat === 'excel'
    ? 'Download as .csv (Excel compatible)'
    : 'Download as .doc (Word compatible)';

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 relative flex flex-col h-full">
      {status === 'success' && (
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <button onClick={handleCopy} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Copy to Clipboard">
            {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5 text-gray-600" />}
          </button>
          <button onClick={handleDownload} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title={downloadTitle}>
            <DownloadIcon className="w-5 h-5 text-gray-600" />
          </button>
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
