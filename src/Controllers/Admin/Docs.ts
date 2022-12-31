import { Request, Response } from "express";
import Student from "../../models/Student";
import { IStudent } from "../../types/DVA";

const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students: IStudent[] = await Student.find();
    if (students.length === 0)
      res.status(200).json({
        success: true,
        message: "No students found",
        students,
      });
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

const addStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { srn, name, email, phone, department, batch } = req.body as Pick<
      IStudent,
      "srn" | "name" | "email" | "phone" | "department" | "batch"
    >;

    if (!name || !email || !phone || !department || !batch)
      throw new Error("All fields are required");

    const student: IStudent | null = await Student.findOne({ srn });
    if (student) throw new Error("Student already exists");

    const newStudent: IStudent = new Student({
      srn,
      name,
      email,
      phone,
      department,
      batch,
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

const addMultipleStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { students } = req.body;
    if (!students) throw new Error("No students provided");

    const failedTOAdd: IStudent[] = [];

    const newStudents: IStudent[] = await Promise.all(
      students.map(async (student: IStudent) => {
        try {
          const { srn, name, email, phone, department, batch } = student;
          if (!srn || !name || !email || !phone || !department || !batch)
            throw new Error(`All fields are required, failed at ${srn}`);

          const existingStudent: IStudent | null = await Student.findOne({
            srn,
          });
          if (existingStudent)
            throw new Error(`Student already exists, failed at ${srn}`);

          return new Student({ srn, name, email, phone, department, batch });
        } catch (error) {
          failedTOAdd.push(student);
          return null;
        }
      })
    );

    const savedStudents: IStudent[] = await Student.insertMany(newStudents);
    if (!savedStudents)
      throw new Error("Something went wrong saving the students");

    res.status(200).json({
      success: true,
      message: "Students added successfully",
      students: savedStudents,
      failed: failedTOAdd,
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
    const { srn, data } = req.body;
    if (!srn || !data) throw new Error("All fields are required");

    const student: IStudent | null = await Student.findOne({ srn });
    if (!student) throw new Error("Student does not exist");

    const updatedStudent: IStudent | null = await Student.findOneAndUpdate(
      { srn },
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

export { getStudents, addStudent, addMultipleStudents, updateStudentDetails };
