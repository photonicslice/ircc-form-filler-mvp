/**
 * AI Tips Routes
 * API endpoints for AI-powered field guidance and tips
 */

import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI client (only if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  console.log('✅ OpenAI API Key detected - AI tips enabled');
  console.log('   Key starts with:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} else {
  console.log('⚠️  No OpenAI API Key found - falling back to static tips only');
}

/**
 * Pre-defined tips for common confusing fields
 * These are used as fallback when AI is not available
 */
const STATIC_TIPS = {
  dli: {
    title: 'What is a DLI Number?',
    tip: 'A Designated Learning Institution (DLI) number is a unique identifier assigned by the Canadian government to approved schools. It always starts with the letter "O" followed by 9 digits (e.g., O123456789). You can find your institution\'s DLI number on their official website or in your Letter of Acceptance.',
    example: 'O123456789'
  },
  letterOfAcceptance: {
    title: 'Letter of Acceptance Requirements',
    tip: 'Your Letter of Acceptance must be an official document from a Designated Learning Institution (DLI) in Canada. It should include: the program name, start date, duration, tuition fees, and the DLI number. The letter must be signed by an authorized official of the institution.',
    keyPoints: [
      'Must be from a DLI',
      'Include program details',
      'Signed and official',
      'Recent (within last 6 months)'
    ]
  },
  proofOfFunds: {
    title: 'Proof of Financial Support',
    tip: 'You need to prove you have enough money to pay for: tuition fees for your first year, living expenses (CAD $10,000 for 12 months), and return transportation for you and any family members coming with you. Acceptable documents include bank statements, scholarship letters, or sponsor affidavits.',
    minimumRequired: 'Tuition + CAD $10,000',
    acceptableDocuments: [
      'Bank statements (last 4-6 months)',
      'Scholarship award letters',
      'Education loan approval',
      'Sponsor affidavit with financial proof'
    ]
  },
  studyPlan: {
    title: 'Statement of Purpose / Study Plan',
    tip: 'Your study plan should explain why you want to study in Canada, why you chose this specific program and institution, how it fits with your previous education and career goals, and most importantly, why you will return to your home country after completing your studies. Be honest and specific.',
    whatToInclude: [
      'Why this program?',
      'Why this institution?',
      'Career goals',
      'How it connects to previous education',
      'Reasons to return home'
    ]
  },
  passport: {
    title: 'Passport Requirements',
    tip: 'Your passport must be valid for the entire duration of your intended stay in Canada. IRCC recommends having at least 6 months of validity beyond your expected departure date. If your passport expires soon, renew it before applying.',
    requirements: [
      'Valid for entire stay',
      'At least 6 months validity recommended',
      'Clear, readable bio page',
      'All pages with stamps/visas'
    ]
  }
};

/**
 * POST /api/tips/get-tips
 * Get AI-powered or static tips for a specific field
 */
router.post('/get-tips', async (req, res) => {
  try {
    const { fieldName, context, formData, useAI } = req.body;

    if (!fieldName) {
      return res.status(400).json({
        success: false,
        error: 'Field name is required'
      });
    }

    // Check if we have a static tip for this field
    const staticTip = STATIC_TIPS[fieldName];

    // If AI is requested and available, generate dynamic tip
    if (useAI && openai) {
      try {
        // Use formData if provided, otherwise fall back to context
        const contextData = formData || context;
        const aiTip = await generateAITip(fieldName, contextData);

        return res.json({
          success: true,
          aiTip: aiTip,  // Frontend expects 'aiTip' field
          tip: staticTip || null,  // Also provide static tip as fallback
          source: 'ai'
        });
      } catch (aiError) {
        console.error('AI tip generation failed:', aiError);
        // Fall back to static tip if AI fails
      }
    }

    // Return static tip or generic guidance
    if (staticTip) {
      return res.json({
        success: true,
        tip: staticTip,
        source: 'static'
      });
    }

    // Generic guidance if no specific tip available
    res.json({
      success: true,
      tip: {
        title: `Guidance for ${formatFieldName(fieldName)}`,
        tip: 'Please ensure this field is filled accurately and completely. Refer to IRCC guidelines for specific requirements.',
        note: 'Enable AI tips in settings for more detailed guidance.'
      },
      source: 'generic'
    });

  } catch (error) {
    console.error('Tips error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tips',
      message: error.message
    });
  }
});

/**
 * POST /api/tips/validate-field
 * Get real-time validation feedback with tips
 */
router.post('/validate-field', async (req, res) => {
  try {
    const { fieldName, value, context } = req.body;

    if (!fieldName) {
      return res.status(400).json({
        success: false,
        error: 'Field name is required'
      });
    }

    // Perform basic validation
    const validation = performFieldValidation(fieldName, value, context);

    // Get tip for the field
    const tip = STATIC_TIPS[fieldName] || null;

    res.json({
      success: true,
      validation,
      tip,
      suggestions: generateSuggestions(fieldName, value, validation)
    });

  } catch (error) {
    console.error('Field validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
      message: error.message
    });
  }
});

/**
 * GET /api/tips/all
 * Get all available static tips
 */
router.get('/all', (req, res) => {
  res.json({
    success: true,
    tips: STATIC_TIPS,
    aiAvailable: !!openai
  });
});

/**
 * GET /api/tips/test
 * Test endpoint to verify tips routes are working
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Tips routes are working',
    aiEnabled: !!openai,
    availableStaticTips: Object.keys(STATIC_TIPS)
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate AI-powered tip using OpenAI
 */
async function generateAITip(fieldName, formData) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  // Extract relevant context from form data
  const contextSummary = buildContextSummary(fieldName, formData);

  const prompt = `You are an expert on Canadian immigration and IRCC study permit applications (IMM 1294 form).

FIELD: ${formatFieldName(fieldName)}

USER'S CURRENT INFORMATION:
${contextSummary}

Based on the user's information above, provide personalized, actionable advice for the "${formatFieldName(fieldName)}" field.

Your response should:
1. Address their specific situation
2. Provide concrete next steps or examples
3. Mention any common mistakes to avoid
4. Reference IRCC requirements when relevant

Keep your response concise (under 200 words), friendly, and practical. Focus on what they need to do, not just what the field is.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful Canadian immigration expert assistant providing personalized guidance for study permit applications. Be specific, practical, and encouraging.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 350,
    temperature: 0.7
  });

  return completion.choices[0].message.content;
}

/**
 * Build context summary from form data for AI personalization
 */
function buildContextSummary(fieldName, formData) {
  if (!formData) {
    return 'No form data available yet.';
  }

  const lines = [];

  // Personal info
  if (formData.personalInfo) {
    const p = formData.personalInfo;
    if (p.citizenship) lines.push(`- Citizenship: ${p.citizenship}`);
    if (p.countryOfResidence) lines.push(`- Current residence: ${p.countryOfResidence}`);
  }

  // Study purpose
  if (formData.studyPurpose) {
    const s = formData.studyPurpose;
    if (s.canadianInstitution) lines.push(`- Institution: ${s.canadianInstitution}`);
    if (s.programName) lines.push(`- Program: ${s.programName}`);
    if (s.programLevel) lines.push(`- Level: ${s.programLevel}`);
    if (s.programDuration) lines.push(`- Duration: ${s.programDuration} months`);
    if (s.programStartDate) lines.push(`- Start date: ${s.programStartDate}`);
  }

  // Financial info
  if (formData.proofOfFunds) {
    const f = formData.proofOfFunds;
    if (f.annualTuitionFees) lines.push(`- Annual tuition: CAD $${f.annualTuitionFees}`);
    if (f.availableFunds) lines.push(`- Available funds: CAD $${f.availableFunds}`);
    if (f.fundingSource) lines.push(`- Funding source: ${f.fundingSource}`);
  }

  // Education history
  if (formData.educationHistory) {
    const e = formData.educationHistory;
    if (e.highestEducationLevel) lines.push(`- Highest education: ${e.highestEducationLevel}`);
  }

  if (lines.length === 0) {
    return 'User is just starting to fill out the form.';
  }

  return lines.join('\n');
}

/**
 * Perform basic field validation
 */
function performFieldValidation(fieldName, value, context) {
  // This is a simplified validation - the full validation is in validator.js
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!value || value === '') {
    result.isValid = false;
    result.errors.push(`${formatFieldName(fieldName)} is required`);
  }

  // Add field-specific validation
  if (fieldName === 'dli' && value) {
    if (!value.match(/^O\d{9}$/)) {
      result.isValid = false;
      result.errors.push('DLI number must start with "O" followed by 9 digits');
    }
  }

  if (fieldName === 'email' && value) {
    if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      result.isValid = false;
      result.errors.push('Please enter a valid email address');
    }
  }

  return result;
}

/**
 * Generate suggestions based on validation results
 */
function generateSuggestions(fieldName, value, validation) {
  const suggestions = [];

  if (!validation.isValid && validation.errors.length > 0) {
    suggestions.push({
      type: 'error',
      message: validation.errors[0]
    });
  }

  // Add field-specific suggestions
  if (fieldName === 'dli' && (!value || value === '')) {
    suggestions.push({
      type: 'info',
      message: 'You can find your institution\'s DLI number on their website or in your acceptance letter'
    });
  }

  if (fieldName === 'proofOfFunds' && value) {
    const amount = parseFloat(value);
    if (amount < 20000) {
      suggestions.push({
        type: 'warning',
        message: 'Consider showing additional funds. IRCC recommends having extra financial buffer.'
      });
    }
  }

  return suggestions;
}

/**
 * Format field name for display
 */
function formatFieldName(fieldName) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export default router;
