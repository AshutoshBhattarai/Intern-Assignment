import { Router } from "express";
import { login, signup, refresh } from "../controller/AuthController";
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
export default router;
