

import express, { response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";

dotenv.config();
const app = express();

// ✅ Important middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup (must come before routes)
app.use(
  cors({
    origin: ["https://virtual-assistant-7sxb.onrender.com"], // frontend origin
    credentials: true, // allow cookies
  })
);

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


  

// })

// ✅ Default root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully and MongoDB is connected!");
});

// ✅ MongoDB connect
connectDb();

// ✅ Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});














/* import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();
const app = express();

// ✅ Important middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup (must come before routes)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies
  })
);

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ MongoDB connect
connectDb();

// ✅ Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
 */
