import { Todo } from "./Todo/Todo";
import { TodoList } from "./Todo/TodoList";
import "./styles/style.css";

const searchInput: HTMLElement | null =
  document.getElementById("todo-search-input");
const btnAddTodo: HTMLElement | null = document.getElementById("btn-add-todo");
const todoContainer: HTMLElement | null =
  document.getElementById("todo-container");
const btnNavAll: HTMLElement | null = document.getElementById("btn-nav-all");
const btnNavCompleted: HTMLElement | null =
  document.getElementById("btn-nav-completed");
const btnNavRemaining: HTMLElement | null =
  document.getElementById("btn-nav-remaining");
const titleInput: HTMLElement | null =
  document.getElementById("todo-input-title");
const descInput: HTMLElement | null =
  document.getElementById("todo-input-desc");

const activePages: {
  [key: string]: boolean;
} = {
  all: true,
  completed: false,
  remaining: false,
};
const todoList = new TodoList();

searchInput?.addEventListener("input", (e) => {
  searchTodos((e.target as HTMLInputElement)?.value, getActiveList());
});
btnAddTodo?.addEventListener("click", () => {
  const title: string = titleInput?.value || "Todo";
  const desc: string = descInput?.value || "Nothing to describe here 😁";
  const todo = new Todo(title, desc);
  todoList.addTodo(todo);
  renderList(getActiveList());
});
btnNavAll?.addEventListener("click", () => {
  toggleActivePage(btnNavAll);
});
btnNavCompleted?.addEventListener("click", () => {
  toggleActivePage(btnNavCompleted);
});
btnNavRemaining?.addEventListener("click", () => {
  toggleActivePage(btnNavRemaining);
});

renderList(getActiveList());

function toggleActivePage(button: HTMLElement | null): void {
  if (!button) throw new Error("Button not there !!");
  Object.keys(activePages).forEach((key) => (activePages[key] = false));
  const buttonID = button.id.substring(8);
  activePages[buttonID] = true;
  btnNavAll?.classList.remove("active");
  btnNavCompleted?.classList.remove("active");
  btnNavRemaining?.classList.remove("active");
  button.classList.add("active");
  renderList(getActiveList());
}

renderList(getActiveList());

function renderList(todos: TodoList): void {
  if (!todoContainer) throw new Error("Tdod container element not found !!");
  todoContainer.innerHTML = "";
  todos.getList().forEach((todo) => createTodoItem(todo, todoContainer));
}
function searchTodos(searchText: string, list: TodoList): void {
  renderList(new TodoList(list.search(searchText)));
}

function getActiveList(): TodoList {
  const { completed, remaining } = activePages;
  if (completed) return new TodoList(todoList.getCompletedList());
  if (remaining) return new TodoList(todoList.getRemainingList());
  return todoList;
}
function createTodoItem(todo: Todo, container: HTMLElement | null): void {
  const todoItem = document.createElement("div");
  todoItem.className = "todo__item";

  const title = document.createElement("h1");
  title.className = "todo__title";
  title.textContent = todo.title;

  const description = document.createElement("label");
  description.className = "todo__description";
  description.textContent = todo.description;

  const addedDate = document.createElement("label");
  addedDate.className = "todo__addedDate";
  addedDate.textContent = `Created At : ${todo.addedDate.toDateString()}`;

  const isCompleted = document.createElement("input");
  const checkboxLabel = document.createElement("label");
  isCompleted.type = "checkbox";
  isCompleted.checked = todo.isCompleted;
  isCompleted.addEventListener("change", () => {
    todo.toggleCompleted();
  });
  checkboxLabel.className = "todo__isCompleted";
  checkboxLabel.textContent = todo.isCompleted ? "Completed" : "Pending";
  checkboxLabel.appendChild(isCompleted);

  const deleteTodo = document.createElement("button");
  deleteTodo.className = "todo__delete";
  deleteTodo.classList.add("delete");
  deleteTodo.textContent = "Delete";
  deleteTodo.addEventListener("click", () => {
    todoList.deleteTodo(todo.id);
    renderList(getActiveList());
  });

  todoItem.appendChild(title);
  todoItem.appendChild(description);
  todoItem.appendChild(addedDate);
  todoItem.appendChild(checkboxLabel);
  todoItem.appendChild(deleteTodo);

  container?.appendChild(todoItem);
}
