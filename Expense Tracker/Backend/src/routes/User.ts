import { Router } from "express";
import {
  getUserById,
  getUserSummary,
  updateUser,
} from "../controllers/UserController";
import { validateRequestBody } from "../middlewares/Validator";
import { userUpdateSchema } from "../validations/UserSchema";
const router = Router();

router
  .route("/")
  .get(getUserById)
  .put(validateRequestBody(userUpdateSchema), updateUser);
//?Not implemented
// router.route("/:id").delete();
router.get("/summary", getUserSummary);

export default router;
