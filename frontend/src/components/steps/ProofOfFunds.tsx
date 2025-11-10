/**
 * Proof of Funds Step Component
 * Collects financial information and funding sources
 */

import { useEffect } from 'react';
import { ProofOfFunds as ProofOfFundsType, FUNDING_SOURCES } from '../../types/form.types';
import { validateProofOfFundsSection } from '../../utils/validation';

interface ProofOfFundsProps {
  data: ProofOfFundsType;
  updateData: (data: ProofOfFundsType) => void;
  errors: Record<string, string>;
  updateErrors: (errors: Record<string, string>) => void;
}

export default function ProofOfFunds({ data, updateData, errors, updateErrors }: ProofOfFundsProps) {
  // Validate on data change
  useEffect(() => {
    const validationErrors = validateProofOfFundsSection(data);
    updateErrors(validationErrors);
  }, [data]);

  const handleChange = (field: keyof ProofOfFundsType, value: string | boolean) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  // Calculate minimum funds required
  const tuition = parseFloat(data.annualTuitionFees) || 0;
  const minimumRequired = tuition + 10000;
  const available = parseFloat(data.availableFunds) || 0;
  const isSufficient = available >= minimumRequired;

  return (
    <div className="space-y-6">
      {/* Annual Tuition Fees */}
      <div>
        <label htmlFor="annualTuitionFees" className="block text-sm font-medium text-gray-700 mb-2">
          Annual Tuition Fees (CAD $) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            id="annualTuitionFees"
            type="number"
            min="1000"
            max="100000"
            step="100"
            value={data.annualTuitionFees}
            onChange={(e) => handleChange('annualTuitionFees', e.target.value)}
            className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
              errors.annualTuitionFees ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="25000"
          />
        </div>
        {errors.annualTuitionFees && (
          <p className="mt-1 text-sm text-red-600">{errors.annualTuitionFees}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          First year tuition fees as stated in your Letter of Acceptance
        </p>
      </div>

      {/* Available Funds */}
      <div>
        <label htmlFor="availableFunds" className="block text-sm font-medium text-gray-700 mb-2">
          Available Funds (CAD $) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            id="availableFunds"
            type="number"
            min="0"
            step="100"
            value={data.availableFunds}
            onChange={(e) => handleChange('availableFunds', e.target.value)}
            className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
              errors.availableFunds ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="35000"
          />
        </div>
        {errors.availableFunds && (
          <p className="mt-1 text-sm text-red-600">{errors.availableFunds}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Total funds available to cover tuition and living expenses
        </p>
      </div>

      {/* Financial Summary */}
      {data.annualTuitionFees && (
        <div className={`p-4 rounded-lg border ${isSufficient ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <h4 className="text-sm font-medium mb-2">Financial Requirements Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Annual Tuition:</span>
              <span className="font-medium">CAD ${tuition.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Living Expenses (minimum):</span>
              <span className="font-medium">CAD $10,000</span>
            </div>
            <div className="flex justify-between border-t pt-1 mt-1">
              <span className="font-medium">Minimum Required:</span>
              <span className="font-bold">CAD ${minimumRequired.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Your Available Funds:</span>
              <span className={`font-bold ${isSufficient ? 'text-green-600' : 'text-yellow-600'}`}>
                CAD ${available.toLocaleString()}
              </span>
            </div>
            {isSufficient ? (
              <p className="text-green-700 text-xs mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                You meet the minimum financial requirements
              </p>
            ) : (
              <p className="text-yellow-700 text-xs mt-2">
                Note: You may need additional funds to meet IRCC requirements
              </p>
            )}
          </div>
        </div>
      )}

      {/* Funding Source */}
      <div>
        <label htmlFor="fundingSource" className="block text-sm font-medium text-gray-700 mb-2">
          Primary Funding Source <span className="text-red-500">*</span>
        </label>
        <select
          id="fundingSource"
          value={data.fundingSource}
          onChange={(e) => handleChange('fundingSource', e.target.value as any)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
            errors.fundingSource ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select funding source</option>
          {FUNDING_SOURCES.map((source) => (
            <option key={source.value} value={source.value}>
              {source.label}
            </option>
          ))}
        </select>
        {errors.fundingSource && (
          <p className="mt-1 text-sm text-red-600">{errors.fundingSource}</p>
        )}
      </div>

      {/* Has Sponsor Checkbox */}
      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={data.hasSponsor}
            onChange={(e) => handleChange('hasSponsor', e.target.checked)}
            className="w-5 h-5 text-ircc-blue focus:ring-ircc-blue border-gray-300 rounded mt-0.5"
          />
          <span className="ml-3">
            <span className="block text-sm font-medium text-gray-700">
              I have a sponsor
            </span>
            <span className="block text-xs text-gray-500 mt-1">
              Check this if someone will financially support your studies
            </span>
          </span>
        </label>
      </div>

      {/* Sponsor Relationship (conditional) */}
      {data.hasSponsor && (
        <div>
          <label htmlFor="sponsorRelationship" className="block text-sm font-medium text-gray-700 mb-2">
            Relationship to Sponsor <span className="text-red-500">*</span>
          </label>
          <input
            id="sponsorRelationship"
            type="text"
            value={data.sponsorRelationship}
            onChange={(e) => handleChange('sponsorRelationship', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ircc-blue focus:border-transparent ${
              errors.sponsorRelationship ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Father, Mother, Uncle, Aunt, etc."
          />
          {errors.sponsorRelationship && (
            <p className="mt-1 text-sm text-red-600">{errors.sponsorRelationship}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Your relationship to the person sponsoring your studies
          </p>
        </div>
      )}

      {/* Info Box - Financial Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">IRCC Financial Requirements</h4>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Tuition fees for your first year of study</li>
              <li>CAD $10,000 for living expenses (single person)</li>
              <li>CAD $4,000 additional for each accompanying family member</li>
              <li>Round-trip travel costs (if applicable)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Info Box - Proof Documents */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
            <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-purple-900 mb-1">Documents You'll Need</h4>
            <p className="text-sm text-purple-700 mb-2">
              Depending on your funding source, you'll need to provide:
            </p>
            <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
              <li>Bank statements (past 4-6 months)</li>
              <li>Proof of scholarship (if applicable)</li>
              <li>Loan approval letter (if applicable)</li>
              <li>Sponsor's financial documents and affidavit (if applicable)</li>
              <li>Proof of paid tuition fees (if already paid)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
