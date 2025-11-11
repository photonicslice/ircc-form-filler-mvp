#!/bin/bash

# Test Script for HTML Summary Endpoint
# This demonstrates how to POST to the /api/pdf/generate-summary endpoint

echo "🧪 Testing HTML Data Summary Endpoint"
echo "======================================"
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
echo "📤 Sending POST request with form data..."
echo ""

curl -X POST http://localhost:3001/api/pdf/generate-summary \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "firstName": "John",
      "lastName": "Smith",
      "dateOfBirth": "1995-03-15",
      "nationality": "India",
      "countryOfResidence": "India",
      "email": "john.smith@email.com",
      "phone": "+91-9876543210"
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
      "graduationYear": "2018"
    },
    "studyPurpose": {
      "canadianInstitution": "University of Toronto",
      "dli": "O19391173552",
      "programName": "Master of Computer Science",
      "programLevel": "masters",
      "programStartDate": "2024-09-01",
      "programDuration": "24",
      "hasLetterOfAcceptance": true
    },
    "proofOfFunds": {
      "annualTuitionFees": "35000",
      "availableFunds": "60000",
      "fundingSource": "family_support",
      "hasSponsor": true,
      "sponsorRelationship": "Parent"
    }
  }' \
  --output form-summary.html

echo ""
echo ""

# Check if file was created
if [ -f "form-summary.html" ]; then
    echo "✅ SUCCESS! HTML summary generated"
    echo ""
    echo "📄 File saved as: form-summary.html"
    echo "📊 File size: $(du -h form-summary.html | cut -f1)"
    echo ""
    echo "🌐 To view the HTML summary:"
    echo "  - macOS:   open form-summary.html"
    echo "  - Linux:   xdg-open form-summary.html"
    echo "  - Windows: start form-summary.html"
    echo ""
    echo "Or just drag form-summary.html into your browser!"
    echo ""
    echo "📝 Next Steps:"
    echo "  1. Open the HTML file in your browser"
    echo "  2. Download IMM 1294 PDF from IRCC website"
    echo "  3. Open PDF in Adobe Reader"
    echo "  4. Manually copy values from HTML → PDF"
    echo ""
else
    echo "❌ ERROR: HTML file was not created"
    echo ""
    echo "Check the server logs for errors"
fi
