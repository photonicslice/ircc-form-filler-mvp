/**
 * Form Validation Service
 * Comprehensive validation rules for Study Permit application
 */

/**
 * Validation Rules Configuration
 * Defines all validation requirements for each form field
 */
const VALIDATION_RULES = {
  personalInfo: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-']+$/,
      message: 'First name must contain only letters, spaces, hyphens, and apostrophes'
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-']+$/,
      message: 'Last name must contain only letters, spaces, hyphens, and apostrophes'
    },
    dateOfBirth: {
      required: true,
      validate: (value) => {
        const date = new Date(value);
        const today = new Date();
        const age = (today - date) / (1000 * 60 * 60 * 24 * 365.25);
        return age >= 16 && age <= 100;
      },
      message: 'Applicant must be between 16 and 100 years old'
    },
    nationality: {
      required: true,
      minLength: 2,
      message: 'Nationality is required'
    },
    countryOfResidence: {
      required: true,
      minLength: 2,
      message: 'Country of residence is required'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    phone: {
      required: true,
      pattern: /^\+?[\d\s\-()]+$/,
      minLength: 10,
      message: 'Please enter a valid phone number'
    }
  },
  passportInfo: {
    passportNumber: {
      required: true,
      minLength: 6,
      maxLength: 15,
      pattern: /^[A-Z0-9]+$/,
      message: 'Passport number must be alphanumeric and uppercase'
    },
    issueDate: {
      required: true,
      validate: (value) => {
        const date = new Date(value);
        const today = new Date();
        return date <= today;
      },
      message: 'Issue date cannot be in the future'
    },
    expiryDate: {
      required: true,
      validate: (value, formData) => {
        const expiryDate = new Date(value);
        const issueDate = new Date(formData.passportInfo?.issueDate);
        const today = new Date();
        // Passport must be valid for at least 6 months
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        
        return expiryDate > issueDate && expiryDate > sixMonthsFromNow;
      },
      message: 'Passport must be valid for at least 6 months from today'
    },
    issuingCountry: {
      required: true,
      minLength: 2,
      message: 'Issuing country is required'
    }
  },
  educationHistory: {
    highestEducation: {
      required: true,
      enum: ['high_school', 'diploma', 'bachelors', 'masters', 'phd'],
      message: 'Please select your highest level of education'
    },
    institutionName: {
      required: true,
      minLength: 3,
      message: 'Institution name is required'
    },
    fieldOfStudy: {
      required: true,
      minLength: 2,
      message: 'Field of study is required'
    },
    graduationYear: {
      required: true,
      validate: (value) => {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        return year >= 1950 && year <= currentYear + 10;
      },
      message: 'Please enter a valid graduation year'
    }
  },
  studyPurpose: {
    canadianInstitution: {
      required: true,
      minLength: 3,
      message: 'Canadian institution name is required'
    },
    dli: {
      required: true,
      pattern: /^O\d{9}$/,
      message: 'DLI number must start with "O" followed by 9 digits (e.g., O123456789)'
    },
    programName: {
      required: true,
      minLength: 3,
      message: 'Program name is required'
    },
    programLevel: {
      required: true,
      enum: ['certificate', 'diploma', 'bachelors', 'masters', 'phd', 'postgraduate'],
      message: 'Please select program level'
    },
    programStartDate: {
      required: true,
      validate: (value) => {
        const startDate = new Date(value);
        const today = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        
        return startDate >= threeMonthsFromNow;
      },
      message: 'Program start date must be at least 3 months from today'
    },
    programDuration: {
      required: true,
      validate: (value) => {
        const duration = parseInt(value);
        return duration >= 1 && duration <= 60;
      },
      message: 'Program duration must be between 1 and 60 months'
    },
    hasLetterOfAcceptance: {
      required: true,
      validate: (value) => value === true || value === 'true',
      message: 'Letter of Acceptance is required for study permit application'
    }
  },
  proofOfFunds: {
    annualTuitionFees: {
      required: true,
      validate: (value) => {
        const amount = parseFloat(value);
        return amount >= 1000 && amount <= 100000;
      },
      message: 'Tuition fees must be between CAD $1,000 and $100,000'
    },
    availableFunds: {
      required: true,
      validate: (value, formData) => {
        const funds = parseFloat(value);
        const tuition = parseFloat(formData.proofOfFunds?.annualTuitionFees || 0);
        // IRCC requires tuition + CAD $10,000 for living expenses (single person)
        const minimumRequired = tuition + 10000;
        
        return funds >= minimumRequired;
      },
      message: 'Available funds must cover tuition plus CAD $10,000 for living expenses'
    },
    fundingSource: {
      required: true,
      enum: ['personal_savings', 'family_support', 'scholarship', 'loan', 'sponsor', 'other'],
      message: 'Please select your funding source'
    },
    hasSponsor: {
      required: false
    },
    sponsorRelationship: {
      required: false,
      validate: (value, formData) => {
        // Only required if hasSponsor is true
        if (formData.proofOfFunds?.hasSponsor === true || formData.proofOfFunds?.hasSponsor === 'true') {
          return value && value.length >= 2;
        }
        return true;
      },
      message: 'Sponsor relationship is required when you have a sponsor'
    }
  }
};

/**
 * Validate a single field against its rules
 * @param {string} section - Form section (e.g., 'personalInfo')
 * @param {string} fieldName - Field name
 * @param {any} value - Field value
 * @param {object} formData - Complete form data for cross-field validation
 * @returns {object} - { isValid: boolean, error: string | null }
 */
export function validateField(section, fieldName, value, formData = {}) {
  const rule = VALIDATION_RULES[section]?.[fieldName];
  
  if (!rule) {
    return { isValid: true, error: null };
  }

  // Check if field is required
  if (rule.required && (value === undefined || value === null || value === '')) {
    return { 
      isValid: false, 
      error: `${fieldName} is required` 
    };
  }

  // If field is empty and not required, it's valid
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return { isValid: true, error: null };
  }

  // Check minimum length
  if (rule.minLength && value.length < rule.minLength) {
    return { 
      isValid: false, 
      error: rule.message || `Minimum length is ${rule.minLength} characters` 
    };
  }

  // Check maximum length
  if (rule.maxLength && value.length > rule.maxLength) {
    return { 
      isValid: false, 
      error: rule.message || `Maximum length is ${rule.maxLength} characters` 
    };
  }

  // Check pattern (regex)
  if (rule.pattern && !rule.pattern.test(value)) {
    return { 
      isValid: false, 
      error: rule.message || 'Invalid format' 
    };
  }

  // Check enum values
  if (rule.enum && !rule.enum.includes(value)) {
    return { 
      isValid: false, 
      error: rule.message || `Value must be one of: ${rule.enum.join(', ')}` 
    };
  }

  // Custom validation function
  if (rule.validate && !rule.validate(value, formData)) {
    return { 
      isValid: false, 
      error: rule.message || 'Invalid value' 
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validate entire form section
 * @param {string} section - Form section name
 * @param {object} sectionData - Section data to validate
 * @param {object} formData - Complete form data
 * @returns {object} - { isValid: boolean, errors: object }
 */
export function validateSection(section, sectionData, formData = {}) {
  const errors = {};
  let isValid = true;

  const sectionRules = VALIDATION_RULES[section];
  if (!sectionRules) {
    return { isValid: true, errors: {} };
  }

  for (const [fieldName, rule] of Object.entries(sectionRules)) {
    const value = sectionData?.[fieldName];
    const result = validateField(section, fieldName, value, formData);
    
    if (!result.isValid) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Validate complete form data
 * @param {object} formData - Complete form data
 * @returns {object} - { isValid: boolean, errors: object, summary: object }
 */
export function validateCompleteForm(formData) {
  const allErrors = {};
  let isValid = true;
  const summary = {
    totalFields: 0,
    validFields: 0,
    invalidFields: 0,
    sections: {}
  };

  for (const section of Object.keys(VALIDATION_RULES)) {
    const sectionData = formData[section] || {};
    const result = validateSection(section, sectionData, formData);
    
    if (!result.isValid) {
      allErrors[section] = result.errors;
      isValid = false;
    }

    // Update summary
    const fieldCount = Object.keys(VALIDATION_RULES[section]).length;
    const errorCount = Object.keys(result.errors).length;
    
    summary.totalFields += fieldCount;
    summary.invalidFields += errorCount;
    summary.validFields += (fieldCount - errorCount);
    summary.sections[section] = {
      isValid: result.isValid,
      fieldCount,
      errorCount
    };
  }

  return { 
    isValid, 
    errors: allErrors,
    summary
  };
}

/**
 * Get human-readable field name
 * @param {string} fieldName - Camel case field name
 * @returns {string} - Human readable name
 */
export function getFieldLabel(fieldName) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export default {
  validateField,
  validateSection,
  validateCompleteForm,
  getFieldLabel,
  VALIDATION_RULES
};
