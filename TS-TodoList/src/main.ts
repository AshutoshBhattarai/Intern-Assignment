import { Todo } from "./Todo/Todo";
import { TodoList } from "./Todo/TodoList";
import "./styles/style.css";

const searchInput = document.getElementById("todo-search-input") as HTMLElement;
const btnNavAll = document.getElementById("btn-nav-all") as HTMLElement;
const btnNavCompleted = document.getElementById(
  "btn-nav-completed"
) as HTMLElement;
const btnNavRemaining = document.getElementById(
  "btn-nav-remaining"
) as HTMLElement;

const btnTodoCreate = document.getElementById("btn-create") as HTMLElement;
const todoCreateForm = document.getElementById("todo-create") as HTMLElement;
const btnAddTodo = document.getElementById("btn-add-todo") as HTMLElement;
const btnCancelTodo = document.getElementById("btn-cancel-todo") as HTMLElement;

const titleInput = document.getElementById("todo-input-title") as HTMLElement;
const descInput = document.getElementById("todo-input-desc") as HTMLElement;

const todoContainer = document.getElementById("todo-container") as HTMLElement;

const activePages: {
  [key: string]: boolean;
} = {
  all: true,
  completed: false,
  remaining: false,
};

const todoList = new TodoList();

toggleActivePage(btnNavAll);

searchInput?.addEventListener("input", (e) => {
  searchTodos((e.target as HTMLInputElement)?.value, getActiveList());
});

btnTodoCreate.addEventListener("click", () => {
  todoCreateForm.style.display = "block";
});

btnCancelTodo.addEventListener("click", () => {
  hideForm();
});

btnAddTodo?.addEventListener("click", () => {
  const title: string = (titleInput as HTMLInputElement).value || "Todo";
  const desc: string =
    (descInput as HTMLInputElement).value || "Nothing to describe here !! 😁";

  const todo = new Todo(title, desc);
  todoList.addTodo(todo);

  renderList(getActiveList());
  hideForm();
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

function toggleActivePage(button: HTMLElement | null): void {
  if (!button) throw new Error("Button not there !!");
  Object.keys(activePages).forEach((key) => (activePages[key] = false));
  //Getting id of the button currently clicked
  //actual id has 'btn-nav-#' so using substring to get the last part that matches the Obj. key
  const buttonID = button.id.substring(8);
  activePages[buttonID] = true;

  btnNavAll?.classList.remove("active");
  btnNavCompleted?.classList.remove("active");
  btnNavRemaining?.classList.remove("active");

  button.classList.add("active");
  renderList(getActiveList());
}

function renderList(todos: TodoList): void {
  if (!todoContainer) throw new Error("Todo container element not found!!");

  todoContainer.innerHTML =
    todos.getList().length <= 0
      ? `<div class="todo__empty">No Todos found</div>`
      : "";

  todos.getList().forEach((todo) => {
    createTodoItem(todo, todoContainer);
  });
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
  addedDate.textContent = `Created : ${todo.addedDate.toDateString()}`;

  const isCompleted = document.createElement("input");
  isCompleted.type = "checkbox";
  isCompleted.checked = todo.isCompleted;

  isCompleted.addEventListener("change", () => {
    todo.toggleCompleted();
    renderList(getActiveList());
  });

  const checkboxLabel = document.createElement("label");
  checkboxLabel.className = "todo__isCompleted";
  checkboxLabel.textContent = todo.isCompleted ? "Completed" : "Pending";
  checkboxLabel.appendChild(isCompleted);

  const deleteTodo = document.createElement("button");
  deleteTodo.className = "todo__delete";
  deleteTodo.classList.add("delete"); // Used to style the button red
  deleteTodo.innerHTML = "&#128465;"; //Shows the trash icon
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

function hideForm(): void {
  todoCreateForm.style.display = "none";
  (titleInput as HTMLInputElement).value = "";
  (descInput as HTMLInputElement).value = "";
}
