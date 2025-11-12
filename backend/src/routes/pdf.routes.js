/**
 * PDF Routes
 * API endpoints for PDF generation, validation, and checklist
 */

import express from 'express';
import { generateStudyPermitPDF } from '../services/pdfGenerator.js';
import { generateIMM1294PDF } from '../services/pdfFormGenerator.js';
import { generateCompleteIMM1294PDF } from '../services/completePdfGenerator.js';
import { generateXFDF } from '../services/xfdfGenerator.js';
import { generateHTMLSummary } from '../services/dataSummaryGenerator.js';
import { validateCompleteForm } from '../services/validator.js';
import { validateCompleteFormData, validateMinimalForm } from '../services/completeFormValidator.js';
import { generateChecklist, getChecklistSummary } from '../services/checklist.js';

const router = express.Router();

/**
 * POST /api/pdf/generate
 * Generate filled PDF from form data
 */
router.post('/generate', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Form data is required'
      });
    }

    // Validate form data before generating PDF
    const validation = validateCompleteForm(formData);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Form data contains validation errors',
        validation
      });
    }

    // Generate PDF
    const pdfBytes = await generateStudyPermitPDF(formData);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=study-permit-application.pdf');
    res.setHeader('Content-Length', pdfBytes.length);

    // Send PDF
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF',
      message: error.message
    });
  }
});

/**
 * POST /api/pdf/generate-xfdf
 * Generate XFDF data file for importing into official PDF
 * This is the recommended method for encrypted PDFs
 */
router.post('/generate-xfdf', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Form data is required'
      });
    }

    // Validate form data before generating XFDF
    const validation = validateCompleteForm(formData);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Form data contains validation errors',
        validation
      });
    }

    // Generate XFDF content
    const xfdfContent = generateXFDF(formData);

    // Set response headers for XFDF download
    res.setHeader('Content-Type', 'application/vnd.adobe.xfdf');
    res.setHeader('Content-Disposition', 'attachment; filename=imm1294e-data.xfdf');
    res.setHeader('Content-Length', Buffer.byteLength(xfdfContent));

    // Send XFDF file
    res.send(xfdfContent);

  } catch (error) {
    console.error('XFDF generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate XFDF',
      message: error.message
    });
  }
});

/**
 * POST /api/pdf/generate-summary
 * Generate HTML data summary (⭐ RECOMMENDED for encrypted PDFs)
 * User downloads HTML and references it while manually filling PDF
 */
router.post('/generate-summary', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Form data is required'
      });
    }

    // Validate form data
    const validation = validateCompleteForm(formData);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Form data contains validation errors',
        validation
      });
    }

    // Generate HTML summary
    const htmlContent = generateHTMLSummary(formData);

    // Set response headers for HTML download
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=imm1294e-data-summary.html');
    res.setHeader('Content-Length', Buffer.byteLength(htmlContent));

    // Send HTML file
    res.send(htmlContent);

  } catch (error) {
    console.error('HTML summary generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate HTML summary',
      message: error.message
    });
  }
});

/**
 * POST /api/pdf/generate-form
 * Generate IMM 1294 form from scratch (✨ NEW - No encryption issues!)
 * Creates a brand new PDF that looks like the official form
 * Uses basic form structure (backward compatible)
 */
router.post('/generate-form', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Form data is required'
      });
    }

    // Validate form data with minimal validation
    const validation = validateMinimalForm(formData);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Form data contains validation errors',
        validation
      });
    }

    // Generate new PDF from scratch
    const pdfBytes = await generateIMM1294PDF(formData);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=imm1294-study-permit.pdf');
    res.setHeader('Content-Length', pdfBytes.length);

    // Send PDF
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('PDF form generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF form',
      message: error.message
    });
  }
});

/**
 * POST /api/pdf/generate-complete-form
 * Generate COMPLETE IMM 1294 form with all 147+ fields
 * This is the new comprehensive endpoint that handles ALL form sections
 */
router.post('/generate-complete-form', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Form data is required'
      });
    }

    // Validate complete form data with all fields
    const validation = validateCompleteFormData(formData);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Form data contains validation errors',
        validation,
        hint: 'This endpoint expects the complete form structure with all fields. See COMPLETE-FIELD-MAPPING.md for details.'
      });
    }

    // Generate complete PDF with all fields
    const pdfBytes = await generateCompleteIMM1294PDF(formData);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=imm1294-complete-application.pdf');
    res.setHeader('Content-Length', pdfBytes.length);

    // Send PDF
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('Complete PDF form generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate complete PDF form',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * POST /api/pdf/validate
 * Validate form data without generating PDF
 */
router.post('/validate', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Form data is required'
      });
    }

    // Validate form data
    const validation = validateCompleteForm(formData);

    res.json({
      success: true,
      validation
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
      message: error.message
    });
  }
});

/**
 * POST /api/pdf/checklist
 * Generate document checklist based on form data
 */
router.post('/checklist', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Form data is required'
      });
    }

    // Generate checklist
    const checklist = generateChecklist(formData);
    const summary = getChecklistSummary(checklist);

    res.json({
      success: true,
      checklist,
      summary
    });

  } catch (error) {
    console.error('Checklist generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate checklist',
      message: error.message
    });
  }
});

/**
 * GET /api/pdf/test
 * Test endpoint to verify PDF routes are working
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'PDF routes are working',
    availableEndpoints: [
      'POST /api/pdf/generate-complete-form - 🌟 NEW! Generate COMPLETE PDF with ALL 147+ fields (MOST COMPREHENSIVE)',
      'POST /api/pdf/generate-form - ✨ Generate PDF from scratch with basic fields (Quick start)',
      'POST /api/pdf/generate-summary - Generate HTML data summary for manual filling',
      'POST /api/pdf/generate - Generate filled PDF (may fail with encrypted forms)',
      'POST /api/pdf/generate-xfdf - Generate XFDF data file (may be blocked by encryption)',
      'POST /api/pdf/validate - Validate form data',
      'POST /api/pdf/checklist - Generate document checklist'
    ],
    recommendation: 'Use /api/pdf/generate-complete-form for the most comprehensive IMM 1294 form with all fields!',
    formStructure: {
      completeForm: {
        endpoint: '/api/pdf/generate-complete-form',
        description: 'Handles all 147+ fields including personal details, marital info, language, passport, national ID, US PR, contact info, study details, education, employment, and background information',
        testScript: './test-complete-form.sh',
        exampleData: './test-data/complete-form-example.json',
        documentation: 'COMPLETE-FIELD-MAPPING.md'
      },
      basicForm: {
        endpoint: '/api/pdf/generate-form',
        description: 'Handles basic fields for quick testing (backward compatible)',
        testScript: './test-form-generator.sh'
      }
    }
  });
});

export default router;
