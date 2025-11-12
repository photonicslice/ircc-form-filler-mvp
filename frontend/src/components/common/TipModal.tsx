/**
 * TipModal Component
 * Modal that displays static tips and allows requesting AI-powered help
 */

import { useState } from 'react';

interface StaticTip {
  title: string;
  tip: string;
  example?: string;
  keyPoints?: string[];
  link?: string;
}

interface TipModalProps {
  fieldName: string;
  staticTip: StaticTip;
  isOpen: boolean;
  onClose: () => void;
  formData?: any;
  onRequestAITip?: (fieldName: string, formData: any) => Promise<string>;
}

export default function TipModal({
  fieldName,
  staticTip,
  isOpen,
  onClose,
  formData,
  onRequestAITip
}: TipModalProps) {
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(false);

  const handleGetAIHelp = async () => {
    if (!onRequestAITip) {
      setAiError(true);
      return;
    }

    setIsLoadingAI(true);
    setAiError(false);

    try {
      const tip = await onRequestAITip(fieldName, formData);
      setAiTip(tip);
    } catch (error) {
      console.error('AI tip error:', error);
      setAiError(true);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Reset AI tip when modal closes
  const handleClose = () => {
    setAiTip(null);
    setAiError(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {staticTip.title}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none font-light"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Static Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <span className="mr-2">💡</span>
              Quick Tip
            </h3>
            <p className="text-sm text-blue-900 leading-relaxed">{staticTip.tip}</p>

            {staticTip.example && (
              <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                <span className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Example:</span>
                <p className="text-sm text-gray-800 mt-1 font-mono">{staticTip.example}</p>
              </div>
            )}

            {staticTip.keyPoints && staticTip.keyPoints.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Key Points:</span>
                <ul className="mt-2 space-y-1">
                  {staticTip.keyPoints.map((point: string, index: number) => (
                    <li key={index} className="text-sm text-blue-900 flex items-start">
                      <span className="mr-2 text-blue-600">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {staticTip.link && (
              <div className="mt-3">
                <a
                  href={staticTip.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-700 hover:text-blue-800 underline font-medium"
                >
                  Learn more →
                </a>
              </div>
            )}
          </div>

          {/* AI Help Section */}
          {!aiTip && !isLoadingAI && onRequestAITip && (
            <div className="text-center py-6 border-2 border-dashed border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="mb-3">
                <span className="text-4xl">🤖</span>
              </div>
              <button
                onClick={handleGetAIHelp}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md inline-flex items-center space-x-2 font-medium"
              >
                <span>Get AI-Powered Personalized Help</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-xs text-gray-600 mt-3">
                Get advice tailored to your specific situation
              </p>
            </div>
          )}

          {/* AI Loading */}
          {isLoadingAI && (
            <div className="flex flex-col items-center justify-center space-y-3 py-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
              <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-purple-700 font-medium">Generating personalized advice...</span>
              <span className="text-xs text-gray-500">This may take a few seconds</span>
            </div>
          )}

          {/* AI Tip Display */}
          {aiTip && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🤖</span>
                <h3 className="text-sm font-semibold text-purple-900">AI Personalized Advice</h3>
              </div>
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap bg-white bg-opacity-60 p-4 rounded">
                {aiTip}
              </div>
            </div>
          )}

          {/* AI Error */}
          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-red-600 text-xl mr-2">⚠️</span>
                <div>
                  <p className="text-sm text-red-800 font-medium">Unable to generate AI advice</p>
                  <p className="text-xs text-red-600 mt-1">
                    Please refer to the quick tip above or try again later.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-xs">
            <p className="text-yellow-900 flex items-start">
              <span className="mr-2 text-yellow-600">⚠️</span>
              <span>
                This guidance is for informational purposes only. Always verify with{' '}
                <a
                  href="https://www.canada.ca/en/immigration-refugees-citizenship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold hover:text-yellow-950"
                >
                  official IRCC resources
                </a>.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
