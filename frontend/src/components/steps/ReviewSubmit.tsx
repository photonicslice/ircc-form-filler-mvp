/**
 * Review and Submit Step Component
 * Final step where users review data, see checklist, and generate PDF
 */

import { useState, useEffect } from 'react';
import { FormData, ChecklistDocument } from '../../types/form.types';
import { generatePDF, generateChecklist, validateForm, downloadPDF, loadMockData } from '../../services/api';

interface ReviewSubmitProps {
  formData: FormData;
  onEdit: (step: number) => void;
}

export default function ReviewSubmit({ formData, onEdit }: ReviewSubmitProps) {
  const [checklist, setChecklist] = useState<ChecklistDocument[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  // Load checklist on mount
  useEffect(() => {
    loadChecklist();
    validateFormData();
  }, []);

  const loadChecklist = async () => {
    setIsLoadingChecklist(true);
    try {
      const response = await generateChecklist(formData);
      setChecklist(response.checklist);
    } catch (error) {
      console.error('Failed to load checklist:', error);
    } finally {
      setIsLoadingChecklist(false);
    }
  };

  const validateFormData = async () => {
    try {
      const response = await validateForm(formData);
      setValidationErrors(response.validation);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await generatePDF(formData);
      downloadPDF(pdfBlob, `study-permit-${formData.personalInfo.lastName}-${Date.now()}.pdf`);
      setPdfGenerated(true);
    } catch (error: any) {
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const requiredDocs = checklist.filter(doc => doc.required);
  const optionalDocs = checklist.filter(doc => !doc.required);

  const isValid = validationErrors?.isValid ?? false;

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      {validationErrors && (
        <div className={`p-4 rounded-lg border ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start">
            {isValid ? (
              <>
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Form is Complete!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    All required fields are filled correctly. You can now generate your PDF.
                  </p>
                </div>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Form Has Errors</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Please fix the errors in the form before generating PDF.
                  </p>
                  <div className="mt-2 text-sm text-red-700">
                    <p className="font-medium">Errors found in:</p>
                    <ul className="list-disc list-inside mt-1">
                      {Object.keys(validationErrors.errors || {}).map((section) => (
                        <li key={section}>{section.replace(/([A-Z])/g, ' $1').trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Form Data Review */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Application Summary</h2>
        </div>

        {/* Personal Information */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-md font-semibold text-gray-900">Personal Information</h3>
            <button
              onClick={() => onEdit(1)}
              className="text-sm text-ircc-blue hover:underline"
            >
              Edit
            </button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Full Name</dt>
              <dd className="font-medium text-gray-900">{formData.personalInfo.firstName} {formData.personalInfo.lastName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Date of Birth</dt>
              <dd className="font-medium text-gray-900">{formData.personalInfo.dateOfBirth}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Nationality</dt>
              <dd className="font-medium text-gray-900">{formData.personalInfo.nationality}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Country of Residence</dt>
              <dd className="font-medium text-gray-900">{formData.personalInfo.countryOfResidence}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{formData.personalInfo.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Phone</dt>
              <dd className="font-medium text-gray-900">{formData.personalInfo.phone}</dd>
            </div>
          </dl>
        </div>

        {/* Passport Information */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-md font-semibold text-gray-900">Passport Information</h3>
            <button
              onClick={() => onEdit(2)}
              className="text-sm text-ircc-blue hover:underline"
            >
              Edit
            </button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Passport Number</dt>
              <dd className="font-medium text-gray-900">{formData.passportInfo.passportNumber}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Issuing Country</dt>
              <dd className="font-medium text-gray-900">{formData.passportInfo.issuingCountry}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Issue Date</dt>
              <dd className="font-medium text-gray-900">{formData.passportInfo.issueDate}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Expiry Date</dt>
              <dd className="font-medium text-gray-900">{formData.passportInfo.expiryDate}</dd>
            </div>
          </dl>
        </div>

        {/* Education History */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-md font-semibold text-gray-900">Education History</h3>
            <button
              onClick={() => onEdit(3)}
              className="text-sm text-ircc-blue hover:underline"
            >
              Edit
            </button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Highest Education</dt>
              <dd className="font-medium text-gray-900">{formData.educationHistory.highestEducation}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Institution</dt>
              <dd className="font-medium text-gray-900">{formData.educationHistory.institutionName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Field of Study</dt>
              <dd className="font-medium text-gray-900">{formData.educationHistory.fieldOfStudy}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Graduation Year</dt>
              <dd className="font-medium text-gray-900">{formData.educationHistory.graduationYear}</dd>
            </div>
          </dl>
        </div>

        {/* Study Purpose */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-md font-semibold text-gray-900">Study Purpose</h3>
            <button
              onClick={() => onEdit(4)}
              className="text-sm text-ircc-blue hover:underline"
            >
              Edit
            </button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Canadian Institution</dt>
              <dd className="font-medium text-gray-900">{formData.studyPurpose.canadianInstitution}</dd>
            </div>
            <div>
              <dt className="text-gray-500">DLI Number</dt>
              <dd className="font-medium text-gray-900">{formData.studyPurpose.dli}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Program Name</dt>
              <dd className="font-medium text-gray-900">{formData.studyPurpose.programName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Program Level</dt>
              <dd className="font-medium text-gray-900">{formData.studyPurpose.programLevel}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Start Date</dt>
              <dd className="font-medium text-gray-900">{formData.studyPurpose.programStartDate}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Duration</dt>
              <dd className="font-medium text-gray-900">{formData.studyPurpose.programDuration} months</dd>
            </div>
          </dl>
        </div>

        {/* Proof of Funds */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-md font-semibold text-gray-900">Proof of Funds</h3>
            <button
              onClick={() => onEdit(5)}
              className="text-sm text-ircc-blue hover:underline"
            >
              Edit
            </button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Annual Tuition</dt>
              <dd className="font-medium text-gray-900">CAD ${parseFloat(formData.proofOfFunds.annualTuitionFees || '0').toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Available Funds</dt>
              <dd className="font-medium text-gray-900">CAD ${parseFloat(formData.proofOfFunds.availableFunds || '0').toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Funding Source</dt>
              <dd className="font-medium text-gray-900">{formData.proofOfFunds.fundingSource}</dd>
            </div>
            {formData.proofOfFunds.hasSponsor && (
              <div>
                <dt className="text-gray-500">Sponsor Relationship</dt>
                <dd className="font-medium text-gray-900">{formData.proofOfFunds.sponsorRelationship}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Document Checklist */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowChecklist(!showChecklist)}
          className="w-full bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center hover:bg-gray-100 transition"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Required Documents ({requiredDocs.length} required, {optionalDocs.length} optional)
          </h2>
          <svg
            className={`w-5 h-5 transform transition ${showChecklist ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {showChecklist && (
          <div className="p-6">
            {isLoadingChecklist ? (
              <p className="text-center text-gray-500">Loading checklist...</p>
            ) : (
              <>
                {/* Required Documents */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Required Documents</h3>
                  <div className="space-y-3">
                    {requiredDocs.map((doc) => (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                              !
                            </span>
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            {doc.tips.length > 0 && (
                              <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
                                {doc.tips.map((tip, i) => (
                                  <li key={i}>{tip}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Documents */}
                {optionalDocs.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Optional But Recommended</h3>
                    <div className="space-y-3">
                      {optionalDocs.map((doc) => (
                        <div key={doc.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                                i
                              </span>
                            </div>
                            <div className="ml-3 flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                              {doc.tips.length > 0 && (
                                <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
                                  {doc.tips.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Generate PDF Button */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <button
          onClick={handleGeneratePDF}
          disabled={!isValid || isGeneratingPDF}
          className={`w-full md:w-auto px-8 py-4 rounded-lg font-semibold text-lg transition ${
            !isValid || isGeneratingPDF
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-ircc-red text-white hover:bg-red-700'
          }`}
        >
          {isGeneratingPDF ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating PDF...
            </span>
          ) : (
            'Generate PDF Application'
          )}
        </button>

        {pdfGenerated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full">
            <p className="text-green-800 text-sm text-center">
              PDF generated successfully! Check your downloads folder.
            </p>
          </div>
        )}

        {!isValid && (
          <p className="text-sm text-red-600 text-center">
            Please fix all validation errors before generating PDF
          </p>
        )}
      </div>

      {/* Next Steps Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">Next Steps</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800">
          <li>Download and review your completed PDF application</li>
          <li>Gather all required documents from the checklist above</li>
          <li>Sign and date your application form</li>
          <li>Create an account on the IRCC website if you haven't already</li>
          <li>Submit your application online through your IRCC account</li>
          <li>Pay the application fee (CAD $150 as of 2024)</li>
          <li>Upload all supporting documents</li>
          <li>Submit biometrics if required</li>
          <li>Track your application status online</li>
        </ol>
      </div>
    </div>
  );
}
