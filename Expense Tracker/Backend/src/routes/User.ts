import { Router } from "express";
import { getAllUsers } from "../controllers/UserController";
const router = Router();

router.route("/").get(getAllUsers);

export default router;