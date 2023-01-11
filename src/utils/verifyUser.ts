import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string = req.cookies.token;
    if (!token) throw Error("No token found");

    const secret: string = process.env.ACCESS_TOKEN_SEC as string;

    const { _id } = jwt.verify(token, secret) as {
      _id: string;
    };

    const user = await User.findById(_id);
    if (!user) throw Error("User does not exist");

    req.body.user = {
      _id,
      name: user.name,
      email: user.email,
      accessLevel: user.accessLevel,
      canAccess: user.canAccess,
    };

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized " + (err as Error).message,
    });
  }
};
