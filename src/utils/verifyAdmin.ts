import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = req.cookies.token;
    if (!token) throw Error("No token found");

    const secret: string = process.env.ACCESS_TOKEN_SEC as string;

    const { _id, accessLevel } = jwt.verify(token, secret) as {
      _id: string;
      accessLevel: number;
    };
    if(accessLevel !== 2) throw Error("Unauthorized");

    const user = User.findById(_id);
    if (!user) throw Error("User does not exist");

    req.body.userId = { _id, accessLevel };

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized" + (err as Error).message,
    });
  }
};
