import { Router } from "express";
import { getStudentReports, getStudents } from "../Controllers/Client/Docs";

const router = Router();

router.get("/students", getStudents);

router.get("/student-reports", getStudentReports);

export default router;
