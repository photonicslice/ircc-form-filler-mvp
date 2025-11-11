/**
 * PDF Field Mapper for Browser Automation
 * Helps you manually map form fields by opening the PDF and showing tab order
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, '../../templates/imm1294e.pdf');
const OUTPUT_PATH = path.join(__dirname, '../../templates/field-mapping-automation.json');

/**
 * Interactive field mapping tool
 */
async function mapFields() {
  console.log('\n🗺️  PDF Field Mapping Tool for Browser Automation\n');
  console.log('='.repeat(80));

  console.log(`
This tool will help you create a field mapping for browser automation.

How it works:
1. Opens the PDF in a browser
2. You press TAB to navigate through fields
3. Tool records the tab order
4. You note which field is which
5. Generates mapping file

Instructions:
- The browser will open with the PDF
- Press TAB to navigate between fields (they will highlight)
- In the console, type the field name when you see it highlighted
- Continue until all fields are mapped
- Press Ctrl+C when done

Alternative: You can also manually create the mapping file by:
1. Opening the PDF in Adobe Reader
2. Pressing TAB to see field order
3. Creating field-mapping-automation.json with tab indices
`);

  console.log('='.repeat(80));

  let browser;
  try {
    // Check if template exists
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(`PDF template not found at: ${TEMPLATE_PATH}`);
    }

    console.log('\n[1/3] Launching browser...');
    browser = await chromium.launch({
      headless: false,
      slowMo: 500
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('\n[2/3] Opening PDF...');
    await page.goto(`file://${TEMPLATE_PATH}`);
    await page.waitForTimeout(2000);

    console.log('\n[3/3] PDF opened! Now:');
    console.log('   1. Click on the PDF');
    console.log('   2. Press TAB repeatedly to navigate fields');
    console.log('   3. Note the tab order of each field');
    console.log('   4. Create mapping file based on what you see\n');

    // Auto-demonstrate TAB navigation
    console.log('Demonstrating TAB navigation (first 10 fields):\n');

    for (let i = 1; i <= 10; i++) {
      await page.keyboard.press('Tab');
      console.log(`   Tab ${i}: (Look at the highlighted field in the browser)`);
      await page.waitForTimeout(1500);
    }

    console.log('\nDemo complete! Continue pressing TAB to see all fields.');
    console.log('Keep browser open and create your mapping file.');
    console.log('\nGenerate mapping template? (y/n)');

    // Generate a template mapping file
    const template = generateMappingTemplate();
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(template, null, 2));

    console.log(`\n✅ Template mapping saved to: ${OUTPUT_PATH}`);
    console.log('\nEdit this file and set the correct tabIndex for each field.');
    console.log('The browser will stay open for you to reference.\n');

    // Keep browser open for manual inspection
    console.log('Press Ctrl+C when you\'re done mapping fields...');
    await new Promise(() => {}); // Keep alive

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
}

/**
 * Generate template mapping file
 */
function generateMappingTemplate() {
  return {
    _instructions: "Set the tabIndex for each field based on TAB navigation order in the PDF. TabIndex starts at 1.",
    _note: "You can also use coordinates: {x: 150, y: 200} if TAB order doesn't work well",

    firstName: {
      tabIndex: 1,
      description: "Given Name / First Name"
    },
    lastName: {
      tabIndex: 2,
      description: "Family Name / Last Name / Surname"
    },
    dateOfBirth: {
      tabIndex: 3,
      description: "Date of Birth (YYYY-MM-DD or MM/DD/YYYY)"
    },
    nationality: {
      tabIndex: 4,
      description: "Nationality / Citizenship"
    },
    countryOfResidence: {
      tabIndex: 5,
      description: "Country of Residence"
    },
    email: {
      tabIndex: 6,
      description: "Email Address"
    },
    phone: {
      tabIndex: 7,
      description: "Phone Number"
    },
    passportNumber: {
      tabIndex: 8,
      description: "Passport Number"
    },
    passportIssueDate: {
      tabIndex: 9,
      description: "Passport Issue Date"
    },
    passportExpiryDate: {
      tabIndex: 10,
      description: "Passport Expiry Date"
    },
    passportIssuingCountry: {
      tabIndex: 11,
      description: "Passport Issuing Country"
    },
    canadianInstitution: {
      tabIndex: 12,
      description: "Canadian Educational Institution"
    },
    dli: {
      tabIndex: 13,
      description: "DLI Number (Designated Learning Institution)"
    },
    programName: {
      tabIndex: 14,
      description: "Program Name"
    },
    programLevel: {
      tabIndex: 15,
      description: "Program Level (Certificate, Diploma, Bachelor's, etc.)"
    },
    programStartDate: {
      tabIndex: 16,
      description: "Program Start Date"
    },
    programDuration: {
      tabIndex: 17,
      description: "Program Duration (in months)"
    }
  };
}

// Run the mapper
mapFields();
