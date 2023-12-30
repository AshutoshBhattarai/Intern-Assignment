import { Router } from "express";
import {
    getUserByEmail,
    getUsers
} from "../controller/UserController";
const router = Router();

router.get("/", getUsers);
//router.get("/:id", getUserById);
router.get("/:email", getUserByEmail);

export default router;
