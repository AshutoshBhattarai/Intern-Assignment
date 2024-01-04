import { Router } from "express";
const router = Router();
import { createBudget,getAllBudgets,getBudgetById } from "../controllers/BudgetController";

router.route("/").get(getAllBudgets).post(createBudget);
router.route("/:id").get(getBudgetById).patch().delete();

export default router;
