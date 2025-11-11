/**
 * PDF Routes
 * API endpoints for PDF generation, validation, and checklist
 */

import express from 'express';
import { generateStudyPermitPDF } from '../services/pdfGenerator.js';
import { generateXFDF } from '../services/xfdfGenerator.js';
import { validateCompleteForm } from '../services/validator.js';
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
      'POST /api/pdf/generate - Generate filled PDF (may have issues with encrypted forms)',
      'POST /api/pdf/generate-xfdf - Generate XFDF data file (recommended for encrypted forms)',
      'POST /api/pdf/validate - Validate form data',
      'POST /api/pdf/checklist - Generate document checklist'
    ]
  });
});

export default router;
