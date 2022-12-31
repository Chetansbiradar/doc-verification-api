import { Router } from "express";
import { getAllUsers, updateAccessLevel } from "../Controllers/Admin/User";

const router = Router();

// manage users
router.get("/all-users", getAllUsers);

router.put("/edit-user", updateAccessLevel);

export default router;
