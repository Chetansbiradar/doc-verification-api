import { Request, Response } from "express";
import Exam from "../../models/Exam";
import ReportCard from "../../models/ReportCard";
import Student from "../../models/Student";
import { IExam, IReportCard, IStudent } from "../../types/DVA";

const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { canAccess } = req.body.user;

    const students: IStudent[] = await Student.find({
      _id: { $in: canAccess },
    });
    if (students.length === 0) {
      res.status(200).json({
        success: true,
        message: "No students found",
        students: [],
      });
      return;
    }
    if (!students) throw new Error("No students found");

    res.status(200).json({
      success: true,
      message: "Students found",
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const getStudentReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { student } = req.query;
    if (!student) throw new Error("No student id provided");

    // check if student id is in canAccess list
    const { canAccess } = req.body.user;
    if (!canAccess.includes(student))
      throw new Error("You do not have access to this student");

    const reports: IReportCard[] = await ReportCard.find({
      student,
    })
      .populate({
        path: "student",
        select: "name",
      })
      .populate("exam")
      .populate("department")
      .populate("grades.subject")
      .sort({ "exam.semester": -1 });
    if (reports.length === 0) {
      res.status(200).json({
        success: true,
        message: "No reports found",
        reports: [],
      });
      return;
    }
    if (!reports) throw new Error("No reports found");

    res.status(200).json({
      success: true,
      message: "Reports found",
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export { getStudents, getStudentReports };
