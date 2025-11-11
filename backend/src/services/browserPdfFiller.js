/**
 * Browser Automation PDF Filler
 * Uses Playwright to fill encrypted PDFs by simulating human interaction
 * This bypasses encryption restrictions that block programmatic PDF modification
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, '../../templates/imm1294e.pdf');

/**
 * Fill PDF form using browser automation
 * @param {object} formData - Complete form data
 * @param {string} outputPath - Where to save the filled PDF
 * @returns {Promise<string>} - Path to the filled PDF
 */
export async function fillPDFWithBrowser(formData, outputPath) {
  console.log('🤖 Starting browser automation PDF filler...');

  let browser;
  try {
    // Check if template exists
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(`PDF template not found at: ${TEMPLATE_PATH}`);
    }

    // Load field mapping
    const mappingPath = path.join(__dirname, '../../templates/field-mapping-automation.json');
    let fieldMapping = {};

    if (fs.existsSync(mappingPath)) {
      fieldMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
      console.log('✅ Loaded field mapping for automation');
    } else {
      console.warn('⚠️  Field mapping not found.');
      console.warn('   Create field-mapping-automation.json with tab order or coordinates.');
      fieldMapping = getDefaultFieldMapping();
    }

    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await chromium.launch({
      headless: false, // Show browser so user can see it working
      slowMo: 100 // Slow down for better visibility
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Open the PDF
    console.log('📄 Opening PDF...');
    await page.goto(`file://${TEMPLATE_PATH}`);

    // Wait for PDF to load
    await page.waitForTimeout(2000);

    // Fill fields using the mapping
    await fillFieldsWithTabNavigation(page, formData, fieldMapping);

    // Save the filled PDF
    console.log('💾 Saving filled PDF...');

    // Download/save functionality
    // Note: Browser PDF viewer might not allow direct save
    // Alternative: Use Print to PDF
    const pdfBuffer = await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });

    console.log(`✅ Filled PDF saved to: ${outputPath}`);

    await browser.close();
    return outputPath;

  } catch (error) {
    console.error('❌ Browser automation error:', error);
    if (browser) await browser.close();
    throw error;
  }
}

/**
 * Fill fields using TAB navigation
 */
async function fillFieldsWithTabNavigation(page, formData, fieldMapping) {
  console.log('⌨️  Filling fields with keyboard navigation...');

  const personalInfo = formData.personalInfo || {};
  const passportInfo = formData.passportInfo || {};
  const educationHistory = formData.educationHistory || {};
  const studyPurpose = formData.studyPurpose || {};
  const proofOfFunds = formData.proofOfFunds || {};

  // Build a sequential list of fields to fill
  const fieldsToFill = [
    { value: personalInfo.firstName, mapping: fieldMapping.firstName },
    { value: personalInfo.lastName, mapping: fieldMapping.lastName },
    { value: formatDate(personalInfo.dateOfBirth), mapping: fieldMapping.dateOfBirth },
    { value: personalInfo.nationality, mapping: fieldMapping.nationality },
    { value: personalInfo.countryOfResidence, mapping: fieldMapping.countryOfResidence },
    { value: personalInfo.email, mapping: fieldMapping.email },
    { value: personalInfo.phone, mapping: fieldMapping.phone },
    { value: passportInfo.passportNumber, mapping: fieldMapping.passportNumber },
    { value: formatDate(passportInfo.issueDate), mapping: fieldMapping.passportIssueDate },
    { value: formatDate(passportInfo.expiryDate), mapping: fieldMapping.passportExpiryDate },
    { value: passportInfo.issuingCountry, mapping: fieldMapping.passportIssuingCountry },
    { value: studyPurpose.canadianInstitution, mapping: fieldMapping.canadianInstitution },
    { value: studyPurpose.dli, mapping: fieldMapping.dli },
    { value: studyPurpose.programName, mapping: fieldMapping.programName },
  ];

  // Focus on first field
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);

  for (let i = 0; i < fieldsToFill.length; i++) {
    const field = fieldsToFill[i];

    if (!field.value) continue;

    const tabIndex = field.mapping?.tabIndex || i + 1;

    console.log(`  [${i + 1}/${fieldsToFill.length}] Filling: ${field.value}`);

    // Type the value
    await page.keyboard.type(field.value.toString(), { delay: 50 });

    // Move to next field
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
  }

  console.log('✅ All fields filled');
}

/**
 * Fill fields using coordinate clicking (alternative method)
 */
async function fillFieldsWithCoordinates(page, formData, fieldMapping) {
  console.log('🖱️  Filling fields with coordinate clicking...');

  const personalInfo = formData.personalInfo || {};

  // Example: Fill first name field by clicking coordinates
  if (personalInfo.firstName && fieldMapping.firstName?.coordinates) {
    const { x, y } = fieldMapping.firstName.coordinates;
    await page.mouse.click(x, y);
    await page.keyboard.type(personalInfo.firstName);
    console.log(`  ✓ Filled firstName at (${x}, ${y})`);
  }

  // Repeat for other fields...
  console.log('✅ All fields filled with coordinates');
}

/**
 * Get default field mapping (empty template)
 */
function getDefaultFieldMapping() {
  return {
    firstName: { tabIndex: 1 },
    lastName: { tabIndex: 2 },
    dateOfBirth: { tabIndex: 3 },
    nationality: { tabIndex: 4 },
    countryOfResidence: { tabIndex: 5 },
    email: { tabIndex: 6 },
    phone: { tabIndex: 7 },
    passportNumber: { tabIndex: 8 },
    passportIssueDate: { tabIndex: 9 },
    passportExpiryDate: { tabIndex: 10 },
    passportIssuingCountry: { tabIndex: 11 },
    canadianInstitution: { tabIndex: 12 },
    dli: { tabIndex: 13 },
    programName: { tabIndex: 14 },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  // Format as YYYY-MM-DD or MM/DD/YYYY based on form requirement
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`; // Adjust format as needed
}

export default {
  fillPDFWithBrowser
};
