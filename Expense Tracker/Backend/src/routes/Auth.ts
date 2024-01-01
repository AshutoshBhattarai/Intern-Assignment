import { Router } from "express";
import {
  login,
  register,
  logout,
  refresh,
} from "../controllers/AuthController";
const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
