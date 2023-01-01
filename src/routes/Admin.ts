import { Router } from "express";
import multer from "multer";
import {
  addReport,
  addStudent,
  getStudents,
  updateStudentDetails,
} from "../Controllers/Admin/Docs";
import { addDept } from "../Controllers/Admin/Management";
import {
  deleteUser,
  getAllUsers,
  updateAccessLevel,
} from "../Controllers/Admin/User";

const maxFileSize = 20;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSize * 1024 * 1024, // no larger than 5mb
  },
});

const router = Router();

// user routes
router.get("/all-users", getAllUsers);

router.put("/edit-access-level", updateAccessLevel);

router.delete("/delete-user", deleteUser);

// doc routes
router.get("/all-students", getStudents);

router.post("/create-student", addStudent);

router.put("/update-student", updateStudentDetails);

router.put("/add-report", upload.single("file"), addReport);

// router.post("create-students", addStudents);

// management routes
router.post("/create-dept", addDept);

export default router;
