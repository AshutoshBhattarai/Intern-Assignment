import { Todo } from "./Todo";

export class TodoList {
  list: Todo[];
  constructor(list: Todo[] = []) {
    this.list = list;
  }

  addTodo(todo: Todo): void {
    this.list.push(todo);
  }

  getTodoById(id: string): Todo | undefined {
    return this.list.find((todo) => todo.id === id);
  }

  getTodoByIndex(index: number): Todo {
    return this.list[index];
  }

  updateTodo(todo: Todo): void {
    console.log(todo);
  }

  deleteTodo(id: string): void {
    this.list.forEach((todo) => {
      if (todo.id === id) this.list.splice(this.list.indexOf(todo), 1);
    });
  }
  getCompletedList(): Todo[] {
    return this.list.filter((todo) => todo.isCompleted);
  }

  getRemainingList(): Todo[] {
    return this.list.filter((todo) => !todo.isCompleted);
  }
  getList(): Todo[] {
    return this.list;
  }
  search(searchText: string): Todo[] {
    return this.list.filter((todo) =>
      todo.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
