/**
 * Main App Component
 * Root component that manages global state and layout
 */

import { useState, useEffect } from 'react';
import { FormData, INITIAL_FORM_DATA } from './types/form.types';
import { loadFormData, saveFormData, clearFormData, hasFormData } from './utils/storage';
import { loadMockData } from './services/api';
import FormWizard from './components/FormWizard';
import { TipProvider } from './contexts/TipContext';

function App() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);

  // Check for existing data on mount
  useEffect(() => {
    const existingData = hasFormData();
    setHasExistingData(existingData);

    if (existingData) {
      const loaded = loadFormData();
      if (loaded) {
        setFormData(loaded);
      }
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    if (!showWelcome) {
      saveFormData(formData);
    }
  }, [formData, showWelcome]);

  const handleStart = (loadPrevious: boolean = false) => {
    if (loadPrevious) {
      const loaded = loadFormData();
      if (loaded) {
        setFormData(loaded);
      }
    }
    setShowWelcome(false);
  };

  const handleLoadMockData = async () => {
    try {
      const mockData = await loadMockData('default');
      setFormData(mockData);
      setShowWelcome(false);
    } catch (error) {
      console.error('Failed to load mock data:', error);
      alert('Failed to load test data. Please try again.');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
      clearFormData();
      setFormData(INITIAL_FORM_DATA);
      setHasExistingData(false);
    }
  };

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? All current data will be cleared.')) {
      clearFormData();
      setFormData(INITIAL_FORM_DATA);
      setShowWelcome(true);
      setHasExistingData(false);
    }
  };

  return (
    <TipProvider formData={formData}>
      <div className="min-h-screen bg-gradient-to-br from-ircc-blue-light to-gray-50">
        {/* Header */}
        <header className="bg-ircc-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">IRCC Study Permit</h1>
                <p className="text-sm text-ircc-blue-light">Application Form Filler</p>
              </div>
            </div>
            {!showWelcome && (
              <button
                onClick={handleStartOver}
                className="px-4 py-2 bg-white text-ircc-blue rounded-lg hover:bg-gray-100 transition text-sm font-medium"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showWelcome ? (
          /* Welcome Screen */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-ircc-blue rounded-full mb-4">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to Study Permit Application Helper
                </h2>
                <p className="text-gray-600 text-lg">
                  Simplify your Canadian study permit application with our guided form filler
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">What This Tool Does:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Step-by-step guided form with validation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Generate a complete PDF application form</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Personalized document checklist</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Automatic progress saving in your browser</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Real-time error checking and guidance</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                {hasExistingData && (
                  <button
                    onClick={() => handleStart(true)}
                    className="w-full px-6 py-4 bg-ircc-blue text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Continue Previous Application
                  </button>
                )}

                <button
                  onClick={() => handleStart(false)}
                  className={`w-full px-6 py-4 rounded-lg transition font-semibold text-lg ${
                    hasExistingData
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-ircc-blue text-white hover:bg-blue-700'
                  }`}
                >
                  Start New Application
                </button>

                <button
                  onClick={handleLoadMockData}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg"
                >
                  Load Test Data (For Demo)
                </button>

                {hasExistingData && (
                  <button
                    onClick={handleClearData}
                    className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-lg"
                  >
                    Clear Saved Data
                  </button>
                )}
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important:</p>
                    <p>This is an MVP tool to help you prepare your application. Always verify information with official IRCC sources and consult with an immigration lawyer or consultant if needed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Form Wizard */
          <FormWizard formData={formData} setFormData={setFormData} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-300">
              IRCC Study Permit Form Filler MVP - For Educational Purposes
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Not affiliated with Immigration, Refugees and Citizenship Canada (IRCC)
            </p>
            <div className="mt-4 text-xs text-gray-400">
              <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Visit Official IRCC Website
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </TipProvider>
  );
}

export default App;
