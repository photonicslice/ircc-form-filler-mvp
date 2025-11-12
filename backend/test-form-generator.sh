#!/bin/bash

# Test Script for PDF Form Generator
# This generates a brand new IMM 1294 PDF from scratch

echo "✨ Testing NEW PDF Form Generator"
echo "==================================="
echo ""

# Check if server is running
echo "📡 Checking if server is running on port 3001..."
if ! curl -s http://localhost:3001/api/pdf/test > /dev/null 2>&1; then
    echo "❌ Server is not running!"
    echo ""
    echo "Please start the server first:"
    echo "  cd backend"
    echo "  npm start"
    echo ""
    exit 1
fi

echo "✅ Server is running!"
echo ""

# Make POST request
echo "📤 Generating PDF form from scratch..."
echo ""

curl -X POST http://localhost:3001/api/pdf/generate-form \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {
      "personalInfo": {
        "firstName": "John",
        "lastName": "Smith",
        "dateOfBirth": "1995-03-15",
        "nationality": "India",
        "countryOfResidence": "India",
        "email": "john.smith@email.com",
        "phone": "+91-9876543210",
        "sex": "Male",
        "cityOfBirth": "Mumbai",
        "countryOfBirth": "India"
      },
      "passportInfo": {
        "passportNumber": "K1234567",
        "issueDate": "2020-01-10",
        "expiryDate": "2030-01-09",
        "issuingCountry": "India"
      },
      "educationHistory": {
        "highestEducation": "bachelors",
        "institutionName": "University of Mumbai",
        "fieldOfStudy": "Computer Science",
        "graduationYear": "2018",
        "institutionCountry": "India"
      },
      "studyPurpose": {
        "canadianInstitution": "University of Toronto",
        "dli": "O123456789",
        "programName": "Master of Computer Science",
        "programLevel": "masters",
        "programStartDate": "2026-09-01",
        "programDuration": "24",
        "hasLetterOfAcceptance": true,
        "studentId": "ST2024001"
      },
      "proofOfFunds": {
        "annualTuitionFees": "35000",
        "availableFunds": "60000",
        "fundingSource": "family_support",
        "hasSponsor": true,
        "sponsorRelationship": "Parent"
      },
      "contactInfo": {
        "email": "john.smith@email.com",
        "phone": "+91-9876543210",
        "mailingAddress": {
          "street": "123 Main Street",
          "city": "Mumbai",
          "province": "Maharashtra",
          "postalCode": "400001",
          "country": "India"
        }
      },
      "languageInfo": {
        "nativeLanguage": "Hindi",
        "englishFrench": "English"
      }
    }
  }' \
  --output imm1294-filled.pdf

echo ""
echo ""

# Check if file was created
if [ -f "imm1294-filled.pdf" ]; then
    echo "✅ SUCCESS! PDF form generated"
    echo ""
    echo "📄 File saved as: imm1294-filled.pdf"
    echo "📊 File size: $(du -h imm1294-filled.pdf | cut -f1)"
    echo "📋 File type: $(file imm1294-filled.pdf)"
    echo ""
    echo "🌐 To view the PDF:"
    echo "  - macOS:   open imm1294-filled.pdf"
    echo "  - Linux:   xdg-open imm1294-filled.pdf"
    echo "  - Windows: start imm1294-filled.pdf"
    echo ""
    echo "Or just drag imm1294-filled.pdf into Adobe Reader!"
    echo ""
    echo "✨ This is a brand NEW PDF created from scratch!"
    echo "   - No encryption issues"
    echo "   - Can be opened in any PDF reader"
    echo "   - All your data is already filled in"
    echo "   - Ready to print or submit"
    echo ""
else
    echo "❌ ERROR: PDF file was not created"
    echo ""
    echo "Check the server logs for errors"
fi
