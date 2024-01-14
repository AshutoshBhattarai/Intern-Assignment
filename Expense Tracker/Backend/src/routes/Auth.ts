import { Router } from "express";
import {
  login,
  register,
  logout,
  refresh,
} from "../controllers/AuthController";
import { validateRequestBody } from "../middlewares/Validator";
import { userBodySchema, userLoginSchema } from "../validations/UserSchema";
import { jwtAuth } from "../middlewares/JwtAuth";
const router = Router();

router.post("/login", validateRequestBody(userLoginSchema), login);
router.post("/register", validateRequestBody(userBodySchema), register);
router.post("/logout", jwtAuth, logout);
router.post("/refresh", refresh);

export default router;
