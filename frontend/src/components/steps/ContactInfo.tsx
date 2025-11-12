/**
 * Contact Information Step Component
 * Collects email, phone, and optional mailing address
 */

import { ContactInfo as ContactInfoType, COMMON_COUNTRIES } from '../../types/form.types';

interface ContactInfoProps {
  data: ContactInfoType;
  updateData: (data: ContactInfoType) => void;
  errors: Record<string, string>;
  updateErrors: (errors: Record<string, string>) => void;
}

export default function ContactInfo({ data, updateData, errors, updateErrors }: ContactInfoProps) {

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const parts = field.split('.');
      const [parent, ...rest] = parts;

      if (rest.length === 1) {
        // Simple nested: telephone.number
        updateData({
          ...data,
          [parent]: {
            ...(data[parent as keyof ContactInfoType] as any),
            [rest[0]]: value
          }
        });
      } else if (rest.length === 2) {
        // Double nested: mailingAddress.city
        const [middle, child] = rest;
        updateData({
          ...data,
          [parent]: {
            ...(data[parent as keyof ContactInfoType] as any),
            [middle]: {
              ...((data[parent as keyof ContactInfoType] as any)?.[middle] || {}),
              [child]: value
            }
          }
        });
      }
    } else {
      updateData({
        ...data,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-6">
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
          IRCC will use this email to communicate about your application
        </p>
      </div>

      {/* Telephone */}
      <div className="border-t pt-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Primary Telephone Number</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phone Type */}
          <div>
            <label htmlFor="telephone.type" className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              id="telephone.type"
              value={data.telephone?.type || ''}
              onChange={(e) => handleChange('telephone.type', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="Home">Home</option>
              <option value="Cell">Cell</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Country Code */}
          <div>
            <label htmlFor="telephone.countryCode" className="block text-sm font-medium text-gray-700 mb-2">
              Country Code
            </label>
            <input
              id="telephone.countryCode"
              type="text"
              value={data.telephone?.countryCode || ''}
              onChange={(e) => handleChange('telephone.countryCode', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
              placeholder="+1"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="telephone.number" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="telephone.number"
              type="tel"
              value={data.telephone?.number || ''}
              onChange={(e) => handleChange('telephone.number', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
                errors['telephone.number'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123-456-7890"
            />
            {errors['telephone.number'] && (
              <p className="mt-1 text-sm text-red-600">{errors['telephone.number']}</p>
            )}
          </div>
        </div>

        {/* Extension */}
        <div className="mt-4 max-w-xs">
          <label htmlFor="telephone.ext" className="block text-sm font-medium text-gray-700 mb-2">
            Extension (Optional)
          </label>
          <input
            id="telephone.ext"
            type="text"
            value={data.telephone?.ext || ''}
            onChange={(e) => handleChange('telephone.ext', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
            placeholder="Ext."
          />
        </div>
      </div>

      {/* Mailing Address (Optional) */}
      <div className="border-t pt-6">
        <h3 className="text-md font-semibold text-gray-900 mb-2">Mailing Address (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Provide your mailing address if you want to receive physical correspondence
        </p>

        <div className="space-y-4">
          {/* Street Number and Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="mailingAddress.streetNo" className="block text-sm font-medium text-gray-700 mb-2">
                Street No.
              </label>
              <input
                id="mailingAddress.streetNo"
                type="text"
                value={data.mailingAddress?.streetNo || ''}
                onChange={(e) => handleChange('mailingAddress.streetNo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
                placeholder="123"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="mailingAddress.streetName" className="block text-sm font-medium text-gray-700 mb-2">
                Street Name
              </label>
              <input
                id="mailingAddress.streetName"
                type="text"
                value={data.mailingAddress?.streetName || ''}
                onChange={(e) => handleChange('mailingAddress.streetName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
                placeholder="Main Street"
              />
            </div>
          </div>

          {/* Apt/Unit */}
          <div className="max-w-xs">
            <label htmlFor="mailingAddress.aptUnit" className="block text-sm font-medium text-gray-700 mb-2">
              Apt/Unit (Optional)
            </label>
            <input
              id="mailingAddress.aptUnit"
              type="text"
              value={data.mailingAddress?.aptUnit || ''}
              onChange={(e) => handleChange('mailingAddress.aptUnit', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
              placeholder="Apt 5B"
            />
          </div>

          {/* City, Province, Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="mailingAddress.city" className="block text-sm font-medium text-gray-700 mb-2">
                City/Town
              </label>
              <input
                id="mailingAddress.city"
                type="text"
                value={data.mailingAddress?.city || ''}
                onChange={(e) => handleChange('mailingAddress.city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
                placeholder="City"
              />
            </div>
            <div>
              <label htmlFor="mailingAddress.provinceState" className="block text-sm font-medium text-gray-700 mb-2">
                Province/State
              </label>
              <input
                id="mailingAddress.provinceState"
                type="text"
                value={data.mailingAddress?.provinceState || ''}
                onChange={(e) => handleChange('mailingAddress.provinceState', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
                placeholder="Province"
              />
            </div>
            <div>
              <label htmlFor="mailingAddress.country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                id="mailingAddress.country"
                value={data.mailingAddress?.country || ''}
                onChange={(e) => handleChange('mailingAddress.country', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
              >
                <option value="">Select country</option>
                {COMMON_COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Postal Code */}
          <div className="max-w-xs">
            <label htmlFor="mailingAddress.postalCode" className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code / ZIP
            </label>
            <input
              id="mailingAddress.postalCode"
              type="text"
              value={data.mailingAddress?.postalCode || ''}
              onChange={(e) => handleChange('mailingAddress.postalCode', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent"
              placeholder="A1A 1A1"
            />
          </div>
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
            <h3 className="text-sm font-medium text-blue-800">Contact Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Ensure your contact information is accurate and current. IRCC will use this information to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Send updates about your application status</li>
                <li>Request additional documents if needed</li>
                <li>Communicate important decisions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
