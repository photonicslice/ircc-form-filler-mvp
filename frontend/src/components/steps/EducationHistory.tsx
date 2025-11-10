/**
 * Education History Step Component
 * Collects educational background information
 */

import { useEffect } from 'react';
import { EducationHistory as EducationHistoryType, EDUCATION_LEVELS } from '../../types/form.types';
import { validateEducationHistorySection } from '../../utils/validation';

interface EducationHistoryProps {
  data: EducationHistoryType;
  updateData: (data: EducationHistoryType) => void;
  errors: Record<string, string>;
  updateErrors: (errors: Record<string, string>) => void;
}

export default function EducationHistory({ data, updateData, errors, updateErrors }: EducationHistoryProps) {
  // Validate on data change
  useEffect(() => {
    const validationErrors = validateEducationHistorySection(data);
    updateErrors(validationErrors);
  }, [data]);

  const handleChange = (field: keyof EducationHistoryType, value: string) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 + 10 }, (_, i) => 1950 + i).reverse();

  return (
    <div className="space-y-6">
      {/* Highest Education Level */}
      <div>
        <label htmlFor="highestEducation" className="block text-sm font-medium text-gray-700 mb-2">
          Highest Level of Education <span className="text-red-500">*</span>
        </label>
        <select
          id="highestEducation"
          value={data.highestEducation}
          onChange={(e) => handleChange('highestEducation', e.target.value as any)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.highestEducation ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your highest education level</option>
          {EDUCATION_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        {errors.highestEducation && (
          <p className="mt-1 text-sm text-red-600">{errors.highestEducation}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Select the highest level of education you have completed
        </p>
      </div>

      {/* Institution Name */}
      <div>
        <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
          Institution Name <span className="text-red-500">*</span>
        </label>
        <input
          id="institutionName"
          type="text"
          value={data.institutionName}
          onChange={(e) => handleChange('institutionName', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.institutionName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="University of Example"
        />
        {errors.institutionName && (
          <p className="mt-1 text-sm text-red-600">{errors.institutionName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Name of the institution where you completed your highest education
        </p>
      </div>

      {/* Field of Study */}
      <div>
        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
          Field of Study <span className="text-red-500">*</span>
        </label>
        <input
          id="fieldOfStudy"
          type="text"
          value={data.fieldOfStudy}
          onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Computer Science, Business Administration, etc."
        />
        {errors.fieldOfStudy && (
          <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Your major or area of specialization
        </p>
      </div>

      {/* Graduation Year */}
      <div>
        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
          Graduation Year <span className="text-red-500">*</span>
        </label>
        <select
          id="graduationYear"
          value={data.graduationYear}
          onChange={(e) => handleChange('graduationYear', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.graduationYear ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select graduation year</option>
          {years.map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
        {errors.graduationYear && (
          <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Year you graduated or expect to graduate (for current students)
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Education Documents Required</h4>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Official transcripts from all institutions attended</li>
              <li>Degree certificate (if applicable)</li>
              <li>Diplomas or certificates</li>
              <li>Documents must be translated to English or French if in another language</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tip Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-green-900 mb-1">Pro Tip</h4>
            <p className="text-sm text-green-700">
              Having a strong academic background in a field related to your Canadian program strengthens your application and demonstrates your preparedness for the proposed studies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
