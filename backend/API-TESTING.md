# API Testing Guide

## Testing XFDF Generation Endpoint

### Method 1: Using npm script (Easiest)

This generates a sample XFDF file directly without needing the server running:

```bash
cd backend
npm run test-xfdf
```

This will:
- Generate XFDF from sample data
- Save to `backend/templates/test-sample.xfdf`
- Show preview of the XFDF content
- Give you next steps for testing import

### Method 2: Using curl (Server must be running)

**1. Start the server:**
```bash
cd backend
npm run dev
```

**2. In another terminal, send a POST request:**

```bash
curl -X POST http://localhost:3001/api/pdf/generate-xfdf \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {
      "personalInfo": {
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1995-05-15",
        "nationality": "Canadian",
        "countryOfResidence": "Canada",
        "email": "john.doe@example.com",
        "phone": "+1-555-0123"
      },
      "passportInfo": {
        "passportNumber": "AB123456",
        "issueDate": "2020-01-15",
        "expiryDate": "2030-01-14",
        "issuingCountry": "Canada"
      },
      "educationHistory": {
        "highestEducation": "bachelors",
        "institutionName": "University of Toronto",
        "fieldOfStudy": "Computer Science",
        "graduationYear": "2018"
      },
      "studyPurpose": {
        "canadianInstitution": "McGill University",
        "dli": "O19391131572",
        "programName": "Master of Computer Science",
        "programLevel": "masters",
        "programStartDate": "2025-09-01",
        "programDuration": "24",
        "hasLetterOfAcceptance": true
      },
      "proofOfFunds": {
        "annualTuitionFees": "25000",
        "availableFunds": "50000",
        "fundingSource": "personal_savings",
        "hasSponsor": false
      }
    }
  }' \
  --output test-output.xfdf
```

**3. Check the downloaded file:**
```bash
cat test-output.xfdf
```

### Method 3: Using Postman or Insomnia

**Endpoint:** `POST http://localhost:3001/api/pdf/generate-xfdf`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "formData": {
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1995-05-15",
      "nationality": "Canadian",
      "countryOfResidence": "Canada",
      "email": "john.doe@example.com",
      "phone": "+1-555-0123"
    },
    "passportInfo": {
      "passportNumber": "AB123456",
      "issueDate": "2020-01-15",
      "expiryDate": "2030-01-14",
      "issuingCountry": "Canada"
    },
    "educationHistory": {
      "highestEducation": "bachelors",
      "institutionName": "University of Toronto",
      "fieldOfStudy": "Computer Science",
      "graduationYear": "2018"
    },
    "studyPurpose": {
      "canadianInstitution": "McGill University",
      "dli": "O19391131572",
      "programName": "Master of Computer Science",
      "programLevel": "masters",
      "programStartDate": "2025-09-01",
      "programDuration": "24",
      "hasLetterOfAcceptance": true
    },
    "proofOfFunds": {
      "annualTuitionFees": "25000",
      "availableFunds": "50000",
      "fundingSource": "personal_savings",
      "hasSponsor": false
    }
  }
}
```

The response will be the XFDF file which you can save.

## Testing Other Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Validate Form Data
```bash
curl -X POST http://localhost:3001/api/pdf/validate \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {
      "personalInfo": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }'
```

### Generate Checklist
```bash
curl -X POST http://localhost:3001/api/pdf/checklist \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {
      "personalInfo": {
        "firstName": "John"
      },
      "studyPurpose": {
        "hasLetterOfAcceptance": true
      },
      "proofOfFunds": {
        "hasSponsor": true
      }
    }
  }'
```

## Testing XFDF Import in Adobe Reader

After generating the XFDF file:

1. **Open the official IMM 1294 PDF** in Adobe Acrobat Reader
2. **Go to:** File → Import → Form Data
3. **Select** your generated `.xfdf` file
4. **Verify** fields auto-fill correctly
5. **Check** which fields are blank (need mapping updates)

## Troubleshooting

### Error: "Form data is required"
**Cause:** Request body is missing or malformed

**Solution:** Ensure you're sending JSON with a `formData` object

### Fields don't fill after import
**Cause:** Field names in XFDF don't match PDF field names

**Solution:**
1. Run `npm run extract-fields` to get actual field names
2. Update `backend/templates/field-mapping.json`
3. Regenerate the XFDF

### CORS errors in browser
**Cause:** Frontend and backend on different origins

**Solution:** Ensure backend CORS is configured (already done in server.js)

## Expected Response Format

### Success (XFDF file):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
    <fields>
        <field name="form1[0].Page1[0].GivenName[0]">
            <value>John</value>
        </field>
        <!-- more fields -->
    </fields>
    <f href="imm1294e.pdf"/>
</xfdf>
```

### Error Response:
```json
{
  "success": false,
  "error": "Form data contains validation errors",
  "validation": {
    "isValid": false,
    "errors": [...]
  }
}
```
