import { NotFoundError } from "../errors/NotFoundError";
import * as todoRepo from "../Repositories/TodoRepo";
import { Todo } from "../model/TodoModel";

export const getAllTodos = () => {
  return todoRepo.getAllTodos();
};

export const getUserTodos = (id: number) => {
  const todos = todoRepo.getUserTodos(id);
  if (!todos) throw new NotFoundError("Todos not found");
  return todos;
};

export const addTodo = (todo: Todo) => {
  const todos = todoRepo.addTodo(todo);
  return todos;
};

export const getTodoById = (id: number, userid: number) :any => {
  const todos = todoRepo.getTodoById(id, userid);
  if (!todos) throw new NotFoundError("Todo not found");
  return todos;
};

export const updateTodo = (id: number, todo: Todo) => {
  const foundTodo = todoRepo.getTodoById(id, todo.userid);
  if (!foundTodo) throw new NotFoundError("Todo not found");
  return todoRepo.updateTodo(id, todo);
};

export const deleteTodo = (id: number, userid: number) => {
  const todo = todoRepo.getTodoById(id, userid);
  if (!todo) throw new NotFoundError("Todo not found");
  return todoRepo.deleteTodo(id);
};
