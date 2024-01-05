import { Router } from "express";
import {
  addTodo,
  deleteTodo,
  getTodosBy,
  getUserTodos,
  updateTodo
} from "../controller/TodoController";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import { todoQuerySchema, todoSchema } from "../schema/todoSchema";
const router = Router();

router.route("/").get(getUserTodos).post(validateReqBody(todoSchema),addTodo);
router.route("/filter").get(validateReqQuery(todoQuerySchema),getTodosBy)
.delete(deleteTodo)
.put(updateTodo);

export default router;
