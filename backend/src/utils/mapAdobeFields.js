/**
 * Adobe Field Coordinate Mapper
 * Helps you map form field coordinates in Adobe Reader
 */

import robot from 'robotjs';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, '../../templates/imm1294e.pdf');
const OUTPUT_PATH = path.join(__dirname, '../../templates/field-mapping-desktop.json');

/**
 * Interactive coordinate mapping tool
 */
async function mapAdobeFields() {
  console.log('\n🗺️  Adobe PDF Field Coordinate Mapper\n');
  console.log('='.repeat(80));

  console.log(`
This tool helps you map field coordinates in Adobe Reader/Acrobat.

How it works:
1. Opens your PDF in Adobe
2. You click on each field
3. Press ENTER to capture coordinates
4. Tool saves coordinates to mapping file

Instructions:
- Adobe will open with the PDF
- Click on the FIRST field (e.g., First Name)
- Press ENTER in this terminal to capture
- Repeat for each field
- Type 'done' when finished

TIP: Make sure Adobe window stays in the same position
  `);

  console.log('='.repeat(80));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    // Open PDF in Adobe
    console.log('\n[1/3] Opening PDF in Adobe...\n');

    // Find and launch Adobe
    const adobeCommand = getAdobeCommand();
    exec(`${adobeCommand} "${TEMPLATE_PATH}"`);

    await sleep(5000);

    console.log('\n[2/3] Adobe should be open now!\n');
    console.log('Field list (in order):');
    console.log('  1. firstName - Given Name');
    console.log('  2. lastName - Family Name');
    console.log('  3. dateOfBirth - Date of Birth');
    console.log('  4. nationality - Nationality');
    console.log('  5. countryOfResidence - Country of Residence');
    console.log('  6. email - Email Address');
    console.log('  7. phone - Phone Number');
    console.log('  8. passportNumber - Passport Number');
    console.log('  9. passportIssueDate - Passport Issue Date');
    console.log(' 10. passportExpiryDate - Passport Expiry Date');
    console.log(' 11. passportIssuingCountry - Passport Issuing Country');
    console.log(' 12. canadianInstitution - Canadian Institution');
    console.log(' 13. dli - DLI Number');
    console.log(' 14. programName - Program Name\n');

    const fieldNames = [
      'firstName', 'lastName', 'dateOfBirth', 'nationality',
      'countryOfResidence', 'email', 'phone', 'passportNumber',
      'passportIssueDate', 'passportExpiryDate', 'passportIssuingCountry',
      'canadianInstitution', 'dli', 'programName'
    ];

    const mapping = {
      _instructions: 'Coordinates captured using mapAdobeFields.js',
      _note: 'Set useTabNavigation to false to use coordinates, true to use TAB',
      useTabNavigation: false,
      _fields: {}
    };

    console.log('[3/3] Capturing field coordinates...\n');
    console.log('For each field:');
    console.log('  1. Click on the field in Adobe');
    console.log('  2. Press ENTER in this terminal');
    console.log('  3. Coordinates will be captured\n');

    for (let i = 0; i < fieldNames.length; i++) {
      const fieldName = fieldNames[i];

      await new Promise((resolve) => {
        rl.question(`Click on field "${fieldName}" then press ENTER: `, async () => {
          await sleep(300); // Give user time to move mouse away

          const mousePos = robot.getMousePos();
          mapping[fieldName] = {
            coordinates: { x: mousePos.x, y: mousePos.y },
            description: `Auto-captured at (${mousePos.x}, ${mousePos.y})`
          };

          console.log(`  ✅ Captured ${fieldName}: (${mousePos.x}, ${mousePos.y})\n`);
          resolve();
        });
      });
    }

    // Save mapping
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mapping, null, 2));

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Field mapping complete!\n');
    console.log(`Saved to: ${OUTPUT_PATH}\n`);
    console.log('Next steps:');
    console.log('1. Review the mapping file');
    console.log('2. Test with: npm run test-desktop-automation');
    console.log('3. Adjust coordinates if needed\n');

    rl.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

/**
 * Get platform-specific Adobe command
 */
function getAdobeCommand() {
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows
    const paths = [
      'C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe',
      'C:\\Program Files (x86)\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe',
      'C:\\Program Files\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe'
    ];

    for (const p of paths) {
      if (fs.existsSync(p)) return `"${p}"`;
    }

    throw new Error('Adobe not found. Install Adobe Acrobat Reader DC.');

  } else if (platform === 'darwin') {
    // macOS
    return 'open -a "Adobe Acrobat Reader DC"';

  } else {
    // Linux
    return 'acroread';
  }
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the mapper
mapAdobeFields();
