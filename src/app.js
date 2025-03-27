import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

// Import routes
import { adminRoute } from "./routes/admin.routes.js";
import { cardRoute } from "./routes/card.routes.js";
import { userRoute } from "./routes/user.routes.js";
import { transactionRoute } from "./routes/transaction.routes.js";
import { orderRoute } from "./routes/orders.routes.js";
import { notificationRoute } from "./routes/notification.routes.js";
import { cartRouter } from "./routes/cart.routes.js";

const app = express();

// Comprehensive CORS Configuration
const corsOptions = {
  origin: [
    'https://ballysgiftcards.com',
    'http://localhost:3000',
    'http://localhost:5002'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware to completely strip charset
app.use((req, res, next) => {
  // Modify Content-Type header to remove charset
  if (req.headers['content-type']) {
    req.headers['content-type'] = req.headers['content-type']
      .split(';')[0]
      .trim();
  }
  
  // Raw body parsing
  let data = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    data += chunk;
  });
  
  req.on('end', () => {
    try {
      // Try parsing JSON manually
      req.body = data ? JSON.parse(data) : {};
      next();
    } catch (error) {
      console.error('JSON Parsing Error:', error);
      next();
    }
  });
});

// Middleware Configuration
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compression());

// Fallback JSON Parsing
app.use((req, res, next) => {
  if (!req.body) {
    try {
      req.body = req.body || {};
    } catch (error) {
      req.body = {};
    }
  }
  next();
});

// Simplified JSON Parsing
app.use(express.json({
  type: ['application/json'],
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch (error) {
      console.error('JSON Verification Error:', error);
      throw new Error('Invalid JSON');
    }
  }
}));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api/admin", adminRoute);
app.use("/api/card", cardRoute);
app.use("/api/user", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/order", orderRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/cart", cartRouter);

// Comprehensive Test Route
app.post("/api/test", (req, res) => {
  try {
    console.log('Received test data:', JSON.stringify(req.body, null, 2));
    res.status(200).json({ 
      message: "API test successful", 
      receivedData: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: "Unexpected server error",
    error: err.message
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found",
    path: req.path
  });
});

export default app;
