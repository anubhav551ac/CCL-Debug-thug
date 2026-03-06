import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import apiRouter from "./routes/index.js";
import authRouter from "./routes/authRoutes.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));
if (process.env.NODE_ENV !== "production") {
  app.get("/test-auth", (_req, res) => res.sendFile(path.join(__dirname, "..", "test-auth.html")));
}

import { agePinDev } from "./controllers/pinController.js";

app.use("/api/v1", apiRouter);
app.use("/api/v1/auth", authRouter);

// Dev Routes
app.post("/api/dev/age-report/:id", agePinDev);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ?? "5000";

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});

