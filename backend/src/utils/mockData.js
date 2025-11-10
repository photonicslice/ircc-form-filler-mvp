/**
 * Mock Data for Testing
 * Sample form data to test the application
 */

/**
 * Complete mock applicant data
 */
export const mockApplicant = {
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

/**
 * Mock applicant 2 - Different scenario
 */
export const mockApplicant2 = {
  personalInfo: {
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    dateOfBirth: '1995-07-22',
    nationality: 'Mexico',
    countryOfResidence: 'Mexico',
    email: 'carlos.rodriguez@example.com',
    phone: '+52-555-123-4567'
  },
  passportInfo: {
    passportNumber: 'G9876543',
    issueDate: '2021-06-10',
    expiryDate: '2031-06-09',
    issuingCountry: 'Mexico'
  },
  educationHistory: {
    highestEducation: 'diploma',
    institutionName: 'Tecnológico de Monterrey',
    fieldOfStudy: 'Business Administration',
    graduationYear: '2017'
  },
  studyPurpose: {
    canadianInstitution: 'Seneca College',
    dli: 'O19395238836',
    programName: 'Post-Graduate Certificate in Project Management',
    programLevel: 'postgraduate',
    programStartDate: '2026-05-15',
    programDuration: '12',
    hasLetterOfAcceptance: true
  },
  proofOfFunds: {
    annualTuitionFees: '16000',
    availableFunds: '30000',
    fundingSource: 'personal_savings',
    hasSponsor: false
  }
};

/**
 * Mock applicant 3 - Scholarship recipient
 */
export const mockApplicant3 = {
  personalInfo: {
    firstName: 'Amina',
    lastName: 'Hassan',
    dateOfBirth: '1999-11-08',
    nationality: 'Nigeria',
    countryOfResidence: 'Nigeria',
    email: 'amina.hassan@example.com',
    phone: '+234-803-555-1234'
  },
  passportInfo: {
    passportNumber: 'A12345678',
    issueDate: '2022-03-20',
    expiryDate: '2032-03-19',
    issuingCountry: 'Nigeria'
  },
  educationHistory: {
    highestEducation: 'masters',
    institutionName: 'University of Lagos',
    fieldOfStudy: 'Environmental Science',
    graduationYear: '2022'
  },
  studyPurpose: {
    canadianInstitution: 'University of British Columbia',
    dli: 'O19275373532',
    programName: 'PhD in Environmental Studies',
    programLevel: 'phd',
    programStartDate: '2026-09-01',
    programDuration: '48',
    hasLetterOfAcceptance: true
  },
  proofOfFunds: {
    annualTuitionFees: '8500',
    availableFunds: '20000',
    fundingSource: 'scholarship',
    hasSponsor: false
  }
};

/**
 * Partial mock data for testing validation
 */
export const incompleteApplicant = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2000-01-01',
    // Missing required fields
  },
  passportInfo: {
    passportNumber: 'ABC123',
    // Missing required fields
  }
};

/**
 * Mock data with validation errors
 */
export const invalidApplicant = {
  personalInfo: {
    firstName: 'Test123', // Invalid - contains numbers
    lastName: 'User',
    dateOfBirth: '2010-01-01', // Too young
    nationality: 'X', // Too short
    countryOfResidence: '',
    email: 'invalid-email', // Invalid format
    phone: '123' // Too short
  },
  passportInfo: {
    passportNumber: 'abc123', // Should be uppercase
    issueDate: '2030-01-01', // In the future
    expiryDate: '2025-01-01', // Already expired/too soon
    issuingCountry: ''
  },
  educationHistory: {
    highestEducation: 'invalid', // Not in enum
    institutionName: 'X',
    fieldOfStudy: '',
    graduationYear: '1900' // Too old
  },
  studyPurpose: {
    canadianInstitution: '',
    dli: '123456789', // Invalid format - should start with O
    programName: '',
    programLevel: '',
    programStartDate: '2026-01-01', // Too soon
    programDuration: '100', // Too long
    hasLetterOfAcceptance: false
  },
  proofOfFunds: {
    annualTuitionFees: '500', // Too low
    availableFunds: '1000', // Insufficient
    fundingSource: 'invalid'
  }
};

/**
 * Get mock data by scenario
 */
export function getMockData(scenario = 'default') {
  const scenarios = {
    default: mockApplicant,
    masters: mockApplicant,
    postgraduate: mockApplicant2,
    phd: mockApplicant3,
    scholarship: mockApplicant3,
    incomplete: incompleteApplicant,
    invalid: invalidApplicant
  };

  return scenarios[scenario] || mockApplicant;
}

/**
 * Get list of all available mock scenarios
 */
export function getMockScenarios() {
  return [
    {
      id: 'default',
      name: 'Default - Master\'s Student (India)',
      description: 'Master\'s program with family sponsor'
    },
    {
      id: 'postgraduate',
      name: 'Post-Graduate Certificate (Mexico)',
      description: 'Post-grad certificate with personal savings'
    },
    {
      id: 'phd',
      name: 'PhD Student with Scholarship (Nigeria)',
      description: 'PhD program with scholarship funding'
    },
    {
      id: 'incomplete',
      name: 'Incomplete Application',
      description: 'Test validation with missing fields'
    },
    {
      id: 'invalid',
      name: 'Invalid Data',
      description: 'Test validation with incorrect data'
    }
  ];
}

export default {
  mockApplicant,
  mockApplicant2,
  mockApplicant3,
  incompleteApplicant,
  invalidApplicant,
  getMockData,
  getMockScenarios
};
