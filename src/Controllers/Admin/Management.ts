import { Request, Response } from "express";
import Dept from "../../models/Dept";
import { IDept } from "../../types/DVA";

const addDept = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name } = req.body as Pick<IDept, "code" | "name">;
    if (!name) throw new Error("Please fill out all fields");

    const dept: IDept | null = await Dept.findOne({ name });
    if (dept) throw new Error("Department already exists");

    const newDept: IDept = new Dept({ code, name });

    const savedDept: IDept = await newDept.save();
    if (!savedDept)
      throw new Error("Something went wrong saving the department");

    res.status(200).json({
      success: true,
      message: "Department added successfully",
      dept: savedDept,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export { addDept };
