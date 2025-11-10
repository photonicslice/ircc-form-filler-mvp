/**
 * PDF Template Test Script
 * Tests if the IMM 1294 template can be loaded, modified, and saved
 */

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, '../../templates/imm1294e.pdf');
const OUTPUT_PATH = path.join(__dirname, '../../templates/test-output.pdf');

async function testPdfTemplate() {
  console.log('\n🧪 Testing PDF Template...\n');
  console.log('='.repeat(80));

  try {
    // Step 1: Check if file exists
    console.log('\n[1/6] Checking if template exists...');
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(`Template not found at: ${TEMPLATE_PATH}`);
    }
    console.log('✅ Template file found');

    // Step 2: Load the PDF
    console.log('\n[2/6] Loading PDF template...');
    const pdfBytes = fs.readFileSync(TEMPLATE_PATH);
    console.log(`   File size: ${(pdfBytes.length / 1024).toFixed(2)} KB`);

    const pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
      updateMetadata: false,
      throwOnInvalidObject: false
    });
    console.log('✅ PDF loaded successfully');

    // Step 3: Get PDF info
    console.log('\n[3/6] Getting PDF information...');
    const pageCount = pdfDoc.getPageCount();
    console.log(`   Pages: ${pageCount}`);

    // Step 4: Check form
    console.log('\n[4/6] Checking form fields...');
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    console.log(`   Form fields: ${fields.length}`);

    if (fields.length > 0) {
      console.log('\n   First 10 fields:');
      fields.slice(0, 10).forEach((field, idx) => {
        const name = field.getName();
        const type = field.constructor.name;
        console.log(`   ${idx + 1}. ${name} (${type})`);
      });
    }

    // Step 5: Try to fill a test field
    console.log('\n[5/6] Testing field modification...');
    if (fields.length > 0) {
      const firstField = fields[0];
      const fieldName = firstField.getName();
      const fieldType = firstField.constructor.name;

      console.log(`   Attempting to modify: ${fieldName} (${fieldType})`);

      try {
        if (fieldType === 'PDFTextField') {
          const textField = form.getTextField(fieldName);
          textField.setText('TEST VALUE');
          console.log('   ✅ Successfully set text field value');
        } else if (fieldType === 'PDFCheckBox') {
          const checkbox = form.getCheckBox(fieldName);
          checkbox.check();
          console.log('   ✅ Successfully checked checkbox');
        } else {
          console.log(`   ⚠️  Skipping field type: ${fieldType}`);
        }
      } catch (err) {
        console.log(`   ⚠️  Could not modify field: ${err.message}`);
      }
    }

    // Step 6: Try to save
    console.log('\n[6/6] Testing PDF save...');
    const outputBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false
    });

    fs.writeFileSync(OUTPUT_PATH, outputBytes);
    console.log(`   ✅ PDF saved to: ${OUTPUT_PATH}`);
    console.log(`   Output size: ${(outputBytes.length / 1024).toFixed(2)} KB`);

    // Verify the output can be re-loaded
    console.log('\n   Verifying output PDF...');
    const testLoad = await PDFDocument.load(outputBytes);
    console.log(`   ✅ Output PDF is valid (${testLoad.getPageCount()} pages)`);

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ All tests passed!\n');
    console.log(`Please try opening: ${OUTPUT_PATH}`);
    console.log('If this file opens correctly, the PDF template is working.\n');

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
testPdfTemplate();
