const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set up CORS
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express parser middleware
app.use(express.json());

// Log incoming requests for dev verification
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import Router modules
const mealRoutes = require('./routes/mealRoutes');
const goalRoutes = require('./routes/goalRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Mount Routers
app.use('/api/meals', mealRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ai', aiRoutes);

// Root entry point response
app.get('/', (req, res) => {
  res.json({
    name: 'Ai-Calorie REST API Service',
    status: 'Operational',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Handle 404 requests
app.use((req, res) => {
  res.status(404).json({ message: `API Endpoint Not Found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Global Exception:', err.stack);
  res.status(500).json({
    message: 'An internal server exception occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Database and Boot Server
const PORT = process.env.PORT || 5000;

async function bootstrap() {
  // Connect to DB (mongoose or fallback)
  await connectDB();
  
  // Start express server listener
  app.listen(PORT, () => {
    console.log(`🚀 Ai-Calorie backend running on http://localhost:${PORT}`);
    console.log(`📡 Ready to serve REST APIs`);
  });
}

bootstrap();
