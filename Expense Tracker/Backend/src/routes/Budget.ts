import { Router } from "express";
const router = Router();
import {
  createBudget,
  deleteBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
} from "../controllers/BudgetController";
import {
  validateRequestBody,
  validateRequestQuery,
} from "../middlewares/Validator";
import {
  budgetBodySchema,
  budgetQuerySchema,
} from "../validations/ValidationSchema";

router
  .route("/")
  .get(getAllBudgets)
  .post(validateRequestBody(budgetBodySchema), createBudget)
  .put(updateBudget);
router.delete("/:id", deleteBudget);
router.get("/filter", validateRequestQuery(budgetQuerySchema), getBudgetById);

export default router;
