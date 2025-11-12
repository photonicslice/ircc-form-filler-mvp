/**
 * Personal Information Step Component
 * Collects basic personal details of the applicant
 * Updated to match backend field structure
 */

import { useEffect } from 'react';
import { PersonalInfo as PersonalInfoType, COMMON_COUNTRIES, SEX_OPTIONS } from '../../types/form.types';
import { validatePersonalInfoSection } from '../../utils/validation';

interface PersonalInfoProps {
  data: PersonalInfoType;
  updateData: (data: PersonalInfoType) => void;
  errors: Record<string, string>;
  updateErrors: (errors: Record<string, string>) => void;
}

export default function PersonalInfo({ data, updateData, errors, updateErrors }: PersonalInfoProps) {
  // Validate on data change
  useEffect(() => {
    const validationErrors = validatePersonalInfoSection(data);
    updateErrors(validationErrors);
  }, [data]);

  const handleChange = (field: keyof PersonalInfoType | string, value: any) => {
    if (field.includes('.')) {
      // Handle nested fields like placeOfBirth.city
      const [parent, child] = field.split('.');
      updateData({
        ...data,
        [parent]: {
          ...(data[parent as keyof PersonalInfoType] as any),
          [child]: value
        }
      });
    } else {
      updateData({
        ...data,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Family Name (Last Name) */}
      <div>
        <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-2">
          Family Name / Surname <span className="text-red-500">*</span>
        </label>
        <input
          id="familyName"
          type="text"
          value={data.familyName}
          onChange={(e) => handleChange('familyName', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.familyName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your family name / surname"
        />
        {errors.familyName && (
          <p className="mt-1 text-sm text-red-600">{errors.familyName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          As shown on your passport or travel document
        </p>
      </div>

      {/* Given Names (First Name) */}
      <div>
        <label htmlFor="givenNames" className="block text-sm font-medium text-gray-700 mb-2">
          Given Name(s) <span className="text-red-500">*</span>
        </label>
        <input
          id="givenNames"
          type="text"
          value={data.givenNames}
          onChange={(e) => handleChange('givenNames', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.givenNames ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your given name(s)"
        />
        {errors.givenNames && (
          <p className="mt-1 text-sm text-red-600">{errors.givenNames}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          As shown on your passport or travel document
        </p>
      </div>

      {/* Sex */}
      <div>
        <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
          Sex <span className="text-red-500">*</span>
        </label>
        <select
          id="sex"
          value={data.sex}
          onChange={(e) => handleChange('sex', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.sex ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your sex</option>
          {SEX_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {errors.sex && (
          <p className="mt-1 text-sm text-red-600">{errors.sex}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          id="dateOfBirth"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          You must be at least 16 years old to apply
        </p>
      </div>

      {/* Citizenship */}
      <div>
        <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700 mb-2">
          Country of Citizenship <span className="text-red-500">*</span>
        </label>
        <select
          id="citizenship"
          value={data.citizenship}
          onChange={(e) => handleChange('citizenship', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.citizenship ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your country of citizenship</option>
          {COMMON_COUNTRIES.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.citizenship && (
          <p className="mt-1 text-sm text-red-600">{errors.citizenship}</p>
        )}
      </div>

      {/* Country of Residence */}
      <div>
        <label htmlFor="countryOfResidence" className="block text-sm font-medium text-gray-700 mb-2">
          Current Country of Residence <span className="text-red-500">*</span>
        </label>
        <select
          id="countryOfResidence"
          value={data.countryOfResidence}
          onChange={(e) => handleChange('countryOfResidence', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.countryOfResidence ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your country of residence</option>
          {COMMON_COUNTRIES.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.countryOfResidence && (
          <p className="mt-1 text-sm text-red-600">{errors.countryOfResidence}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          The country where you currently reside
        </p>
      </div>

      {/* Place of Birth (Optional) */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Place of Birth (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="placeOfBirth.city" className="block text-sm font-medium text-gray-700 mb-2">
              City/Town
            </label>
            <input
              id="placeOfBirth.city"
              type="text"
              value={data.placeOfBirth?.city || ''}
              onChange={(e) => handleChange('placeOfBirth.city', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
              placeholder="City or town of birth"
            />
          </div>
          <div>
            <label htmlFor="placeOfBirth.country" className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              id="placeOfBirth.country"
              value={data.placeOfBirth?.country || ''}
              onChange={(e) => handleChange('placeOfBirth.country', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
            >
              <option value="">Select country</option>
              {COMMON_COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Important</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Ensure all information matches your passport or travel document exactly.
                Any discrepancies may delay your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
