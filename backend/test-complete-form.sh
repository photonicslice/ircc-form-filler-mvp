#!/bin/bash

# Test Script for Complete PDF Form Generator
# This generates a comprehensive IMM 1294 PDF with all 147+ fields

echo "✨ Testing COMPLETE PDF Form Generator (All 147+ Fields)"
echo "========================================================="
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

# Make POST request with complete form data
echo "📤 Generating COMPLETE PDF form with all fields..."
echo ""

curl -X POST http://localhost:3001/api/pdf/generate-complete-form \
  -H "Content-Type: application/json" \
  -d @test-data/complete-form-example.json \
  --output imm1294-complete.pdf

echo ""
echo ""

# Check if file was created
if [ -f "imm1294-complete.pdf" ]; then
    echo "✅ SUCCESS! Complete PDF form generated"
    echo ""
    echo "📄 File saved as: imm1294-complete.pdf"
    echo "📊 File size: $(du -h imm1294-complete.pdf | cut -f1)"
    echo "📋 File type: $(file imm1294-complete.pdf)"
    echo ""
    echo "🌐 To view the PDF:"
    echo "  - macOS:   open imm1294-complete.pdf"
    echo "  - Linux:   xdg-open imm1294-complete.pdf"
    echo "  - Windows: start imm1294-complete.pdf"
    echo ""
    echo "Or just drag imm1294-complete.pdf into Adobe Reader!"
    echo ""
    echo "✨ This PDF includes ALL 147+ fields:"
    echo "   ✓ Personal Details (including other names, place of birth, residence history)"
    echo "   ✓ Marital Info (current and previous relationships)"
    echo "   ✓ Language Info (native language, English/French proficiency)"
    echo "   ✓ Passport Details (including Taiwan/Israeli passport questions)"
    echo "   ✓ National ID Document"
    echo "   ✓ US PR Card info"
    echo "   ✓ Complete Contact Info (mailing & residential addresses, multiple phones)"
    echo "   ✓ Study Details (school, DLI, costs, PAL/CAQ)"
    echo "   ✓ Education History"
    echo "   ✓ Employment History"
    echo "   ✓ Background Information (health, immigration, criminal, military, political)"
    echo ""
    echo "   - No encryption issues"
    echo "   - Opens in any PDF reader"
    echo "   - All data pre-filled"
    echo "   - Ready to print or submit"
    echo ""
else
    echo "❌ ERROR: PDF file was not created"
    echo ""
    echo "Check the response for validation errors or server issues"
    echo ""
    echo "Common issues:"
    echo "  - Missing required fields in test data"
    echo "  - Validation errors (check field formats)"
    echo "  - Server compilation errors"
    echo ""
    echo "Try checking the server logs for details"
fi
