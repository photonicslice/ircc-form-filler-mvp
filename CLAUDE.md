# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IRCC Study Permit Form-Filler MVP - Web application for filling Canadian IRCC Study Permit applications with validation and PDF generation.

**Stack:** React 18 + TypeScript + Vite (frontend) | Node.js + Express ES modules (backend) | pdf-lib

## Development Commands

### Backend (port 3001)
```bash
cd backend
npm install
npm run dev          # Start with nodemon
npm start            # Production server
```

**Utility scripts:**
- `npm run extract-fields` - Extract PDF form fields from template
- `npm run test-pdf` - Test PDF template loading
- `npm run playwright-install` - Install browser automation

### Frontend (port 5173)
```bash
cd frontend
npm install
npm run dev         # Vite dev server
npm run build       # TypeScript + Vite build
npm run lint        # ESLint
```

### Kill processes if ports are in use:
```bash
lsof -ti:3001 | xargs kill -9    # Backend
lsof -ti:5173 | xargs kill -9    # Frontend
```

## Architecture Overview

### Multi-Step Form Flow (8 Steps)

The application uses a wizard pattern managed by `FormWizard.tsx`:

1. **PersonalInfo** - Family name, given names, sex, DOB, citizenship, residence
2. **PassportInfo** - Passport number, country of issue, dates
3. **MaritalLanguage** - Marital status + language proficiency (combined step)
4. **ContactInfo** - Email, phone, mailing address
5. **EducationHistory** - Education level, institution, field, graduation year
6. **StudyPurpose** - Canadian institution, DLI, program details
7. **ProofOfFunds** - Tuition, available funds, funding source
8. **ReviewSubmit** - Review and generate PDF

Each step is a separate component in `frontend/src/components/steps/`.

### Data Flow

```
User fills form → FormWizard state → Auto-save to localStorage
                     ↓
Submit → POST /api/pdf/generate-form (JSON formData)
                     ↓
Backend validates & normalizes → pdfFormGenerator.js
                     ↓
PDF created from scratch → Returns PDF bytes
                     ↓
Browser downloads PDF file
```

### Critical: Field Name Migration

**The codebase underwent a field naming change. The backend normalizes both formats:**

| Old (deprecated) | Current | Section |
|---|---|---|
| `firstName` | `familyName` | personalInfo |
| `lastName` | `givenNames` | personalInfo |
| `passportNumber` | `number` | passportInfo |
| `issuingCountry` | `countryOfIssue` | passportInfo |

**Backend normalization:** `backend/src/services/pdfFormGenerator.js:19-31` maps old → new names.

**Always use new field names** when adding features.

### PDF Generation (3 Approaches)

1. **pdfFormGenerator.js** (PRIMARY - used by frontend)
   - Endpoint: `/api/pdf/generate-form`
   - Creates PDF from scratch, no template needed
   - Handles missing fields gracefully

2. **completePdfGenerator.js** (COMPLETE - 147 fields)
   - Endpoint: `/api/pdf/generate-complete-form`
   - Full IMM 1294 implementation
   - Requires strict validation via `completeFormValidator.js`

3. **pdfGenerator.js** (LEGACY - template-based)
   - Endpoint: `/api/pdf/generate`
   - Requires `imm1294e.pdf` template file
   - Has encryption issues with government PDFs

## Key Architecture Patterns

### Type-Driven Development

**Central type definitions:** `frontend/src/types/form.types.ts`

All form interfaces, dropdown options, and the `FORM_STEPS` array are defined here. Changes to form structure start here.

```typescript
export interface FormData {
  personalInfo: PersonalInfo;
  passportInfo: PassportInfo;
  maritalInfo: MaritalInfo;
  languageInfo: LanguageInfo;
  contactInfo: ContactInfo;
  educationHistory: EducationHistory;
  studyPurpose: StudyPurpose;
  proofOfFunds: ProofOfFunds;
}
```

### Validation Architecture

**Dual validation:** Client-side (immediate feedback) + Server-side (security)

- Frontend: `frontend/src/utils/validation.ts` - Section validators for each form step
- Backend: `backend/src/services/validator.js` (basic) + `completeFormValidator.js` (comprehensive)

**Keep validation synchronized** between frontend and backend.

### Nested Field Handling

Components use dot notation for nested fields:

```typescript
const handleChange = (field: string, value: any) => {
  if (field.includes('.')) {
    const [parent, child] = field.split('.');
    // Handle nested update
  } else {
    // Handle flat update
  }
};
```

Example: `telephone.number`, `placeOfBirth.city`, `mailingAddress.streetName`

## API Endpoints

```
POST /api/pdf/generate-form          # Primary PDF generation (no template)
POST /api/pdf/generate-complete-form # Full 147-field PDF
POST /api/pdf/validate                # Validate form data
POST /api/pdf/checklist               # Generate document checklist
POST /api/tips/get-tips               # AI tips (requires OPENAI_API_KEY)
```

**Request format:**
```json
{
  "formData": {
    "personalInfo": { "familyName": "...", "givenNames": "..." },
    "passportInfo": { "number": "...", "countryOfIssue": "..." },
    ...
  }
}
```

## Adding a New Form Field

1. **Update type** in `frontend/src/types/form.types.ts`:
   ```typescript
   export interface PersonalInfo {
     newField: string;  // Add to interface
   }

   export const INITIAL_FORM_DATA: FormData = {
     personalInfo: { newField: '' }  // Add to initial state
   }
   ```

2. **Add to component** (e.g., `PersonalInfo.tsx`):
   ```tsx
   <input
     value={data.newField}
     onChange={(e) => handleChange('newField', e.target.value)}
   />
   ```

3. **Add validation** in `frontend/src/utils/validation.ts`:
   ```typescript
   export function validatePersonalInfoSection(data) {
     const errors = {};
     const result = validateRequired(data.newField, 'New Field');
     if (!result.isValid) errors.newField = result.error!;
     return errors;
   }
   ```

4. **Update PDF generation** in `backend/src/services/pdfFormGenerator.js`

## Environment Variables

### Backend `.env`
```bash
PORT=3001
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-...  # Optional for AI tips
```

### Frontend (Vite auto-loads `.env`)
```bash
VITE_API_URL=http://localhost:3001
```

## Important Constraints

1. **ES Modules:** Backend uses `"type": "module"` - use import/export, not require()
2. **8 Steps Fixed:** FormWizard expects exactly 8 steps. Changing this requires updates to FormWizard.tsx and all step navigation logic
3. **No Database:** MVP uses LocalStorage only - no server-side persistence
4. **Field Names:** Always use new naming convention (familyName, givenNames, number, countryOfIssue)
5. **Validation Sync:** Keep frontend/backend validation rules aligned

## Troubleshooting

**PDF returns JSON error instead of file:**
- Backend received malformed data
- Check request has `formData` wrapper object
- Verify field names match backend expectations

**Validation errors on submit:**
- Open browser console for specific field errors
- Check `validation.ts` for validation rules
- Ensure all required fields in `INITIAL_FORM_DATA` have values

**Port conflicts:**
```bash
lsof -ti:3001 | xargs kill -9  # Kill backend
lsof -ti:5173 | xargs kill -9  # Kill frontend
```

## Reference Documentation

- **Migration Guide:** See `FRONTEND_BACKEND_ALIGNMENT_COMPLETE.md` for field name changes and 6→8 step migration
- **Form Structure:** See `backend/src/models/completeFormStructure.js` for full IMM 1294 field definitions (147 fields)
- **README:** See root `README.md` for MVP features and project structure
