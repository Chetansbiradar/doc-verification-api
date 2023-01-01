import { Request, Response } from "express";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../configs/firebase_config";
import ReportCard from "../../models/ReportCard";
import Student from "../../models/Student";
import { IReportCard, IStudent } from "../../types/DVA";

const storage = getStorage(app);

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

const addReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { srn, report } = req.body;
    if (!srn || !report) throw new Error("All fields are required");

    const student: IStudent | null = await Student.findOne({ srn });
    if (!student) throw new Error("Student does not exist");

    const checkExistingReport: IReportCard | null = await ReportCard.findOne({
      student: student._id,
      exam: report.examId,
    });
    if (checkExistingReport) throw new Error("Report card already exists");

    const joiningYear = student.joiningDate.getFullYear();
    const fileFullPath = `${student.department}/${joiningYear}/${student.srn}/${
      report.MMYYofExam
    }-${(req.file as Express.Multer.File).originalname}`;
    const storageRef = ref(storage, fileFullPath);
    const uploadTask = uploadBytes(
      storageRef,
      (req.file as Express.Multer.File).buffer
    );
    const snapshot = await uploadTask;
    const url = await getDownloadURL(snapshot.ref);

    const newReport: IReportCard = new ReportCard({
      student: student._id,
      department: report.departmentId,
      exam: report.examId,
      grades: report.grades,
      file: {
        name: (req.file as Express.Multer.File).originalname,
        url,
        path: fileFullPath,
      },
    });

    const savedReport: IReportCard = await newReport.save();
    if (!savedReport) throw new Error("Something went wrong saving the report");

    res.status(200).json({
      success: true,
      message: "Report added successfully",
      report: savedReport,
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
  addStudent,
  // addStudents,
  updateStudentDetails,
  addReport,
};
