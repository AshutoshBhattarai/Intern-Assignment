import { Router } from "express";
import {
  getAllTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
} from "../controller/TodoController";
const router = Router();

router.route("/").get(getAllTodos).post(addTodo);
router.route("/:id").get(getTodoById).delete(deleteTodo).put(updateTodo);

export default router;
