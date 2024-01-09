import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getFilteredExpenses,
  updateExpense,
} from "../controllers/ExpenseController";
import {
  validateRequestBody,
  validateRequestQuery,
} from "../middlewares/Validator";
import {
  expenseBodySchema,
  expenseQuerySchema,
} from "../validations/ValidationSchema";
const router = Router();

router
  .route("/")
  .get(getAllExpenses)
  .post(validateRequestBody(expenseBodySchema), createExpense)
  .put(updateExpense);
router.delete("/:id", deleteExpense);
router.get(
  "/filter",
  validateRequestQuery(expenseQuerySchema),
  getFilteredExpenses
);

export default router;
