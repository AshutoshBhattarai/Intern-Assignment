import { Request, Response } from "express";
import * as todoService from "../service/TodoService";
import { Todo } from "../model/TodoModel";
export const getAllTodos = (req: Request, res: Response) => {
  const todos = todoService.getAllTodos();
  return res.json({ todos });
};

export const addTodo = (req: Request, res: Response) => {
  const todo = todoService.addTodo(req.body);
  return res.json({ todo });
};

export const updateTodo = (req: Request, res: Response) => {
  const id : number = parseInt(req.params.id);
  const data: Todo = req.body;
  const todo = todoService.updateTodo(id, data);
  return res.json({ todo });
};
export const getTodoById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const todo = todoService.getTodoById(id);
  return res.json({ todo });
};

export const deleteTodo = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const todo = todoService.deleteTodo(id);
  return res.json({ todo });
};
