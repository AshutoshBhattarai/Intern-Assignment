import { Router } from "express";
import { getUsers } from "../controller/UserController";
const router = Router();

router.route("/").get(getUsers).delete().put();

export default router;
