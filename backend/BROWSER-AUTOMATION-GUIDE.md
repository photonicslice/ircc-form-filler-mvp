# Browser Automation Solution for Encrypted PDFs

## ⭐ Why This Approach?

**Problem:** The IMM 1294 PDF is encrypted and blocks:
- ❌ Programmatic PDF modification (Error 132)
- ❌ XFDF import functionality
- ❌ Direct field access via pdf-lib

**Solution:** Browser automation simulates human interaction:
- ✅ Bypasses encryption completely
- ✅ Works exactly like manual filling
- ✅ No PDF structure modification
- ✅ Guaranteed compatibility

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd backend
npm install
npm run playwright-install
```

This installs Playwright and Chromium browser.

### Step 2: Map PDF Fields

You need to map form fields to tab order (one-time setup):

```bash
npm run map-fields
```

This will:
1. Open the PDF in a browser
2. Demonstrate TAB navigation
3. Generate `field-mapping-automation.json` template
4. Keep browser open for you to map fields

**While the browser is open:**
- Click on the PDF
- Press TAB repeatedly
- Note which field highlights at each tab press
- Update `backend/templates/field-mapping-automation.json` with correct tab indices

### Step 3: Test the Automation

```bash
npm run test-automation
```

This will:
1. Open browser (visible, not headless)
2. Open the PDF
3. Fill fields using sample data
4. Save filled PDF to `backend/templates/test-browser-filled.pdf`

Watch it work in real-time!

### Step 4: Verify and Adjust

1. Open `test-browser-filled.pdf`
2. Check if fields are filled correctly
3. If wrong fields are filled, adjust `tabIndex` in mapping file
4. Run test again until perfect

## 📝 How It Works

### TAB Navigation Method

The automation uses keyboard navigation to fill the form:

```javascript
1. Focus on PDF
2. Press TAB (moves to first field)
3. Type value
4. Press TAB (moves to next field)
5. Type value
6. Repeat until all fields filled
7. Save PDF
```

This mimics exactly how a human would fill the form.

### Field Mapping Structure

`backend/templates/field-mapping-automation.json`:

```json
{
  "firstName": {
    "tabIndex": 1,
    "description": "Given Name / First Name"
  },
  "lastName": {
    "tabIndex": 2,
    "description": "Family Name / Last Name"
  },
  "dateOfBirth": {
    "tabIndex": 3,
    "description": "Date of Birth"
  }
}
```

**tabIndex** = Which TAB press number reaches this field

### Alternative: Coordinate Method

If TAB order doesn't work well, you can use coordinates:

```json
{
  "firstName": {
    "coordinates": {"x": 150, "y": 200},
    "description": "Given Name / First Name"
  }
}
```

The automation will click at (x, y) then type the value.

## 🛠️ Integration with Your API

### Option 1: Generate Filled PDF (Server-side)

**Endpoint:** `POST /api/pdf/generate-automation`

```javascript
router.post('/generate-automation', async (req, res) => {
  const { formData } = req.body;
  const outputPath = path.join(tmpdir(), 'filled-form.pdf');

  await fillPDFWithBrowser(formData, outputPath);

  res.download(outputPath, 'imm1294e-filled.pdf');
});
```

**Pros:**
- User gets filled PDF directly
- No manual steps

**Cons:**
- Requires server with display (or Xvfb for headless)
- Slower than other methods
- Resource intensive

### Option 2: Desktop Application

**Better for production:**
1. Create Electron app
2. User downloads app
3. App runs automation locally
4. No server requirements

### Option 3: Browser Extension

**For client-side:**
1. Create Chrome/Firefox extension
2. Extension runs automation in user's browser
3. User keeps control of their data

## 📋 Complete Workflow

### For Development:

```bash
# 1. Install dependencies
npm install
npm run playwright-install

# 2. Map fields (one-time)
npm run map-fields
# (Keep browser open, press TAB, note field order)
# Edit backend/templates/field-mapping-automation.json

# 3. Test automation
npm run test-automation
# Verify test-browser-filled.pdf

# 4. Adjust and repeat until perfect
# Edit tabIndex values
npm run test-automation

# 5. Integrate with API
# Add route in pdf.routes.js
```

### For Production:

```bash
# Option A: Server deployment
# - Need display server (Xvfb)
# - Or use visible browser on Windows/Mac server

# Option B: Desktop app (Recommended)
# - Package with Electron
# - Distribute to users
# - Runs locally

# Option C: Browser extension
# - Chrome Web Store
# - Firefox Add-ons
# - User installs extension
```

## 🔧 Configuration Options

### Browser Settings

In `browserPdfFiller.js`:

```javascript
const browser = await chromium.launch({
  headless: false, // Show browser (set true for production)
  slowMo: 100,    // Delay between actions (ms)
  args: [
    '--disable-blink-features=AutomationControlled' // Avoid detection
  ]
});
```

### Timing Adjustments

If fields don't fill correctly, adjust timing:

```javascript
await page.waitForTimeout(300); // Wait after each field
await page.keyboard.type(value, { delay: 50 }); // Delay between keystrokes
```

## 🐛 Troubleshooting

### Browser doesn't open

**Issue:** `browserType.launch: Executable doesn't exist`

**Solution:**
```bash
npx playwright install chromium
```

### Fields fill incorrectly

**Issue:** Wrong field gets filled

**Solutions:**
1. Adjust `tabIndex` in mapping file
2. Increase `slowMo` and `waitForTimeout`
3. Use coordinate clicking instead of TAB

### PDF doesn't save

**Issue:** `page.pdf()` doesn't work with some PDFs

**Solutions:**
1. Use browser's native save: Ctrl+S
2. Use print-to-PDF feature
3. Screenshot each page as fallback

### Encryption still blocks

**Issue:** Even browser automation doesn't work

**Last resort:**
1. Print PDF to create unencrypted copy
2. Use that copy as template
3. Run automation on unencrypted version

## 📊 Performance

**Speed:**
- ~5-10 seconds per form
- Depends on field count and timing settings

**Resources:**
- RAM: ~200MB per browser instance
- CPU: Low to moderate
- Disk: Temporary PDFs

**Scalability:**
- Good for <100 forms/day
- For higher volume, consider parallel instances
- Or switch to dedicated form-filling service

## 🎯 Best Practices

### 1. Field Mapping

- Test mapping with several forms
- Verify tab order doesn't change between PDF versions
- Keep backup of mapping file
- Document any special field requirements

### 2. Error Handling

```javascript
try {
  await fillPDFWithBrowser(formData, outputPath);
} catch (error) {
  // Fallback: Generate XFDF
  // Or: Return error to user
  // Or: Retry with different method
}
```

### 3. Validation

- Validate form data before automation
- Check filled PDF after generation
- Compare with user's original input
- Allow manual corrections

### 4. Security

- Run in isolated environment
- Don't store sensitive data
- Clean up temporary files
- Limit concurrent browsers

## 🚀 Next Steps

1. ✅ Map your PDF fields
2. ✅ Test automation locally
3. ⏭️ Decide on deployment:
   - Server with Xvfb?
   - Electron desktop app?
   - Browser extension?
4. ⏭️ Integrate with your frontend
5. ⏭️ Add error handling and fallbacks
6. ⏭️ Test with real users

## 💡 Alternative Tools

If Playwright doesn't work:

- **Puppeteer:** Similar to Playwright, Chromium-based
- **Selenium:** More mature, supports more browsers
- **PyAutoGUI:** Direct mouse/keyboard control (Python)
- **AutoIt:** Windows automation (Windows only)
- **PDF.co API:** Commercial service for form filling

## 📚 Resources

- Playwright Docs: https://playwright.dev
- PDF Form Filling Best Practices
- IRCC Form Guidelines
- Accessibility Standards (for field mapping)

---

**Need Help?**

Common issues and solutions are in this guide. For complex problems:
1. Check Playwright GitHub issues
2. Test with simpler PDF first
3. Verify your field mapping is correct
4. Try coordinate clicking instead of TAB
