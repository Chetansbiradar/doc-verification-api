import { Router } from "express";
import multer from "multer";
import { addReport } from "../Controllers/Admin/Docs";
import {
  addDept,
  deleteDept,
  editDept,
  getDepts,
} from "../Controllers/Admin/Management";
import {
  addStudent,
  deleteStudent,
  getStudents,
  updateStudentDetails,
} from "../Controllers/Admin/Students";
import {
  deleteUser,
  getAllUsers,
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

router.put("/edit-access-level", updateAccessLevel);

router.delete("/delete-user", deleteUser);

// doc routes
router.get("/students", getStudents);

router.post("/create-student", addStudent);

router.put("/update-student", updateStudentDetails);

router.delete("/delete-student", deleteStudent);

router.put("/add-report", upload.single("file"), addReport);

// router.post("create-students", addStudents);

// management routes
router.get("/depts", getDepts);

router.post("/create-dept", addDept);

router.put("/edit-dept", editDept);

router.delete("/delete-dept", deleteDept);

export default router;
