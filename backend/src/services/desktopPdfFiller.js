/**
 * OS-Level Automation PDF Filler
 * Uses nut.js to control Adobe Acrobat/Reader at the OS level
 * This works with the actual desktop application, not browser
 */

import { mouse, keyboard, Key, screen, Button } from '@nut-tree/nut-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, '../../templates/imm1294e.pdf');

// Platform-specific Adobe paths
const ADOBE_PATHS = {
  win32: [
    'C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe',
    'C:\\Program Files (x86)\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe',
    'C:\\Program Files\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe'
  ],
  darwin: [
    '/Applications/Adobe Acrobat DC/Adobe Acrobat.app/Contents/MacOS/Adobe Acrobat',
    '/Applications/Adobe Acrobat Reader DC.app/Contents/MacOS/AdobeReader'
  ],
  linux: [
    '/usr/bin/acroread',
    '/opt/Adobe/Reader9/bin/acroread'
  ]
};

/**
 * Fill PDF using OS-level automation
 * @param {object} formData - Complete form data
 * @param {string} outputPath - Where to save the filled PDF
 * @returns {Promise<string>} - Path to the filled PDF
 */
export async function fillPDFWithDesktopAutomation(formData, outputPath) {
  console.log('🖥️  Starting OS-level automation PDF filler...');

  try {
    // Check if template exists
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(`PDF template not found at: ${TEMPLATE_PATH}`);
    }

    // Load field mapping
    const mappingPath = path.join(__dirname, '../../templates/field-mapping-desktop.json');
    let fieldMapping = {};

    if (fs.existsSync(mappingPath)) {
      fieldMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
      console.log('✅ Loaded field mapping for desktop automation');
    } else {
      console.warn('⚠️  Field mapping not found.');
      console.warn('   Create field-mapping-desktop.json with coordinates or tab order.');
      fieldMapping = getDefaultFieldMapping();
    }

    // Copy template to working location
    const workingPath = path.join(os.tmpdir(), 'imm1294e-working.pdf');
    fs.copyFileSync(TEMPLATE_PATH, workingPath);
    console.log(`📄 Copied template to: ${workingPath}`);

    // Open Adobe with the PDF
    await openPDFInAdobe(workingPath);

    // Wait for Adobe to fully load
    console.log('⏳ Waiting for Adobe to open...');
    await sleep(5000); // Adjust based on your system speed

    // Configure nut.js settings
    mouse.config.mouseSpeed = 500; // Slower mouse movement for better accuracy
    keyboard.config.autoDelayMs = 50; // Delay between keystrokes

    // Fill fields
    await fillFieldsWithDesktopAutomation(formData, fieldMapping);

    // Save the file
    console.log('💾 Saving file...');
    await keyboard.type(Key.LeftControl, Key.S); // Ctrl+S
    await sleep(1000);

    // Handle save dialog if it appears
    await keyboard.type(Key.Enter); // Confirm save
    await sleep(2000);

    // Close Adobe
    await keyboard.type(Key.LeftAlt, Key.F4); // Alt+F4
    await sleep(1000);

    // Copy saved file to output
    if (fs.existsSync(workingPath)) {
      fs.copyFileSync(workingPath, outputPath);
      console.log(`✅ Filled PDF saved to: ${outputPath}`);
    }

    return outputPath;

  } catch (error) {
    console.error('❌ Desktop automation error:', error);
    throw error;
  }
}

/**
 * Open PDF in Adobe Acrobat/Reader
 */
async function openPDFInAdobe(pdfPath) {
  const platform = os.platform();
  const adobePaths = ADOBE_PATHS[platform] || [];

  // Find installed Adobe application
  let adobePath = null;
  for (const path of adobePaths) {
    if (fs.existsSync(path)) {
      adobePath = path;
      break;
    }
  }

  if (!adobePath) {
    throw new Error(
      'Adobe Acrobat/Reader not found. Please install Adobe Acrobat Reader DC.\\n' +
      'Download from: https://get.adobe.com/reader/'
    );
  }

  console.log(`🚀 Opening PDF with: ${adobePath}`);

  // Platform-specific command
  if (platform === 'win32') {
    await execAsync(`"${adobePath}" "${pdfPath}"`);
  } else if (platform === 'darwin') {
    await execAsync(`open -a "${adobePath}" "${pdfPath}"`);
  } else {
    await execAsync(`"${adobePath}" "${pdfPath}" &`);
  }
}

/**
 * Fill fields using desktop automation
 */
async function fillFieldsWithDesktopAutomation(formData, fieldMapping) {
  console.log('⌨️  Filling fields with desktop automation...');

  const personalInfo = formData.personalInfo || {};
  const passportInfo = formData.passportInfo || {};
  const educationHistory = formData.educationHistory || {};
  const studyPurpose = formData.studyPurpose || {};
  const proofOfFunds = formData.proofOfFunds || {};

  // Build list of fields to fill
  const fieldsToFill = [
    { value: personalInfo.firstName, fieldName: 'firstName' },
    { value: personalInfo.lastName, fieldName: 'lastName' },
    { value: formatDate(personalInfo.dateOfBirth), fieldName: 'dateOfBirth' },
    { value: personalInfo.nationality, fieldName: 'nationality' },
    { value: personalInfo.countryOfResidence, fieldName: 'countryOfResidence' },
    { value: personalInfo.email, fieldName: 'email' },
    { value: personalInfo.phone, fieldName: 'phone' },
    { value: passportInfo.passportNumber, fieldName: 'passportNumber' },
    { value: formatDate(passportInfo.issueDate), fieldName: 'passportIssueDate' },
    { value: formatDate(passportInfo.expiryDate), fieldName: 'passportExpiryDate' },
    { value: passportInfo.issuingCountry, fieldName: 'passportIssuingCountry' },
    { value: studyPurpose.canadianInstitution, fieldName: 'canadianInstitution' },
    { value: studyPurpose.dli, fieldName: 'dli' },
    { value: studyPurpose.programName, fieldName: 'programName' },
  ];

  // Method 1: Fill using TAB navigation
  if (fieldMapping.useTabNavigation) {
    console.log('   Using TAB navigation method...');
    await fillWithTabNavigation(fieldsToFill, fieldMapping);
  }
  // Method 2: Fill using coordinates
  else {
    console.log('   Using coordinate clicking method...');
    await fillWithCoordinates(fieldsToFill, fieldMapping);
  }

  console.log('✅ All fields filled');
}

/**
 * Fill fields using TAB navigation
 */
async function fillWithTabNavigation(fieldsToFill, fieldMapping) {
  // Click on PDF to focus
  await mouse.click(Button.LEFT);
  await sleep(500);

  // Navigate to first field
  await keyboard.type(Key.Tab);
  await sleep(300);

  for (let i = 0; i < fieldsToFill.length; i++) {
    const field = fieldsToFill[i];

    if (!field.value) {
      await keyboard.type(Key.Tab);
      await sleep(300);
      continue;
    }

    console.log(`  [${i + 1}/${fieldsToFill.length}] Filling: ${field.fieldName} = ${field.value}`);

    // Type the value
    await keyboard.type(field.value.toString());
    await sleep(200);

    // Move to next field
    await keyboard.type(Key.Tab);
    await sleep(300);
  }
}

/**
 * Fill fields using coordinate clicking
 */
async function fillWithCoordinates(fieldsToFill, fieldMapping) {
  for (const field of fieldsToFill) {
    if (!field.value) continue;

    const mapping = fieldMapping[field.fieldName];
    if (!mapping || !mapping.coordinates) {
      console.warn(`  ⚠️  No coordinates for: ${field.fieldName}`);
      continue;
    }

    const { x, y } = mapping.coordinates;

    console.log(`  Filling ${field.fieldName} at (${x}, ${y}): ${field.value}`);

    // Move mouse to field
    await mouse.setPosition({ x, y });
    await sleep(200);

    // Click to focus
    await mouse.click(Button.LEFT);
    await sleep(200);

    // Clear existing value
    await keyboard.type(Key.LeftControl, Key.A);
    await sleep(100);

    // Type new value
    await keyboard.type(field.value.toString());
    await sleep(300);
  }
}

/**
 * Get default field mapping
 */
function getDefaultFieldMapping() {
  return {
    useTabNavigation: true,
    firstName: { tabIndex: 1 },
    lastName: { tabIndex: 2 },
    dateOfBirth: { tabIndex: 3 },
    // ... more fields
  };
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format date helper
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default {
  fillPDFWithDesktopAutomation
};
