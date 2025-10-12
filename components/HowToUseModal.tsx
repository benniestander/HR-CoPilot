import React, { useState } from 'react';
import { MasterPolicyIcon, FormsIcon } from './Icons';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'forms'>('policies');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col"
        style={{ maxHeight: '90vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-use-title"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 id="how-to-use-title" className="text-xl font-bold text-secondary">How to Use Ingcweti</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-md font-semibold border-b-2 transition-colors ${
              activeTab === 'policies'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MasterPolicyIcon className="w-5 h-5 mr-2" />
            Policy Generator
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-md font-semibold border-b-2 transition-colors ${
              activeTab === 'forms'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FormsIcon className="w-5 h-5 mr-2" />
            Form Generator
          </button>
        </div>

        <div className="p-8 overflow-y-auto text-gray-700">
            {activeTab === 'policies' ? (
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4">How to Generate a Custom HR Policy</h3>
                <ol className="list-decimal list-inside space-y-4">
                  <li>
                    <strong className="font-semibold text-secondary">Select a Policy:</strong> Start by browsing our extensive list of HR policies. You can use the search bar to find a specific policy or filter by industry to see recommended documents for your sector. Click on the policy you need.
                  </li>
                  <li>
                    <strong className="font-semibold text-secondary">Enter Company Details:</strong> On the next screen, enter your company's official name and confirm your industry. This basic information is crucial for tailoring the document specifically for your business.
                  </li>
                  <li>
                    <strong className="font-semibold text-secondary">Answer Guided Questions:</strong> You'll be presented with a short questionnaire. Choose a "Company Voice" to set the tone (e.g., formal or friendly) and answer a few simple questions. Your answers will be integrated directly into the policy clauses by our AI.
                  </li>
                  <li>
                    <strong className="font-semibold text-secondary">Generate & Finalize:</strong> Click "Generate My Document". The AI will draft a comprehensive, legally-grounded policy in the preview pane. You can then:
                    <ul className="list-disc list-inside space-y-2 mt-2 ml-5">
                        <li><strong>Edit directly</strong> in the text box for minor changes.</li>
                        <li>Review the <strong>web sources</strong> the AI used for accuracy.</li>
                        <li><strong>Copy</strong> the full text to your clipboard.</li>
                        <li><strong>Download</strong> the document as a Word-compatible .doc file.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4">How to Generate a Ready-to-Use HR Form</h3>
                <ol className="list-decimal list-inside space-y-4">
                    <li>
                        <strong className="font-semibold text-secondary">Select a Form:</strong> Navigate to the "HR Forms" tab and choose the form you need. Look for the Word or Excel icon to see the recommended format for the document.
                    </li>
                    <li>
                        <strong className="font-semibold text-secondary">Provide Company Name:</strong> Enter your company name to ensure it's included on the form.
                    </li>
                    <li>
                        <strong className="font-semibold text-secondary">Answer Simple Questions:</strong> Some forms have a few optional questions to pre-fill key details, such as an employee's name or a manager's title. This saves you time later.
                    </li>
                    <li>
                        <strong className="font-semibold text-secondary">Generate & Use:</strong> Click "Generate My Document". The AI will refine the template into a clean, professional form. You can then:
                        <ul className="list-disc list-inside space-y-2 mt-2 ml-5">
                            <li><strong>Edit directly</strong> in the preview pane.</li>
                            <li><strong>Copy</strong> the text to use elsewhere.</li>
                            <li><strong>Download</strong> the form. It will download as a Word-compatible .doc or an Excel-compatible .csv file, depending on the form's purpose.</li>
                        </ul>
                    </li>
                </ol>
              </div>
            )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md text-white bg-primary hover:bg-opacity-90 transition"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToUseModal;
