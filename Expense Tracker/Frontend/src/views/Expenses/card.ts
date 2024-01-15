import * as bootstrap from "bootstrap";
import Category from "../../interfaces/Category";
import Expense from "../../interfaces/Expense";

const createExpenseCard = (
  expense: Expense,
  editOnClick: () => void,
  deleteOnClick: () => void
) => {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "row",
    "border",
    "rounded-3",
    "py-2",
    "mb-2",
    "card",
    "mx-2",
  );

  const cardBody = document.createElement("div");
  cardBody.classList.add("row", "m-0", "align-items-center", "col-lg-12");

  const amount = document.createElement("div");
  amount.classList.add("col-lg-1","col-md-6", "text-danger", "m-0", "align-middle");
  amount.innerHTML = `-Rs. ${expense.amount}`;

  const remarks = document.createElement("div");
  remarks.classList.add("col-lg-6","col-sm-12");
  remarks.textContent = expense.description;

  const category = document.createElement("div");
  category.classList.add("col-lg","col-sm-12");
  category.textContent = (expense.category as Category).title;

  const date = document.createElement("div");
  date.classList.add("col-lg","col-sm-12");
  date.textContent = new Date(expense.date as Date)
    .toUTCString()
    .substring(5, 16);

  const actions = document.createElement("div");
  actions.classList.add("col","mt-3","mt-lg-0");

  const editButton = document.createElement("button");
  editButton.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
  editButton.classList.add("btn", "btn-outline-primary", "col");
  editButton.setAttribute("data-bs-toggle", "tooltip");
  editButton.setAttribute("data-bs-placement", "top");
  editButton.setAttribute("data-bs-title", "Edit Expense");
  const editTooltip = new bootstrap.Tooltip(editButton);
  editButton.addEventListener("click", () => {
    editTooltip.dispose();
    editOnClick();
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
  deleteButton.classList.add("btn", "btn-outline-danger", "mx-2", "col");
  deleteButton.setAttribute("data-bs-toggle", "tooltip");
  deleteButton.setAttribute("data-bs-placement", "top");
  deleteButton.setAttribute("data-bs-title", "Delete Expense");
  const deleteTooltip = new bootstrap.Tooltip(deleteButton);
  deleteButton.addEventListener("click", () => {
    deleteTooltip.dispose();
    deleteOnClick();
  });

  const viewImageButton = document.createElement("a");
  viewImageButton.innerHTML = "<i class='fa-solid fa-receipt'></i>";
  viewImageButton.classList.add("btn", "btn-outline-warning", "col");
  viewImageButton.href = expense.image || "#";
  viewImageButton.target = "_blank";
  viewImageButton.setAttribute("data-bs-toggle", "tooltip");
  viewImageButton.setAttribute("data-bs-placement", "top");
  viewImageButton.setAttribute("data-bs-title", "View Receipt");
  const viewImageToolTip = new bootstrap.Tooltip(viewImageButton);
  viewImageButton.addEventListener("click", () => {
    viewImageToolTip.dispose();
  });

  cardBody.appendChild(amount);
  cardBody.appendChild(remarks);
  cardBody.appendChild(category);
  cardBody.appendChild(date);
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
  actions.appendChild(viewImageButton);
  cardBody.appendChild(actions);
  cardContainer.appendChild(cardBody);
  return cardContainer;
};

export default createExpenseCard;
