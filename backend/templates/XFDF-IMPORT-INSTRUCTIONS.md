# How to Import XFDF Data into IMM 1294 Form

## What is XFDF?

XFDF (XML Forms Data Format) is a data file that contains your form field values. Instead of modifying the PDF directly (which can cause issues with encrypted forms), you import this data file into the official PDF form.

## Step-by-Step Instructions

### Option 1: Using Adobe Acrobat Reader (Recommended)

1. **Download the files:**
   - Download the `imm1294e-data.xfdf` file from our application
   - Download the official IMM 1294 PDF from IRCC (if you don't have it already)
   - Keep both files in the same folder

2. **Open the PDF form:**
   - Open the official IMM 1294 PDF in Adobe Acrobat Reader
   - Make sure it's the **blank** form (not filled)

3. **Import the XFDF data:**
   - In Adobe Acrobat Reader, go to: **File → Import → Form Data**
   - Select your `imm1294e-data.xfdf` file
   - Click "Open"

4. **Review and save:**
   - The form fields will auto-fill with your data
   - Review all fields for accuracy
   - Make any necessary corrections
   - Save the filled PDF: **File → Save As**

### Option 2: Using Preview (Mac) - May Not Work

Preview on Mac has limited XFDF support. If import doesn't work:
- Use Adobe Acrobat Reader (free download)
- Or manually copy the values from the XFDF file

### Option 3: Using Online Tools

If you don't want to install Adobe Reader:
- Use online PDF form filler tools
- Upload both the PDF and XFDF file
- Some tools support XFDF import

## Troubleshooting

### "Import Data" option is greyed out

**Solution:** The PDF must have fillable form fields. Ensure you downloaded the official fillable IMM 1294 form from IRCC, not a flat PDF.

### Fields don't auto-fill after import

**Possible causes:**
1. Field names in XFDF don't match PDF field names
   - Solution: Run `npm run extract-fields` to get correct field names
   - Update the field mapping in `field-mapping.json`

2. PDF is a different version
   - Solution: Ensure you're using the same PDF version as the XFDF was generated for

### Some fields are blank

This is normal if:
- The field wasn't filled in the web form
- The field name mapping is missing
- The PDF field name changed in a newer version

**Solution:** Manually fill in the blank fields in Adobe Reader

## Benefits of XFDF Method

✅ **No PDF corruption:** Works with encrypted government forms
✅ **Official form:** Uses the unmodified official PDF
✅ **Accepted by IRCC:** Ensures compatibility with submission systems
✅ **Easy corrections:** Can manually edit fields after import
✅ **Reusable:** Keep the XFDF file as a backup of your data

## Technical Details

### XFDF File Format

The XFDF file is a simple XML file containing:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
    <fields>
        <field name="form1[0].Page1[0].FirstName[0]">
            <value>John</value>
        </field>
        <!-- more fields -->
    </fields>
    <f href="imm1294e.pdf"/>
</xfdf>
```

### Viewing XFDF Contents

You can open the XFDF file in any text editor to:
- Verify your data
- See which fields were filled
- Manually edit values if needed

### Field Name Mapping

To see which form fields are available:
```bash
cd backend
npm run extract-fields
```

This generates `field-mapping.json` showing all PDF field names.

## Need Help?

If you encounter issues:
1. Ensure you have Adobe Acrobat Reader (not just Preview/browser)
2. Verify the PDF is the official fillable version from IRCC
3. Check that both PDF and XFDF are in the same folder
4. Try downloading a fresh copy of the IMM 1294 form

## Alternative: Manual PDF Filling

If XFDF import doesn't work, you can:
1. Open the XFDF file in a text editor
2. View your form data values
3. Manually type them into the PDF form

This defeats the purpose of automation but ensures you get a filled form.
