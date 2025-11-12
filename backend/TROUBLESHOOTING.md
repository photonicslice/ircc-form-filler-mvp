# Common Issues and Solutions

## Issue: Empty HTML File Generated

### Problem
When running the test script or curl command, the generated `form-summary.html` file is empty or very small (< 1KB).

### Root Cause
This happens when the endpoint returns a **validation error** instead of the HTML content. The endpoint validates all form data before generating the summary.

### Solution

#### 1. Check the File Contents
```bash
cat form-summary.html
```

If you see JSON with validation errors like this:
```json
{
  "success": false,
  "error": "Form data contains validation errors",
  "validation": {
    "errors": {
      "studyPurpose": {
        "dli": "DLI number must start with \"O\" followed by 9 digits",
        "programStartDate": "Program start date must be at least 3 months from today"
      }
    }
  }
}
```

Then your form data has validation errors.

#### 2. Common Validation Errors

| Field | Error | Fix |
|-------|-------|-----|
| `dli` | DLI number format invalid | Must be exactly O + 9 digits (e.g., `O123456789`) |
| `programStartDate` | Must be 3+ months in future | Use future date (e.g., `2026-09-01`) |
| `dateOfBirth` | Invalid format | Use YYYY-MM-DD format |
| `email` | Invalid email | Use valid email format |
| `passportExpiryDate` | Must be at least 6 months valid | Ensure expiry is > 6 months from now |

#### 3. Test with Valid Data

Before running npm install, make sure you have valid test data:

**Valid Example:**
```json
{
  "formData": {
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
      "dli": "O123456789",
      "programName": "Master of Computer Science",
      "programLevel": "masters",
      "programStartDate": "2026-09-01",
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
  }
}
```

**Key Points:**
- ✅ `dli`: Exactly 9 digits after "O"
- ✅ `programStartDate`: Future date (at least 3 months from today)
- ✅ `passportExpiryDate`: At least 6 months validity remaining
- ✅ All required fields present
- ✅ Data wrapped in `formData` object

## Issue: Dependencies Not Installed

### Problem
Server fails to start with error:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express'
```

### Solution
```bash
cd backend
npm install
npm start
```

## Issue: Port Already in Use

### Problem
Server fails to start:
```
Error: listen EADDRINUSE: address already in use :::3001
```

### Solution

**Option 1: Kill existing process**
```bash
lsof -ti:3001 | xargs kill -9
npm start
```

**Option 2: Use different port**
Edit `backend/src/server.js`:
```javascript
const PORT = process.env.PORT || 3002;  // Changed from 3001
```

## Testing Workflow

### Quick Test (Recommended)
```bash
cd backend
npm install          # Install dependencies (first time only)
npm start            # Start server (keep running)

# In another terminal:
./test-summary-endpoint.sh
open form-summary.html
```

### Manual Test
```bash
cd backend
npm install
npm start &

# Wait 2 seconds for server to start
sleep 2

# Test endpoint
curl -X POST http://localhost:3001/api/pdf/generate-summary \
  -H "Content-Type: application/json" \
  -d @test-data.json \
  -o output.html

# Check file size (should be ~9KB)
ls -lh output.html

# View in browser
open output.html
```

### Validation-Only Test
To check if your data is valid without generating the summary:
```bash
curl -X POST http://localhost:3001/api/pdf/validate \
  -H "Content-Type: application/json" \
  -d '{"formData": {...}}' | jq
```

This returns validation results without generating HTML.

## Checking What Went Wrong

### 1. Check Server Logs
```bash
# If you started with npm start in background
tail -f backend/server.log

# Or check the terminal where npm start is running
```

### 2. Test the Server is Running
```bash
curl http://localhost:3001/api/pdf/test
```

Should return:
```json
{
  "success": true,
  "message": "PDF routes are working",
  "availableEndpoints": [...]
}
```

### 3. Validate Your Data First
```bash
curl -X POST http://localhost:3001/api/pdf/validate \
  -H "Content-Type: application/json" \
  -d '{"formData": {...}}' | jq
```

### 4. Check File Size
```bash
ls -lh form-summary.html
```

- **< 1KB**: Likely validation error (open file to see JSON error)
- **~9KB**: Success! HTML was generated

## Expected Behavior

When everything works correctly:

1. ✅ Server starts on port 3001
2. ✅ POST request returns 200 status
3. ✅ Generated file is ~9KB
4. ✅ HTML file opens in browser showing formatted form data
5. ✅ File includes styling, instructions, and all form sections

## Need Help?

If you're still having issues:

1. Check the validation errors in the JSON response
2. Ensure all required fields are present
3. Verify data formats (dates, DLI number, email)
4. Run `npm install` again to ensure dependencies are installed
5. Check server logs for error messages
6. Test with the exact sample data from `test-summary-endpoint.sh`
