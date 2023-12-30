import * as todoRepo from "../Repositories/TodoRepo";
import { Todo } from "../model/TodoModel";

export const getAllTodos = () => {
  return todoRepo.getAllTodos();
};

export const addTodo = (todo: Todo) => {
  return todoRepo.addTodo(todo);
};

export const getTodoById = (id: number) => {
  return todoRepo.getTodoById(id);
};

export const updateTodo = (id:number,todo: Todo) => {
  return todoRepo.updateTodo(id,todo);
};

export const deleteTodo = (id: number) => {
  return todoRepo.deleteTodo(id);
};
