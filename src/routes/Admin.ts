import { Router } from "express";
import {
  addMultipleStudents,
  addStudent,
  getStudents,
  updateStudentDetails,
} from "../Controllers/Admin/Docs";
import {
  deleteUser,
  getAllUsers,
  updateAccessLevel,
} from "../Controllers/Admin/User";

const router = Router();

// user routes
router.get("/all-users", getAllUsers);

router.put("/edit-access-level", updateAccessLevel);

router.delete("/delete-user", deleteUser);

// doc routes
router.get("/all-students", getStudents);

router.post("/create-student", addStudent);

router.post("create-students", addMultipleStudents);

router.put("/update-student", updateStudentDetails);

export default router;
