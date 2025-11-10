/**
 * PDF Generation Service
 * Fills IMM 1294 Study Permit application PDF using pdf-lib
 */

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the PDF template
const TEMPLATE_PATH = path.join(__dirname, '../../templates/imm1294e.pdf');

/**
 * Generate Study Permit Application PDF by filling the IMM 1294 template
 * @param {object} formData - Complete form data
 * @returns {Promise<Uint8Array>} - Generated PDF bytes
 */
export async function generateStudyPermitPDF(formData) {
  try {
    // Check if template exists
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(
        `PDF template not found at ${TEMPLATE_PATH}. ` +
        'Please place the imm1294e.pdf file in backend/templates/ directory. ' +
        'See backend/templates/README.md for instructions.'
      );
    }

    // Load the PDF template (ignoreEncryption handles encrypted government forms)
    const templateBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(templateBytes, {
      ignoreEncryption: true,
      updateMetadata: false
    });

    // Get the form
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    console.log(`📄 Loaded PDF template with ${fields.length} form fields`);

    // Load field mapping
    const mappingPath = path.join(__dirname, '../../templates/field-mapping.json');
    let fieldMapping = {};

    if (fs.existsSync(mappingPath)) {
      const mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
      fieldMapping = mappingData.fieldMapping || {};
      console.log('✅ Loaded field mapping configuration');
    } else {
      console.warn('⚠️  Field mapping not found. Using default field names.');
      console.warn('   Run: node src/utils/extractFormFields.js to generate mapping.');
      // Use a default mapping strategy
      fieldMapping = generateDefaultMapping(formData);
    }

    // Fill the form fields
    fillFormFields(form, formData, fieldMapping);

    // Save the filled PDF with options optimized for encrypted forms
    console.log('💾 Saving filled PDF...');
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false
    });
    console.log('✅ PDF generated successfully');

    return pdfBytes;

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
}

/**
 * Fill form fields with data
 * @param {PDFForm} form - PDF form object
 * @param {object} formData - Form data from user
 * @param {object} fieldMapping - Mapping configuration
 */
function fillFormFields(form, formData, fieldMapping) {
  const personalInfo = formData.personalInfo || {};
  const passportInfo = formData.passportInfo || {};
  const educationHistory = formData.educationHistory || {};
  const studyPurpose = formData.studyPurpose || {};
  const proofOfFunds = formData.proofOfFunds || {};

  // Personal Information
  fillTextField(form, fieldMapping['personalInfo.firstName'], personalInfo.firstName);
  fillTextField(form, fieldMapping['personalInfo.lastName'], personalInfo.lastName);
  fillTextField(form, fieldMapping['personalInfo.dateOfBirth'], formatDate(personalInfo.dateOfBirth));
  fillTextField(form, fieldMapping['personalInfo.nationality'], personalInfo.nationality);
  fillTextField(form, fieldMapping['personalInfo.countryOfResidence'], personalInfo.countryOfResidence);
  fillTextField(form, fieldMapping['personalInfo.email'], personalInfo.email);
  fillTextField(form, fieldMapping['personalInfo.phone'], personalInfo.phone);

  // Try common variations for name fields if mapping is empty
  if (!fieldMapping['personalInfo.firstName']) {
    tryFillTextField(form, [
      'GivenName', 'FirstName', 'Given_Name', 'First_Name',
      'form1[0].#subform[0].GivenName[0]', 'form1[0].#subform[0].FirstName[0]'
    ], personalInfo.firstName);
  }

  if (!fieldMapping['personalInfo.lastName']) {
    tryFillTextField(form, [
      'FamilyName', 'LastName', 'Family_Name', 'Last_Name', 'Surname',
      'form1[0].#subform[0].FamilyName[0]', 'form1[0].#subform[0].LastName[0]'
    ], personalInfo.lastName);
  }

  // Passport Information
  fillTextField(form, fieldMapping['passportInfo.passportNumber'], passportInfo.passportNumber);
  fillTextField(form, fieldMapping['passportInfo.issueDate'], formatDate(passportInfo.issueDate));
  fillTextField(form, fieldMapping['passportInfo.expiryDate'], formatDate(passportInfo.expiryDate));
  fillTextField(form, fieldMapping['passportInfo.issuingCountry'], passportInfo.issuingCountry);

  // Try common variations for passport fields
  if (!fieldMapping['passportInfo.passportNumber']) {
    tryFillTextField(form, [
      'PassportNo', 'PassportNumber', 'Passport_No', 'Passport_Number',
      'form1[0].#subform[1].PassportNo[0]'
    ], passportInfo.passportNumber);
  }

  // Education History
  fillTextField(form, fieldMapping['educationHistory.highestEducation'], formatEducationLevel(educationHistory.highestEducation));
  fillTextField(form, fieldMapping['educationHistory.institutionName'], educationHistory.institutionName);
  fillTextField(form, fieldMapping['educationHistory.fieldOfStudy'], educationHistory.fieldOfStudy);
  fillTextField(form, fieldMapping['educationHistory.graduationYear'], educationHistory.graduationYear);

  // Study Purpose
  fillTextField(form, fieldMapping['studyPurpose.canadianInstitution'], studyPurpose.canadianInstitution);
  fillTextField(form, fieldMapping['studyPurpose.dli'], studyPurpose.dli);
  fillTextField(form, fieldMapping['studyPurpose.programName'], studyPurpose.programName);
  fillTextField(form, fieldMapping['studyPurpose.programLevel'], formatProgramLevel(studyPurpose.programLevel));
  fillTextField(form, fieldMapping['studyPurpose.programStartDate'], formatDate(studyPurpose.programStartDate));
  fillTextField(form, fieldMapping['studyPurpose.programDuration'], studyPurpose.programDuration);

  // Try common variations for DLI
  if (!fieldMapping['studyPurpose.dli']) {
    tryFillTextField(form, [
      'DLI', 'DLI_Number', 'DLINumber', 'DesignatedLearningInstitution',
      'form1[0].#subform[2].DLI[0]'
    ], studyPurpose.dli);
  }

  // Proof of Funds
  fillTextField(form, fieldMapping['proofOfFunds.annualTuitionFees'], formatCurrency(proofOfFunds.annualTuitionFees));
  fillTextField(form, fieldMapping['proofOfFunds.availableFunds'], formatCurrency(proofOfFunds.availableFunds));
  fillTextField(form, fieldMapping['proofOfFunds.fundingSource'], formatFundingSource(proofOfFunds.fundingSource));

  // Checkboxes for Yes/No questions
  if (studyPurpose.hasLetterOfAcceptance && fieldMapping['studyPurpose.hasLetterOfAcceptance']) {
    fillCheckbox(form, fieldMapping['studyPurpose.hasLetterOfAcceptance'], true);
  }

  if (proofOfFunds.hasSponsor) {
    fillCheckbox(form, fieldMapping['proofOfFunds.hasSponsor'], true);
    fillTextField(form, fieldMapping['proofOfFunds.sponsorRelationship'], proofOfFunds.sponsorRelationship);
  }

  console.log('✅ Form fields filled successfully');
}

/**
 * Safely fill a text field
 */
function fillTextField(form, fieldName, value) {
  if (!fieldName || !value) return;

  try {
    const field = form.getTextField(fieldName);
    field.setText(String(value));
    console.log(`  ✓ Filled: ${fieldName} = ${value}`);
  } catch (error) {
    console.warn(`  ⚠️  Could not fill field: ${fieldName} (${error.message})`);
  }
}

/**
 * Try multiple field names until one works
 */
function tryFillTextField(form, fieldNames, value) {
  if (!value) return;

  for (const fieldName of fieldNames) {
    try {
      const field = form.getTextField(fieldName);
      field.setText(String(value));
      console.log(`  ✓ Filled: ${fieldName} = ${value}`);
      return true;
    } catch (error) {
      // Try next field name
      continue;
    }
  }

  console.warn(`  ⚠️  Could not fill field with value: ${value}`);
  return false;
}

/**
 * Safely fill a checkbox
 */
function fillCheckbox(form, fieldName, checked) {
  if (!fieldName) return;

  try {
    const field = form.getCheckBox(fieldName);
    if (checked) {
      field.check();
    } else {
      field.uncheck();
    }
    console.log(`  ✓ Checked: ${fieldName} = ${checked}`);
  } catch (error) {
    console.warn(`  ⚠️  Could not check field: ${fieldName} (${error.message})`);
  }
}

/**
 * Generate a default field mapping based on common patterns
 */
function generateDefaultMapping(formData) {
  console.log('📝 Generating default field mapping...');
  // Return empty object - will use tryFillTextField for common patterns
  return {};
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date for display (YYYY-MM-DD)
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return as-is if invalid
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  if (!amount) return '';
  return parseFloat(amount).toFixed(2);
}

/**
 * Format education level
 */
function formatEducationLevel(level) {
  const levels = {
    'high_school': 'High School',
    'diploma': 'Diploma/Certificate',
    'bachelors': 'Bachelor\'s Degree',
    'masters': 'Master\'s Degree',
    'phd': 'Doctoral Degree (PhD)'
  };
  return levels[level] || level || '';
}

/**
 * Format program level
 */
function formatProgramLevel(level) {
  const levels = {
    'certificate': 'Certificate',
    'diploma': 'Diploma',
    'bachelors': 'Bachelor\'s Degree',
    'masters': 'Master\'s Degree',
    'phd': 'Doctoral Degree (PhD)',
    'postgraduate': 'Post-Graduate Certificate/Diploma'
  };
  return levels[level] || level || '';
}

/**
 * Format funding source
 */
function formatFundingSource(source) {
  const sources = {
    'personal_savings': 'Personal Savings',
    'family_support': 'Family Support',
    'scholarship': 'Scholarship/Grant',
    'loan': 'Education Loan',
    'sponsor': 'Sponsor',
    'other': 'Other'
  };
  return sources[source] || source || '';
}

export default {
  generateStudyPermitPDF
};
