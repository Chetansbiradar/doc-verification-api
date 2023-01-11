import { Request, Response } from "express";
import Dept from "../../models/Dept";
import Exam from "../../models/Exam";
import Subject from "../../models/Subject";
import { IDept, IExam, ISubject } from "../../types/DVA";

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

const getSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const subjects: ISubject[] = await Subject.find();
    if (!subjects) throw new Error("No subjects found");

    res.status(200).json({
      success: true,
      message: "Returning all subjects",
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const addSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, credits } = req.body as Pick<
      ISubject,
      "code" | "name" | "credits"
    >;
    if (!code || !name || !credits)
      throw new Error("Please fill out all fields");

    const subject: ISubject | null = await Subject.findOne({ code });
    if (subject) throw new Error("Subject already exists");

    const newSubject: ISubject = new Subject({ code, name, credits });

    const savedSubject: ISubject = await newSubject.save();
    if (!savedSubject)
      throw new Error("Something went wrong saving the subject");

    res.status(200).json({
      success: true,
      message: "Subject added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const editSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, credits } = req.body as Pick<
      ISubject,
      "code" | "name" | "credits"
    >;
    if (!req.body.subjectId || !code || !name || !credits)
      throw new Error("Please fill out all fields");

    const updatedSubject: ISubject | null = await Subject.findByIdAndUpdate(
      req.body.subjectId,
      { code, name, credits },
      { new: true }
    );

    if (!updatedSubject) throw new Error("Subject update failed");

    res.status(200).json({
      success: true,
      message: "Subject updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const deleteSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.body;
    if (!subjectId) throw new Error("Please fill out all fields");

    const deletedSubject: ISubject | null = await Subject.findByIdAndDelete(
      subjectId
    );
    if (!deletedSubject) throw new Error("Subject delete failed");

    res.status(200).json({
      success: true,
      message: "Subject deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const getExams = async (req: Request, res: Response): Promise<void> => {
  try {
    const exams: IExam[] = await Exam.find()
      .populate("subjects")
      .populate("dept");
    if (!exams) throw new Error("No exams found");

    res.status(200).json({
      success: true,
      message: "Returning all exams",
      exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const addExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dept, subjects, examDate, semester } = req.body as Pick<
      IExam,
      "dept" | "subjects" | "examDate" | "semester"
    >;
    if (!dept || !subjects || !examDate || !semester)
      throw new Error("Please fill out all fields");

    const exam: IExam | null = await Exam.findOne({ examDate, dept, semester });
    if (exam) throw new Error("Exam already exists");

    const newExam: IExam = new Exam({ dept, subjects, examDate, semester });

    const savedExam: IExam = await newExam.save();
    if (!savedExam) throw new Error("Something went wrong saving the exam");

    res.status(200).json({
      success: true,
      message: "Exam added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const editExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dept, subjects, examDate, semester } = req.body as Pick<
      IExam,
      "dept" | "subjects" | "examDate" | "semester"
    >;
    if (!req.body.examId || !dept || !subjects || !examDate || !semester)
      throw new Error("Please fill out all fields");

    const updatedExam: IExam | null = await Exam.findByIdAndUpdate(
      req.body.examId,
      { dept, subjects, examDate, semester },
      { new: true }
    );

    if (!updatedExam) throw new Error("Exam update failed");

    res.status(200).json({
      success: true,
      message: "Exam updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const deleteExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.body;
    if (!examId) throw new Error("Please fill out all fields");

    const deletedExam: IExam | null = await Exam.findByIdAndDelete(examId);
    if (!deletedExam) throw new Error("Exam delete failed");

    res.status(200).json({
      success: true,
      message: "Exam deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export {
  getDepts,
  addDept,
  editDept,
  deleteDept,
  getSubjects,
  addSubject,
  editSubject,
  deleteSubject,
  getExams,
  addExam,
  editExam,
  deleteExam,
};
