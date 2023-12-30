import dbTodos from "../Database/Todo";
import { Todo } from "../model/TodoModel";

const todos: Todo[] = dbTodos;

export const addTodo = (todo: Todo): string => {
  const id = todos.length + 1;
  const createTodo = new Todo(id, todo.title, todo.completed, todo.userid);
  todos.push(createTodo);
  return "Todo Added sucessfully";
};

export const getAllTodos = (): Todo[] => {
  return todos;
};

export const getTodoById = (id: number, userid: number): Todo | undefined => {
  return todos.find((todo) => todo.id === id && todo.userid === userid);
};
export const updateTodo = (id: number, todo: Todo): string => {
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos[index] = new Todo(id, todo.title, todo.completed, todo.userid);
    return "Todo updated successfully";
  } else {
    return "Todo not found";
  }
};

export const deleteTodo = (id: number): string => {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    return "Todo deleted successfully";
  } else {
    return "Todo not found";
  }
};
export function getUserTodos(id: number) {
  return todos.filter((todo) => todo.userid === id);
}
