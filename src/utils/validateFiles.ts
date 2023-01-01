import { NextFunction, Request, Response } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files) throw Error("No files found");

    const fileTypes = ["image/jpeg", "image/png", "application/pdf"];
    files.map((file: any) => {
      if (!fileTypes.includes(file.mimetype)) {
        throw Error("Invalid file type");
      }
    });

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized " + (err as Error).message,
    });
  }
};
