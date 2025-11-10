/**
 * Study Purpose Step Component
 * Collects information about planned studies in Canada
 */

import { useEffect } from 'react';
import { StudyPurpose as StudyPurposeType, PROGRAM_LEVELS } from '../../types/form.types';
import { validateStudyPurposeSection } from '../../utils/validation';

interface StudyPurposeProps {
  data: StudyPurposeType;
  updateData: (data: StudyPurposeType) => void;
  errors: Record<string, string>;
  updateErrors: (errors: Record<string, string>) => void;
}

export default function StudyPurpose({ data, updateData, errors, updateErrors }: StudyPurposeProps) {
  // Validate on data change
  useEffect(() => {
    const validationErrors = validateStudyPurposeSection(data);
    updateErrors(validationErrors);
  }, [data]);

  const handleChange = (field: keyof StudyPurposeType, value: string | boolean) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  // Calculate minimum start date (3 months from today)
  const minStartDate = new Date();
  minStartDate.setMonth(minStartDate.getMonth() + 3);
  const minStartDateString = minStartDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Canadian Institution */}
      <div>
        <label htmlFor="canadianInstitution" className="block text-sm font-medium text-gray-700 mb-2">
          Canadian Institution <span className="text-red-500">*</span>
        </label>
        <input
          id="canadianInstitution"
          type="text"
          value={data.canadianInstitution}
          onChange={(e) => handleChange('canadianInstitution', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.canadianInstitution ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="University of Toronto, McGill University, etc."
        />
        {errors.canadianInstitution && (
          <p className="mt-1 text-sm text-red-600">{errors.canadianInstitution}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Name of the Designated Learning Institution (DLI) in Canada
        </p>
      </div>

      {/* DLI Number */}
      <div>
        <label htmlFor="dli" className="block text-sm font-medium text-gray-700 mb-2">
          DLI Number <span className="text-red-500">*</span>
        </label>
        <input
          id="dli"
          type="text"
          value={data.dli}
          onChange={(e) => handleChange('dli', e.target.value.toUpperCase())}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.dli ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="O123456789"
          maxLength={10}
          style={{ textTransform: 'uppercase' }}
        />
        {errors.dli && (
          <p className="mt-1 text-sm text-red-600">{errors.dli}</p>
        )}
        <div className="mt-1 text-xs text-gray-500">
          DLI starts with "O" followed by 9 digits.
          <a
            href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ircc-blue hover:underline ml-1"
          >
            Find your institution's DLI
          </a>
        </div>
      </div>

      {/* Program Name */}
      <div>
        <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-2">
          Program Name <span className="text-red-500">*</span>
        </label>
        <input
          id="programName"
          type="text"
          value={data.programName}
          onChange={(e) => handleChange('programName', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.programName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Master of Computer Science, MBA, etc."
        />
        {errors.programName && (
          <p className="mt-1 text-sm text-red-600">{errors.programName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Official name of the program as stated in your Letter of Acceptance
        </p>
      </div>

      {/* Program Level */}
      <div>
        <label htmlFor="programLevel" className="block text-sm font-medium text-gray-700 mb-2">
          Program Level <span className="text-red-500">*</span>
        </label>
        <select
          id="programLevel"
          value={data.programLevel}
          onChange={(e) => handleChange('programLevel', e.target.value as any)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.programLevel ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select program level</option>
          {PROGRAM_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        {errors.programLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.programLevel}</p>
        )}
      </div>

      {/* Program Start Date */}
      <div>
        <label htmlFor="programStartDate" className="block text-sm font-medium text-gray-700 mb-2">
          Program Start Date <span className="text-red-500">*</span>
        </label>
        <input
          id="programStartDate"
          type="date"
          value={data.programStartDate}
          onChange={(e) => handleChange('programStartDate', e.target.value)}
          min={minStartDateString}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.programStartDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.programStartDate && (
          <p className="mt-1 text-sm text-red-600">{errors.programStartDate}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Start date must be at least 3 months from today to allow for processing
        </p>
      </div>

      {/* Program Duration */}
      <div>
        <label htmlFor="programDuration" className="block text-sm font-medium text-gray-700 mb-2">
          Program Duration (in months) <span className="text-red-500">*</span>
        </label>
        <input
          id="programDuration"
          type="number"
          min="1"
          max="60"
          value={data.programDuration}
          onChange={(e) => handleChange('programDuration', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.programDuration ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="24"
        />
        {errors.programDuration && (
          <p className="mt-1 text-sm text-red-600">{errors.programDuration}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Total program duration in months (1-60 months)
        </p>
      </div>

      {/* Letter of Acceptance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Letter of Acceptance <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.hasLetterOfAcceptance}
              onChange={(e) => handleChange('hasLetterOfAcceptance', e.target.checked)}
              className="w-5 h-5 text-ircc-blue focus:ring-ircc-blue border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              I have received a Letter of Acceptance from this institution
            </span>
          </label>
        </div>
        {errors.hasLetterOfAcceptance && (
          <p className="mt-1 text-sm text-red-600">{errors.hasLetterOfAcceptance}</p>
        )}
      </div>

      {/* Warning if no LOA */}
      {!data.hasLetterOfAcceptance && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-900 mb-1">Letter of Acceptance Required</h4>
              <p className="text-sm text-red-700">
                You must have a valid Letter of Acceptance from a Designated Learning Institution (DLI) before you can apply for a study permit. Please obtain this document before proceeding with your application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">About DLI (Designated Learning Institutions)</h4>
            <p className="text-sm text-blue-700 mb-2">
              Only schools approved by a provincial or territorial government can accept international students. Your Letter of Acceptance must include your DLI number.
            </p>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>All DLI numbers start with the letter "O"</li>
              <li>You can verify your institution on the IRCC website</li>
              <li>The DLI number appears on your Letter of Acceptance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
