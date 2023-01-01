import { Request, Response } from "express";

import User from "../../models/User";
import { IUser } from "../../types/DVA";

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

const updateAccessLevel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, accessLevel } = req.body;
    if (!userId || !accessLevel) throw new Error("Please fill out all fields");

    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      userId,
      { accessLevel },
      { new: true }
    ).select("-password");
    if (!updatedUser) throw new Error("User update failed");

    res.status(200).json({
      success: true,
      message: "User updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    if (!userId) throw new Error("Please fill out all fields");

    const deletedUser: IUser | null = await User.findByIdAndDelete(
      userId
    ).select("-password");
    if (!deletedUser) throw new Error("User delete failed");

    res.status(200).json({
      success: true,
      message: "User deleted",
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export { getAllUsers, updateAccessLevel, deleteUser };
