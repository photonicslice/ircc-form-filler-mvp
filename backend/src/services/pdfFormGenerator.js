/**
 * PDF Form Generator
 * Creates IMM 1294 study permit application form from scratch
 * This bypasses encryption issues by building new PDFs instead of filling templates
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PAGE_WIDTH = 612; // 8.5 inches * 72 DPI
const PAGE_HEIGHT = 792; // 11 inches * 72 DPI
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 562;
const MARGIN_TOP = 742;

/**
 * Generate IMM 1294 PDF from form data
 * @param {object} formData - Complete form data
 * @returns {Promise<Uint8Array>} - PDF bytes
 */
export async function generateIMM1294PDF(formData) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 10;
  const titleSize = 16;
  const headingSize = 12;

  // Extract form sections
  const personal = formData.personalInfo || {};
  const passport = formData.passportInfo || {};
  const education = formData.educationHistory || {};
  const study = formData.studyPurpose || {};
  const funds = formData.proofOfFunds || {};
  const contact = formData.contactInfo || {};
  const marital = formData.maritalInfo || {};
  const language = formData.languageInfo || {};

  // PAGE 1: Personal Details
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = MARGIN_TOP;

  // Header
  drawText(page1, 'Government of Canada', MARGIN_LEFT, y, fontBold, 12);
  drawText(page1, 'PAGE 1 OF 5', MARGIN_RIGHT - 100, y, font, 10);
  y -= 30;

  // Title
  drawText(page1, 'APPLICATION FOR STUDY PERMIT', MARGIN_LEFT, y, fontBold, titleSize);
  y -= 20;
  drawText(page1, 'MADE OUTSIDE OF CANADA', MARGIN_LEFT, y, fontBold, titleSize);
  y -= 40;

  // Section: PERSONAL DETAILS
  drawSectionHeader(page1, 'PERSONAL DETAILS', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 25;

  // Full name
  drawLabel(page1, '1. Full name', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 15;
  drawLabel(page1, 'Family name (as shown on passport or travel document)', MARGIN_LEFT + 10, y, font, 8);
  drawValue(page1, personal.lastName || '', MARGIN_LEFT + 10, y - 15, font, fontSize);

  drawLabel(page1, 'Given name(s) (as shown on passport or travel document)', 320, y, font, 8);
  drawValue(page1, personal.firstName || '', 320, y - 15, font, fontSize);
  y -= 40;

  // Sex
  drawLabel(page1, '3. Sex', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page1, personal.sex || personal.gender || '', MARGIN_LEFT + 100, y, font, fontSize);

  // Date of birth
  drawLabel(page1, '4. Date of birth', 200, y, fontBold, fontSize);
  drawValue(page1, formatDate(personal.dateOfBirth), 320, y, font, fontSize);
  y -= 20;

  // Place of birth
  drawLabel(page1, '5. Place of birth', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 15;
  drawLabel(page1, 'City/Town', MARGIN_LEFT + 10, y, font, 8);
  drawValue(page1, personal.cityOfBirth || '', MARGIN_LEFT + 10, y - 15, font, fontSize);

  drawLabel(page1, 'Country or Territory', 320, y, font, 8);
  drawValue(page1, personal.countryOfBirth || personal.nationality || '', 320, y - 15, font, fontSize);
  y -= 40;

  // Citizenship
  drawLabel(page1, '6. Citizenship', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page1, personal.nationality || '', MARGIN_LEFT + 10, y - 15, font, fontSize);
  y -= 35;

  // Current country of residence
  drawLabel(page1, '7. Current country or territory of residence', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page1, personal.countryOfResidence || '', MARGIN_LEFT + 10, y - 15, font, fontSize);
  y -= 60;

  // PAGE 2: Language, Passport, Contact
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = MARGIN_TOP;

  drawText(page2, 'PAGE 2 OF 5', MARGIN_RIGHT - 100, y, font, 10);
  y -= 30;

  // Section: LANGUAGE(S)
  drawSectionHeader(page2, 'LANGUAGE(S)', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 25;

  drawLabel(page2, 'a) Native language/Mother Tongue', MARGIN_LEFT + 10, y, font, fontSize);
  drawValue(page2, language?.nativeLanguage || '', MARGIN_LEFT + 10, y - 15, font, fontSize);

  drawLabel(page2, 'b) Are you able to communicate in English and/or French?', 320, y, font, fontSize);
  drawValue(page2, language?.englishFrench || 'English', 320, y - 15, font, fontSize);
  y -= 50;

  // Section: PASSPORT
  drawSectionHeader(page2, 'PASSPORT', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 25;

  drawLabel(page2, '1. Passport number', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page2, passport.passportNumber || '', MARGIN_LEFT + 10, y - 15, font, fontSize);

  drawLabel(page2, '2. Country or territory of issue', 200, y, fontBold, fontSize);
  drawValue(page2, passport.issuingCountry || '', 200, y - 15, font, fontSize);
  y -= 35;

  drawLabel(page2, '3. Issue date', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page2, formatDate(passport.issueDate), MARGIN_LEFT + 10, y - 15, font, fontSize);

  drawLabel(page2, '4. Expiry date', 200, y, fontBold, fontSize);
  drawValue(page2, formatDate(passport.expiryDate), 200, y - 15, font, fontSize);
  y -= 50;

  // Section: CONTACT INFORMATION
  drawSectionHeader(page2, 'CONTACT INFORMATION', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 25;

  drawLabel(page2, 'Email address', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page2, personal.email || contact?.email || '', MARGIN_LEFT + 10, y - 15, font, fontSize);
  y -= 35;

  drawLabel(page2, 'Telephone number', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page2, personal.phone || contact?.phone || '', MARGIN_LEFT + 10, y - 15, font, fontSize);
  y -= 35;

  // Current mailing address
  if (contact?.mailingAddress) {
    drawLabel(page2, 'Current mailing address', MARGIN_LEFT, y, fontBold, fontSize);
    y -= 15;
    drawLabel(page2, 'Street name', MARGIN_LEFT + 10, y, font, 8);
    drawValue(page2, contact.mailingAddress.street || '', MARGIN_LEFT + 10, y - 15, font, fontSize);
    y -= 30;

    drawLabel(page2, 'City/Town', MARGIN_LEFT + 10, y, font, 8);
    drawValue(page2, contact.mailingAddress.city || '', MARGIN_LEFT + 10, y - 15, font, fontSize);

    drawLabel(page2, 'Province/State', 250, y, font, 8);
    drawValue(page2, contact.mailingAddress.province || '', 250, y - 15, font, fontSize);

    drawLabel(page2, 'Postal code', 400, y, font, 8);
    drawValue(page2, contact.mailingAddress.postalCode || '', 400, y - 15, font, fontSize);
    y -= 35;

    drawLabel(page2, 'Country', MARGIN_LEFT + 10, y, font, 8);
    drawValue(page2, contact.mailingAddress.country || '', MARGIN_LEFT + 10, y - 15, font, fontSize);
  }
  y -= 50;

  // PAGE 3: Study Details
  const page3 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = MARGIN_TOP;

  drawText(page3, 'PAGE 3 OF 5', MARGIN_RIGHT - 100, y, font, 10);
  y -= 30;

  // Section: DETAILS OF INTENDED STUDY IN CANADA
  drawSectionHeader(page3, 'DETAILS OF INTENDED STUDY IN CANADA', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 25;

  drawLabel(page3, '1. I have been accepted at the following educational institution', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 15;
  drawLabel(page3, 'a) Name of School', MARGIN_LEFT + 10, y, font, fontSize);
  drawValue(page3, study.canadianInstitution || '', MARGIN_LEFT + 10, y - 15, font, fontSize);
  y -= 35;

  drawLabel(page3, 'b) My level of study will be:', MARGIN_LEFT + 10, y, font, fontSize);
  drawValue(page3, formatProgramLevel(study.programLevel), MARGIN_LEFT + 10, y - 15, font, fontSize);

  drawLabel(page3, 'c) My field of study will be:', 320, y, font, fontSize);
  drawValue(page3, study.programName || education.fieldOfStudy || '', 320, y - 15, font, fontSize);
  y -= 45;

  drawLabel(page3, '2. a) Designated Learning Institution # (O#)', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page3, study.dli || '', MARGIN_LEFT + 10, y - 15, font, fontSize);

  drawLabel(page3, 'b) My Student ID # is:', 300, y, fontBold, fontSize);
  drawValue(page3, study.studentId || '', 300, y - 15, font, fontSize);
  y -= 45;

  drawLabel(page3, '3. Duration of expected study', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 15;
  drawLabel(page3, 'From', MARGIN_LEFT + 10, y, font, fontSize);
  drawValue(page3, formatDate(study.programStartDate), MARGIN_LEFT + 60, y, font, fontSize);

  drawLabel(page3, 'To', 250, y, font, fontSize);
  const endDate = calculateEndDate(study.programStartDate, study.programDuration);
  drawValue(page3, formatDate(endDate), 280, y, font, fontSize);
  y -= 35;

  drawLabel(page3, '4. The cost of my studies will be:', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 15;
  drawLabel(page3, 'Tuition', MARGIN_LEFT + 10, y, font, fontSize);
  drawValue(page3, funds.annualTuitionFees ? `CAD $${formatCurrency(funds.annualTuitionFees)}` : '', MARGIN_LEFT + 80, y, font, fontSize);
  y -= 35;

  drawLabel(page3, '5. Funds available for my stay (CAD)', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page3, funds.availableFunds ? `CAD $${formatCurrency(funds.availableFunds)}` : '', MARGIN_LEFT + 10, y - 15, font, fontSize);
  y -= 35;

  drawLabel(page3, '6. a) My expenses in Canada will be paid by:', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page3, formatFundingSource(funds.fundingSource), MARGIN_LEFT + 10, y - 15, font, fontSize);
  y -= 50;

  // PAGE 4: Education History
  const page4 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = MARGIN_TOP;

  drawText(page4, 'PAGE 4 OF 5', MARGIN_RIGHT - 100, y, font, 10);
  y -= 30;

  // Section: EDUCATION
  drawSectionHeader(page4, 'EDUCATION', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 25;

  drawLabel(page4, 'Have you had any post secondary education?', MARGIN_LEFT + 10, y, font, fontSize);
  drawValue(page4, education.institutionName ? 'Yes' : 'No', 400, y, font, fontSize);
  y -= 20;

  if (education.institutionName) {
    drawLabel(page4, 'If you answered "yes", give full details of your highest level of post secondary education.', MARGIN_LEFT + 10, y, font, 8);
    y -= 25;

    drawLabel(page4, 'Field and level of study', MARGIN_LEFT + 20, y, font, fontSize);
    drawValue(page4, `${formatEducationLevel(education.highestEducation)} - ${education.fieldOfStudy || ''}`, MARGIN_LEFT + 20, y - 15, font, fontSize);
    y -= 35;

    drawLabel(page4, 'School/Facility name', MARGIN_LEFT + 20, y, font, fontSize);
    drawValue(page4, education.institutionName || '', MARGIN_LEFT + 20, y - 15, font, fontSize);
    y -= 35;

    drawLabel(page4, 'Country or Territory', MARGIN_LEFT + 20, y, font, fontSize);
    drawValue(page4, education.institutionCountry || personal.countryOfResidence || '', MARGIN_LEFT + 20, y - 15, font, fontSize);

    if (education.graduationYear) {
      drawLabel(page4, 'Graduation Year', 350, y, font, fontSize);
      drawValue(page4, education.graduationYear.toString(), 350, y - 15, font, fontSize);
    }
  }
  y -= 50;

  // PAGE 5: Background Information
  const page5 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = MARGIN_TOP;

  drawText(page5, 'PAGE 5 OF 5', MARGIN_RIGHT - 100, y, font, 10);
  y -= 30;

  // Section: BACKGROUND INFORMATION
  drawSectionHeader(page5, 'BACKGROUND INFORMATION', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;
  drawText(page5, 'You must complete this section if you are 18 years of age or older.', MARGIN_LEFT + 10, y, font, 9);
  y -= 30;

  drawLabel(page5, '1. a) Within the past two years, have you or a family member ever had tuberculosis', MARGIN_LEFT + 10, y, font, 9);
  y -= 12;
  drawLabel(page5, '    of the lungs or been in close contact with a person with tuberculosis?', MARGIN_LEFT + 10, y, font, 9);
  drawValue(page5, 'No', 450, y, font, fontSize);
  y -= 25;

  drawLabel(page5, '   b) Do you have any physical or mental disorder that would require social and/or', MARGIN_LEFT + 10, y, font, 9);
  y -= 12;
  drawLabel(page5, '      health services, other than medication, during a stay in Canada?', MARGIN_LEFT + 10, y, font, 9);
  drawValue(page5, 'No', 450, y, font, fontSize);
  y -= 35;

  drawLabel(page5, '2. a) Have you ever remained beyond the validity of your status, attended school', MARGIN_LEFT + 10, y, font, 9);
  y -= 12;
  drawLabel(page5, '      without authorization or worked without authorization in Canada?', MARGIN_LEFT + 10, y, font, 9);
  drawValue(page5, 'No', 450, y, font, fontSize);
  y -= 25;

  drawLabel(page5, '   b) Have you ever been refused a visa or permit, denied entry or ordered to', MARGIN_LEFT + 10, y, font, 9);
  y -= 12;
  drawLabel(page5, '      leave Canada or any other country or territory?', MARGIN_LEFT + 10, y, font, 9);
  drawValue(page5, 'No', 450, y, font, fontSize);
  y -= 25;

  drawLabel(page5, '   c) Have you previously applied to enter or remain in Canada?', MARGIN_LEFT + 10, y, font, 9);
  drawValue(page5, 'No', 450, y, font, fontSize);
  y -= 35;

  drawLabel(page5, '3. a) Have you ever committed, been arrested for, been charged with or convicted of', MARGIN_LEFT + 10, y, font, 9);
  y -= 12;
  drawLabel(page5, '      any criminal offence in any country or territory?', MARGIN_LEFT + 10, y, font, 9);
  drawValue(page5, 'No', 450, y, font, fontSize);
  y -= 50;

  // Footer
  y = 50;
  drawText(page5, 'IMM 1294 (10-2024) E', MARGIN_LEFT, y, font, 8);
  drawText(page5, 'APPLICATION FOR STUDY MADE OUTSIDE CANADA', MARGIN_RIGHT - 250, y, font, 8);

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Helper functions
function drawText(page, text, x, y, font, size) {
  page.drawText(text, {
    x,
    y,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

function drawLabel(page, label, x, y, font, size) {
  page.drawText(label, {
    x,
    y,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

function drawValue(page, value, x, y, font, size) {
  if (!value) return;

  page.drawText(String(value), {
    x,
    y,
    size,
    font,
    color: rgb(0, 0.2, 0.5), // Slightly blue to indicate filled data
  });
}

function drawSectionHeader(page, title, x, y, font, size) {
  page.drawRectangle({
    x: x - 5,
    y: y - 15,
    width: 512,
    height: 20,
    color: rgb(0.9, 0.9, 0.9),
  });

  page.drawText(title, {
    x,
    y,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCurrency(amount) {
  if (!amount) return '';
  return parseFloat(amount).toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatEducationLevel(level) {
  const levels = {
    'high_school': 'High School',
    'diploma': 'Diploma/Certificate',
    'bachelors': "Bachelor's Degree",
    'masters': "Master's Degree",
    'phd': 'Doctoral Degree (PhD)'
  };
  return levels[level] || level || '';
}

function formatProgramLevel(level) {
  const levels = {
    'certificate': 'Certificate',
    'diploma': 'Diploma',
    'bachelors': "Bachelor's Degree",
    'masters': "Master's Degree",
    'phd': 'Doctoral Degree (PhD)',
    'postgraduate': 'Post-Graduate Certificate/Diploma'
  };
  return levels[level] || level || '';
}

function formatFundingSource(source) {
  const sources = {
    'personal_savings': 'Personal Savings',
    'family_support': 'Family Support',
    'scholarship': 'Scholarship/Grant',
    'loan': 'Education Loan',
    'sponsor': 'Sponsor',
    'other': 'Other'
  };
  return sources[source] || source || '';
}

function calculateEndDate(startDate, durationMonths) {
  if (!startDate || !durationMonths) return '';

  const start = new Date(startDate);
  if (isNaN(start.getTime())) return '';

  const end = new Date(start);
  end.setMonth(end.getMonth() + parseInt(durationMonths));

  return end.toISOString().split('T')[0];
}

export default {
  generateIMM1294PDF
};
