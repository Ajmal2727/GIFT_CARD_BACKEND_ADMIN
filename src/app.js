import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import routes
import { adminRoute } from "./routes/admin.routes.js";
import { cardRoute } from "./routes/card.routes.js";
import { userRoute } from "./routes/user.routes.js";
import { transactionRoute } from "./routes/transaction.routes.js";
import { orderRoute } from "./routes/orders.routes.js";
import { notificationRoute } from "./routes/notification.routes.js";
import { cartRouter } from "./routes/cart.routes.js";

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://ballysgiftcards.com',
    'http://localhost:3000', // Add development frontend URL
    // Add any other allowed origins
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate Limiting Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Middleware Configuration
app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet()); // Adds security headers
app.use(compression());
app.use(cookieParser());

// JSON Parsing with Enhanced Configuration
app.use(express.json({
  limit: "50mb",
  strict: true,
  type: ['application/json']
}));

// Logging Middleware (Optional, for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Define API Routes
app.use("/api/admin", adminRoute);
app.use("/api/card", cardRoute);
app.use("/api/user", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/order", orderRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/cart", cartRouter);

// Test Route with Comprehensive Error Handling
app.post("/api/test", (req, res) => {
  try {
    console.log('Received test data:', req.body);
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
  console.error(err.stack);
  res.status(500).json({
    message: "Unexpected server error",
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
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
