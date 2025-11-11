/**
 * XFDF Generator Service
 * Generates XFDF (XML Forms Data Format) files for IMM 1294 form
 * Users can import these into the official PDF to auto-fill fields
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate XFDF file for IMM 1294 Study Permit Application
 * @param {object} formData - Complete form data
 * @param {string} pdfFileName - Original PDF file name (default: imm1294e.pdf)
 * @returns {string} - XFDF XML content
 */
export function generateXFDF(formData, pdfFileName = 'imm1294e.pdf') {
  console.log('📝 Generating XFDF data file...');

  // Load field mapping
  const mappingPath = path.join(__dirname, '../../templates/field-mapping.json');
  let fieldMapping = {};

  if (fs.existsSync(mappingPath)) {
    const mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
    fieldMapping = mappingData.fieldMapping || {};
    console.log('✅ Loaded field mapping configuration');
  } else {
    console.warn('⚠️  Field mapping not found. Using default field names.');
    console.warn('   Run: npm run extract-fields to generate mapping.');
    fieldMapping = getDefaultFieldMapping();
  }

  // Build field values
  const fields = buildFieldValues(formData, fieldMapping);

  // Generate XFDF XML
  const xfdfContent = buildXFDFXML(fields, pdfFileName);

  console.log(`✅ Generated XFDF with ${fields.length} field values`);

  return xfdfContent;
}

/**
 * Build field values array from form data
 */
function buildFieldValues(formData, fieldMapping) {
  const fields = [];

  const personalInfo = formData.personalInfo || {};
  const passportInfo = formData.passportInfo || {};
  const educationHistory = formData.educationHistory || {};
  const studyPurpose = formData.studyPurpose || {};
  const proofOfFunds = formData.proofOfFunds || {};

  // Personal Information
  addField(fields, fieldMapping['personalInfo.firstName'], personalInfo.firstName);
  addField(fields, fieldMapping['personalInfo.lastName'], personalInfo.lastName);
  addField(fields, fieldMapping['personalInfo.dateOfBirth'], formatDate(personalInfo.dateOfBirth));
  addField(fields, fieldMapping['personalInfo.nationality'], personalInfo.nationality);
  addField(fields, fieldMapping['personalInfo.countryOfResidence'], personalInfo.countryOfResidence);
  addField(fields, fieldMapping['personalInfo.email'], personalInfo.email);
  addField(fields, fieldMapping['personalInfo.phone'], personalInfo.phone);

  // Passport Information
  addField(fields, fieldMapping['passportInfo.passportNumber'], passportInfo.passportNumber);
  addField(fields, fieldMapping['passportInfo.issueDate'], formatDate(passportInfo.issueDate));
  addField(fields, fieldMapping['passportInfo.expiryDate'], formatDate(passportInfo.expiryDate));
  addField(fields, fieldMapping['passportInfo.issuingCountry'], passportInfo.issuingCountry);

  // Education History
  addField(fields, fieldMapping['educationHistory.highestEducation'], formatEducationLevel(educationHistory.highestEducation));
  addField(fields, fieldMapping['educationHistory.institutionName'], educationHistory.institutionName);
  addField(fields, fieldMapping['educationHistory.fieldOfStudy'], educationHistory.fieldOfStudy);
  addField(fields, fieldMapping['educationHistory.graduationYear'], educationHistory.graduationYear);

  // Study Purpose
  addField(fields, fieldMapping['studyPurpose.canadianInstitution'], studyPurpose.canadianInstitution);
  addField(fields, fieldMapping['studyPurpose.dli'], studyPurpose.dli);
  addField(fields, fieldMapping['studyPurpose.programName'], studyPurpose.programName);
  addField(fields, fieldMapping['studyPurpose.programLevel'], formatProgramLevel(studyPurpose.programLevel));
  addField(fields, fieldMapping['studyPurpose.programStartDate'], formatDate(studyPurpose.programStartDate));
  addField(fields, fieldMapping['studyPurpose.programDuration'], studyPurpose.programDuration);

  // Proof of Funds
  addField(fields, fieldMapping['proofOfFunds.annualTuitionFees'], formatCurrency(proofOfFunds.annualTuitionFees));
  addField(fields, fieldMapping['proofOfFunds.availableFunds'], formatCurrency(proofOfFunds.availableFunds));
  addField(fields, fieldMapping['proofOfFunds.fundingSource'], formatFundingSource(proofOfFunds.fundingSource));

  // Checkboxes
  if (studyPurpose.hasLetterOfAcceptance && fieldMapping['studyPurpose.hasLetterOfAcceptance']) {
    addField(fields, fieldMapping['studyPurpose.hasLetterOfAcceptance'], 'Yes');
  }

  if (proofOfFunds.hasSponsor) {
    addField(fields, fieldMapping['proofOfFunds.hasSponsor'], 'Yes');
    addField(fields, fieldMapping['proofOfFunds.sponsorRelationship'], proofOfFunds.sponsorRelationship);
  }

  return fields;
}

/**
 * Add a field to the fields array if value exists
 */
function addField(fields, fieldName, value) {
  if (fieldName && value !== undefined && value !== null && value !== '') {
    fields.push({
      name: fieldName,
      value: String(value)
    });
  }
}

/**
 * Build XFDF XML content
 */
function buildXFDFXML(fields, pdfFileName) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const xfdfOpen = '<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">';
  const fieldsOpen = '  <fields>';

  // Build field entries
  const fieldEntries = fields.map(field => {
    const escapedName = escapeXML(field.name);
    const escapedValue = escapeXML(field.value);
    return `    <field name="${escapedName}">\n      <value>${escapedValue}</value>\n    </field>`;
  }).join('\n');

  const fieldsClose = '  </fields>';
  const pdfReference = `  <f href="${escapeXML(pdfFileName)}"/>`;
  const xfdfClose = '</xfdf>';

  return [
    xmlHeader,
    xfdfOpen,
    fieldsOpen,
    fieldEntries,
    fieldsClose,
    pdfReference,
    xfdfClose
  ].join('\n');
}

/**
 * Escape XML special characters
 */
function escapeXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Get default field mapping (common IMM 1294 field names)
 */
function getDefaultFieldMapping() {
  // These are placeholder field names
  // Run npm run extract-fields to get actual field names from your PDF
  return {
    'personalInfo.firstName': 'form1[0].Page1[0].GivenName[0]',
    'personalInfo.lastName': 'form1[0].Page1[0].FamilyName[0]',
    'personalInfo.dateOfBirth': 'form1[0].Page1[0].DOB[0]',
    'personalInfo.nationality': 'form1[0].Page1[0].Nationality[0]',
    'personalInfo.countryOfResidence': 'form1[0].Page1[0].CountryOfResidence[0]',
    'personalInfo.email': 'form1[0].Page1[0].Email[0]',
    'personalInfo.phone': 'form1[0].Page1[0].Phone[0]',
    'passportInfo.passportNumber': 'form1[0].Page1[0].PassportNo[0]',
    'passportInfo.issueDate': 'form1[0].Page1[0].PassportIssueDate[0]',
    'passportInfo.expiryDate': 'form1[0].Page1[0].PassportExpiryDate[0]',
    'passportInfo.issuingCountry': 'form1[0].Page1[0].PassportIssuingCountry[0]',
    'studyPurpose.canadianInstitution': 'form1[0].Page2[0].CanadianInstitution[0]',
    'studyPurpose.dli': 'form1[0].Page2[0].DLI[0]',
    'studyPurpose.programName': 'form1[0].Page2[0].ProgramName[0]',
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function formatCurrency(amount) {
  if (!amount) return '';
  return parseFloat(amount).toFixed(2);
}

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
  generateXFDF
};
