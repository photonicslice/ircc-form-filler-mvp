/**
 * Personal Information Step Component
 * Collects basic personal details of the applicant
 */

import { useEffect } from 'react';
import { PersonalInfo as PersonalInfoType, COMMON_COUNTRIES } from '../../types/form.types';
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

  const handleChange = (field: keyof PersonalInfoType, value: string) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          id="firstName"
          type="text"
          value={data.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your first name"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          As shown on your passport
        </p>
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          id="lastName"
          type="text"
          value={data.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your last name"
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          As shown on your passport
        </p>
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

      {/* Nationality */}
      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
          Nationality <span className="text-red-500">*</span>
        </label>
        <select
          id="nationality"
          value={data.nationality}
          onChange={(e) => handleChange('nationality', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.nationality ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your nationality</option>
          {COMMON_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.nationality && (
          <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Country of citizenship as shown on your passport
        </p>
      </div>

      {/* Country of Residence */}
      <div>
        <label htmlFor="countryOfResidence" className="block text-sm font-medium text-gray-700 mb-2">
          Country of Residence <span className="text-red-500">*</span>
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
          {COMMON_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.countryOfResidence && (
          <p className="mt-1 text-sm text-red-600">{errors.countryOfResidence}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Country where you currently live
        </p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          IRCC will use this email for all correspondence
        </p>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+1-234-567-8900"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Include country code (e.g., +1 for Canada, +91 for India)
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Important</h4>
            <p className="text-sm text-blue-700">
              Ensure all information matches your passport exactly. Any discrepancies may delay your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
