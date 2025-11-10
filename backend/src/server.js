/**
 * IRCC Form Filler - Backend Server
 * Main Express server setup with middleware and routes
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import pdfRoutes from './routes/pdf.routes.js';
import tipsRoutes from './routes/tips.routes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * Security headers with Helmet
 * Protects app from common vulnerabilities
 */
app.use(helmet());

/**
 * CORS Configuration
 * Allows frontend to communicate with backend
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Body Parser Middleware
 * Parses incoming JSON requests
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * HTTP Request Logger
 * Logs all incoming requests for debugging
 */
app.use(morgan('dev'));

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Health Check Endpoint
 * Used to verify server is running
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * API Routes
 */
app.use('/api/pdf', pdfRoutes);
app.use('/api/tips', tipsRoutes);

/**
 * 404 Handler
 * Catches all undefined routes
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Global Error Handler
 * Catches and formats all errors
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Start Express Server
 */
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   IRCC Form Filler Backend - MVP                           ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║   Server running on: http://localhost:${PORT}              ║`);
  console.log(`║   Environment: ${process.env.NODE_ENV || 'development'}                               ║`);
  console.log(`║   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}       ║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║   Available Endpoints:                                     ║');
  console.log('║   - GET  /health                                           ║');
  console.log('║   - POST /api/pdf/generate                                 ║');
  console.log('║   - POST /api/pdf/validate                                 ║');
  console.log('║   - POST /api/pdf/checklist                                ║');
  console.log('║   - POST /api/tips/get-tips                                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
});

/**
 * Graceful Shutdown Handler
 * Ensures proper cleanup on server shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

export default app;
