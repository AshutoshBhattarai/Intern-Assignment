import { Router } from "express";
import { login, signup, refresh } from "../controller/AuthController";
import { validateReqBody } from "../middleware/validator";
import { loginSchema, signupSchema } from "../schema/userSchema";
const router = Router();

router.post("/signup", validateReqBody(signupSchema), signup);
router.post("/login", validateReqBody(loginSchema), login);
router.post("/refresh", refresh);
export default router;
