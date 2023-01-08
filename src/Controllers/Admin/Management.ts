import { Request, Response } from "express";
import Dept from "../../models/Dept";
import { IDept } from "../../types/DVA";

const getDepts = async (req: Request, res: Response): Promise<void> => {
  try {
    const depts: IDept[] = await Dept.find();
    if (!depts) throw new Error("No departments found");

    res.status(200).json({
      success: true,
      message: "Returning all departments",
      depts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

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
      message: "Department added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const editDept = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name } = req.body as Pick<IDept, "code" | "name">;
    if (!req.body.deptId || !name || !code)
      throw new Error("Please fill out all fields");

    const updatedDept: IDept | null = await Dept.findByIdAndUpdate(
      req.body.deptId,
      { code, name },
      { new: true }
    );
    if (!updatedDept) throw new Error("Department update failed");

    res.status(200).json({
      success: true,
      message: "Department updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const deleteDept = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deptId } = req.body;
    if (!deptId) throw new Error("Please fill out all fields");

    const deletedDept: IDept | null = await Dept.findByIdAndDelete(deptId);
    if (!deletedDept) throw new Error("Department delete failed");

    res.status(200).json({
      success: true,
      message: "Department deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export { getDepts, addDept, editDept, deleteDept };
