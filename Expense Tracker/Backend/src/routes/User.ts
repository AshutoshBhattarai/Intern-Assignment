import { Router } from "express";
import { getAllUsers, addUser } from "../controllers/UserController";
const router = Router();

router.route("/").get(getAllUsers).post(addUser);


export default router;