import { Router } from "express";
const router = Router();
import {
  createExpense,
  getAllExpenses,
  getFilteredExpenses,
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
  .patch()
  .delete();
router.get(
  "/filter",
  validateRequestQuery(expenseQuerySchema),
  getFilteredExpenses
);

export default router;
