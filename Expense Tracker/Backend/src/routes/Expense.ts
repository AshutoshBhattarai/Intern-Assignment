import { Router } from "express";
const router = Router();
import {
  createExpense,
  getAllExpenses,
  getFilteredExpenses,
} from "../controllers/ExpenseController";

router.route("/").get(getAllExpenses).post(createExpense).patch().delete();
router.route("/filter").get(getFilteredExpenses);

export default router;
