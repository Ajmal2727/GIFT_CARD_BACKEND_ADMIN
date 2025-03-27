import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import bodyParser from "body-parser";

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
  allowedHeaders: ['Content-Type', 'Authorization', 'charset'],
  credentials: true
};

// Middleware Configuration
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compression());

// Enhanced JSON Parsing Middleware
app.use((req, res, next) => {
  // Custom middleware to handle charset and content type
  if (req.headers['content-type']) {
    req.headers['content-type'] = req.headers['content-type']
      .replace('; charset=UTF-8', '')
      .replace('; charset=utf-8', '');
  }
  next();
});

// Flexible JSON Parsing
app.use(express.json({
  limit: "50mb",
  strict: true,
  type: ['application/json']
}));

app.use(bodyParser.json({
  limit: "50mb",
  type: ['application/json']
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
