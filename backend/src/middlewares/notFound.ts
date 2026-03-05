import type { RequestHandler } from "express";

export const notFound: RequestHandler = (req, res, _next) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
};

