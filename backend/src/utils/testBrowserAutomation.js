/**
 * Test Browser Automation PDF Filling
 * Tests the browser automation approach with sample data
 */

import { fillPDFWithBrowser } from '../services/browserPdfFiller.js';
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

async function testBrowserAutomation() {
  console.log('\n🧪 Testing Browser Automation PDF Filling...\n');
  console.log('='.repeat(80));

  const outputPath = path.join(__dirname, '../../templates/test-browser-filled.pdf');

  try {
    console.log('\n⚠️  IMPORTANT NOTES:');
    console.log('   - Browser will open (not headless) so you can see it working');
    console.log('   - Make sure field-mapping-automation.json is configured');
    console.log('   - Run "npm run map-fields" first if you haven\'t mapped fields yet\n');

    console.log('[1/2] Starting browser automation...\n');

    await fillPDFWithBrowser(sampleFormData, outputPath);

    console.log('\n[2/2] Verification:');
    console.log(`   ✅ Output saved to: ${outputPath}`);
    console.log('   Open this file to verify the form is filled correctly\n');

    console.log('='.repeat(80));
    console.log('\n✅ Browser Automation Test Complete!\n');
    console.log('Next steps:');
    console.log('1. Open the filled PDF and check if fields are correct');
    console.log('2. If fields are wrong, adjust tabIndex in field-mapping-automation.json');
    console.log('3. Run this test again until all fields fill correctly');
    console.log('4. Once working, integrate with your API endpoint\n');

  } catch (error) {
    console.log('\n' + '='.repeat(80));
    console.error('\n❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure Playwright is installed: npm install');
    console.error('2. Install browser: npx playwright install chromium');
    console.error('3. Ensure PDF template exists at backend/templates/imm1294e.pdf');
    console.error('4. Create field mapping: npm run map-fields\n');

    if (error.stack) {
      console.error('Stack trace:');
      console.error(error.stack);
    }

    process.exit(1);
  }
}

// Run the test
testBrowserAutomation();
