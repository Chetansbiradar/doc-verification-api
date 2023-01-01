import { Router } from "express";
import verifyUser from "../utils/verifyUser";

import {
  changePassword,
  login,
  logout,
  refresh,
  register,
} from "../Controllers/Auth/Auth";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get("/refresh", refresh);

router.put("/change-password", verifyUser, changePassword);

export default router;
