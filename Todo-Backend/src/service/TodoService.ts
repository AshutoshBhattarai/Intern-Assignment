import * as todoRepo from "../Repositories/TodoRepo";
import { Todo } from "../model/TodoModel";

export const getAllTodos = () => {
  return todoRepo.getAllTodos();
};

export const getUserTodos = (id: number) => {
  return todoRepo.getUserTodos(id);
}

export const addTodo = (todo: Todo) => {
  return todoRepo.addTodo(todo);
};

export const getTodoById = (id: number,userid : number) => {
  return todoRepo.getTodoById(id,userid);
};

export const updateTodo = (id:number,todo: Todo) => {
  return todoRepo.updateTodo(id,todo);
};

export const deleteTodo = (id: number) => {
  return todoRepo.deleteTodo(id);
};
