/**
 * Passport Information Step Component
 * Collects passport details
 */

import { useEffect } from 'react';
import { PassportInfo as PassportInfoType, COMMON_COUNTRIES } from '../../types/form.types';
import { validatePassportInfoSection } from '../../utils/validation';

interface PassportInfoProps {
  data: PassportInfoType;
  updateData: (data: PassportInfoType) => void;
  errors: Record<string, string>;
  updateErrors: (errors: Record<string, string>) => void;
}

export default function PassportInfo({ data, updateData, errors, updateErrors }: PassportInfoProps) {
  // Validate on data change
  useEffect(() => {
    const validationErrors = validatePassportInfoSection(data);
    updateErrors(validationErrors);
  }, [data]);

  const handleChange = (field: keyof PassportInfoType, value: string) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  // Calculate minimum expiry date (6 months from today)
  const minExpiryDate = new Date();
  minExpiryDate.setMonth(minExpiryDate.getMonth() + 6);
  const minExpiryDateString = minExpiryDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Passport Number */}
      <div>
        <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Passport Number <span className="text-red-500">*</span>
        </label>
        <input
          id="passportNumber"
          type="text"
          value={data.passportNumber}
          onChange={(e) => handleChange('passportNumber', e.target.value.toUpperCase())}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.passportNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="A12345678"
          maxLength={15}
          style={{ textTransform: 'uppercase' }}
        />
        {errors.passportNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.passportNumber}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter in uppercase letters and numbers only (6-15 characters)
        </p>
      </div>

      {/* Issuing Country */}
      <div>
        <label htmlFor="issuingCountry" className="block text-sm font-medium text-gray-700 mb-2">
          Issuing Country <span className="text-red-500">*</span>
        </label>
        <select
          id="issuingCountry"
          value={data.issuingCountry}
          onChange={(e) => handleChange('issuingCountry', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.issuingCountry ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select issuing country</option>
          {COMMON_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.issuingCountry && (
          <p className="mt-1 text-sm text-red-600">{errors.issuingCountry}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Country that issued your passport
        </p>
      </div>

      {/* Issue Date */}
      <div>
        <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
          Issue Date <span className="text-red-500">*</span>
        </label>
        <input
          id="issueDate"
          type="date"
          value={data.issueDate}
          onChange={(e) => handleChange('issueDate', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.issueDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.issueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.issueDate}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Date when your passport was issued
        </p>
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
          Expiry Date <span className="text-red-500">*</span>
        </label>
        <input
          id="expiryDate"
          type="date"
          value={data.expiryDate}
          onChange={(e) => handleChange('expiryDate', e.target.value)}
          min={minExpiryDateString}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.expiryDate && (
          <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Your passport must be valid for at least 6 months from today
        </p>
      </div>

      {/* Passport Validity Warning */}
      {data.expiryDate && new Date(data.expiryDate) < new Date(minExpiryDateString) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-900 mb-1">Passport Validity Warning</h4>
              <p className="text-sm text-yellow-700">
                Your passport expiry date is less than 6 months from today. IRCC requires passports to be valid for the duration of your intended stay. You may need to renew your passport before applying.
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
            <h4 className="text-sm font-medium text-blue-900 mb-1">Passport Requirements</h4>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Your passport must be valid for the duration of your stay in Canada</li>
              <li>IRCC recommends at least 6 months of validity remaining</li>
              <li>If your passport expires soon, consider renewing it before applying</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
