import { Router } from "express";
import users from "./User";
import auth from "./Auth";
import { jwtAuth } from "../middlewares/JwtAuth";
const router = Router();

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
/* --------------------------- Initial Home Route --------------------------- */
router.get("/", (req, res) => {
  res.json({
    message: "Hello World from the Expense Tracker API!!",
  });
});

/* ------------------------------- Sub Routes ------------------------------- */
// User routes
router.use("/users", jwtAuth, users);
// Authentication routes
router.use(auth);
// Export the router
export default router;
