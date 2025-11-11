/**
 * Data Summary Generator
 * Generates a formatted summary of form data that users can reference
 * while manually filling the encrypted PDF form
 *
 * This is the most reliable solution for encrypted government forms
 */

/**
 * Generate HTML data summary
 * @param {object} formData - Complete form data
 * @returns {string} - HTML content
 */
export function generateHTMLSummary(formData) {
  const personalInfo = formData.personalInfo || {};
  const passportInfo = formData.passportInfo || {};
  const educationHistory = formData.educationHistory || {};
  const studyPurpose = formData.studyPurpose || {};
  const proofOfFunds = formData.proofOfFunds || {};

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IMM 1294 Form Data Summary</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        h2 {
            color: #34495e;
            background: #ecf0f1;
            padding: 12px 20px;
            border-left: 4px solid #3498db;
            margin-top: 30px;
            margin-bottom: 20px;
        }
        .field {
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 20px;
        }
        .field-label {
            font-weight: 600;
            color: #555;
        }
        .field-value {
            color: #2c3e50;
            font-size: 16px;
            font-weight: 500;
        }
        .empty-value {
            color: #999;
            font-style: italic;
        }
        .instructions {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 30px 0;
            border-radius: 5px;
        }
        .instructions h3 {
            margin-top: 0;
            color: #856404;
        }
        .instructions ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin: 8px 0;
            color: #856404;
        }
        @media print {
            body {
                background: white;
                margin: 0;
            }
            .container {
                box-shadow: none;
                padding: 20px;
            }
            .instructions {
                page-break-before: avoid;
            }
        }
        .print-button {
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin: 20px 0;
        }
        .print-button:hover {
            background: #2980b9;
        }
        @media print {
            .print-button {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 IMM 1294 Form Data Summary</h1>

        <div class="instructions">
            <h3>📝 How to Use This Summary</h3>
            <ol>
                <li><strong>Download</strong> the official IMM 1294 PDF from IRCC</li>
                <li><strong>Open</strong> the PDF in Adobe Acrobat Reader DC</li>
                <li><strong>Print this page</strong> or keep it on a second screen</li>
                <li><strong>Copy values</strong> from this summary into the PDF form</li>
                <li><strong>Review</strong> all fields for accuracy before submitting</li>
            </ol>
            <p><strong>Tip:</strong> You can print this summary (Ctrl+P / Cmd+P) for easy reference.</p>
        </div>

        <button class="print-button" onclick="window.print()">🖨️ Print This Summary</button>

        <h2>Section 1: Personal Information</h2>
        ${generateField('Given Name (First Name)', personalInfo.firstName)}
        ${generateField('Family Name (Last Name)', personalInfo.lastName)}
        ${generateField('Date of Birth', formatDate(personalInfo.dateOfBirth))}
        ${generateField('Nationality', personalInfo.nationality)}
        ${generateField('Country of Residence', personalInfo.countryOfResidence)}
        ${generateField('Email Address', personalInfo.email)}
        ${generateField('Phone Number', personalInfo.phone)}

        <h2>Section 2: Passport Information</h2>
        ${generateField('Passport Number', passportInfo.passportNumber)}
        ${generateField('Passport Issue Date', formatDate(passportInfo.issueDate))}
        ${generateField('Passport Expiry Date', formatDate(passportInfo.expiryDate))}
        ${generateField('Passport Issuing Country', passportInfo.issuingCountry)}

        <h2>Section 3: Education History</h2>
        ${generateField('Highest Level of Education', formatEducationLevel(educationHistory.highestEducation))}
        ${generateField('Institution Name', educationHistory.institutionName)}
        ${generateField('Field of Study', educationHistory.fieldOfStudy)}
        ${generateField('Graduation Year', educationHistory.graduationYear)}

        <h2>Section 4: Study Purpose in Canada</h2>
        ${generateField('Canadian Educational Institution', studyPurpose.canadianInstitution)}
        ${generateField('DLI Number', studyPurpose.dli)}
        ${generateField('Program Name', studyPurpose.programName)}
        ${generateField('Program Level', formatProgramLevel(studyPurpose.programLevel))}
        ${generateField('Program Start Date', formatDate(studyPurpose.programStartDate))}
        ${generateField('Program Duration', studyPurpose.programDuration ? `${studyPurpose.programDuration} months` : '')}
        ${generateField('Letter of Acceptance', studyPurpose.hasLetterOfAcceptance ? 'Yes' : 'No')}

        <h2>Section 5: Proof of Financial Support</h2>
        ${generateField('Annual Tuition Fees', proofOfFunds.annualTuitionFees ? `CAD $${formatCurrency(proofOfFunds.annualTuitionFees)}` : '')}
        ${generateField('Available Funds', proofOfFunds.availableFunds ? `CAD $${formatCurrency(proofOfFunds.availableFunds)}` : '')}
        ${generateField('Source of Funding', formatFundingSource(proofOfFunds.fundingSource))}
        ${generateField('Have Sponsor?', proofOfFunds.hasSponsor ? 'Yes' : 'No')}
        ${proofOfFunds.hasSponsor ? generateField('Sponsor Relationship', proofOfFunds.sponsorRelationship) : ''}

        <div class="instructions" style="margin-top: 40px;">
            <h3>✅ Before Submitting</h3>
            <ol>
                <li>Double-check all fields for accuracy</li>
                <li>Ensure dates are in the correct format (YYYY-MM-DD or as required)</li>
                <li>Verify passport number and DLI number</li>
                <li>Attach all required supporting documents</li>
                <li>Save a copy of the filled PDF for your records</li>
            </ol>
        </div>

        <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 14px;">
            Generated on: ${new Date().toLocaleString()}<br>
            Form: IMM 1294 - Application for Study Permit Made Outside of Canada
        </p>
    </div>
</body>
</html>
`;

  return html;
}

/**
 * Generate a field row
 */
function generateField(label, value) {
  const displayValue = value || '<em class="empty-value">Not provided</em>';
  return `
    <div class="field">
        <div class="field-label">${label}:</div>
        <div class="field-value">${displayValue}</div>
    </div>
  `;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  if (!amount) return '';
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
  return levels[level] || level || '';
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
  return levels[level] || level || '';
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
  return sources[source] || source || '';
}

export default {
  generateHTMLSummary
};
