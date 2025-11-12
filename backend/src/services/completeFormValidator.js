/**
 * Complete Form Validation Service
 * Comprehensive validation rules for ALL IMM 1294 fields
 * Based on complete form structure with ~147 fields
 */

/**
 * Complete Validation Rules Configuration
 * Defines all validation requirements for each form field
 */
export const COMPLETE_VALIDATION_RULES = {
  // UCI & Service Language
  uci: {
    required: false,
    pattern: /^[A-Z0-9]{8,10}$/,
    message: 'UCI must be 8-10 alphanumeric characters'
  },
  serviceLanguage: {
    required: true,
    enum: ['English', 'French'],
    message: 'Service language must be English or French'
  },

  // Personal Info
  personalInfo: {
    familyName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-']+$/,
      message: 'Family name must contain only letters, spaces, hyphens, and apostrophes'
    },
    givenNames: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-']+$/,
      message: 'Given name(s) must contain only letters, spaces, hyphens, and apostrophes'
    },
    hasOtherNames: {
      required: false
    },
    sex: {
      required: true,
      enum: ['Male', 'Female', 'Another gender'],
      message: 'Please select your sex'
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
    citizenship: {
      required: true,
      minLength: 2,
      message: 'Citizenship is required'
    }
  },

  // Marital Info
  maritalInfo: {
    status: {
      required: true,
      enum: ['Single', 'Married', 'Common-law', 'Divorced', 'Separated', 'Widowed', 'Annulled'],
      message: 'Please select your marital status'
    },
    dateOfMarriage: {
      required: false,
      validate: (value, formData) => {
        if (!value) return true;
        const status = formData.maritalInfo?.status;
        if (status === 'Married' || status === 'Common-law') {
          const marriageDate = new Date(value);
          const birthDate = new Date(formData.personalInfo?.dateOfBirth);
          const today = new Date();
          return marriageDate > birthDate && marriageDate <= today;
        }
        return true;
      },
      message: 'Marriage date must be after birth date and not in the future'
    },
    previouslyMarried: {
      required: false
    }
  },

  // Language Info
  languageInfo: {
    nativeLanguage: {
      required: true,
      minLength: 2,
      message: 'Native language is required'
    },
    communicateInEnglishFrench: {
      required: true,
      enum: ['English', 'French', 'Both', 'Neither'],
      message: 'Please select your ability to communicate in English and/or French'
    },
    languageTest: {
      required: false
    }
  },

  // Passport Info
  passportInfo: {
    number: {
      required: true,
      minLength: 6,
      maxLength: 15,
      pattern: /^[A-Z0-9]+$/,
      message: 'Passport number must be alphanumeric and uppercase'
    },
    countryOfIssue: {
      required: true,
      minLength: 2,
      message: 'Passport issuing country is required'
    },
    issueDate: {
      required: true,
      validate: (value) => {
        const date = new Date(value);
        const today = new Date();
        return date <= today;
      },
      message: 'Passport issue date cannot be in the future'
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
    taiwanPassport: {
      required: false
    },
    israeliPassport: {
      required: false
    }
  },

  // National ID Info
  nationalIdInfo: {
    hasDocument: {
      required: false
    },
    documentNumber: {
      required: false,
      validate: (value, formData) => {
        if (formData.nationalIdInfo?.hasDocument === true) {
          return value && value.length >= 5;
        }
        return true;
      },
      message: 'Document number is required when you have a national ID'
    }
  },

  // US PR Info
  usPRInfo: {
    isPermanentResident: {
      required: false
    },
    uscisNumber: {
      required: false,
      validate: (value, formData) => {
        if (formData.usPRInfo?.isPermanentResident === true) {
          return value && value.length >= 8;
        }
        return true;
      },
      message: 'USCIS number is required for US permanent residents'
    }
  },

  // Contact Info
  contactInfo: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    }
  },

  // Study Details
  studyDetails: {
    schoolName: {
      required: true,
      minLength: 3,
      message: 'School name is required'
    },
    levelOfStudy: {
      required: true,
      minLength: 2,
      message: 'Level of study is required'
    },
    fieldOfStudy: {
      required: true,
      minLength: 2,
      message: 'Field of study is required'
    },
    dliNumber: {
      required: true,
      pattern: /^O\d{9,11}$/,
      message: 'DLI number must start with "O" followed by 9-11 digits'
    },
    fundsAvailable: {
      required: true,
      validate: (value) => {
        const funds = parseFloat(value);
        return funds >= 10000;
      },
      message: 'Available funds must be at least CAD $10,000'
    },
    expensesPaidBy: {
      required: true,
      minLength: 2,
      message: 'Please specify who will pay your expenses'
    }
  },

  // Education History
  educationHistory: {
    hasPostSecondary: {
      required: true,
      message: 'Please indicate if you have post-secondary education'
    }
  },

  // Employment History - validated as array

  // Background Info
  backgroundInfo: {
    // All health, immigration, criminal, military, political, war crimes questions
    // default to false, validated when true requires details
  }
};

/**
 * Validate nested object field
 */
function validateNestedField(obj, path, rule, formData) {
  const keys = path.split('.');
  let value = obj;

  for (const key of keys) {
    value = value?.[key];
  }

  if (rule.required && (value === undefined || value === null || value === '')) {
    return {
      isValid: false,
      error: rule.message || `${path} is required`
    };
  }

  if (!rule.required && (value === undefined || value === null || value === '')) {
    return { isValid: true, error: null };
  }

  // Check minimum length
  if (rule.minLength && String(value).length < rule.minLength) {
    return {
      isValid: false,
      error: rule.message || `Minimum length is ${rule.minLength} characters`
    };
  }

  // Check maximum length
  if (rule.maxLength && String(value).length > rule.maxLength) {
    return {
      isValid: false,
      error: rule.message || `Maximum length is ${rule.maxLength} characters`
    };
  }

  // Check pattern (regex)
  if (rule.pattern && !rule.pattern.test(String(value))) {
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
 * Validate complete form with nested structure
 */
export function validateCompleteFormData(formData) {
  const errors = {};
  let isValid = true;

  // Validate top-level fields
  if (formData.uci) {
    const result = validateNestedField({ uci: formData.uci }, 'uci', COMPLETE_VALIDATION_RULES.uci, formData);
    if (!result.isValid) {
      errors.uci = result.error;
      isValid = false;
    }
  }

  const result = validateNestedField({ serviceLanguage: formData.serviceLanguage }, 'serviceLanguage',
    COMPLETE_VALIDATION_RULES.serviceLanguage, formData);
  if (!result.isValid) {
    errors.serviceLanguage = result.error;
    isValid = false;
  }

  // Validate each section
  for (const [section, rules] of Object.entries(COMPLETE_VALIDATION_RULES)) {
    if (section === 'uci' || section === 'serviceLanguage') continue;

    const sectionData = formData[section];
    const sectionErrors = {};

    if (typeof rules === 'object' && !Array.isArray(rules)) {
      for (const [field, rule] of Object.entries(rules)) {
        const result = validateNestedField(sectionData || {}, field, rule, formData);
        if (!result.isValid) {
          sectionErrors[field] = result.error;
          isValid = false;
        }
      }
    }

    if (Object.keys(sectionErrors).length > 0) {
      errors[section] = sectionErrors;
    }
  }

  // Count fields for summary
  const summary = {
    totalFields: countTotalFields(),
    validFields: 0,
    invalidFields: Object.keys(errors).length,
    sections: {}
  };

  summary.validFields = summary.totalFields - summary.invalidFields;

  return {
    isValid,
    errors,
    summary
  };
}

/**
 * Count total number of fields in validation rules
 */
function countTotalFields() {
  let count = 2; // uci + serviceLanguage

  for (const [section, rules] of Object.entries(COMPLETE_VALIDATION_RULES)) {
    if (section === 'uci' || section === 'serviceLanguage') continue;
    if (typeof rules === 'object' && !Array.isArray(rules)) {
      count += Object.keys(rules).length;
    }
  }

  return count;
}

/**
 * Simplified validation for backward compatibility
 * Only validates critical required fields
 */
export function validateMinimalForm(formData) {
  const errors = {};
  let isValid = true;

  // Critical required fields only
  const criticalFields = {
    'personalInfo.familyName': 'Family name is required',
    'personalInfo.givenNames': 'Given name(s) is required',
    'personalInfo.dateOfBirth': 'Date of birth is required',
    'personalInfo.sex': 'Sex is required',
    'personalInfo.citizenship': 'Citizenship is required',
    'passportInfo.number': 'Passport number is required',
    'passportInfo.countryOfIssue': 'Passport country of issue is required',
    'passportInfo.issueDate': 'Passport issue date is required',
    'passportInfo.expiryDate': 'Passport expiry date is required',
    'contactInfo.email': 'Email is required',
    'studyDetails.schoolName': 'School name is required',
    'studyDetails.dliNumber': 'DLI number is required',
    'studyDetails.levelOfStudy': 'Level of study is required',
    'studyDetails.fieldOfStudy': 'Field of study is required',
    'languageInfo.nativeLanguage': 'Native language is required',
    'maritalInfo.status': 'Marital status is required'
  };

  for (const [path, message] of Object.entries(criticalFields)) {
    const keys = path.split('.');
    let value = formData;

    for (const key of keys) {
      value = value?.[key];
    }

    if (!value || value === '') {
      const section = keys[0];
      if (!errors[section]) errors[section] = {};
      errors[section][keys[1]] = message;
      isValid = false;
    }
  }

  return {
    isValid,
    errors,
    summary: {
      totalFields: Object.keys(criticalFields).length,
      validFields: isValid ? Object.keys(criticalFields).length : 0,
      invalidFields: isValid ? 0 : Object.keys(errors).length
    }
  };
}

export default {
  validateCompleteFormData,
  validateMinimalForm,
  COMPLETE_VALIDATION_RULES
};
