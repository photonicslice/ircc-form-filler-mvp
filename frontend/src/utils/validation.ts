/**
 * Client-Side Validation Utilities
 * Mirrors backend validation for immediate feedback
 */

import { FormData, ValidationResult } from '../types/form.types';

// ============================================================================
// VALIDATION RULES (matching backend)
// ============================================================================

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!pattern.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const pattern = /^\+?[\d\s\-()]+$/;

  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  if (phone.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }

  if (!pattern.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate name (first/last)
 */
export function validateName(name: string, fieldLabel: string): ValidationResult {
  const pattern = /^[a-zA-Z\s\-']+$/;

  if (!name) {
    return { isValid: false, error: `${fieldLabel} is required` };
  }

  if (name.length < 2) {
    return { isValid: false, error: `${fieldLabel} must be at least 2 characters` };
  }

  if (name.length > 50) {
    return { isValid: false, error: `${fieldLabel} must be less than 50 characters` };
  }

  if (!pattern.test(name)) {
    return { isValid: false, error: `${fieldLabel} must contain only letters, spaces, hyphens, and apostrophes` };
  }

  return { isValid: true, error: null };
}

/**
 * Validate date of birth
 */
export function validateDateOfBirth(dateOfBirth: string): ValidationResult {
  if (!dateOfBirth) {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const date = new Date(dateOfBirth);
  const today = new Date();
  const age = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  if (age < 16) {
    return { isValid: false, error: 'Applicant must be at least 16 years old' };
  }

  if (age > 100) {
    return { isValid: false, error: 'Please enter a valid date of birth' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate passport number
 */
export function validatePassportNumber(passportNumber: string): ValidationResult {
  const pattern = /^[A-Z0-9]+$/;

  if (!passportNumber) {
    return { isValid: false, error: 'Passport number is required' };
  }

  if (passportNumber.length < 6 || passportNumber.length > 15) {
    return { isValid: false, error: 'Passport number must be 6-15 characters' };
  }

  if (!pattern.test(passportNumber)) {
    return { isValid: false, error: 'Passport number must be alphanumeric and uppercase' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate passport issue date
 */
export function validatePassportIssueDate(issueDate: string): ValidationResult {
  if (!issueDate) {
    return { isValid: false, error: 'Issue date is required' };
  }

  const date = new Date(issueDate);
  const today = new Date();

  if (date > today) {
    return { isValid: false, error: 'Issue date cannot be in the future' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate passport expiry date
 */
export function validatePassportExpiryDate(expiryDate: string, issueDate?: string): ValidationResult {
  if (!expiryDate) {
    return { isValid: false, error: 'Expiry date is required' };
  }

  const expiry = new Date(expiryDate);
  const today = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  if (issueDate) {
    const issue = new Date(issueDate);
    if (expiry <= issue) {
      return { isValid: false, error: 'Expiry date must be after issue date' };
    }
  }

  if (expiry <= sixMonthsFromNow) {
    return { isValid: false, error: 'Passport must be valid for at least 6 months from today' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate DLI number
 */
export function validateDLI(dli: string): ValidationResult {
  const pattern = /^O\d{9}$/;

  if (!dli) {
    return { isValid: false, error: 'DLI number is required' };
  }

  if (!pattern.test(dli)) {
    return { isValid: false, error: 'DLI number must start with "O" followed by 9 digits (e.g., O123456789)' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate program start date
 */
export function validateProgramStartDate(startDate: string): ValidationResult {
  if (!startDate) {
    return { isValid: false, error: 'Program start date is required' };
  }

  const start = new Date(startDate);
  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  if (start < threeMonthsFromNow) {
    return { isValid: false, error: 'Program start date must be at least 3 months from today' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate program duration
 */
export function validateProgramDuration(duration: string): ValidationResult {
  if (!duration) {
    return { isValid: false, error: 'Program duration is required' };
  }

  const durationNum = parseInt(duration);

  if (isNaN(durationNum) || durationNum < 1 || durationNum > 60) {
    return { isValid: false, error: 'Program duration must be between 1 and 60 months' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate graduation year
 */
export function validateGraduationYear(year: string): ValidationResult {
  if (!year) {
    return { isValid: false, error: 'Graduation year is required' };
  }

  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();

  if (isNaN(yearNum) || yearNum < 1950 || yearNum > currentYear + 10) {
    return { isValid: false, error: 'Please enter a valid graduation year' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate tuition fees
 */
export function validateTuitionFees(fees: string): ValidationResult {
  if (!fees) {
    return { isValid: false, error: 'Tuition fees are required' };
  }

  const feesNum = parseFloat(fees);

  if (isNaN(feesNum) || feesNum < 1000 || feesNum > 100000) {
    return { isValid: false, error: 'Tuition fees must be between CAD $1,000 and $100,000' };
  }

  return { isValid: true, error: null };
}

/**
 * Validate available funds
 */
export function validateAvailableFunds(funds: string, tuitionFees?: string): ValidationResult {
  if (!funds) {
    return { isValid: false, error: 'Available funds are required' };
  }

  const fundsNum = parseFloat(funds);

  if (isNaN(fundsNum)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }

  if (tuitionFees) {
    const tuition = parseFloat(tuitionFees);
    const minimumRequired = tuition + 10000;

    if (fundsNum < minimumRequired) {
      return {
        isValid: false,
        error: `Available funds must cover tuition (${tuition.toLocaleString()}) plus CAD $10,000 for living expenses. Minimum required: CAD $${minimumRequired.toLocaleString()}`
      };
    }
  }

  return { isValid: true, error: null };
}

/**
 * Validate required field (generic)
 */
export function validateRequired(value: any, fieldLabel: string): ValidationResult {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: `${fieldLabel} is required` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldLabel} is required` };
  }

  return { isValid: true, error: null };
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, minLength: number, fieldLabel: string): ValidationResult {
  if (!value) {
    return { isValid: false, error: `${fieldLabel} is required` };
  }

  if (value.length < minLength) {
    return { isValid: false, error: `${fieldLabel} must be at least ${minLength} characters` };
  }

  return { isValid: true, error: null };
}

// ============================================================================
// SECTION VALIDATORS
// ============================================================================

/**
 * Validate Personal Info Section
 */
export function validatePersonalInfoSection(data: FormData['personalInfo']): Record<string, string> {
  const errors: Record<string, string> = {};

  const firstNameResult = validateName(data.firstName, 'First name');
  if (!firstNameResult.isValid) errors.firstName = firstNameResult.error!;

  const lastNameResult = validateName(data.lastName, 'Last name');
  if (!lastNameResult.isValid) errors.lastName = lastNameResult.error!;

  const dobResult = validateDateOfBirth(data.dateOfBirth);
  if (!dobResult.isValid) errors.dateOfBirth = dobResult.error!;

  const nationalityResult = validateRequired(data.nationality, 'Nationality');
  if (!nationalityResult.isValid) errors.nationality = nationalityResult.error!;

  const countryResult = validateRequired(data.countryOfResidence, 'Country of residence');
  if (!countryResult.isValid) errors.countryOfResidence = countryResult.error!;

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) errors.email = emailResult.error!;

  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.isValid) errors.phone = phoneResult.error!;

  return errors;
}

/**
 * Validate Passport Info Section
 */
export function validatePassportInfoSection(data: FormData['passportInfo']): Record<string, string> {
  const errors: Record<string, string> = {};

  const passportResult = validatePassportNumber(data.passportNumber);
  if (!passportResult.isValid) errors.passportNumber = passportResult.error!;

  const issueResult = validatePassportIssueDate(data.issueDate);
  if (!issueResult.isValid) errors.issueDate = issueResult.error!;

  const expiryResult = validatePassportExpiryDate(data.expiryDate, data.issueDate);
  if (!expiryResult.isValid) errors.expiryDate = expiryResult.error!;

  const countryResult = validateRequired(data.issuingCountry, 'Issuing country');
  if (!countryResult.isValid) errors.issuingCountry = countryResult.error!;

  return errors;
}

/**
 * Validate Education History Section
 */
export function validateEducationHistorySection(data: FormData['educationHistory']): Record<string, string> {
  const errors: Record<string, string> = {};

  const educationResult = validateRequired(data.highestEducation, 'Highest education');
  if (!educationResult.isValid) errors.highestEducation = educationResult.error!;

  const institutionResult = validateMinLength(data.institutionName, 3, 'Institution name');
  if (!institutionResult.isValid) errors.institutionName = institutionResult.error!;

  const fieldResult = validateMinLength(data.fieldOfStudy, 2, 'Field of study');
  if (!fieldResult.isValid) errors.fieldOfStudy = fieldResult.error!;

  const yearResult = validateGraduationYear(data.graduationYear);
  if (!yearResult.isValid) errors.graduationYear = yearResult.error!;

  return errors;
}

/**
 * Validate Study Purpose Section
 */
export function validateStudyPurposeSection(data: FormData['studyPurpose']): Record<string, string> {
  const errors: Record<string, string> = {};

  const institutionResult = validateMinLength(data.canadianInstitution, 3, 'Canadian institution');
  if (!institutionResult.isValid) errors.canadianInstitution = institutionResult.error!;

  const dliResult = validateDLI(data.dli);
  if (!dliResult.isValid) errors.dli = dliResult.error!;

  const programResult = validateMinLength(data.programName, 3, 'Program name');
  if (!programResult.isValid) errors.programName = programResult.error!;

  const levelResult = validateRequired(data.programLevel, 'Program level');
  if (!levelResult.isValid) errors.programLevel = levelResult.error!;

  const startResult = validateProgramStartDate(data.programStartDate);
  if (!startResult.isValid) errors.programStartDate = startResult.error!;

  const durationResult = validateProgramDuration(data.programDuration);
  if (!durationResult.isValid) errors.programDuration = durationResult.error!;

  if (!data.hasLetterOfAcceptance) {
    errors.hasLetterOfAcceptance = 'Letter of Acceptance is required for study permit application';
  }

  return errors;
}

/**
 * Validate Proof of Funds Section
 */
export function validateProofOfFundsSection(data: FormData['proofOfFunds']): Record<string, string> {
  const errors: Record<string, string> = {};

  const tuitionResult = validateTuitionFees(data.annualTuitionFees);
  if (!tuitionResult.isValid) errors.annualTuitionFees = tuitionResult.error!;

  const fundsResult = validateAvailableFunds(data.availableFunds, data.annualTuitionFees);
  if (!fundsResult.isValid) errors.availableFunds = fundsResult.error!;

  const fundingResult = validateRequired(data.fundingSource, 'Funding source');
  if (!fundingResult.isValid) errors.fundingSource = fundingResult.error!;

  if (data.hasSponsor && (!data.sponsorRelationship || data.sponsorRelationship.length < 2)) {
    errors.sponsorRelationship = 'Sponsor relationship is required when you have a sponsor';
  }

  return errors;
}

/**
 * Get section validator by section name
 */
export function getSectionValidator(section: keyof FormData) {
  const validators: Record<keyof FormData, (data: any) => Record<string, string>> = {
    personalInfo: validatePersonalInfoSection,
    passportInfo: validatePassportInfoSection,
    educationHistory: validateEducationHistorySection,
    studyPurpose: validateStudyPurposeSection,
    proofOfFunds: validateProofOfFundsSection
  };

  return validators[section];
}
