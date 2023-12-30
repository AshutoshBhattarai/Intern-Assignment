import { Router } from "express";
import users from "./User";
import auth from "./Auth";
import todo from "./Todo";
import { authJwt } from "../middleware/AuthJwt";
// Initializing router
const router = Router();
// Attaching sub-routes to router
router.use(auth);
router.use("/users", users);
router.use("/todos",authJwt, todo);

//Exporting router
export default router;
