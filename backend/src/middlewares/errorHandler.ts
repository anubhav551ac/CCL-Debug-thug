import type { ErrorRequestHandler } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const appError = err as AppError;
  const statusCode = appError.statusCode ?? 500;
  const message = appError.message || "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

