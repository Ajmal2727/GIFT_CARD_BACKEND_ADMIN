import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";  // ✅ Import body-parser correctly
import { adminRoute } from "./routes/admin.routes.js";
import { corsOptions } from "./constant.js";
import compression from 'compression';
import { cardRoute } from "./routes/card.routes.js";
import { userRoute } from "./routes/user.routes.js";
const app = express();
app.use(compression())

// // ✅ Apply body-parser FIRST before everything else
// app.use(bodyParser.json({ limit: "50mb" }));  // 🔹 Supports large JSON payloads

// ✅ Use express.json() instead of body-parser
app.use(
  express.json({
    limit: "50mb", // Keep large payload support
    verify: (req, res, buf) => {
      req.rawBody = buf.toString(); // Store raw request body as a string
    },
  })
);


app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // 🔹 Supports large form-data

// ✅ Move WebSocket handler AFTER JSON body parsing
// socketHandler(app);

// ✅ Other middleware
app.use(cookieParser());
app.use(cors(corsOptions));

// ✅ Debugging logs
// app.use((req, res, next) => {
//   console.log(
//     `Incoming Request: ${req.method} ${req.url}, Size: ${
//       req.headers["content-length"] || 0
//     } bytes`
//   );
//   next();
// });

// ✅ Define API Routes AFTER setting body-parser limits
app.use("/api/admin", adminRoute);
app.use("/api/card", cardRoute);
app.use("/api/user", userRoute);


app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API is working!" });
});

export default app;
