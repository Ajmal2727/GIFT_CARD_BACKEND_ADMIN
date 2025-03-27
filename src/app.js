import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import bodyParser from "body-parser";
import { adminRoute } from "./routes/admin.routes.js";
import { corsOptions } from "./constant.js";
import { cardRoute } from "./routes/card.routes.js";
import { userRoute } from "./routes/user.routes.js";
import { transactionRoute } from "./routes/transaction.routes.js";
import { orderRoute } from "./routes/orders.routes.js";
import { notificationRoute } from "./routes/notification.routes.js";
import { cartRouter } from "./routes/cart.routes.js";

const app = express();

// ✅ Explicitly set response headers for UTF-8
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=UTF-8");
  next();
});

// ✅ Use express.json() with charset handling
app.use(
  express.json({
    limit: "50mb",
    type: ["application/json", "application/json; charset=utf-8"], // Accept UTF-8 charset
  })
);

// ✅ Use body-parser for additional support
app.use(
  bodyParser.json({
    limit: "50mb",
    type: ["application/json", "application/json; charset=utf-8"], // Accept UTF-8 charset
  })
);

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(compression());

// ✅ Define API Routes
app.use("/api/admin", adminRoute);
app.use("/api/card", cardRoute);
app.use("/api/user", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/order", orderRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/cart", cartRouter);

app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API is working!" });
});

export default app;
