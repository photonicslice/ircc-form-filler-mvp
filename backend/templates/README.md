# PDF Template Setup

## Required File

Please place the IMM 1294 PDF template in this directory:

```
backend/templates/imm1294e.pdf
```

## How to Get the Template

1. Download the official IMM 1294 form from IRCC:
   https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/application-study-permit-made-outside-canada.html

2. Save it as `imm1294e.pdf` in this directory

## Extracting Form Fields

After placing the PDF template, run this command to extract the form fields:

```bash
cd backend
node src/utils/extractFormFields.js
```

This will:
- Extract all form fields from the PDF
- Create a `field-mapping.json` file with field names and types
- Help you map your application fields to the PDF form fields

## Note

The PDF template is tracked in git (exception added to .gitignore) to ensure consistent form filling across deployments.
