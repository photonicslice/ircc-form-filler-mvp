/**
 * PDF Form Field Extractor
 * Utility to extract and analyze form fields from IMM 1294 PDF template
 */

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract all form fields from a PDF
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Array>} - Array of form field information
 */
export async function extractFormFields(pdfPath) {
  try {
    // Read the PDF file (ignoreEncryption handles encrypted government forms)
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    // Get the form
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    console.log(`\n📄 Found ${fields.length} form fields in the PDF\n`);
    console.log('=' .repeat(80));

    const fieldInfo = [];

    fields.forEach((field, index) => {
      const fieldName = field.getName();
      const fieldType = field.constructor.name;

      let fieldDetails = {
        index: index + 1,
        name: fieldName,
        type: fieldType,
        isReadOnly: false,
        isRequired: false
      };

      // Get additional details based on field type
      try {
        if (fieldType === 'PDFTextField') {
          fieldDetails.maxLength = field.getMaxLength() || 'unlimited';
          fieldDetails.isMultiline = field.isMultiline();
          fieldDetails.alignment = field.getAlignment();
        } else if (fieldType === 'PDFCheckBox') {
          fieldDetails.isChecked = field.isChecked();
        } else if (fieldType === 'PDFRadioGroup') {
          fieldDetails.options = field.getOptions();
          fieldDetails.selected = field.getSelected();
        } else if (fieldType === 'PDFDropdown') {
          fieldDetails.options = field.getOptions();
          fieldDetails.selected = field.getSelected();
        }
      } catch (err) {
        // Some fields might not support all methods
        fieldDetails.error = err.message;
      }

      fieldInfo.push(fieldDetails);

      // Print field information
      console.log(`\n[${index + 1}] ${fieldName}`);
      console.log(`    Type: ${fieldType}`);
      if (fieldDetails.maxLength) {
        console.log(`    Max Length: ${fieldDetails.maxLength}`);
      }
      if (fieldDetails.options) {
        console.log(`    Options: ${fieldDetails.options.join(', ')}`);
      }
      if (fieldDetails.isMultiline !== undefined) {
        console.log(`    Multiline: ${fieldDetails.isMultiline}`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ Extracted ${fields.length} fields successfully\n`);

    return fieldInfo;

  } catch (error) {
    console.error('Error extracting form fields:', error);
    throw error;
  }
}

/**
 * Save field information to a JSON file
 */
export async function saveFieldMapping(pdfPath, outputPath) {
  const fields = await extractFormFields(pdfPath);

  const mapping = {
    templateName: path.basename(pdfPath),
    extractedDate: new Date().toISOString(),
    totalFields: fields.length,
    fields: fields,
    // Template for mapping our form data to PDF fields
    fieldMapping: {
      // Personal Information
      'personalInfo.firstName': '',
      'personalInfo.lastName': '',
      'personalInfo.dateOfBirth': '',
      'personalInfo.nationality': '',
      'personalInfo.countryOfResidence': '',
      'personalInfo.email': '',
      'personalInfo.phone': '',

      // Passport Information
      'passportInfo.passportNumber': '',
      'passportInfo.issueDate': '',
      'passportInfo.expiryDate': '',
      'passportInfo.issuingCountry': '',

      // Education History
      'educationHistory.highestEducation': '',
      'educationHistory.institutionName': '',
      'educationHistory.fieldOfStudy': '',
      'educationHistory.graduationYear': '',

      // Study Purpose
      'studyPurpose.canadianInstitution': '',
      'studyPurpose.dli': '',
      'studyPurpose.programName': '',
      'studyPurpose.programLevel': '',
      'studyPurpose.programStartDate': '',
      'studyPurpose.programDuration': '',
      'studyPurpose.hasLetterOfAcceptance': '',

      // Proof of Funds
      'proofOfFunds.annualTuitionFees': '',
      'proofOfFunds.availableFunds': '',
      'proofOfFunds.fundingSource': '',
      'proofOfFunds.hasSponsor': '',
      'proofOfFunds.sponsorRelationship': ''
    }
  };

  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  console.log(`\n💾 Field mapping saved to: ${outputPath}\n`);

  return mapping;
}

// If run directly, extract fields from the template
if (import.meta.url === `file://${process.argv[1]}`) {
  const templatePath = path.join(__dirname, '../../templates/imm1294e.pdf');
  const outputPath = path.join(__dirname, '../../templates/field-mapping.json');

  console.log('\n🔍 Extracting form fields from IMM 1294 template...\n');
  console.log(`Template: ${templatePath}`);

  if (!fs.existsSync(templatePath)) {
    console.error(`\n❌ Error: Template file not found at ${templatePath}`);
    console.error('Please ensure the PDF template is placed in backend/templates/imm1294e.pdf\n');
    process.exit(1);
  }

  saveFieldMapping(templatePath, outputPath)
    .then(() => {
      console.log('✅ Done! Check field-mapping.json to map your form fields.\n');
    })
    .catch(err => {
      console.error('\n❌ Error:', err.message);
      process.exit(1);
    });
}

export default {
  extractFormFields,
  saveFieldMapping
};
