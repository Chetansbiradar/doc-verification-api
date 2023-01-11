import { Router } from "express";
import multer from "multer";
import { addDocToReport, addReport, deleteReport, getReports } from "../Controllers/Admin/Docs";
import {
  addDept,
  addExam,
  addSubject,
  deleteDept,
  deleteExam,
  deleteSubject,
  editDept,
  editSubject,
  getDepts,
  getExams,
  getSubjects,
} from "../Controllers/Admin/Management";
import {
  addStudent,
  deleteStudent,
  getStudents,
  getStudentsGroupedDept,
  updateStudentDetails,
} from "../Controllers/Admin/Students";
import {
  addAccess,
  deleteUser,
  getAllUsers,
  getVerifiers,
  removeAccess,
  updateAccessLevel,
} from "../Controllers/Admin/User";

const maxFileSize = 20;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSize * 1024 * 1024,
  },
});

const router = Router();

// user routes
router.get("/all-users", getAllUsers);

router.get("/verifiers", getVerifiers);

router.put("/edit-access-level", updateAccessLevel);

router.put("/add-access-to-verifier", addAccess);

router.put("/remove-access-from-verifier", removeAccess);

router.delete("/delete-user", deleteUser);

// doc routes
router.get("/students", getStudents);

router.get("/students-group-dept", getStudentsGroupedDept);

router.post("/create-student", addStudent);

router.put("/update-student", updateStudentDetails);

router.delete("/delete-student", deleteStudent);

router.get("/student-reports", getReports);

router.post("/add-report", upload.single("file"), addReport);

router.post("/upload-report-doc", upload.single("file"), addDocToReport);

router.delete("/delete-report", deleteReport);

// router.post("create-students", addStudents);

// management routes
router.get("/depts", getDepts);

router.post("/create-dept", addDept);

router.put("/edit-dept", editDept);

router.delete("/delete-dept", deleteDept);

router.get("/subjects", getSubjects);

router.post("/create-subject", addSubject);

router.put("/edit-subject", editSubject);

router.delete("/delete-subject", deleteSubject);

router.get("/exams", getExams);

router.post("/create-exam", addExam);

router.delete("/delete-exam", deleteExam);

export default router;
