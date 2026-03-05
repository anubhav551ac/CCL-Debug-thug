import type { Request, Response, NextFunction } from "express";

export const getRoot = (req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).json({
    success: true,
    data: {
      message: "Hello World",
    },
  });
};

