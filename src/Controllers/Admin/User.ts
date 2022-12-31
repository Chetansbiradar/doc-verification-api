import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../models/User";
import { IUser } from "../../types/DVA";

import createToken from "../../utils/createToken";

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] = await User.find().select("-password");
    if (!users) throw new Error("No users found");

    res.status(200).json({
      success: true,
      message: "Returning all users",
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export { getAllUsers };
