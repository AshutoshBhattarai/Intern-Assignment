import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/UserController";
const router = Router();

router.get("/", getAllUsers);
router.route("/:id").get(getUserById);

export default router;
