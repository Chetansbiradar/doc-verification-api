import { Request, Response } from "express";
import { getStorage } from "firebase/storage";
import app from "../../configs/firebase_config";
import Student from "../../models/Student";
import { IStudent } from "../../types/DVA";

const storage = getStorage(app);

const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    // get all students sorted by department code and joining date
    const students: IStudent[] = await Student.find()
      .populate("department")
      .sort({ joiningDate: 1, "department.code": 1 });
    if (students?.length === 0) {
      res.status(200).json({
        success: true,
        message: "No students found",
        students,
      });
      return;
    }
    if (!students) throw new Error("Something went wrong fetching students");

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const getStudentsGroupedDept = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // get all students by grouping all students of same department together
    const groups: IStudent[] = await Student.aggregate([
      {
        $lookup: {
          from: "depts",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $group: {
          _id: "$department._id",
          deptName: { $first: "$department.name" },
          students: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { "department.code": 1 },
      },
    ]);

    if (groups?.length === 0) {
      res.status(200).json({
        success: true,
        message: "No students found",
        groups,
      });
      return;
    }
    if (!groups) throw new Error("Something went wrong fetching students");

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const addStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { srn, name, email, phone, department, joiningDate } =
      req.body as Pick<
        IStudent,
        "srn" | "name" | "email" | "phone" | "department" | "joiningDate"
      >;

    if (!name || !email || !phone || !department || !joiningDate)
      throw new Error("All fields are required");

    const student: IStudent | null = await Student.findOne({ srn });
    if (student) throw new Error("Student already exists");

    const newStudent: IStudent = new Student({
      srn,
      name,
      email,
      phone,
      department,
      joiningDate,
    });

    const savedStudent: IStudent = await newStudent.save();
    if (!savedStudent)
      throw new Error("Something went wrong saving the student");

    res.status(200).json({
      success: true,
      message: "Student added successfully",
      student: savedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const updateStudentDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sid, data } = req.body;
    if (!sid || !data) throw new Error("All fields are required");

    const student: IStudent | null = await Student.findById(sid);
    if (!student) throw new Error("Student does not exist");

    const updatedStudent: IStudent | null = await Student.findByIdAndUpdate(
      sid,
      { $set: data },
      { new: true }
    );
    if (!updatedStudent)
      throw new Error("Something went wrong updating the student");

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.body;
    if (!studentId) throw new Error("No student id provided");

    const student: IStudent | null = await Student.findByIdAndDelete(studentId);
    if (!student) throw new Error("Student does not exist");

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export {
  getStudents,
  getStudentsGroupedDept,
  addStudent,
  updateStudentDetails,
  deleteStudent,
};
