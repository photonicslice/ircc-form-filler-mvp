/**
 * TypeScript Type Definitions for IRCC Study Permit Form
 * Defines all form data structures and validation types
 */

// ============================================================================
// FORM SECTIONS
// ============================================================================

/**
 * Personal Information Section
 * Updated to match backend structure (familyName/givenNames)
 */
export interface PersonalInfo {
  familyName: string;          // Family name as shown on passport (was lastName)
  givenNames: string;          // Given name(s) as shown on passport (was firstName)
  sex: 'Male' | 'Female' | 'Another gender' | '';  // Sex/Gender
  dateOfBirth: string;         // Date of birth (YYYY-MM-DD)
  citizenship: string;         // Country of citizenship (was nationality)
  countryOfResidence: string;  // Current country of residence
  placeOfBirth?: {            // Place of birth (optional)
    city?: string;
    country?: string;
  };
  hasOtherNames?: boolean;     // Has other names/aliases
  otherNames?: {               // Other names (if applicable)
    familyName?: string;
    givenNames?: string;
  };
}

/**
 * Passport Information Section
 * Updated to match backend structure
 */
export interface PassportInfo {
  number: string;              // Passport number (was passportNumber)
  countryOfIssue: string;      // Country of issue (was issuingCountry)
  issueDate: string;           // Issue date (YYYY-MM-DD)
  expiryDate: string;          // Expiry date (YYYY-MM-DD)
  taiwanPassport?: boolean;    // Using Taiwan passport with PIN
  israeliPassport?: boolean;   // Using Israeli passport
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
 * Marital Information Section
 */
export interface MaritalInfo {
  status: 'Single' | 'Married' | 'Common-law' | 'Divorced' | 'Separated' | 'Widowed' | 'Annulled' | '';
  dateOfMarriage?: string;     // Date of marriage (if applicable)
  spouse?: {                   // Spouse information (if applicable)
    familyName?: string;
    givenNames?: string;
  };
}

/**
 * Language Information Section
 */
export interface LanguageInfo {
  nativeLanguage: string;                                      // Native language/Mother tongue
  communicateInEnglishFrench: 'English' | 'French' | 'Both' | 'Neither' | '';  // Can communicate in English/French
  mostAtEase?: string;                                         // Language most at ease
  languageTest?: boolean;                                      // Taken language proficiency test
}

/**
 * Contact Information Section
 */
export interface ContactInfo {
  email: string;               // Email address
  telephone: {                 // Primary telephone
    type?: string;             // Type: Home, Cell, Business
    countryCode?: string;      // Country code
    number: string;            // Phone number
    ext?: string;              // Extension
  };
  mailingAddress?: {           // Mailing address (optional)
    streetNo?: string;
    streetName?: string;
    aptUnit?: string;
    city?: string;
    provinceState?: string;
    country?: string;
    postalCode?: string;
  };
}

/**
 * Complete Form Data Structure
 * Updated to include all essential sections
 */
export interface FormData {
  personalInfo: PersonalInfo;
  passportInfo: PassportInfo;
  maritalInfo: MaritalInfo;
  languageInfo: LanguageInfo;
  contactInfo: ContactInfo;
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
 * Updated to include new required sections
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
    id: 'marital-language',
    step: 3,
    title: 'Marital & Language',
    description: 'Marital status and language information',
    section: 'maritalInfo'
  },
  {
    id: 'contact-info',
    step: 4,
    title: 'Contact Information',
    description: 'Email, phone, and address details',
    section: 'contactInfo'
  },
  {
    id: 'education-history',
    step: 5,
    title: 'Education History',
    description: 'Tell us about your educational background',
    section: 'educationHistory'
  },
  {
    id: 'study-purpose',
    step: 6,
    title: 'Study Purpose',
    description: 'Details about your Canadian study plans',
    section: 'studyPurpose'
  },
  {
    id: 'proof-of-funds',
    step: 7,
    title: 'Proof of Funds',
    description: 'Financial information and funding sources',
    section: 'proofOfFunds'
  },
  {
    id: 'review-submit',
    step: 8,
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
 * Updated to match new structure
 */
export const INITIAL_FORM_DATA: FormData = {
  personalInfo: {
    familyName: '',
    givenNames: '',
    sex: '',
    dateOfBirth: '',
    citizenship: '',
    countryOfResidence: ''
  },
  passportInfo: {
    number: '',
    countryOfIssue: '',
    issueDate: '',
    expiryDate: ''
  },
  maritalInfo: {
    status: ''
  },
  languageInfo: {
    nativeLanguage: '',
    communicateInEnglishFrench: ''
  },
  contactInfo: {
    email: '',
    telephone: {
      number: ''
    }
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
 * Sex/Gender Options
 */
export const SEX_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Another gender', label: 'Another gender' }
];

/**
 * Marital Status Options
 */
export const MARITAL_STATUS_OPTIONS = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Common-law', label: 'Common-law' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Separated', label: 'Separated' },
  { value: 'Widowed', label: 'Widowed' },
  { value: 'Annulled', label: 'Annulled' }
];

/**
 * Language Communication Options
 */
export const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English only' },
  { value: 'French', label: 'French only' },
  { value: 'Both', label: 'Both English and French' },
  { value: 'Neither', label: 'Neither' }
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
