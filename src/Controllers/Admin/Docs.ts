import { Request, Response } from "express";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import app from "../../configs/firebase_config";
import Exam from "../../models/Exam";
import ReportCard from "../../models/ReportCard";
import Student from "../../models/Student";
import { IExam, IReportCard, IStudent } from "../../types/DVA";

const storage: any = getStorage(app);

// const addStudents = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { students } = req.body;
//     if (!students) throw new Error("No students provided");

//     const failedTOAdd: IStudent[] = [];

//     const newStudents: IStudent[] = await Promise.all(
//       students.map(async (student: IStudent) => {
//         try {
//           const { srn, name, email, phone, department, joiningDate } = student;
//           if (!srn || !name || !email || !phone || !department || !joiningDate)
//             throw new Error(`All fields are required, failed at ${srn}`);

//           const existingStudent: IStudent | null = await Student.findOne({
//             srn,
//           });
//           if (existingStudent)
//             throw new Error(`Student already exists, failed at ${srn}`);

//           return new Student({
//             srn,
//             name,
//             email,
//             phone,
//             department,
//             joiningDate,
//           });
//         } catch (error) {
//           failedTOAdd.push(student);
//           return null;
//         }
//       })
//     );

//     const savedStudents: IStudent[] = await Student.insertMany(newStudents);
//     if (!savedStudents)
//       throw new Error("Something went wrong saving the students");

//     res.status(200).json({
//       success: true,
//       message: "Students added successfully",
//       students: savedStudents,
//       failed: failedTOAdd,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: (error as Error).message,
//     });
//   }
// };

const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sid } = req.query;
    if (!sid) throw new Error("Student id not provided");

    const reports = await ReportCard.find({ student: sid })
      .populate({
        path: "student",
        select: "name srn",
      })
      .populate({
        path: "department",
        select: "name",
      })
      .populate({
        path: "exam",
        select: "examDate semester",
      })
      .populate({
        path: "grades.subject",
        select: "name code",
      })
      .sort({ "exam.examDate": -1 });

    if (!reports) throw new Error("No reports found");

    res.status(200).json({
      success: true,
      message: "Returning all reports",
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const addReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, departmentId, examId } = req.body;
    const { grades, sgpa } = req.body;
    const file = req.file;

    const reportExist: IReportCard | null = await ReportCard.findOne({
      student: studentId,
      exam: examId,
    });
    if (reportExist) throw new Error("Report already exists");

    const student: IStudent | null = await Student.findById(studentId).populate(
      "department"
    );
    if (!student) throw new Error("Student does not exist");

    const exam: IExam | null = await Exam.findById(examId);
    if (!exam) throw new Error("Exam does not exist");

    if (file) {
      const joiningYear = student.joiningDate.getFullYear();
      const fileFullPath = `${student.department.code}/${joiningYear}/${
        student.srn
      }/${exam.examDate.getMonth()}-${exam.examDate.getFullYear()}-${
        (req.file as Express.Multer.File).originalname
      }`;
      const storageRef = ref(storage, fileFullPath);
      const uploadTask = uploadBytes(
        storageRef,
        (req.file as Express.Multer.File).buffer
      );
      const snapshot = await uploadTask;
      const url = await getDownloadURL(snapshot.ref);

      const newReport: IReportCard = new ReportCard({
        student: studentId,
        department: departmentId,
        exam: examId,
        sgpa: sgpa,
        file: {
          name: (req.file as Express.Multer.File).originalname,
          url,
          path: fileFullPath,
        },
      });
      const gradeList = Array.isArray(grades) ? grades : [grades];

      newReport.grades = gradeList.map((grade: any) => JSON.parse(grade));

      const savedReport: IReportCard = await newReport.save();
      if (!savedReport)
        throw new Error("Something went wrong saving the report");

      res.status(200).json({
        success: true,
        message: "Report added successfully",
        report: savedReport,
      });
    } else {
      const newReport: IReportCard = new ReportCard({
        student: studentId,
        department: departmentId,
        exam: examId,
        sgpa: sgpa,
      });

      // if grades is not a list then make it a list
      const gradeList = Array.isArray(grades) ? grades : [grades];

      newReport.grades = gradeList.map((grade: any) => JSON.parse(grade));

      const savedReport: IReportCard = await newReport.save();
      if (!savedReport)
        throw new Error("Something went wrong saving the report");

      res.status(200).json({
        success: true,
        message: "Report added successfully",
        report: savedReport,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const addDocToReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportId } = req.body;

    const report: IReportCard | null = await ReportCard.findById(reportId)
      .populate({
        path: "student",
        select: "name srn joiningDate",
      })
      .populate({
        path: "department",
        select: "name",
      })
      .populate({
        path: "exam",
        select: "examDate semester",
      });
    if (!report) throw new Error("Report does not exist");

    const file = req.file;
    if (!file) throw new Error("No file provided");

    const joiningYear = report.student.joiningDate.getFullYear();
    const fileFullPath = `${report.department.code}/${joiningYear}/${
      report.student.srn
    }/${report.exam.examDate.getMonth()}-${report.exam.examDate.getFullYear()}-${
      (req.file as Express.Multer.File).originalname
    }`;
    const storageRef = ref(storage, fileFullPath);
    const uploadTask = uploadBytes(
      storageRef,
      (req.file as Express.Multer.File).buffer
    );
    const snapshot = await uploadTask;
    const url = await getDownloadURL(snapshot.ref);

    report.file = {
      name: (req.file as Express.Multer.File).originalname,
      url,
      path: fileFullPath,
    };

    const savedReport: IReportCard | null = await report.save();
    if (!savedReport) throw new Error("Something went wrong saving report");

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      report: savedReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const deleteReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportId, studentId } = req.body;

    const report: IReportCard | null = await ReportCard.findById(reportId);
    if (!report) throw new Error("Report does not exist");

    if (report.student.toString() !== studentId)
      throw new Error("Student does not own this report");

    // delete files from storage
    const fileRef = ref(storage, report.file.path);
    await deleteObject(fileRef);

    const deletedReport: IReportCard | null =
      await ReportCard.findByIdAndDelete(reportId);
    if (!deletedReport) throw new Error("Something went wrong deleting report");

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export { getReports, addReport, addDocToReport, deleteReport };
