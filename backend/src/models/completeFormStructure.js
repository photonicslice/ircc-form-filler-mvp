/**
 * Complete IMM 1294 Form Data Structure
 * Based on analysis of all 8 form screenshots
 * Total: ~147 fields across 8 pages
 */

/**
 * Complete form data structure for IMM 1294
 * All fields are optional unless marked as required in validation
 */
export const COMPLETE_FORM_STRUCTURE = {
  // Page 1: Personal Details
  uci: '',                    // UCI number (optional)
  serviceLanguage: 'English', // 'English' or 'French'

  personalInfo: {
    // Section 1: Full Name
    familyName: '',           // Required - Family name as shown on passport
    givenNames: '',           // Required - Given name(s) as shown on passport

    // Section 2: Other Names
    hasOtherNames: false,     // Yes/No
    otherNames: {
      familyName: '',
      givenNames: ''
    },

    // Section 3: Sex
    sex: '',                  // Required - Dropdown selection

    // Section 4: Date of Birth
    dateOfBirth: '',          // Required - YYYY-MM-DD format

    // Section 5: Place of Birth
    placeOfBirth: {
      city: '',               // City/Town
      country: ''             // Required - Country or Territory
    },

    // Section 6: Citizenship
    citizenship: '',          // Required - Country

    // Section 7: Current Country/Territory of Residence
    currentResidence: {
      country: '',            // Required - Country or Territory
      status: '',             // Status (dropdown: visitor, student, worker, citizen, etc.)
      other: '',              // Other status (if applicable)
      from: '',               // YYYY-MM-DD
      to: ''                  // YYYY-MM-DD
    },

    // Section 8: Previous Countries of Residence (Past 5 Years, > 6 months)
    previousResidences: [
      {
        country: '',          // Country or Territory
        status: '',           // Status
        other: '',            // Other
        from: '',             // YYYY-MM-DD
        to: ''                // YYYY-MM-DD
      }
      // Can have multiple entries
    ],

    // Section 9: Country Where Applying
    applyingFrom: {
      sameAsCurrent: true,    // Yes/No
      country: '',            // Country or Territory (if different)
      status: '',             // Status
      other: '',              // Other
      from: '',               // YYYY-MM-DD
      to: ''                  // YYYY-MM-DD
    }
  },

  // Page 2: Marital Status
  maritalInfo: {
    // Section 10: Marital Status
    status: '',               // Required - Dropdown: Single, Married, Common-law, Divorced, Separated, Widowed
    dateOfMarriage: '',       // YYYY-MM-DD (if married/common-law)

    // Current Spouse/Common-law Partner
    spouse: {
      familyName: '',
      givenNames: ''
    },

    // Section 11: Previous Marriage/Relationship
    previouslyMarried: false, // Yes/No
    previousSpouse: {
      familyName: '',
      givenNames: '',
      dateOfBirth: '',        // YYYY-MM-DD
      relationshipType: '',   // Type of relationship (dropdown)
      from: '',               // YYYY-MM-DD
      to: ''                  // YYYY-MM-DD
    }
  },

  // Page 3: Language
  languageInfo: {
    nativeLanguage: '',       // Native language/Mother Tongue
    communicateInEnglishFrench: '', // Dropdown: English, French, Both, Neither
    mostAtEase: '',           // Language most at ease
    languageTest: false       // Yes/No - taken proficiency test
  },

  // Page 3: Passport
  passportInfo: {
    number: '',               // Required - Passport number
    countryOfIssue: '',       // Required - Country or territory of issue
    issueDate: '',            // Required - YYYY-MM-DD
    expiryDate: '',           // Required - YYYY-MM-DD
    taiwanPassport: false,    // Yes/No - Taiwan passport with PIN
    israeliPassport: false    // Yes/No - National Israeli passport
  },

  // Page 3: National Identity Document
  nationalIdInfo: {
    hasDocument: false,       // Yes/No
    documentNumber: '',       // Document number
    countryOfIssue: '',       // Country or territory of issue
    issueDate: '',            // YYYY-MM-DD
    expiryDate: ''            // YYYY-MM-DD
  },

  // Page 3: US PR Card
  usPRInfo: {
    isPermanentResident: false, // Yes/No
    uscisNumber: '',          // USCIS number
    expiryDate: ''            // YYYY-MM-DD
  },

  // Page 4: Contact Information
  contactInfo: {
    // Current Mailing Address
    mailingAddress: {
      poBox: '',              // P.O. box
      aptUnit: '',            // Apt/Unit
      streetNo: '',           // Street no.
      streetName: '',         // Required - Street name
      city: '',               // Required - City/Town
      country: '',            // Required - Country or Territory
      provinceState: '',      // Province/State
      postalCode: '',         // Postal code
      district: ''            // District
    },

    // Residential Address
    residentialSameAsMailing: true, // Yes/No
    residentialAddress: {
      aptUnit: '',
      streetNo: '',
      streetName: '',
      city: '',
      country: '',
      provinceState: '',
      postalCode: '',
      district: ''
    },

    // Telephone Numbers
    telephone: {
      type: '',               // Type (dropdown: Home, Cell, Business)
      isCanadaUS: true,       // Canada/US or Other
      countryCode: '',        // Country Code
      number: '',             // Required - No.
      ext: ''                 // Ext.
    },

    // Alternate Telephone
    alternateTelephone: {
      type: '',
      isCanadaUS: true,
      countryCode: '',
      number: '',
      ext: ''
    },

    // Fax
    fax: {
      isCanadaUS: true,
      countryCode: '',
      number: '',
      ext: ''
    },

    // Email
    email: ''                 // Required - E-mail address
  },

  // Page 5: Details of Intended Study in Canada
  studyDetails: {
    // Section 1: Educational Institution
    schoolName: '',           // Required - Name of School
    levelOfStudy: '',         // Required - Dropdown: Primary, Secondary, Post-secondary, etc.
    fieldOfStudy: '',         // Required - Dropdown or text

    schoolAddress: {
      province: '',           // Required - Province (dropdown)
      city: '',               // Required - City/Town
      address: ''             // Complete address
    },

    // Section 2: DLI & Student ID
    dliNumber: '',            // Required - Designated Learning Institution # (O#########)
    studentId: '',            // My Student ID #

    // Section 3: Duration
    duration: {
      from: '',               // Required - YYYY-MM-DD
      to: ''                  // Required - YYYY-MM-DD
    },

    // Section 4: Cost of Studies
    costs: {
      tuition: '',            // Tuition (CAD)
      roomAndBoard: '',       // Room and board (CAD)
      other: ''               // Other (CAD)
    },

    // Section 5: Funds Available
    fundsAvailable: '',       // Required - Funds available for stay (CAD)

    // Section 6: Expenses Paid By
    expensesPaidBy: '',       // Required - Dropdown: Self, Parents, Sponsor, etc.
    expensesPaidByOther: '',  // Other (text if applicable)

    // Section 7: Provincial Attestation Letter (PAL/TAL)
    pal: {
      documentNumber: '',
      expiryDate: ''          // YYYY-MM-DD
    },

    // Section 8: Quebec Acceptance Certificate (CAQ)
    caq: {
      certificateNumber: '',
      expiryDate: ''          // YYYY-MM-DD
    }
  },

  // Page 6: Education History
  educationHistory: {
    hasPostSecondary: false,  // Yes/No

    // Highest Level of Post-Secondary Education
    highestEducation: {
      from: '',               // YYYY-MM (From)
      to: '',                 // YYYY-MM (To)
      fieldAndLevel: '',      // Field and level of study
      schoolName: '',         // School/Facility name
      city: '',               // City/Town
      country: '',            // Country or Territory
      provinceState: ''       // Province/State
    }
  },

  // Page 7: Employment History (Past 10 Years)
  employmentHistory: [
    {
      from: '',               // YYYY-MM
      to: '',                 // YYYY-MM
      occupation: '',         // Current/Previous Activity/Occupation
      companyName: '',        // Company/Employer/Facility name
      city: '',               // City/Town
      country: '',            // Country or Territory
      provinceState: ''       // Province/State
    }
    // Can have multiple entries (minimum 3 rows shown on form)
  ],

  // Page 8: Background Information
  backgroundInfo: {
    // Section 1: Health
    health: {
      tuberculosis: false,    // Yes/No - TB or close contact
      physicalMentalDisorder: false, // Yes/No - disorder requiring services
      details: ''             // Details (if yes to 1a or 1b)
    },

    // Section 2: Immigration History
    immigration: {
      overstayed: false,      // Yes/No - overstayed, attended school or worked without authorization
      refusedVisa: false,     // Yes/No - refused visa or denied entry
      previousApplication: false, // Yes/No - previously applied to enter Canada
      details: ''             // Details (if yes to any)
    },

    // Section 3: Criminal History
    criminal: {
      hasRecord: false,       // Yes/No - committed, arrested, charged, or convicted
      details: ''             // Details (if yes)
    },

    // Section 4: Military Service
    military: {
      served: false,          // Yes/No - served in military, militia, civil defence, etc.
      details: ''             // Dates of service and countries (if yes)
    },

    // Section 5: Political Associations
    political: {
      memberOfParty: false    // Yes/No - member of political party or organization
    },

    // Section 6: War Crimes
    warCrimes: {
      witnessed: false        // Yes/No - witnessed or participated in ill treatment, looting, desecration
    }
  }
};

/**
 * Example of a complete filled form (for testing)
 */
export const COMPLETE_FORM_EXAMPLE = {
  uci: 'UCI123456',
  serviceLanguage: 'English',

  personalInfo: {
    familyName: 'Smith',
    givenNames: 'John Michael',
    hasOtherNames: false,
    otherNames: {
      familyName: '',
      givenNames: ''
    },
    sex: 'Male',
    dateOfBirth: '1995-03-15',
    placeOfBirth: {
      city: 'Mumbai',
      country: 'India'
    },
    citizenship: 'India',
    currentResidence: {
      country: 'India',
      status: 'Citizen',
      other: '',
      from: '1995-03-15',
      to: '2026-12-31'
    },
    previousResidences: [],
    applyingFrom: {
      sameAsCurrent: true,
      country: '',
      status: '',
      other: '',
      from: '',
      to: ''
    }
  },

  maritalInfo: {
    status: 'Single',
    dateOfMarriage: '',
    spouse: {
      familyName: '',
      givenNames: ''
    },
    previouslyMarried: false,
    previousSpouse: {
      familyName: '',
      givenNames: '',
      dateOfBirth: '',
      relationshipType: '',
      from: '',
      to: ''
    }
  },

  languageInfo: {
    nativeLanguage: 'Hindi',
    communicateInEnglishFrench: 'English',
    mostAtEase: 'English',
    languageTest: false
  },

  passportInfo: {
    number: 'K1234567',
    countryOfIssue: 'India',
    issueDate: '2020-01-10',
    expiryDate: '2030-01-09',
    taiwanPassport: false,
    israeliPassport: false
  },

  nationalIdInfo: {
    hasDocument: false,
    documentNumber: '',
    countryOfIssue: '',
    issueDate: '',
    expiryDate: ''
  },

  usPRInfo: {
    isPermanentResident: false,
    uscisNumber: '',
    expiryDate: ''
  },

  contactInfo: {
    mailingAddress: {
      poBox: '',
      aptUnit: '101',
      streetNo: '123',
      streetName: 'Main Street',
      city: 'Mumbai',
      country: 'India',
      provinceState: 'Maharashtra',
      postalCode: '400001',
      district: ''
    },
    residentialSameAsMailing: true,
    residentialAddress: {
      aptUnit: '',
      streetNo: '',
      streetName: '',
      city: '',
      country: '',
      provinceState: '',
      postalCode: '',
      district: ''
    },
    telephone: {
      type: 'Cell',
      isCanadaUS: false,
      countryCode: '91',
      number: '9876543210',
      ext: ''
    },
    alternateTelephone: {
      type: '',
      isCanadaUS: true,
      countryCode: '',
      number: '',
      ext: ''
    },
    fax: {
      isCanadaUS: true,
      countryCode: '',
      number: '',
      ext: ''
    },
    email: 'john.smith@email.com'
  },

  studyDetails: {
    schoolName: 'University of Toronto',
    levelOfStudy: 'Post-secondary - Masters',
    fieldOfStudy: 'Computer Science',
    schoolAddress: {
      province: 'Ontario',
      city: 'Toronto',
      address: '27 King\'s College Circle, Toronto, ON M5S 1A1'
    },
    dliNumber: 'O19391173552',
    studentId: 'ST2024001',
    duration: {
      from: '2026-09-01',
      to: '2028-08-31'
    },
    costs: {
      tuition: '35000',
      roomAndBoard: '15000',
      other: '5000'
    },
    fundsAvailable: '60000',
    expensesPaidBy: 'Parents',
    expensesPaidByOther: '',
    pal: {
      documentNumber: '',
      expiryDate: ''
    },
    caq: {
      certificateNumber: '',
      expiryDate: ''
    }
  },

  educationHistory: {
    hasPostSecondary: true,
    highestEducation: {
      from: '2014-08',
      to: '2018-05',
      fieldAndLevel: 'Bachelor of Science - Computer Science',
      schoolName: 'University of Mumbai',
      city: 'Mumbai',
      country: 'India',
      provinceState: 'Maharashtra'
    }
  },

  employmentHistory: [
    {
      from: '2018-07',
      to: '2024-06',
      occupation: 'Software Engineer',
      companyName: 'Tech Solutions India Pvt Ltd',
      city: 'Mumbai',
      country: 'India',
      provinceState: 'Maharashtra'
    }
  ],

  backgroundInfo: {
    health: {
      tuberculosis: false,
      physicalMentalDisorder: false,
      details: ''
    },
    immigration: {
      overstayed: false,
      refusedVisa: false,
      previousApplication: false,
      details: ''
    },
    criminal: {
      hasRecord: false,
      details: ''
    },
    military: {
      served: false,
      details: ''
    },
    political: {
      memberOfParty: false
    },
    warCrimes: {
      witnessed: false
    }
  }
};

export default {
  COMPLETE_FORM_STRUCTURE,
  COMPLETE_FORM_EXAMPLE
};
