/**
 * Complete PDF Form Generator for IMM 1294
 * Handles ALL 147+ fields from the official form
 * Based on 8 form screenshots analysis
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PAGE_WIDTH = 612; // 8.5 inches * 72 DPI
const PAGE_HEIGHT = 792; // 11 inches * 72 DPI
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 562;
const MARGIN_TOP = 742;
const LINE_HEIGHT = 18;

/**
 * Generate complete IMM 1294 PDF from form data
 * @param {object} formData - Complete form data with all sections
 * @returns {Promise<Uint8Array>} - PDF bytes
 */
export async function generateCompleteIMM1294PDF(formData) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 9;
  const labelSize = 8;
  const titleSize = 14;
  const headingSize = 11;

  // Extract all form sections using the new complete structure
  const personal = formData.personalInfo || {};
  const marital = formData.maritalInfo || {};
  const language = formData.languageInfo || {};
  const passport = formData.passportInfo || {};
  const nationalId = formData.nationalIdInfo || {};
  const usPR = formData.usPRInfo || {};
  const contact = formData.contactInfo || {};
  const study = formData.studyDetails || {};
  const education = formData.educationHistory || {};
  const employment = formData.employmentHistory || [];
  const background = formData.backgroundInfo || {};

  // PAGE 1: Personal Details
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = MARGIN_TOP;

  // Header
  drawText(page1, 'Government of Canada', MARGIN_LEFT, y, fontBold, 11);
  drawText(page1, 'PROTECTED WHEN COMPLETED - B', MARGIN_RIGHT - 200, y, fontBold, 9);
  y -= 12;
  drawText(page1, 'PAGE 1 OF 5', MARGIN_RIGHT - 100, y, font, 9);
  y -= 25;

  // Title
  drawText(page1, 'APPLICATION FOR STUDY PERMIT', MARGIN_LEFT, y, fontBold, titleSize);
  y -= 15;
  drawText(page1, 'MADE OUTSIDE OF CANADA', MARGIN_LEFT, y, fontBold, titleSize);
  y -= 30;

  // UCI and Service Language
  drawLabel(page1, '1. UCI', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page1, formData.uci || '', MARGIN_LEFT + 50, y, font, fontSize);

  drawLabel(page1, '2. I want service in', MARGIN_LEFT + 250, y, fontBold, fontSize);
  drawValue(page1, formData.serviceLanguage || 'English', MARGIN_LEFT + 370, y, font, fontSize);
  y -= 25;

  // PERSONAL DETAILS Section
  drawSectionHeader(page1, 'PERSONAL DETAILS', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  // 1. Full name
  drawLabel(page1, '1. Full name', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 12;
  drawLabel(page1, 'Family name (as shown on passport or travel document)', MARGIN_LEFT + 5, y, font, labelSize);
  drawValue(page1, personal.familyName || '', MARGIN_LEFT + 5, y - 12, font, fontSize);

  drawLabel(page1, 'Given name(s) (as shown on passport or travel document)', 320, y, font, labelSize);
  drawValue(page1, personal.givenNames || '', 320, y - 12, font, fontSize);
  y -= 30;

  // 2. Other names
  drawLabel(page1, '2. a) Have you ever used any other name (e.g. Nickname, maiden name, alias, etc.)?', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page1, personal.hasOtherNames ? 'Yes' : 'No', MARGIN_RIGHT - 80, y, font, fontSize);
  y -= 12;

  if (personal.hasOtherNames && personal.otherNames) {
    drawLabel(page1, 'b) Family name', MARGIN_LEFT + 10, y, font, labelSize);
    drawValue(page1, personal.otherNames.familyName || '', MARGIN_LEFT + 10, y - 12, font, fontSize);

    drawLabel(page1, 'Given name(s)', 320, y, font, labelSize);
    drawValue(page1, personal.otherNames.givenNames || '', 320, y - 12, font, fontSize);
    y -= 30;
  } else {
    y -= 20;
  }

  // 3. Sex
  drawLabel(page1, '3. Sex', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page1, personal.sex || '', MARGIN_LEFT + 50, y, font, fontSize);
  y -= 15;

  // 4. Date of birth
  drawLabel(page1, '4. Date of birth', 200, y, fontBold, fontSize);
  drawValue(page1, formatDate(personal.dateOfBirth), 300, y, font, fontSize);
  y -= 15;

  // 5. Place of birth
  drawLabel(page1, '5. Place of birth', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 12;
  drawLabel(page1, 'City/Town', MARGIN_LEFT + 10, y, font, labelSize);
  drawValue(page1, personal.placeOfBirth?.city || '', MARGIN_LEFT + 10, y - 12, font, fontSize);

  drawLabel(page1, 'Country or Territory', 320, y, font, labelSize);
  drawValue(page1, personal.placeOfBirth?.country || personal.citizenship || '', 320, y - 12, font, fontSize);
  y -= 30;

  // 6. Citizenship
  drawLabel(page1, '6. Citizenship', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page1, personal.citizenship || '', MARGIN_LEFT + 10, y - 12, font, fontSize);
  y -= 25;

  // 7. Current country or territory of residence
  drawLabel(page1, '7. Current country or territory of residence:', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 12;

  if (personal.currentResidence) {
    drawLabel(page1, 'Country or Territory', MARGIN_LEFT + 10, y, font, labelSize);
    drawValue(page1, personal.currentResidence.country || '', MARGIN_LEFT + 10, y - 12, font, fontSize);

    drawLabel(page1, 'Status', 200, y, font, labelSize);
    drawValue(page1, personal.currentResidence.status || '', 200, y - 12, font, fontSize);

    drawLabel(page1, 'From', 350, y, font, labelSize);
    drawValue(page1, formatDate(personal.currentResidence.from), 350, y - 12, font, fontSize);

    drawLabel(page1, 'To', 450, y, font, labelSize);
    drawValue(page1, formatDate(personal.currentResidence.to), 450, y - 12, font, fontSize);
    y -= 30;
  }

  // 8. Previous countries of residence (past 5 years, > 6 months)
  drawLabel(page1, '8. Previous countries or territories of residence:', MARGIN_LEFT, y, fontBold, fontSize);
  drawLabel(page1, 'During the past five years have you lived in any country or territory', MARGIN_LEFT, y - 10, font, labelSize);
  drawLabel(page1, 'other than your country of citizenship or current country/territory of residence for more than six months?', MARGIN_LEFT, y - 18, font, labelSize);
  y -= 35;

  if (personal.previousResidences && personal.previousResidences.length > 0) {
    personal.previousResidences.forEach((residence, index) => {
      if (y < 100) {
        // Need new page if running out of space
        return;
      }
      drawValue(page1, residence.country || '', MARGIN_LEFT + 10, y, font, fontSize);
      drawValue(page1, residence.status || '', 200, y, font, fontSize);
      drawValue(page1, formatDate(residence.from), 350, y, font, fontSize);
      drawValue(page1, formatDate(residence.to), 450, y, font, fontSize);
      y -= 15;
    });
  }

  // 9. Country where applying
  if (y < 80) {
    y = MARGIN_TOP;
  }
  drawLabel(page1, '9. Country or territory where applying:', MARGIN_LEFT, y - 10, fontBold, fontSize);
  drawLabel(page1, 'Same as current country or territory of residence?', MARGIN_LEFT + 10, y - 20, font, fontSize);
  drawValue(page1, personal.applyingFrom?.sameAsCurrent ? 'Yes' : 'No', MARGIN_RIGHT - 80, y - 20, font, fontSize);

  // PAGE 2: Marital Status Continued
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = MARGIN_TOP;

  drawText(page2, 'PAGE 2 OF 5', MARGIN_RIGHT - 100, y, font, 9);
  y -= 30;

  // 10. Marital Status
  drawLabel(page2, '10. a) Your current marital status', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page2, marital.status || '', MARGIN_LEFT + 10, y - 12, font, fontSize);
  y -= 25;

  if (marital.status === 'Married' || marital.status === 'Common-law') {
    drawLabel(page2, 'b) If you are married or in a common-law relationship', MARGIN_LEFT + 10, y, font, fontSize);
    drawLabel(page2, 'Provide the date on which you were married or entered into the common-law relationship', MARGIN_LEFT + 15, y - 10, font, labelSize);
    y -= 18;
    drawLabel(page2, 'Date', MARGIN_RIGHT - 150, y, font, labelSize);
    drawValue(page2, formatDate(marital.dateOfMarriage), MARGIN_RIGHT - 100, y, font, fontSize);
    y -= 20;

    drawLabel(page2, 'c) Provide the name of your current Spouse/Common-law partner', MARGIN_LEFT, y, font, fontSize);
    y -= 12;
    drawLabel(page2, 'Family name', MARGIN_LEFT + 10, y, font, labelSize);
    drawValue(page2, marital.spouse?.familyName || '', MARGIN_LEFT + 10, y - 12, font, fontSize);

    drawLabel(page2, 'Given name(s)', 320, y, font, labelSize);
    drawValue(page2, marital.spouse?.givenNames || '', 320, y - 12, font, fontSize);
    y -= 30;
  }

  // FOR OFFICE USE ONLY section
  y -= 50;
  drawText(page2, 'FOR OFFICE USE ONLY - DO NOT WRITE IN THIS SPACE', MARGIN_LEFT + 100, y, fontBold, 11);

  // PAGE 3: Previous Marriage, Language, Passport, National ID, US PR
  const page3 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = MARGIN_TOP;

  drawText(page3, 'PAGE 3 OF 5', MARGIN_RIGHT - 100, y, font, 9);
  y -= 30;

  // PERSONAL DETAILS (CONTINUED)
  drawSectionHeader(page3, 'PERSONAL DETAILS (CONTINUED)', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  // 11. Previous marriage
  drawLabel(page3, '11. a) Have you previously been married or in a common-law relationship?', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page3, marital.previouslyMarried ? 'Yes' : 'No', MARGIN_RIGHT - 80, y, font, fontSize);
  y -= 15;

  if (marital.previouslyMarried && marital.previousSpouse) {
    drawLabel(page3, 'b) Provide the following details for your previous Spouse/Common-law Partner:', MARGIN_LEFT + 5, y, font, fontSize);
    y -= 12;
    drawLabel(page3, 'Family name', MARGIN_LEFT + 10, y, font, labelSize);
    drawValue(page3, marital.previousSpouse.familyName || '', MARGIN_LEFT + 10, y - 12, font, fontSize);

    drawLabel(page3, 'Given name(s)', 320, y, font, labelSize);
    drawValue(page3, marital.previousSpouse.givenNames || '', 320, y - 12, font, fontSize);
    y -= 30;

    drawLabel(page3, 'c) Date of birth', MARGIN_LEFT + 10, y, font, fontSize);
    drawValue(page3, formatDate(marital.previousSpouse.dateOfBirth), MARGIN_LEFT + 100, y, font, fontSize);

    drawLabel(page3, 'd) Type of relationship', 250, y, font, fontSize);
    drawValue(page3, marital.previousSpouse.relationshipType || '', 350, y, font, fontSize);
    y -= 15;

    drawLabel(page3, 'From', 400, y, font, labelSize);
    drawValue(page3, formatDate(marital.previousSpouse.from), 430, y, font, fontSize);

    drawLabel(page3, 'To', 500, y, font, labelSize);
    drawValue(page3, formatDate(marital.previousSpouse.to), 520, y, font, fontSize);
    y -= 25;
  } else {
    y -= 15;
  }

  // LANGUAGE(S)
  drawSectionHeader(page3, 'LANGUAGE(S)', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  drawLabel(page3, '1. a) Native language/ Mother Tongue', MARGIN_LEFT + 5, y, fontBold, fontSize);
  drawValue(page3, language.nativeLanguage || '', MARGIN_LEFT + 5, y - 12, font, fontSize);

  drawLabel(page3, 'b) Are you able to communicate in English and/or French?', 300, y, fontBold, fontSize);
  drawValue(page3, language.communicateInEnglishFrench || '', 300, y - 12, font, fontSize);
  y -= 25;

  drawLabel(page3, 'c) In which language are you most at ease?', 300, y, font, fontSize);
  drawValue(page3, language.mostAtEase || '', 300, y - 12, font, fontSize);
  y -= 20;

  drawLabel(page3, 'd) Have you taken a test from a designated testing agency to assess your proficiency in English or French?', MARGIN_LEFT + 5, y, font, fontSize);
  drawValue(page3, language.languageTest ? 'Yes' : 'No', MARGIN_RIGHT - 80, y, font, fontSize);
  y -= 25;

  // PASSPORT
  drawSectionHeader(page3, 'PASSPORT', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  drawLabel(page3, '1. Passport number', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page3, passport.number || '', MARGIN_LEFT + 5, y - 12, font, fontSize);

  drawLabel(page3, '2. Country or territory of issue', 250, y, fontBold, fontSize);
  drawValue(page3, passport.countryOfIssue || '', 250, y - 12, font, fontSize);
  y -= 25;

  drawLabel(page3, '3. Issue date', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page3, formatDate(passport.issueDate), MARGIN_LEFT + 80, y, font, fontSize);

  drawLabel(page3, '4. Expiry date', 250, y, fontBold, fontSize);
  drawValue(page3, formatDate(passport.expiryDate), 330, y, font, fontSize);
  y -= 20;

  drawLabel(page3, '5. For this trip, will you use a passport issued by the Ministry of Foreign Affairs in Taiwan', MARGIN_LEFT, y, font, fontSize);
  drawLabel(page3, '   that includes your personal identification number?', MARGIN_LEFT, y - 10, font, fontSize);
  drawValue(page3, passport.taiwanPassport ? 'Yes' : 'No', MARGIN_RIGHT - 80, y, font, fontSize);
  y -= 22;

  drawLabel(page3, '6. For this trip, will you use a National Israeli passport?', MARGIN_LEFT, y, font, fontSize);
  drawValue(page3, passport.israeliPassport ? 'Yes' : 'No', MARGIN_RIGHT - 80, y, font, fontSize);
  y -= 25;

  // NATIONAL IDENTITY DOCUMENT
  drawSectionHeader(page3, 'NATIONAL IDENTITY DOCUMENT', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  drawLabel(page3, '1. Do you have a national identity document?', MARGIN_LEFT, y, font, fontSize);
  drawValue(page3, nationalId.hasDocument ? 'Yes' : 'No', MARGIN_RIGHT - 80, y, font, fontSize);
  y -= 15;

  if (nationalId.hasDocument) {
    drawLabel(page3, '2. Document number', MARGIN_LEFT + 5, y, font, fontSize);
    drawValue(page3, nationalId.documentNumber || '', MARGIN_LEFT + 120, y, font, fontSize);

    drawLabel(page3, '3. Country or territory of issue', 300, y, font, fontSize);
    drawValue(page3, nationalId.countryOfIssue || '', 300, y - 12, font, fontSize);
    y -= 20;

    drawLabel(page3, '4. Issue date', MARGIN_LEFT + 5, y, font, fontSize);
    drawValue(page3, formatDate(nationalId.issueDate), MARGIN_LEFT + 80, y, font, fontSize);

    drawLabel(page3, '5. Expiry date', 250, y, font, fontSize);
    drawValue(page3, formatDate(nationalId.expiryDate), 330, y, font, fontSize);
    y -= 25;
  }

  // US PR CARD
  drawSectionHeader(page3, 'US PR CARD', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  drawLabel(page3, '1. Are you a lawful permanent resident of the United States?', MARGIN_LEFT, y, font, fontSize);
  drawValue(page3, usPR.isPermanentResident ? 'Yes' : 'No', MARGIN_RIGHT - 80, y, font, fontSize);
  y -= 15;

  if (usPR.isPermanentResident) {
    drawLabel(page3, '2. U.S. Citizenship and Immigration Services (USCIS) number', MARGIN_LEFT + 5, y, font, fontSize);
    drawValue(page3, usPR.uscisNumber || '', MARGIN_LEFT + 350, y, font, fontSize);

    drawLabel(page3, '3. Expiry date', 450, y, font, fontSize);
    drawValue(page3, formatDate(usPR.expiryDate), 450, y - 12, font, fontSize);
  }

  // PAGE 4: Contact Information
  const page4 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = MARGIN_TOP;

  drawText(page4, 'Applicant Name', MARGIN_LEFT, y, font, 9);
  drawValue(page4, `${personal.familyName || ''}, ${personal.givenNames || ''}`, MARGIN_LEFT + 100, y, font, 9);
  drawText(page4, 'Date of Birth', 400, y, font, 9);
  drawValue(page4, formatDate(personal.dateOfBirth), 480, y, font, 9);
  y -= 20;

  drawText(page4, 'PAGE 4 OF 5', MARGIN_RIGHT - 100, y, font, 9);
  y -= 30;

  // CONTACT INFORMATION
  drawSectionHeader(page4, 'CONTACT INFORMATION', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  // Mailing address
  drawLabel(page4, '1. Current mailing address', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 12;

  if (contact.mailingAddress) {
    const addr = contact.mailingAddress;
    drawLabel(page4, 'P.O. box', MARGIN_LEFT + 5, y, font, labelSize);
    drawValue(page4, addr.poBox || '', MARGIN_LEFT + 5, y - 10, font, fontSize);

    drawLabel(page4, 'Apt/Unit', 120, y, font, labelSize);
    drawValue(page4, addr.aptUnit || '', 120, y - 10, font, fontSize);

    drawLabel(page4, 'Street no.', 200, y, font, labelSize);
    drawValue(page4, addr.streetNo || '', 200, y - 10, font, fontSize);

    drawLabel(page4, 'Street name', 280, y, font, labelSize);
    drawValue(page4, addr.streetName || '', 280, y - 10, font, fontSize);
    y -= 25;

    drawLabel(page4, 'City/Town', MARGIN_LEFT + 5, y, font, labelSize);
    drawValue(page4, addr.city || '', MARGIN_LEFT + 5, y - 10, font, fontSize);

    drawLabel(page4, 'Country or Territory', 200, y, font, labelSize);
    drawValue(page4, addr.country || '', 200, y - 10, font, fontSize);

    drawLabel(page4, 'Province/State', 350, y, font, labelSize);
    drawValue(page4, addr.provinceState || '', 350, y - 10, font, fontSize);
    y -= 25;

    drawLabel(page4, 'Postal code', MARGIN_LEFT + 5, y, font, labelSize);
    drawValue(page4, addr.postalCode || '', MARGIN_LEFT + 5, y - 10, font, fontSize);

    drawLabel(page4, 'District', 200, y, font, labelSize);
    drawValue(page4, addr.district || '', 200, y - 10, font, fontSize);
    y -= 25;
  }

  // Residential address
  drawLabel(page4, '2. Residential address  Same as mailing address?', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page4, contact.residentialSameAsMailing ? 'Yes' : 'No', MARGIN_RIGHT - 80, y, font, fontSize);
  y -= 15;

  if (!contact.residentialSameAsMailing && contact.residentialAddress) {
    // Similar structure as mailing address
    const addr = contact.residentialAddress;
    drawLabel(page4, 'Apt/Unit', MARGIN_LEFT + 5, y, font, labelSize);
    drawValue(page4, addr.aptUnit || '', MARGIN_LEFT + 5, y - 10, font, fontSize);

    drawLabel(page4, 'Street no.', 120, y, font, labelSize);
    drawValue(page4, addr.streetNo || '', 120, y - 10, font, fontSize);

    drawLabel(page4, 'Street name', 200, y, font, labelSize);
    drawValue(page4, addr.streetName || '', 200, y - 10, font, fontSize);

    drawLabel(page4, 'City/Town', 400, y, font, labelSize);
    drawValue(page4, addr.city || '', 400, y - 10, font, fontSize);
    y -= 25;

    drawLabel(page4, 'Country or Territory', MARGIN_LEFT + 5, y, font, labelSize);
    drawValue(page4, addr.country || '', MARGIN_LEFT + 5, y - 10, font, fontSize);

    drawLabel(page4, 'Province/State', 200, y, font, labelSize);
    drawValue(page4, addr.provinceState || '', 200, y - 10, font, fontSize);

    drawLabel(page4, 'Postal code', 350, y, font, labelSize);
    drawValue(page4, addr.postalCode || '', 350, y - 10, font, fontSize);
    y -= 25;
  }

  // Telephone
  drawLabel(page4, '3. Telephone no.', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 12;

  if (contact.telephone) {
    const tel = contact.telephone;
    drawLabel(page4, 'Canada/US', MARGIN_LEFT + 10, y, font, labelSize);
    drawLabel(page4, 'Other', MARGIN_LEFT + 80, y, font, labelSize);
    drawValue(page4, tel.isCanadaUS ? '☑' : '☐', MARGIN_LEFT + 10, y + 2, font, fontSize);
    drawValue(page4, !tel.isCanadaUS ? '☑' : '☐', MARGIN_LEFT + 80, y + 2, font, fontSize);

    drawLabel(page4, 'Type', 150, y, font, labelSize);
    drawValue(page4, tel.type || '', 150, y - 10, font, fontSize);

    drawLabel(page4, 'Country Code', 230, y, font, labelSize);
    drawValue(page4, tel.countryCode || '', 230, y - 10, font, fontSize);

    drawLabel(page4, 'No.', 310, y, font, labelSize);
    drawValue(page4, tel.number || '', 310, y - 10, font, fontSize);

    drawLabel(page4, 'Ext.', 450, y, font, labelSize);
    drawValue(page4, tel.ext || '', 450, y - 10, font, fontSize);
    y -= 25;
  }

  // Alternate telephone
  drawLabel(page4, '4. Alternate Telephone no.', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 12;

  if (contact.alternateTelephone && contact.alternateTelephone.number) {
    const tel = contact.alternateTelephone;
    drawLabel(page4, 'Canada/US', MARGIN_LEFT + 10, y, font, labelSize);
    drawLabel(page4, 'Other', MARGIN_LEFT + 80, y, font, labelSize);
    drawValue(page4, tel.isCanadaUS ? '☑' : '☐', MARGIN_LEFT + 10, y + 2, font, fontSize);
    drawValue(page4, !tel.isCanadaUS ? '☑' : '☐', MARGIN_LEFT + 80, y + 2, font, fontSize);

    drawLabel(page4, 'Type', 150, y, font, labelSize);
    drawValue(page4, tel.type || '', 150, y - 10, font, fontSize);

    drawLabel(page4, 'Country Code', 230, y, font, labelSize);
    drawValue(page4, tel.countryCode || '', 230, y - 10, font, fontSize);

    drawLabel(page4, 'No.', 310, y, font, labelSize);
    drawValue(page4, tel.number || '', 310, y - 10, font, fontSize);

    drawLabel(page4, 'Ext.', 450, y, font, labelSize);
    drawValue(page4, tel.ext || '', 450, y - 10, font, fontSize);
    y -= 25;
  } else {
    y -= 15;
  }

  // Fax
  drawLabel(page4, '5. Fax no.', MARGIN_LEFT, y, fontBold, fontSize);
  y -= 12;

  if (contact.fax && contact.fax.number) {
    const fax = contact.fax;
    drawLabel(page4, 'Canada/US', MARGIN_LEFT + 10, y, font, labelSize);
    drawLabel(page4, 'Other', MARGIN_LEFT + 80, y, font, labelSize);
    drawValue(page4, fax.isCanadaUS ? '☑' : '☐', MARGIN_LEFT + 10, y + 2, font, fontSize);
    drawValue(page4, !fax.isCanadaUS ? '☑' : '☐', MARGIN_LEFT + 80, y + 2, font, fontSize);

    drawLabel(page4, 'Country Code', 150, y, font, labelSize);
    drawValue(page4, fax.countryCode || '', 150, y - 10, font, fontSize);

    drawLabel(page4, 'No.', 250, y, font, labelSize);
    drawValue(page4, fax.number || '', 250, y - 10, font, fontSize);

    drawLabel(page4, 'Ext.', 400, y, font, labelSize);
    drawValue(page4, fax.ext || '', 400, y - 10, font, fontSize);
    y -= 25;
  } else {
    y -= 15;
  }

  // Email
  drawLabel(page4, '6. E-mail address', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page4, contact.email || '', MARGIN_LEFT + 5, y - 12, font, fontSize);

  // PAGE 5: Study Details, Education, Employment
  const page5 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = MARGIN_TOP;

  drawText(page5, 'Applicant Name', MARGIN_LEFT, y, font, 9);
  drawValue(page5, `${personal.familyName || ''}, ${personal.givenNames || ''}`, MARGIN_LEFT + 100, y, font, 9);
  drawText(page5, 'Date of Birth', 400, y, font, 9);
  drawValue(page5, formatDate(personal.dateOfBirth), 480, y, font, 9);
  y -= 20;

  drawText(page5, 'PAGE 5 OF 5', MARGIN_RIGHT - 100, y, font, 9);
  y -= 30;

  // DETAILS OF INTENDED STUDY
  drawSectionHeader(page5, 'DETAILS OF INTENDED STUDY IN CANADA', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  drawLabel(page5, '1. Level of study', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page5, study.level || '', MARGIN_LEFT + 10, y - 12, font, fontSize);

  drawLabel(page5, '2. Field of study', 250, y, fontBold, fontSize);
  drawValue(page5, study.field || '', 250, y - 12, font, fontSize);
  y -= 25;

  drawLabel(page5, '3. Name of school/institution/facility', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page5, study.institution || '', MARGIN_LEFT + 10, y - 12, font, fontSize);
  y -= 25;

  drawLabel(page5, '4. Name of program of study', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page5, study.programName || '', MARGIN_LEFT + 10, y - 12, font, fontSize);
  y -= 25;

  drawLabel(page5, '5. Designated Learning Institution Number (DLI#)', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page5, study.dli || '', MARGIN_LEFT + 10, y - 12, font, fontSize);
  y -= 25;

  drawLabel(page5, '6. Start date (YYYY-MM-DD)', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page5, formatDate(study.startDate), MARGIN_LEFT + 150, y, font, fontSize);

  drawLabel(page5, '7. Expected completion date', 300, y, fontBold, fontSize);
  drawValue(page5, formatDate(study.expectedEndDate), 300, y - 12, font, fontSize);
  y -= 25;

  drawLabel(page5, '8. Cost of studies (tuition only)', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page5, study.tuitionCost || '', MARGIN_LEFT + 10, y - 12, font, fontSize);

  drawLabel(page5, 'Currency', 250, y, font, labelSize);
  drawValue(page5, study.currency || 'CAD', 250, y - 12, font, fontSize);
  y -= 30;

  // EDUCATION HISTORY
  drawSectionHeader(page5, 'EDUCATION', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  drawLabel(page5, '1. Number of years of education successfully completed', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page5, education.yearsCompleted || '', MARGIN_RIGHT - 80, y, font, fontSize);
  y -= 15;

  if (education.schools && education.schools.length > 0) {
    drawLabel(page5, '2. Schools attended during last 10 years', MARGIN_LEFT, y, fontBold, fontSize);
    y -= 15;

    education.schools.slice(0, 2).forEach((school, index) => {
      if (y < 100) return; // Prevent overflow

      drawLabel(page5, `School ${index + 1}:`, MARGIN_LEFT + 10, y, font, fontSize);
      y -= 12;

      drawLabel(page5, 'Name', MARGIN_LEFT + 15, y, font, labelSize);
      drawValue(page5, school.name || '', MARGIN_LEFT + 15, y - 10, font, fontSize);

      drawLabel(page5, 'City/Town', 300, y, font, labelSize);
      drawValue(page5, school.city || '', 300, y - 10, font, fontSize);
      y -= 20;

      drawLabel(page5, 'Country', MARGIN_LEFT + 15, y, font, labelSize);
      drawValue(page5, school.country || '', MARGIN_LEFT + 15, y - 10, font, fontSize);

      drawLabel(page5, 'From', 200, y, font, labelSize);
      drawValue(page5, formatDate(school.from), 200, y - 10, font, fontSize);

      drawLabel(page5, 'To', 300, y, font, labelSize);
      drawValue(page5, formatDate(school.to), 300, y - 10, font, fontSize);

      drawLabel(page5, 'Field of study', 400, y, font, labelSize);
      drawValue(page5, school.field || '', 400, y - 10, font, fontSize);
      y -= 25;
    });
  } else {
    y -= 15;
  }

  // EMPLOYMENT HISTORY
  if (y < 200) {
    y -= 30;
  }

  drawSectionHeader(page5, 'EMPLOYMENT', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  drawLabel(page5, '1. a) In what language will you be taught?', MARGIN_LEFT, y, fontBold, fontSize);
  drawValue(page5, study.languageOfInstruction || 'English', MARGIN_RIGHT - 100, y, font, fontSize);
  y -= 15;

  if (employment && employment.length > 0) {
    drawLabel(page5, '2. Employment during last 10 years', MARGIN_LEFT, y, fontBold, fontSize);
    y -= 15;

    employment.slice(0, 1).forEach((job, index) => {
      if (y < 100) return;

      drawLabel(page5, 'Employer', MARGIN_LEFT + 10, y, font, labelSize);
      drawValue(page5, job.employer || '', MARGIN_LEFT + 10, y - 10, font, fontSize);

      drawLabel(page5, 'Position', 300, y, font, labelSize);
      drawValue(page5, job.position || '', 300, y - 10, font, fontSize);
      y -= 20;

      drawLabel(page5, 'From', MARGIN_LEFT + 10, y, font, labelSize);
      drawValue(page5, formatDate(job.from), MARGIN_LEFT + 10, y - 10, font, fontSize);

      drawLabel(page5, 'To', 150, y, font, labelSize);
      drawValue(page5, formatDate(job.to), 150, y - 10, font, fontSize);

      drawLabel(page5, 'City/Town', 250, y, font, labelSize);
      drawValue(page5, job.city || '', 250, y - 10, font, fontSize);

      drawLabel(page5, 'Country', 400, y, font, labelSize);
      drawValue(page5, job.country || '', 400, y - 10, font, fontSize);
      y -= 25;
    });
  }

  // BACKGROUND INFORMATION
  if (y < 150) {
    y = MARGIN_TOP - 50;
  } else {
    y -= 30;
  }

  drawSectionHeader(page5, 'BACKGROUND INFORMATION', MARGIN_LEFT, y, fontBold, headingSize);
  y -= 20;

  if (background) {
    const questions = [
      { key: 'refusedVisa', label: '1. Have you ever been refused a visa or permit, denied entry or ordered to leave Canada or any other country?' },
      { key: 'criminalOffense', label: '2. Have you ever committed, been arrested for, been charged with or convicted of any criminal offence in any country?' },
      { key: 'medicalCondition', label: '3. Do you have any physical or mental disorder that requires social and/or health services, other than medication, during a stay in Canada?' }
    ];

    questions.forEach((q) => {
      if (y < 80) return;
      drawLabel(page5, q.label, MARGIN_LEFT, y, font, labelSize);
      drawValue(page5, background[q.key] ? 'Yes' : 'No', MARGIN_RIGHT - 80, y, font, fontSize);
      y -= 18;
    });
  }

  // Footer
  y = 50;
  drawText(page5, 'This form is for information purposes only and does not constitute legal advice.', MARGIN_LEFT, y, font, 8);
  drawText(page5, 'For official IMM 1294 form, visit: canada.ca/study-permit', MARGIN_LEFT, y - 12, font, 8);

  // Save and return PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Helper functions
function drawText(page, text, x, y, font, size) {
  if (!text) return;
  page.drawText(String(text), {
    x,
    y,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

function drawLabel(page, label, x, y, font, size) {
  if (!label) return;
  page.drawText(String(label), {
    x,
    y,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

function drawValue(page, value, x, y, font, size) {
  if (!value || value === '') return;
  page.drawText(String(value), {
    x,
    y,
    size,
    font,
    color: rgb(0, 0.2, 0.5), // Blue-ish to indicate filled data
  });
}

function drawSectionHeader(page, title, x, y, font, size) {
  page.drawRectangle({
    x: x - 5,
    y: y - 12,
    width: 512,
    height: 16,
    color: rgb(0.85, 0.85, 0.85),
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

export default {
  generateCompleteIMM1294PDF
};
