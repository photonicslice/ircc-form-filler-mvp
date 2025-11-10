/**
 * Document Checklist Generator Service
 * Generates required documents list based on applicant's form data
 */

/**
 * Generate complete document checklist based on form data
 * @param {object} formData - Complete form data
 * @returns {array} - Array of required documents
 */
export function generateChecklist(formData) {
  const documents = [];

  // ============================================================================
  // MANDATORY DOCUMENTS (Required for all applicants)
  // ============================================================================

  documents.push({
    id: 'application_form',
    title: 'IMM 1294 - Application for Study Permit',
    description: 'Completed and signed application form generated from this system',
    category: 'Application Forms',
    required: true,
    tips: [
      'Ensure all fields are filled accurately',
      'Sign and date the form',
      'Keep a copy for your records'
    ]
  });

  documents.push({
    id: 'letter_of_acceptance',
    title: 'Letter of Acceptance from DLI',
    description: `Original Letter of Acceptance from ${formData.studyPurpose?.canadianInstitution || 'your designated learning institution'}`,
    category: 'Education Documents',
    required: true,
    tips: [
      'Must be from a Designated Learning Institution (DLI)',
      'Must include program details, start date, and duration',
      'Should be signed by an authorized official'
    ]
  });

  documents.push({
    id: 'passport',
    title: 'Valid Passport',
    description: 'Copy of passport information page showing passport number, issue and expiry dates',
    category: 'Identity Documents',
    required: true,
    tips: [
      'Passport must be valid for duration of intended stay',
      'Include all pages with stamps or visas',
      'Ensure passport photo is clear and readable'
    ]
  });

  documents.push({
    id: 'passport_photo',
    title: 'Passport-sized Photographs',
    description: '2 recent passport-sized photos (35mm x 45mm) taken within last 6 months',
    category: 'Identity Documents',
    required: true,
    tips: [
      'White or light-colored background',
      'Face must be clearly visible',
      'No hats or sunglasses (unless for religious reasons)',
      'Write name and date of birth on the back'
    ]
  });

  // ============================================================================
  // PROOF OF FUNDS (Based on tuition and available funds)
  // ============================================================================

  const tuitionFees = parseFloat(formData.proofOfFunds?.annualTuitionFees || 0);
  const availableFunds = parseFloat(formData.proofOfFunds?.availableFunds || 0);
  const fundingSource = formData.proofOfFunds?.fundingSource;

  documents.push({
    id: 'proof_of_funds',
    title: 'Proof of Financial Support',
    description: `Evidence of CAD $${availableFunds.toLocaleString()} to cover tuition and living expenses`,
    category: 'Financial Documents',
    required: true,
    tips: [
      'Bank statements for past 4 months',
      'Proof of paid tuition fees (if applicable)',
      'Scholarship letters (if applicable)',
      'Must show sufficient funds for first year + CAD $10,000'
    ]
  });

  // Additional financial documents based on funding source
  if (fundingSource === 'family_support' || formData.proofOfFunds?.hasSponsor) {
    documents.push({
      id: 'sponsor_documents',
      title: 'Sponsor Documents',
      description: 'Financial documents from your sponsor',
      category: 'Financial Documents',
      required: true,
      tips: [
        'Sponsor\'s bank statements (4-6 months)',
        'Proof of relationship to sponsor',
        'Sponsor\'s employment letter or business proof',
        'Notarized affidavit of support'
      ]
    });
  }

  if (fundingSource === 'scholarship') {
    documents.push({
      id: 'scholarship_letter',
      title: 'Scholarship Award Letter',
      description: 'Official scholarship or financial aid award letter',
      category: 'Financial Documents',
      required: true,
      tips: [
        'Must be on official letterhead',
        'Include scholarship amount and duration',
        'Specify terms and conditions'
      ]
    });
  }

  if (fundingSource === 'loan') {
    documents.push({
      id: 'loan_documents',
      title: 'Education Loan Documentation',
      description: 'Proof of approved education loan',
      category: 'Financial Documents',
      required: true,
      tips: [
        'Loan approval letter from bank',
        'Loan amount and repayment terms',
        'Disbursement schedule'
      ]
    });
  }

  // ============================================================================
  // EDUCATION DOCUMENTS
  // ============================================================================

  documents.push({
    id: 'transcripts',
    title: 'Official Academic Transcripts',
    description: 'Transcripts from all post-secondary institutions attended',
    category: 'Education Documents',
    required: true,
    tips: [
      'Must be official/sealed transcripts',
      'Include all years of study',
      'Translate if not in English or French (with certified translation)'
    ]
  });

  const highestEducation = formData.educationHistory?.highestEducation;
  if (highestEducation === 'bachelors' || highestEducation === 'masters' || highestEducation === 'phd') {
    documents.push({
      id: 'degree_certificate',
      title: 'Degree Certificate',
      description: `Your ${getEducationLabel(highestEducation)} degree certificate`,
      category: 'Education Documents',
      required: true,
      tips: [
        'Original or certified copy',
        'Translate if not in English or French'
      ]
    });
  }

  // ============================================================================
  // LANGUAGE PROFICIENCY (If applicable)
  // ============================================================================

  const nationality = formData.personalInfo?.nationality?.toLowerCase();
  const isEnglishSpeakingCountry = ['canada', 'usa', 'united states', 'uk', 'united kingdom', 
                                     'australia', 'new zealand', 'ireland'].includes(nationality);
  
  if (!isEnglishSpeakingCountry) {
    documents.push({
      id: 'language_test',
      title: 'Language Test Results',
      description: 'IELTS, TOEFL, or other approved language test results',
      category: 'Language Documents',
      required: true,
      tips: [
        'Test must be taken within last 2 years',
        'Must meet minimum score requirements of your institution',
        'IELTS Academic or TOEFL iBT are most commonly accepted'
      ]
    });
  }

  // ============================================================================
  // ADDITIONAL REQUIREMENTS
  // ============================================================================

  documents.push({
    id: 'statement_of_purpose',
    title: 'Statement of Purpose / Study Plan',
    description: 'Explanation of why you want to study in Canada and your future plans',
    category: 'Supporting Documents',
    required: false,
    tips: [
      'Explain your study goals',
      'How this program fits your career plans',
      'Why you chose this institution',
      'Why you will return to your home country after studies'
    ]
  });

  documents.push({
    id: 'resume',
    title: 'Curriculum Vitae (CV)',
    description: 'Current resume or CV',
    category: 'Supporting Documents',
    required: false,
    tips: [
      'Include education history',
      'Work experience (if any)',
      'Skills and achievements',
      'Volunteer work or extracurricular activities'
    ]
  });

  // If applicant has work experience
  const hasWorkExperience = formData.educationHistory?.graduationYear && 
                           (new Date().getFullYear() - parseInt(formData.educationHistory.graduationYear) >= 2);
  
  if (hasWorkExperience) {
    documents.push({
      id: 'employment_letter',
      title: 'Employment Letters',
      description: 'Letters from current and previous employers',
      category: 'Supporting Documents',
      required: false,
      tips: [
        'On company letterhead',
        'Include job title, duties, and duration',
        'Signed by supervisor or HR'
      ]
    });
  }

  // Medical exam (always recommended)
  documents.push({
    id: 'medical_exam',
    title: 'Medical Examination',
    description: 'Upfront medical exam results from panel physician',
    category: 'Medical Documents',
    required: false,
    tips: [
      'Not always required but recommended for faster processing',
      'Must be done by IRCC-approved panel physician',
      'Valid for 12 months from date of exam',
      'Physician will upload results directly to IRCC'
    ]
  });

  // Police certificate (if applicable)
  const age = calculateAge(formData.personalInfo?.dateOfBirth);
  if (age >= 18) {
    documents.push({
      id: 'police_certificate',
      title: 'Police Certificate',
      description: 'Police clearance certificate from country of residence',
      category: 'Background Documents',
      required: false,
      tips: [
        'Required if you lived in a country for 6+ months since age 18',
        'Must be issued within last 6 months',
        'Translated if not in English or French'
      ]
    });
  }

  // Digital photo for online application
  documents.push({
    id: 'digital_photo',
    title: 'Digital Photo',
    description: 'Digital photo meeting IRCC specifications for online submission',
    category: 'Identity Documents',
    required: true,
    tips: [
      'File size: 240 KB or less',
      'Minimum dimensions: 420 x 540 pixels',
      'JPEG format',
      'Clear, recent photo (within 6 months)'
    ]
  });

  // ============================================================================
  // SORT AND RETURN
  // ============================================================================

  // Sort by required first, then by category
  documents.sort((a, b) => {
    if (a.required && !b.required) return -1;
    if (!a.required && b.required) return 1;
    return a.category.localeCompare(b.category);
  });

  return documents;
}

/**
 * Get summary statistics for checklist
 * @param {array} checklist - Generated checklist
 * @returns {object} - Summary statistics
 */
export function getChecklistSummary(checklist) {
  const required = checklist.filter(doc => doc.required);
  const optional = checklist.filter(doc => !doc.required);
  
  const categories = {};
  checklist.forEach(doc => {
    if (!categories[doc.category]) {
      categories[doc.category] = { required: 0, optional: 0, total: 0 };
    }
    categories[doc.category].total++;
    if (doc.required) {
      categories[doc.category].required++;
    } else {
      categories[doc.category].optional++;
    }
  });

  return {
    totalDocuments: checklist.length,
    requiredDocuments: required.length,
    optionalDocuments: optional.length,
    categories: Object.keys(categories).length,
    categoryBreakdown: categories
  };
}

/**
 * Helper function to calculate age from date of birth
 * @param {string} dateOfBirth - Date of birth (YYYY-MM-DD)
 * @returns {number} - Age in years
 */
function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Helper function to get education level label
 * @param {string} level - Education level code
 * @returns {string} - Human readable label
 */
function getEducationLabel(level) {
  const labels = {
    'high_school': 'High School',
    'diploma': 'Diploma',
    'bachelors': 'Bachelor\'s',
    'masters': 'Master\'s',
    'phd': 'PhD'
  };
  return labels[level] || level;
}

export default {
  generateChecklist,
  getChecklistSummary
};
