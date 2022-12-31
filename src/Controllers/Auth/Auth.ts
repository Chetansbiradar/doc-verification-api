import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../models/User";
import { IUser } from "../../types/DVA";

import createToken from "../../utils/createToken";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      throw new Error("Please fill out all fields");

    const user: IUser | null = await User.findOne({ email });
    if (user) throw new Error("User already exists");

    const salt: string = await bcrypt.genSalt(10);
    if (!salt) throw new Error("Salt generation failed");

    const hashedPassword: string = await bcrypt.hash(password, salt);
    if (!hashedPassword) throw new Error("Hashing failed");

    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser: IUser = await newUser.save();
    if (!savedUser) throw new Error("User creation failed");

    const token: string = createToken(
      savedUser,
      process.env.ACCESS_TOKEN_SEC as string,
      "72h"
    );
    if (!token) throw new Error("Token creation failed");

    res.cookie("token", token, { httpOnly: true }).status(200).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error("Please fill out all fields");

    const user: IUser | null = await User.findOne({ email });
    if (!user) throw new Error("User does not exist");

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token: string = createToken(
      user,
      process.env.ACCESS_TOKEN_SEC as string,
      "72h"
    );
    if (!token) throw new Error("Token creation failed");

    res.cookie("token", token, { httpOnly: true }).status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("No token found");

    const isJwtValid: string | object = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SEC as string
    );
    if (!isJwtValid) throw new Error("Invalid token");

    const user: IUser | null = await User.findById(
      (isJwtValid as { _id: string })._id
    );
    if (!user) throw new Error("User does not exist");

    const newToken: string = createToken(
      user,
      process.env.ACCESS_TOKEN_SEC as string,
      "72h"
    );
    if (!newToken) throw new Error("Token creation failed");

    res.cookie("token", newToken, { httpOnly: true }).status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      throw new Error("Please fill out all fields");

    const user: IUser | null = await User.findById(req.body._id);
    if (!user) throw new Error("User does not exist");

    const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const salt: string = await bcrypt.genSalt(10);
    if (!salt) throw new Error("Salt generation failed");

    const hashedPassword: string = await bcrypt.hash(newPassword, salt);
    if (!hashedPassword) throw new Error("Hashing failed");

    user.password = hashedPassword;
    const savedUser: IUser = await user.save();
    if (!savedUser) throw new Error("Password change failed");

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export { register, login, refresh, logout, changePassword };
