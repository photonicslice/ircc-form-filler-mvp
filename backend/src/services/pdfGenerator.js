/**
 * PDF Generation Service
 * Generates filled Study Permit application PDF using pdf-lib
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Generate Study Permit Application PDF
 * @param {object} formData - Complete form data
 * @returns {Promise<Uint8Array>} - Generated PDF bytes
 */
export async function generateStudyPermitPDF(formData) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Embed standard fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Define page size and margins
  const pageWidth = 612; // 8.5 inches * 72 points
  const pageHeight = 792; // 11 inches * 72 points
  const margin = 50;
  const lineHeight = 18;
  
  // ============================================================================
  // PAGE 1: PERSONAL INFORMATION
  // ============================================================================
  
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;
  
  // Header
  page.drawText('APPLICATION FOR STUDY PERMIT', {
    x: margin,
    y: yPosition,
    size: 20,
    font: fontBold,
    color: rgb(0, 0, 0.5)
  });
  yPosition -= 30;
  
  page.drawText('IMM 1294', {
    x: margin,
    y: yPosition,
    size: 12,
    font: font,
    color: rgb(0.5, 0.5, 0.5)
  });
  yPosition -= 40;
  
  // Section 1: Personal Information
  yPosition = drawSection(page, font, fontBold, 'SECTION 1: PERSONAL INFORMATION', yPosition, margin, lineHeight);
  
  const personalInfo = formData.personalInfo || {};
  yPosition = drawField(page, font, fontBold, 'Full Name:', 
    `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`, 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Date of Birth:', 
    formatDate(personalInfo.dateOfBirth), 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Nationality:', 
    personalInfo.nationality || '', 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Country of Residence:', 
    personalInfo.countryOfResidence || '', 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Email:', 
    personalInfo.email || '', 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Phone:', 
    personalInfo.phone || '', 
    yPosition, margin, lineHeight);
  
  yPosition -= 20;
  
  // Section 2: Passport Information
  yPosition = drawSection(page, font, fontBold, 'SECTION 2: PASSPORT INFORMATION', yPosition, margin, lineHeight);
  
  const passportInfo = formData.passportInfo || {};
  yPosition = drawField(page, font, fontBold, 'Passport Number:', 
    passportInfo.passportNumber || '', 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Issue Date:', 
    formatDate(passportInfo.issueDate), 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Expiry Date:', 
    formatDate(passportInfo.expiryDate), 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Issuing Country:', 
    passportInfo.issuingCountry || '', 
    yPosition, margin, lineHeight);
  
  yPosition -= 20;
  
  // Section 3: Education History
  yPosition = drawSection(page, font, fontBold, 'SECTION 3: EDUCATION HISTORY', yPosition, margin, lineHeight);
  
  const educationHistory = formData.educationHistory || {};
  yPosition = drawField(page, font, fontBold, 'Highest Level of Education:', 
    formatEducationLevel(educationHistory.highestEducation), 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Institution Name:', 
    educationHistory.institutionName || '', 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Field of Study:', 
    educationHistory.fieldOfStudy || '', 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Graduation Year:', 
    educationHistory.graduationYear || '', 
    yPosition, margin, lineHeight);
  
  // ============================================================================
  // PAGE 2: STUDY PURPOSE AND FINANCIAL INFORMATION
  // ============================================================================
  
  page = pdfDoc.addPage([pageWidth, pageHeight]);
  yPosition = pageHeight - margin;
  
  // Header (repeated)
  page.drawText('APPLICATION FOR STUDY PERMIT (Page 2)', {
    x: margin,
    y: yPosition,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0.5)
  });
  yPosition -= 40;
  
  // Section 4: Study Purpose
  yPosition = drawSection(page, font, fontBold, 'SECTION 4: PURPOSE OF STUDY IN CANADA', yPosition, margin, lineHeight);
  
  const studyPurpose = formData.studyPurpose || {};
  yPosition = drawField(page, font, fontBold, 'Canadian Institution:', 
    studyPurpose.canadianInstitution || '', 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'DLI Number:', 
    studyPurpose.dli || '', 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Program Name:', 
    studyPurpose.programName || '', 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Program Level:', 
    formatProgramLevel(studyPurpose.programLevel), 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Program Start Date:', 
    formatDate(studyPurpose.programStartDate), 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Program Duration:', 
    `${studyPurpose.programDuration || ''} months`, 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Letter of Acceptance:', 
    studyPurpose.hasLetterOfAcceptance ? 'Yes' : 'No', 
    yPosition, margin, lineHeight);
  
  yPosition -= 20;
  
  // Section 5: Proof of Funds
  yPosition = drawSection(page, font, fontBold, 'SECTION 5: PROOF OF FINANCIAL SUPPORT', yPosition, margin, lineHeight);
  
  const proofOfFunds = formData.proofOfFunds || {};
  yPosition = drawField(page, font, fontBold, 'Annual Tuition Fees:', 
    `CAD $${formatCurrency(proofOfFunds.annualTuitionFees)}`, 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Available Funds:', 
    `CAD $${formatCurrency(proofOfFunds.availableFunds)}`, 
    yPosition, margin, lineHeight);
  
  yPosition = drawField(page, font, fontBold, 'Source of Funding:', 
    formatFundingSource(proofOfFunds.fundingSource), 
    yPosition, margin, lineHeight);
  
  if (proofOfFunds.hasSponsor) {
    yPosition = drawField(page, font, fontBold, 'Sponsor:', 
      'Yes', 
      yPosition, margin, lineHeight);
    
    yPosition = drawField(page, font, fontBold, 'Sponsor Relationship:', 
      proofOfFunds.sponsorRelationship || '', 
      yPosition, margin, lineHeight);
  }
  
  yPosition -= 40;
  
  // ============================================================================
  // DECLARATION AND SIGNATURE
  // ============================================================================
  
  yPosition = drawSection(page, font, fontBold, 'DECLARATION', yPosition, margin, lineHeight);
  
  const declarationText = [
    'I certify that the information provided in this application is true, complete, and correct.',
    'I understand that any false or misleading information may result in the refusal of my',
    'application or cancellation of my study permit if already issued.',
    '',
    'I authorize the release of information from this application to other Canadian government',
    'institutions as deemed necessary for the administration of immigration programs.'
  ];
  
  for (const line of declarationText) {
    page.drawText(line, {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0, 0, 0)
    });
    yPosition -= 14;
  }
  
  yPosition -= 20;
  
  // Signature section
  page.drawText('Signature: _________________________________', {
    x: margin,
    y: yPosition,
    size: 11,
    font: font
  });
  
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: pageWidth - margin - 150,
    y: yPosition,
    size: 11,
    font: font
  });
  
  yPosition -= 40;
  
  // Footer
  page.drawText('This is a system-generated document. Official IRCC forms may differ.', {
    x: margin,
    y: margin - 20,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  page.drawText(`Generated: ${new Date().toLocaleString()}`, {
    x: pageWidth - margin - 200,
    y: margin - 20,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Draw a section header
 */
function drawSection(page, font, fontBold, text, yPosition, margin, lineHeight) {
  page.drawText(text, {
    x: margin,
    y: yPosition,
    size: 13,
    font: fontBold,
    color: rgb(0, 0, 0.7)
  });
  
  // Draw underline
  page.drawLine({
    start: { x: margin, y: yPosition - 3 },
    end: { x: 562, y: yPosition - 3 },
    thickness: 1,
    color: rgb(0, 0, 0.7)
  });
  
  return yPosition - 25;
}

/**
 * Draw a field with label and value
 */
function drawField(page, font, fontBold, label, value, yPosition, margin, lineHeight) {
  page.drawText(label, {
    x: margin,
    y: yPosition,
    size: 11,
    font: fontBold
  });
  
  page.drawText(value || 'N/A', {
    x: margin + 200,
    y: yPosition,
    size: 11,
    font: font
  });
  
  return yPosition - lineHeight;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  if (!amount) return '0.00';
  return parseFloat(amount).toLocaleString('en-CA', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });
}

/**
 * Format education level
 */
function formatEducationLevel(level) {
  const levels = {
    'high_school': 'High School',
    'diploma': 'Diploma/Certificate',
    'bachelors': 'Bachelor\'s Degree',
    'masters': 'Master\'s Degree',
    'phd': 'Doctoral Degree (PhD)'
  };
  return levels[level] || level || 'N/A';
}

/**
 * Format program level
 */
function formatProgramLevel(level) {
  const levels = {
    'certificate': 'Certificate',
    'diploma': 'Diploma',
    'bachelors': 'Bachelor\'s Degree',
    'masters': 'Master\'s Degree',
    'phd': 'Doctoral Degree (PhD)',
    'postgraduate': 'Post-Graduate Certificate/Diploma'
  };
  return levels[level] || level || 'N/A';
}

/**
 * Format funding source
 */
function formatFundingSource(source) {
  const sources = {
    'personal_savings': 'Personal Savings',
    'family_support': 'Family Support',
    'scholarship': 'Scholarship/Grant',
    'loan': 'Education Loan',
    'sponsor': 'Sponsor',
    'other': 'Other'
  };
  return sources[source] || source || 'N/A';
}

export default {
  generateStudyPermitPDF
};
