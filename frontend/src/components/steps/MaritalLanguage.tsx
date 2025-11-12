/**
 * Marital Status and Language Information Step Component
 * Collects marital status and language proficiency details
 */

import { MaritalInfo, LanguageInfo, MARITAL_STATUS_OPTIONS, LANGUAGE_OPTIONS } from '../../types/form.types';

interface MaritalLanguageProps {
  maritalData: MaritalInfo;
  languageData: LanguageInfo;
  updateMaritalData: (data: MaritalInfo) => void;
  updateLanguageData: (data: LanguageInfo) => void;
  errors: Record<string, string>;
  updateErrors: (errors: Record<string, string>) => void;
}

export default function MaritalLanguage({
  maritalData,
  languageData,
  updateMaritalData,
  updateLanguageData,
  errors,
  updateErrors
}: MaritalLanguageProps) {

  const handleMaritalChange = (field: keyof MaritalInfo | string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateMaritalData({
        ...maritalData,
        [parent]: {
          ...(maritalData[parent as keyof MaritalInfo] as any),
          [child]: value
        }
      });
    } else {
      updateMaritalData({
        ...maritalData,
        [field]: value
      });
    }
  };

  const handleLanguageChange = (field: keyof LanguageInfo, value: any) => {
    updateLanguageData({
      ...languageData,
      [field]: value
    });
  };

  const showSpouseFields = maritalData.status === 'Married' || maritalData.status === 'Common-law';

  return (
    <div className="space-y-8">
      {/* MARITAL STATUS SECTION */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marital Status</h3>

        {/* Marital Status */}
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Current Marital Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={maritalData.status}
            onChange={(e) => handleMaritalChange('status', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your marital status</option>
            {MARITAL_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        {/* Spouse Information (conditional) */}
        {showSpouseFields && (
          <div className="border-t pt-6 space-y-4">
            <h4 className="text-md font-medium text-gray-900">Spouse / Common-law Partner Information</h4>

            {/* Date of Marriage */}
            <div>
              <label htmlFor="dateOfMarriage" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Marriage / Start of Common-law Relationship
              </label>
              <input
                id="dateOfMarriage"
                type="date"
                value={maritalData.dateOfMarriage || ''}
                onChange={(e) => handleMaritalChange('dateOfMarriage', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
              />
            </div>

            {/* Spouse Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="spouse.familyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Spouse's Family Name
                </label>
                <input
                  id="spouse.familyName"
                  type="text"
                  value={maritalData.spouse?.familyName || ''}
                  onChange={(e) => handleMaritalChange('spouse.familyName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
                  placeholder="Family name"
                />
              </div>
              <div>
                <label htmlFor="spouse.givenNames" className="block text-sm font-medium text-gray-700 mb-2">
                  Spouse's Given Name(s)
                </label>
                <input
                  id="spouse.givenNames"
                  type="text"
                  value={maritalData.spouse?.givenNames || ''}
                  onChange={(e) => handleMaritalChange('spouse.givenNames', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
                  placeholder="Given name(s)"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LANGUAGE INFORMATION SECTION */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Information</h3>

        {/* Native Language */}
        <div className="mb-6">
          <label htmlFor="nativeLanguage" className="block text-sm font-medium text-gray-700 mb-2">
            Native Language / Mother Tongue <span className="text-red-500">*</span>
          </label>
          <input
            id="nativeLanguage"
            type="text"
            value={languageData.nativeLanguage}
            onChange={(e) => handleLanguageChange('nativeLanguage', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
              errors.nativeLanguage ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Hindi, Mandarin, Spanish"
          />
          {errors.nativeLanguage && (
            <p className="mt-1 text-sm text-red-600">{errors.nativeLanguage}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            The first language you learned and still understand
          </p>
        </div>

        {/* English/French Communication */}
        <div className="mb-6">
          <label htmlFor="communicateInEnglishFrench" className="block text-sm font-medium text-gray-700 mb-2">
            Can you communicate in English or French? <span className="text-red-500">*</span>
          </label>
          <select
            id="communicateInEnglishFrench"
            value={languageData.communicateInEnglishFrench}
            onChange={(e) => handleLanguageChange('communicateInEnglishFrench', e.target.value as any)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
              errors.communicateInEnglishFrench ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your language ability</option>
            {LANGUAGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.communicateInEnglishFrench && (
            <p className="mt-1 text-sm text-red-600">{errors.communicateInEnglishFrench}</p>
          )}
        </div>

        {/* Language Most At Ease (Optional) */}
        <div className="mb-6">
          <label htmlFor="mostAtEase" className="block text-sm font-medium text-gray-700 mb-2">
            In which language are you most at ease? (Optional)
          </label>
          <input
            id="mostAtEase"
            type="text"
            value={languageData.mostAtEase || ''}
            onChange={(e) => handleLanguageChange('mostAtEase', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
            placeholder="e.g., English, French, or your native language"
          />
        </div>

        {/* Language Test */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={languageData.languageTest || false}
              onChange={(e) => handleLanguageChange('languageTest', e.target.checked)}
              className="h-4 w-4 text-ircc-blue focus:ring-ircc-blue border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              I have taken a language proficiency test (IELTS, CELPIP, TEF, etc.)
            </span>
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Language Requirements</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                For study permit applications, language proficiency in English or French is typically demonstrated through:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Acceptance letter from a Canadian institution (which implies language proficiency)</li>
                <li>Language test results (IELTS, TOEFL, CELPIP for English; TEF, TCF for French)</li>
                <li>Previous education completed in English or French</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
