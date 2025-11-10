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

## Testing the PDF Template

After placing the PDF template, test if it can be loaded and filled:

```bash
cd backend
npm run test-pdf
```

This will:
- Load the PDF template
- Check for form fields
- Attempt to fill a test field
- Save a test output PDF
- Verify the output is valid

If the test passes, you'll find a `test-output.pdf` in this directory that you can open to verify.

## Extracting Form Fields

After verifying the template works, extract the form fields:

```bash
cd backend
npm run extract-fields
```

This will:
- Extract all form fields from the PDF
- Create a `field-mapping.json` file with field names and types
- Help you map your application fields to the PDF form fields

## Troubleshooting

### Error 132 when opening PDFs

If Adobe Reader shows "Error 132", the PDF might be encrypted with restrictions. Try:

1. Opening the original PDF in Adobe Reader
2. Print to PDF (File > Print > Save as PDF) to create an unencrypted version
3. Use the unencrypted version as your template

### No form fields found

If the PDF has no fillable fields, it's a flat PDF. You'll need the official fillable version from IRCC.

## Note

The PDF template is tracked in git (exception added to .gitignore) to ensure consistent form filling across deployments.
