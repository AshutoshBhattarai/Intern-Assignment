import { Todo } from "./Todo/Todo";
import { TodoList } from "./Todo/TodoList";
import "./styles/style.css";

// Search input field
const searchInput = document.getElementById("todo-search-input") as HTMLElement;
// Button to simulate navigation to different sections/pages
const btnNavAll = document.getElementById("btn-nav-all") as HTMLElement;
const btnNavCompleted = document.getElementById(
  "btn-nav-completed"
) as HTMLElement;
const btnNavRemaining = document.getElementById(
  "btn-nav-remaining"
) as HTMLElement;
// Button to create a new todo(display the input fields and buttons)
const btnTodoCreate = document.getElementById("btn-create") as HTMLElement;
// Div element that contains the input fields and buttons
const todoCreateForm = document.getElementById("todo-create") as HTMLElement;
// Buttons to add todo or cancel (hide the input fields and buttons)
const btnAddTodo = document.getElementById("btn-add-todo") as HTMLElement;
const btnCancelTodo = document.getElementById("btn-cancel-todo") as HTMLElement;
//. Todo input fields (Title and Description)
const titleInput = document.getElementById("todo-input-title") as HTMLElement;
const descInput = document.getElementById("todo-input-desc") as HTMLElement;
// Main container that contains all the todo items
const todoContainer = document.getElementById("todo-container") as HTMLElement;

//Creating a list of active pages to keep track of which list is to be displayed
const activePages: {
  [key: string]: boolean;
} = {
  all: true,
  completed: false,
  remaining: false,
};
//Creates a new/initial TodoList instance
const todoList = new TodoList();
// Sets 'all' as the default page to display
toggleActivePage(btnNavAll);
/* ------------------------- Button Event Listeners ------------------------- */
//Searches for todos in the list based on the text input
searchInput?.addEventListener("input", (e) => {
  searchTodos((e.target as HTMLInputElement)?.value, getActiveList());
});

//Display input fields for the todo when clicked
btnTodoCreate.addEventListener("click", () => {
  todoCreateForm.style.display = "block";
});

// Simple cancel button to hide the input fields
btnCancelTodo.addEventListener("click", () => {
  hideForm();
});

// This adds the new todo when the 'Add Todo' button is clicked
btnAddTodo?.addEventListener("click", () => {
  // If there is input get the values from the input fields else use default values
  const title: string = titleInput?.value || "Todo";
  const desc: string = descInput?.value || "Nothing to describe here !! 😁";
  // Creates a new Todo instance
  const todo = new Todo(title, desc);
  // Adds the todo to the list
  todoList.addTodo(todo);
  // Re-renders the list to display the new todo
  renderList(getActiveList());
  // Hides the input fields
  hideForm();
});

/* ------------ Toggles the active page when a button is clicked ------------ */
btnNavAll?.addEventListener("click", () => {
  toggleActivePage(btnNavAll);
});
btnNavCompleted?.addEventListener("click", () => {
  toggleActivePage(btnNavCompleted);
});
btnNavRemaining?.addEventListener("click", () => {
  toggleActivePage(btnNavRemaining);
});
/* ----------------------------------- -- ----------------------------------- */

function toggleActivePage(button: HTMLElement | null): void {
  if (!button) throw new Error("Button not there !!");
  // Setting all the active pages to false
  Object.keys(activePages).forEach((key) => (activePages[key] = false));
  //Getting id of the button currently clicked
  //actual id has 'btn-nav-#' so using substring to get the last part that matches the Obj. key
  const buttonID = button.id.substring(8);
  // Setting current page to true according to the button clicked
  activePages[buttonID] = true;
  //Removing active class from all the buttons
  btnNavAll?.classList.remove("active");
  btnNavCompleted?.classList.remove("active");
  btnNavRemaining?.classList.remove("active");
  // Setting active class to the only button clicked
  button.classList.add("active");
  // Rendering the list according to the current page
  renderList(getActiveList());
}

function renderList(todos: TodoList): void {
  // Check if the todoContainer element exists
  // If it doesn't exist, throw an error
  if (!todoContainer) throw new Error("Todo container element not found!!");

  // Clear the contents of the todoContainer element
  // If there is no todo in the list, display a message
  // else clear the container and display the list
  todoContainer.innerHTML =
    todos.getList().length <= 0
      ? `<div class="todo__empty">No Todos found</div>`
      : "";

  // Iterate over each todo in the todo list and create a todo item for each todo
  todos.getList().forEach((todo) => {
    createTodoItem(todo, todoContainer);
  });
}

function searchTodos(searchText: string, list: TodoList): void {
  // Searches and displays the todo according to the user input text
  // Renders the list based on the searched text
  renderList(new TodoList(list.search(searchText)));
}

// Getting the active list based on the active pages
function getActiveList(): TodoList {
  const { completed, remaining } = activePages;
  // Creates a new Todolist instance with the required list based on the active pages
  if (completed) return new TodoList(todoList.getCompletedList());
  if (remaining) return new TodoList(todoList.getRemainingList());
  // Returns the original todoList if 'all' page is active
  return todoList;
}
function createTodoItem(todo: Todo, container: HTMLElement | null): void {
  // Creating html dom elements for the todo
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
  // If change event is triggered, it will toggle the completed status of the todo and re-render the list
  isCompleted.addEventListener("change", () => {
    todo.toggleCompleted();
    renderList(getActiveList());
  });
  // This just shows a text based on the completed status(pending or completed)
  const checkboxLabel = document.createElement("label");
  checkboxLabel.className = "todo__isCompleted";
  checkboxLabel.textContent = todo.isCompleted ? "Completed" : "Pending";
  // The whole label consists of the checkbox and the text
  checkboxLabel.appendChild(isCompleted);

  // Simple delete button to delete the current todo
  const deleteTodo = document.createElement("button");
  deleteTodo.className = "todo__delete";
  deleteTodo.classList.add("delete"); // Used to style the button red
  deleteTodo.innerHTML = "&#128465;"; //Shows the trash icon
  deleteTodo.addEventListener("click", () => {
    // Deletes the todo from the list with the id of the current todo and re-renders the list
    todoList.deleteTodo(todo.id);
    renderList(getActiveList());
  });

  // Appending all the elements to the todo item
  todoItem.appendChild(title);
  todoItem.appendChild(description);
  todoItem.appendChild(addedDate);
  todoItem.appendChild(checkboxLabel);
  todoItem.appendChild(deleteTodo);
  // Adding the todo item to the todo container
  container?.appendChild(todoItem);
}

function hideForm(): void {
  // Hides the form and clears the input fields if any of the add or cancel buttons are clicked
  todoCreateForm.style.display = "none";
  titleInput.value = "";
  descInput.value = "";
}
