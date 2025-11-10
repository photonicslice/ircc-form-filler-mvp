/**
 * TypeScript Type Definitions for IRCC Study Permit Form
 * Defines all form data structures and validation types
 */

// ============================================================================
// FORM SECTIONS
// ============================================================================

/**
 * Personal Information Section
 */
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  email: string;
  phone: string;
}

/**
 * Passport Information Section
 */
export interface PassportInfo {
  passportNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingCountry: string;
}

/**
 * Education History Section
 */
export interface EducationHistory {
  highestEducation: 'high_school' | 'diploma' | 'bachelors' | 'masters' | 'phd' | '';
  institutionName: string;
  fieldOfStudy: string;
  graduationYear: string;
}

/**
 * Study Purpose Section
 */
export interface StudyPurpose {
  canadianInstitution: string;
  dli: string;
  programName: string;
  programLevel: 'certificate' | 'diploma' | 'bachelors' | 'masters' | 'phd' | 'postgraduate' | '';
  programStartDate: string;
  programDuration: string;
  hasLetterOfAcceptance: boolean;
}

/**
 * Proof of Funds Section
 */
export interface ProofOfFunds {
  annualTuitionFees: string;
  availableFunds: string;
  fundingSource: 'personal_savings' | 'family_support' | 'scholarship' | 'loan' | 'sponsor' | 'other' | '';
  hasSponsor: boolean;
  sponsorRelationship: string;
}

/**
 * Complete Form Data Structure
 */
export interface FormData {
  personalInfo: PersonalInfo;
  passportInfo: PassportInfo;
  educationHistory: EducationHistory;
  studyPurpose: StudyPurpose;
  proofOfFunds: ProofOfFunds;
}

// ============================================================================
// FORM NAVIGATION
// ============================================================================

/**
 * Form Step Definition
 */
export interface FormStep {
  id: string;
  step: number;
  title: string;
  description: string;
  section: keyof FormData;
}

/**
 * Form Steps Configuration
 */
export const FORM_STEPS: FormStep[] = [
  {
    id: 'personal-info',
    step: 1,
    title: 'Personal Information',
    description: 'Enter your basic personal details',
    section: 'personalInfo'
  },
  {
    id: 'passport-info',
    step: 2,
    title: 'Passport Information',
    description: 'Provide your passport details',
    section: 'passportInfo'
  },
  {
    id: 'education-history',
    step: 3,
    title: 'Education History',
    description: 'Tell us about your educational background',
    section: 'educationHistory'
  },
  {
    id: 'study-purpose',
    step: 4,
    title: 'Study Purpose',
    description: 'Details about your Canadian study plans',
    section: 'studyPurpose'
  },
  {
    id: 'proof-of-funds',
    step: 5,
    title: 'Proof of Funds',
    description: 'Financial information and funding sources',
    section: 'proofOfFunds'
  },
  {
    id: 'review-submit',
    step: 6,
    title: 'Review & Submit',
    description: 'Review your information and generate documents',
    section: 'personalInfo' // Placeholder, this step reviews all sections
  }
];

// ============================================================================
// INITIAL STATE
// ============================================================================

/**
 * Initial Empty Form Data
 */
export const INITIAL_FORM_DATA: FormData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    countryOfResidence: '',
    email: '',
    phone: ''
  },
  passportInfo: {
    passportNumber: '',
    issueDate: '',
    expiryDate: '',
    issuingCountry: ''
  },
  educationHistory: {
    highestEducation: '',
    institutionName: '',
    fieldOfStudy: '',
    graduationYear: ''
  },
  studyPurpose: {
    canadianInstitution: '',
    dli: '',
    programName: '',
    programLevel: '',
    programStartDate: '',
    programDuration: '',
    hasLetterOfAcceptance: false
  },
  proofOfFunds: {
    annualTuitionFees: '',
    availableFunds: '',
    fundingSource: '',
    hasSponsor: false,
    sponsorRelationship: ''
  }
};

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation Result
 */
export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Section Validation Result
 */
export interface SectionValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Complete Form Validation Result
 */
export interface CompleteFormValidation {
  isValid: boolean;
  errors: Record<string, Record<string, string>>;
  summary: {
    totalFields: number;
    validFields: number;
    invalidFields: number;
    sections: Record<string, {
      isValid: boolean;
      fieldCount: number;
      errorCount: number;
    }>;
  };
}

// ============================================================================
// API TYPES
// ============================================================================

/**
 * API Response for Validation
 */
export interface ValidationResponse {
  success: boolean;
  validation: CompleteFormValidation;
}

/**
 * Document Checklist Item
 */
export interface ChecklistDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  required: boolean;
  tips: string[];
}

/**
 * Checklist Response
 */
export interface ChecklistResponse {
  success: boolean;
  checklist: ChecklistDocument[];
  summary: {
    totalDocuments: number;
    requiredDocuments: number;
    optionalDocuments: number;
    categories: number;
    categoryBreakdown: Record<string, {
      required: number;
      optional: number;
      total: number;
    }>;
  };
}

/**
 * AI Tip Response
 */
export interface TipResponse {
  success: boolean;
  tip: string;
  fieldName: string;
}

// ============================================================================
// DROPDOWN OPTIONS
// ============================================================================

/**
 * Education Level Options
 */
export const EDUCATION_LEVELS = [
  { value: 'high_school', label: 'High School Diploma' },
  { value: 'diploma', label: 'College Diploma' },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' }
];

/**
 * Program Level Options
 */
export const PROGRAM_LEVELS = [
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' },
  { value: 'postgraduate', label: 'Post-Graduate Certificate' }
];

/**
 * Funding Source Options
 */
export const FUNDING_SOURCES = [
  { value: 'personal_savings', label: 'Personal Savings' },
  { value: 'family_support', label: 'Family Support' },
  { value: 'scholarship', label: 'Scholarship / Grant' },
  { value: 'loan', label: 'Education Loan' },
  { value: 'sponsor', label: 'Sponsor' },
  { value: 'other', label: 'Other' }
];

/**
 * Common Countries (for autocomplete)
 */
export const COMMON_COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia',
  'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Bulgaria',
  'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica',
  'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'Finland',
  'France', 'Germany', 'Ghana', 'Greece', 'Hong Kong',
  'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
  'Jordan', 'Kenya', 'South Korea', 'Kuwait', 'Lebanon',
  'Malaysia', 'Mexico', 'Morocco', 'Nepal', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia',
  'Saudi Arabia', 'Singapore', 'South Africa', 'Spain', 'Sri Lanka',
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Thailand',
  'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Venezuela', 'Vietnam', 'Yemen'
];
