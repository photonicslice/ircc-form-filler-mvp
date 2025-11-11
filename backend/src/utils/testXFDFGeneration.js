/**
 * Test XFDF Generation
 * Generates a sample XFDF file to test the import process
 */

import { generateXFDF } from '../services/xfdfGenerator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample form data for testing
const sampleFormData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1995-05-15',
    nationality: 'Canadian',
    countryOfResidence: 'Canada',
    email: 'john.doe@example.com',
    phone: '+1-555-0123'
  },
  passportInfo: {
    passportNumber: 'AB123456',
    issueDate: '2020-01-15',
    expiryDate: '2030-01-14',
    issuingCountry: 'Canada'
  },
  educationHistory: {
    highestEducation: 'bachelors',
    institutionName: 'University of Toronto',
    fieldOfStudy: 'Computer Science',
    graduationYear: '2018'
  },
  studyPurpose: {
    canadianInstitution: 'McGill University',
    dli: 'O19391131572',
    programName: 'Master of Computer Science',
    programLevel: 'masters',
    programStartDate: '2025-09-01',
    programDuration: '24',
    hasLetterOfAcceptance: true
  },
  proofOfFunds: {
    annualTuitionFees: '25000',
    availableFunds: '50000',
    fundingSource: 'personal_savings',
    hasSponsor: false
  }
};

async function testXFDFGeneration() {
  console.log('\n🧪 Testing XFDF Generation...\n');
  console.log('='.repeat(80));

  try {
    // Generate XFDF
    console.log('\n[1/3] Generating XFDF from sample data...');
    const xfdfContent = generateXFDF(sampleFormData);

    console.log(`   ✅ Generated ${xfdfContent.length} bytes of XFDF data`);

    // Save to file
    console.log('\n[2/3] Saving XFDF file...');
    const outputPath = path.join(__dirname, '../../templates/test-sample.xfdf');
    fs.writeFileSync(outputPath, xfdfContent, 'utf8');

    console.log(`   ✅ Saved to: ${outputPath}`);

    // Display preview
    console.log('\n[3/3] XFDF Content Preview:');
    console.log('-'.repeat(80));
    const lines = xfdfContent.split('\n');
    const previewLines = lines.slice(0, 25);
    previewLines.forEach(line => console.log('   ' + line));
    if (lines.length > 25) {
      console.log(`   ... (${lines.length - 25} more lines)`);
    }
    console.log('-'.repeat(80));

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ XFDF Generation Test Passed!\n');
    console.log('Next steps:');
    console.log('1. Open the IMM 1294 PDF in Adobe Acrobat Reader');
    console.log('2. Go to: File → Import → Form Data');
    console.log('3. Select the generated XFDF file:');
    console.log(`   ${outputPath}`);
    console.log('4. The form should auto-fill with the sample data');
    console.log('\nIf fields are blank, you need to update the field mapping.');
    console.log('Run: npm run extract-fields\n');

  } catch (error) {
    console.log('\n' + '='.repeat(80));
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    console.log('');
    process.exit(1);
  }
}

// Run the test
testXFDFGeneration();
