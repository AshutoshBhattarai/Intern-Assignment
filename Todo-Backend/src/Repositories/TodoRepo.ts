import { Todo } from "../model/TodoModel";
import BaseRepo from "./BaseRepo";

const query = BaseRepo.queryBuilder();

export const addTodo = async(todo: Todo) => {
 return await query.insert(todo).into("todos");
};

export const getAllTodos = () => {
  return query.select(selectFormat).from("todos");
};

export const getTodoById = (id: number, userid: number) => {
  return query.select(selectFormat).from("todos").where({ id, userid }).first();
};
export const updateTodo = (id: number, todo: Todo) => {
  return query.update(todo).from("todos").where({ id }).first();
};

export const deleteTodo = (id: number) => {
  query.from("todos").where({ id }).del();
};
export const getUserTodos = async(id: number)=> {
 const todos = await  query.select(selectFormat).from("todos").where({ userid : id });
 return todos;
}

const selectFormat = {
  id: "todos.id",
  title: "todos.title",
  completed: "todos.completed",
  userid: "todos.userid",
}