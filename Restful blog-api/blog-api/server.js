/**
 * Blog API Server
 * Main entry point for the RESTful Blog API
 */

// Load environment variables first
require('dotenv').config();

// Import dependencies
const express = require('express');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

/**
 * Body parser middleware
 * Parses incoming JSON requests
 */
app.use(express.json());

/**
 * URL-encoded parser
 * Parses URL-encoded data
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Request logging middleware
 * Logs all incoming requests
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.url}`);
  
  // Log request body for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  // Track response time
  const startTime = Date.now();
  
  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`Response: ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

/**
 * CORS middleware (optional - for frontend integration)
 * Allows cross-origin requests
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// ============================================
// ROUTES
// ============================================

// Import route handlers
const postRoutes = require('./routes/postRoutes');

// Mount routes
app.use('/api/posts', postRoutes);

/**
 * Health check endpoint
 * Useful for monitoring server status
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * API info endpoint
 * Returns API information and available endpoints
 */
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Blog API',
    version: '1.0.0',
    endpoints: {
      posts: {
        'GET /api/posts': 'Get all posts',
        'POST /api/posts': 'Create a new post',
        'GET /api/posts/:id': 'Get a single post',
        'PUT /api/posts/:id': 'Update a post',
        'DELETE /api/posts/:id': 'Delete a post'
      },
      health: {
        'GET /health': 'Check server health'
      }
    }
  });
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

/**
 * Global error handler
 * Catches all unhandled errors
 */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ============================================
// SERVER STARTUP
// ============================================

// Get port from environment or default to 5000
const PORT = process.env.PORT || 5000;

/**
 * Start the server
 * Connects to MongoDB first, then starts listening
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('\n========================================');
      console.log('   🚀 Blog API Server Started');
      console.log('========================================');
      console.log(`   Port: ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Base URL: http://localhost:${PORT}`);
      console.log(`   API Docs: http://localhost:${PORT}/api`);
      console.log('========================================\n');
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();

// Export app for testing purposes
module.exports = app;
