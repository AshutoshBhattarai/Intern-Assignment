import { Router } from "express";
const router = Router();
import {
  createExpense,
  getAllExpenses,
  getFilteredExpenses,
  updateExpense,
  deleteExpense
} from "../controllers/ExpenseController";
import {
  validateRequestBody,
  validateRequestQuery,
} from "../middlewares/Validator";
import {
  expenseBodySchema,
  expenseQuerySchema,
} from "../validations/ValidationSchema";

router
  .route("/")
  .get(getAllExpenses)
  .post(validateRequestBody(expenseBodySchema), createExpense)
  .patch(updateExpense);
router.delete("/:id", deleteExpense);
router.get(
  "/filter",
  validateRequestQuery(expenseQuerySchema),
  getFilteredExpenses
);

export default router;
