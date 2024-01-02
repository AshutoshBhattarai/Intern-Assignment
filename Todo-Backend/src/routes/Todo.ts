import { Router } from "express";
import {
  getAllTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
  getUserTodos,
} from "../controller/TodoController";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import { todoQuerySchema, todoSchema } from "../schema/todoSchema";
const router = Router();

router.route("/").get(getUserTodos).post(validateReqBody(todoSchema),addTodo);
router.route("/:id").get(validateReqQuery(todoQuerySchema),getTodoById)
.delete(deleteTodo)
.put(updateTodo);

export default router;
