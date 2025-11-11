/**
 * Test Desktop Automation PDF Filling
 * Tests OS-level automation with Adobe Acrobat/Reader
 */

import { fillPDFWithDesktopAutomation } from '../services/desktopPdfFiller.js';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

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

async function testDesktopAutomation() {
  console.log('\n🧪 Testing Desktop Automation PDF Filling...\n');
  console.log('='.repeat(80));

  const outputPath = path.join(__dirname, '../../templates/test-desktop-filled.pdf');

  try {
    console.log('\n⚠️  IMPORTANT NOTES:');
    console.log('   - Adobe Reader/Acrobat will open automatically');
    console.log('   - Do NOT touch mouse/keyboard during automation!');
    console.log('   - The script will control your computer');
    console.log('   - Make sure field-mapping-desktop.json is configured');
    console.log('   - Run "npm run map-adobe-fields" first if you haven\'t\n');

    console.log('Platform:', os.platform());
    console.log('Output will be saved to:', outputPath);

    console.log('\n⏳ Starting in 5 seconds...');
    console.log('    (Press Ctrl+C to cancel)\n');

    await sleep(5000);

    console.log('[1/2] Starting desktop automation...\n');

    await fillPDFWithDesktopAutomation(sampleFormData, outputPath);

    console.log('\n[2/2] Verification:');
    console.log(`   ✅ Output saved to: ${outputPath}`);
    console.log('   Open this file in Adobe to verify fields are filled correctly\n');

    console.log('='.repeat(80));
    console.log('\n✅ Desktop Automation Test Complete!\n');
    console.log('Next steps:');
    console.log('1. Open the filled PDF and check if fields are correct');
    console.log('2. If wrong, adjust coordinates in field-mapping-desktop.json');
    console.log('3. Or switch to TAB navigation (set useTabNavigation: true)');
    console.log('4. Run this test again until all fields fill correctly\n');

  } catch (error) {
    console.log('\n' + '='.repeat(80));
    console.error('\n❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Install nut.js: npm install');
    console.error('2. Install Adobe Acrobat Reader DC');
    console.error('3. Ensure PDF template exists at backend/templates/imm1294e.pdf');
    console.error('4. Create field mapping: npm run map-adobe-fields');
    console.error('5. Check that Adobe is set as default PDF viewer\n');

    if (error.stack) {
      console.error('Stack trace:');
      console.error(error.stack);
    }

    process.exit(1);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test
testDesktopAutomation();
