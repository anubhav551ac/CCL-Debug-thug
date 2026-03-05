import "dotenv/config";
import express from "express";

import apiRouter from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ?? "5000";

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});

