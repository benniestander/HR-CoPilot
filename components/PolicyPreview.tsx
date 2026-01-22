
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  onContentChange?: (newContent: string) => void;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    accentColor?: string;
  };
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
  .branding-header { margin-bottom: 30pt; text-align: right; border-bottom: 2pt solid var(--primary-color, #188693); padding-bottom: 10pt; }
  .branding-logo { max-height: 60pt; max-width: 200pt; }
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

const PolicyPreview: React.FC<PolicyPreviewProps> = ({ policyText, status, onRetry, isForm, outputFormat, sources, errorMessage, loadingMessages, onContentChange, branding }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      // Only set content if it's different to prevent cursor jumps if this runs on re-render
      // However, typically policyText won't change while editing unless re-generated.
      // We assume policyText is the source of truth from AI initially.
      if (editorRef.current.innerHTML === '') {
        (async () => {
          const rawHtml = await marked.parse(policyText);
          const cleanHtml = DOMPurify.sanitize(rawHtml);
          editorRef.current!.innerHTML = cleanHtml;
          // If onContentChange is provided, initialize it with the generated content
          if (onContentChange) onContentChange(policyText); // We pass markdown back initially? No, let's keep it HTML edit.
          // Actually, if we edit HTML, we lose markdown structure. But for saving, we save the HTML or Text content.
          // The DB saves 'content'. If we edit, we save the innerText/HTML.
          // For simplicity, let's just assume manual edits are saved as text or basic HTML.
        })();
      }
    } else if (editorRef.current && status !== 'success') {
      editorRef.current.innerHTML = '';
    }
  }, [policyText, status]);

  const handleInput = () => {
    if (editorRef.current && onContentChange) {
      // Pass the innerText (or innerHTML if you want to support rich text saving, but marked converts MD->HTML)
      // Since the generator expects to save 'content', and the preview displays MD converted to HTML,
      // saving innerText is safer for "text" edits, but we lose formatting. 
      // Saving innerHTML preserves formatting but makes future "updates" harder if not converted back to MD.
      // For this MVP: Save innerText to keep it simple, or innerHTML if we treat it as the final doc.
      // Let's use innerText to be safe against XSS persistence, or check requirements.
      // Requirement: "user edits are captured". 
      onContentChange(editorRef.current.innerText);
    }
  };

  const handleCopy = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStyledHtmlForDownload = (contentHtml: string, docTitle: string) => {
    const bodyStyles = WORD_DOCUMENT_STYLES.replace(/\.word-document-preview/g, 'body');
    const headerHtml = branding?.logoUrl ? `
      <div class="branding-header">
        <img src="${branding.logoUrl}" class="branding-logo" />
      </div>
    ` : '';

    return `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><title>${docTitle}</title>
      <style>
        @page { size: A4; margin: 1in; }
        :root { --primary-color: ${branding?.primaryColor || '#188693'}; }
        ${bodyStyles}
        .print-hide { display: none !important; }
      </style></head><body>${headerHtml}${contentHtml}</body></html>
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
      blob = new Blob([htmlDoc], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' });
      filename = `${title}.docx`;
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
        return (
          <div className="text-center py-20 px-8 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl">
            <ShieldCheckIcon className="w-16 h-16 text-secondary/10 mx-auto mb-6" />
            <h3 className="text-xl font-serif italic text-secondary mb-2">Registry Draft Pending</h3>
            <p className="text-secondary/40 text-sm max-w-sm mx-auto">Complete the diagnostic questionnaire to generate your legally validated document.</p>
          </div>
        );
      case 'loading':
        if (loadingMessages && loadingMessages.length > 0) {
          return <SemanticLoader messages={loadingMessages} />;
        }
        return (
          <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl">
            <LoadingIcon className="w-12 h-12 animate-spin mx-auto mb-6 text-primary" />
            <h3 className="text-xl font-serif italic text-secondary">Forging Document...</h3>
            <p className="text-secondary/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Consulting SA Labour Law Database</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center py-12 bg-red-500/5 rounded-3xl border border-red-500/10 px-8">
            <h3 className="text-lg font-bold text-red-600 mb-2">Generation Interrupted</h3>
            <p className="text-red-500/70 text-sm mb-6">{errorMessage || "The AI smithy encountered a conflict. Please re-attempt generation."}</p>
            <button onClick={onRetry} className="bg-red-500 text-white font-black text-[10px] uppercase tracking-widest py-3 px-8 rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">
              Retry Forge
            </button>
          </div>
        );
      case 'success':
        return (
          <div id="policy-preview-content" className="h-full flex flex-col space-y-6 md:space-y-8 animate-fade-in">
            <div className={`bg-white shadow-2xl shadow-secondary/10 border border-secondary/5 ${isMobile ? 'p-6 py-10' : 'p-12 md:p-20'} min-h-[600px] md:min-h-[800px] rounded-sm relative group overflow-hidden ring-1 ring-black/5`}>
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>

              <div
                ref={editorRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={handleInput}
                className="word-document-preview w-full h-full outline-none relative z-10 font-serif leading-relaxed text-[17px] text-secondary/90"
              />
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <span className="text-[9px] font-black uppercase tracking-widest text-secondary/30 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-secondary/5 shadow-sm">Interactive Draft Mode</span>
              </div>
            </div>

            {!isForm && <SourcesUsed sources={sources} />}

            <div className="bg-secondary/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-secondary/5">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-secondary/40 mb-6">Execution Roadmap</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">Step 01</span>
                  <h4 className="font-serif italic text-lg text-secondary">Clinical Review</h4>
                  <p className="text-secondary/50 text-xs leading-relaxed">Read through the generated content and make any final tweaks directly in the interactive paper above.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">Step 02</span>
                  <h4 className="font-serif italic text-lg text-secondary">Legal Validation</h4>
                  <p className="text-secondary/50 text-xs leading-relaxed">Our AI is built on constitutional principles, but we recommend a final verified check for sensitive cases.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">Step 03</span>
                  <h4 className="font-serif italic text-lg text-secondary">Official Activation</h4>
                  <p className="text-secondary/50 text-xs leading-relaxed">Download as Word, print on company letterhead, and secure signatures to activate compliance.</p>
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
      <div className={`absolute ${isMobile ? '-top-14 right-4' : '-top-6 right-0'} flex space-x-3 z-20 print-hide`}>
        <button
          onClick={handleCopy}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-secondary/5 shadow-xl shadow-secondary/5 hover:bg-secondary hover:text-white transition-all group"
          title="Copy to Clipboard"
        >
          {copied ? <CheckIcon className="w-5 h-5 text-emerald-500" /> : <CopyIcon className="w-5 h-5 transition-transform group-hover:scale-110" />}
        </button>

        <div ref={downloadMenuRef} className="relative">
          <button
            onClick={() => setDownloadMenuOpen(p => !p)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all group"
            title="Download Repository"
          >
            <DownloadIcon className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
          </button>
          {isDownloadMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 mt-3 w-64 origin-top-right bg-white rounded-3xl shadow-2xl ring-1 ring-black ring-opacity-5 border border-secondary/5 z-50 overflow-hidden px-2 py-2"
            >
              <button onClick={() => handleDownload('word')} className="w-full text-left flex items-center p-4 rounded-2xl hover:bg-secondary/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                  <WordIcon className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <span className="block text-[11px] font-black text-secondary uppercase tracking-wider">Word Document</span>
                  <span className="block text-[9px] text-secondary/40">Best for further editing</span>
                </div>
              </button>
              <button onClick={() => handleDownload('txt')} className="w-full text-left flex items-center p-4 rounded-2xl hover:bg-secondary/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-gray-100 transition-colors">
                  <TxtIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <span className="block text-[11px] font-black text-secondary uppercase tracking-wider">Plain Text</span>
                  <span className="block text-[9px] text-secondary/40">Raw text data</span>
                </div>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative flex flex-col ${status === 'loading' ? 'h-auto' : 'h-full mt-10'}`}>
      {renderActionButtons()}
      <div className="h-full flex-grow flex items-center justify-center">
        <div className="w-full h-full mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PolicyPreview;
