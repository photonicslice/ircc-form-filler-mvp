/**
 * API Service
 * Handles all backend API communication
 */

import { FormData, ValidationResponse, ChecklistResponse, TipResponse } from '../types/form.types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * API request wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Handle non-JSON responses (like PDF downloads)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf')) {
      const blob = await response.blob();
      return blob as any;
    }

    // Parse JSON response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// ============================================================================
// PDF ENDPOINTS
// ============================================================================

/**
 * Generate PDF from form data
 * @param formData - Complete form data
 * @returns PDF blob
 */
export async function generatePDF(formData: FormData): Promise<Blob> {
  try {
    const blob = await apiRequest<Blob>('/api/pdf/generate', {
      method: 'POST',
      body: JSON.stringify({ formData })
    });

    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Validate form data
 * @param formData - Complete form data
 * @returns Validation results
 */
export async function validateForm(formData: FormData): Promise<ValidationResponse> {
  try {
    const response = await apiRequest<ValidationResponse>('/api/pdf/validate', {
      method: 'POST',
      body: JSON.stringify({ formData })
    });

    return response;
  } catch (error) {
    console.error('Error validating form:', error);
    throw new Error('Failed to validate form. Please try again.');
  }
}

/**
 * Generate document checklist
 * @param formData - Complete form data
 * @returns Document checklist
 */
export async function generateChecklist(formData: FormData): Promise<ChecklistResponse> {
  try {
    const response = await apiRequest<ChecklistResponse>('/api/pdf/checklist', {
      method: 'POST',
      body: JSON.stringify({ formData })
    });

    return response;
  } catch (error) {
    console.error('Error generating checklist:', error);
    throw new Error('Failed to generate checklist. Please try again.');
  }
}

// ============================================================================
// AI TIPS ENDPOINTS
// ============================================================================

/**
 * Get AI-powered tips for a specific field
 * @param fieldName - Name of the field
 * @param context - Additional context (form data, etc.)
 * @returns AI tip
 */
export async function getFieldTip(fieldName: string, context?: any): Promise<TipResponse> {
  try {
    const response = await apiRequest<TipResponse>('/api/tips/get-tips', {
      method: 'POST',
      body: JSON.stringify({ fieldName, context })
    });

    return response;
  } catch (error) {
    console.error('Error fetching tip:', error);
    // Return fallback tip instead of throwing
    return {
      success: false,
      tip: 'AI tips are temporarily unavailable. Please refer to IRCC official guidelines.',
      fieldName
    };
  }
}

/**
 * Get tips for multiple fields at once
 * @param fieldNames - Array of field names
 * @param context - Additional context
 * @returns Array of tips
 */
export async function getMultipleTips(
  fieldNames: string[],
  context?: any
): Promise<TipResponse[]> {
  try {
    const promises = fieldNames.map(fieldName => getFieldTip(fieldName, context));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching multiple tips:', error);
    return fieldNames.map(fieldName => ({
      success: false,
      tip: 'Tips unavailable',
      fieldName
    }));
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check if backend API is available
 * @returns boolean indicating API availability
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

// ============================================================================
// MOCK DATA ENDPOINTS (for testing)
// ============================================================================

/**
 * Load mock data for testing
 * @param scenario - Mock scenario name
 * @returns Mock form data
 */
export async function loadMockData(scenario: string = 'default'): Promise<FormData> {
  try {
    const response = await apiRequest<{ mockData: FormData }>('/api/mock/get', {
      method: 'POST',
      body: JSON.stringify({ scenario })
    });

    return response.mockData;
  } catch (error) {
    console.error('Error loading mock data:', error);
    // Return hardcoded mock data as fallback
    return getMockDataFallback(scenario);
  }
}

/**
 * Fallback mock data (in case backend is unavailable)
 */
function getMockDataFallback(scenario: string): FormData {
  const mockData: FormData = {
    personalInfo: {
      firstName: 'Priya',
      lastName: 'Sharma',
      dateOfBirth: '1998-03-15',
      nationality: 'India',
      countryOfResidence: 'India',
      email: 'priya.sharma@example.com',
      phone: '+91-98765-43210'
    },
    passportInfo: {
      passportNumber: 'K1234567',
      issueDate: '2020-01-15',
      expiryDate: '2030-01-14',
      issuingCountry: 'India'
    },
    educationHistory: {
      highestEducation: 'bachelors',
      institutionName: 'Delhi University',
      fieldOfStudy: 'Computer Science',
      graduationYear: '2020'
    },
    studyPurpose: {
      canadianInstitution: 'University of Toronto',
      dli: 'O019430508',
      programName: 'Master of Computer Science',
      programLevel: 'masters',
      programStartDate: '2026-09-01',
      programDuration: '24',
      hasLetterOfAcceptance: true
    },
    proofOfFunds: {
      annualTuitionFees: '45000',
      availableFunds: '60000',
      fundingSource: 'family_support',
      hasSponsor: true,
      sponsorRelationship: 'Father'
    }
  };

  return mockData;
}

// ============================================================================
// DOWNLOAD HELPERS
// ============================================================================

/**
 * Download PDF blob as file
 * @param blob - PDF blob
 * @param filename - Desired filename
 */
export function downloadPDF(blob: Blob, filename: string = 'study-permit-application.pdf'): void {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
}

/**
 * Open PDF in new tab
 * @param blob - PDF blob
 */
export function openPDFInNewTab(blob: Blob): void {
  try {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Note: URL will be revoked after some time, but that's okay for preview
  } catch (error) {
    console.error('Error opening PDF:', error);
    throw new Error('Failed to open PDF');
  }
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors?: Record<string, any>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

/**
 * Configure API client
 */
export const apiClient = {
  // PDF operations
  generatePDF,
  validateForm,
  generateChecklist,

  // AI tips
  getFieldTip,
  getMultipleTips,

  // Utilities
  checkAPIHealth,
  loadMockData,
  downloadPDF,
  openPDFInNewTab
};

export default apiClient;
