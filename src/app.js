import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import { adminRoute } from "./routes/admin.routes.js";
import { corsOptions } from "./constant.js";
import { cardRoute } from "./routes/card.routes.js";
import { userRoute } from "./routes/user.routes.js";
import { transactionRoute } from "./routes/transaction.routes.js";
import { orderRoute } from "./routes/orders.routes.js";
import { notificationRoute } from "./routes/notification.routes.js";
import { cartRouter } from "./routes/cart.routes.js";

const app = express();

// ✅ Enable compression (should be first)
app.use(compression());

// ✅ Use express.json() (body-parser is not needed for JSON)
app.use(
  express.json({
    limit: "50mb",
    type: ["application/json", "application/json; charset=utf-8"], // ✅ Fix charset issue
    verify: (req, res, buf) => {
      req.rawBody = buf.toString(); // Store raw body if needed
    },
  })
);

// ✅ Use express.urlencoded() for form data (replacing body-parser)
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Other middleware
app.use(cookieParser());
app.use(cors(corsOptions));

// ✅ Define API Routes AFTER middleware
app.use("/api/admin", adminRoute);
app.use("/api/card", cardRoute);
app.use("/api/user", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/order", orderRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/cart", cartRouter);

// ✅ Health check route
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API is working!" });
});

export default app;