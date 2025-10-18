
import React, { useState } from 'react';
import { updatePolicy } from '../services/geminiService';
import type { PolicyUpdateResult } from '../types';
import { LoadingIcon, UpdateIcon } from './Icons';
import ReactMarkdown from 'https://esm.sh/react-markdown@9?deps=react@^19.2.0';
import rehypeSanitize from 'https://esm.sh/rehype-sanitize@6?deps=react@^19.2.0';

interface PolicyUpdaterProps {
  onBack: () => void;
}

const PolicyUpdater: React.FC<PolicyUpdaterProps> = ({ onBack }) => {
  const [originalPolicy, setOriginalPolicy] = useState('');
  const [updateResult, setUpdateResult] = useState<PolicyUpdateResult | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!originalPolicy.trim()) return;
    setStatus('loading');
    setError(null);
    setUpdateResult(null);
    try {
      const result = await updatePolicy(originalPolicy);
      setUpdateResult(result);
      setStatus('success');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setStatus('error');
    }
  };

  const renderResults = () => {
    if (status !== 'success' || !updateResult) return null;
    return (
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-secondary mb-6 text-center">Analysis Complete</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel: Updated Policy */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-xl font-bold text-secondary mb-4">Updated Policy</h3>
                <p className="text-sm text-gray-600 mb-4">Review the updated version of your policy below. We've preserved your original wording where possible.</p>
                <div className="border border-gray-200 rounded-md bg-gray-50 flex-grow" style={{ minHeight: '400px', maxHeight: '60vh', overflowY: 'auto' }}>
                    <article className="prose max-w-none p-4">
                        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{updateResult.updatedPolicyText}</ReactMarkdown>
                    </article>
                </div>
            </div>
            {/* Right Panel: Changes */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-xl font-bold text-secondary mb-4">Summary of Changes</h3>
                 <p className="text-sm text-gray-600 mb-4">Here's what we changed and why, based on current SA legislation.</p>
                <div className="space-y-4 flex-grow" style={{ minHeight: '400px', maxHeight: '60vh', overflowY: 'auto' }}>
                    {updateResult.changes.length > 0 ? (
                        updateResult.changes.map((change, index) => (
                            <div key={index} className="p-4 border rounded-md bg-blue-50 border-blue-200 text-sm">
                                <h4 className="font-semibold text-secondary">{change.changeDescription}</h4>
                                <p className="text-gray-800 mt-1"><strong className="font-medium text-secondary">Reason:</strong> {change.reason}</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 border rounded-md bg-green-50 border-green-200 text-center flex items-center justify-center h-full">
                            <p className="text-green-800 font-semibold">No major compliance changes were needed. Your policy appears to be up-to-date.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-primary font-semibold hover:underline flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Home
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary">Update Your HR Policy</h2>
            <p className="text-gray-600 mt-2 mb-6 max-w-3xl mx-auto">Paste your current policy text below. Our AI will review it against the latest South African labour laws, suggest updates, and explain the reasons for each change.</p>
        </div>
        
        <textarea
          value={originalPolicy}
          onChange={(e) => setOriginalPolicy(e.target.value)}
          placeholder="Paste your full policy text here..."
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm h-64 resize-y focus:ring-primary focus:border-primary"
          aria-label="Policy text input"
          disabled={status === 'loading'}
        />

        <div className="mt-6 flex justify-center">
            <button
            onClick={handleUpdate}
            disabled={status === 'loading' || !originalPolicy.trim()}
            className="w-full max-w-xs bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
            {status === 'loading' ? (
                <>
                    <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Analyzing...
                </>
            ) : (
                <>
                    <UpdateIcon className="w-5 h-5 mr-2" />
                    Update My Policy
                </>
            )}
            </button>
        </div>

        {status === 'error' && <p className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
      </div>
      
      {renderResults()}
    </div>
  );
};

export default PolicyUpdater;
