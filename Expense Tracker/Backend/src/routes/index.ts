import { Router } from "express";
const router = Router();

// Initial route
router.get("/", (req, res) => {
  res.json({
    message: "Hello World from the Expense Tracker API!!",
  });
});

// Export the router
export default router;
