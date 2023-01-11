import { NextFunction, Request, Response } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessLevel = req.body.user.accessLevel;
    if (accessLevel !== 1) throw Error("Unauthorized");

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized " + (err as Error).message,
    });
  }
};
