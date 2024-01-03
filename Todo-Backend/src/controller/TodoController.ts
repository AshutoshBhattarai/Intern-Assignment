import { Request, Response } from "express";
import * as todoService from "../service/TodoService";
import { Todo } from "../model/TodoModel";
import { CustomRequest } from "../interfaces/CustomRequest";
export const getAllTodos = async (req: Request, res: Response) => {
  const todos = (await todoService.getAllTodos()).map((todo) => responseTodo(todo));
  return res.json({ todos });
};

export const getUserTodos = async (req: Request, res: Response) => {
  const user = (req as CustomRequest).user;
  const todos : any = (await todoService
    .getUserTodos(user.id))
    .map((todo: Todo | undefined) => responseTodo(todo));
  return res.json({ todos });
};

export const addTodo = (req: Request, res: Response) => {
  const todo = todoService.addTodo(createData(req));
  return res.json({ todo });
};

export const updateTodo = (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const data: Todo = createData(req);
  const todo = todoService.updateTodo(id, data);
  return res.json({ todo });
};
export const getTodoById = (req: Request, res: Response) => {
  const todoId = parseInt(req.params.id);
  const userId = (req as CustomRequest).user.id;
  const todo = responseTodo(todoService.getTodoById(todoId, userId));
  return res.json(todo);
};

export const deleteTodo = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const todo = todoService.deleteTodo(id, (req as CustomRequest).user.id);
  return res.json({ todo });
};

const createData = (req: Request) => {
  const user = (req as CustomRequest).user;
  return { ...req.body, userid: user.id };
};

const responseTodo = (todo: Todo | undefined) => {
  if (!todo) return null;
  return {
    title: todo.title,
    completed: todo.completed,
  };
};
