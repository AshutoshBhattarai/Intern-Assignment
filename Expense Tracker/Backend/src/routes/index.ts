import { Router } from "express";
import users from "./User";
const router = Router();

// Initial route
router.get("/", (req, res) => {
  res.json({
    message: "Hello World from the Expense Tracker API!!",
  });
});

router.use("/users", users);
// Export the router
export default router;
