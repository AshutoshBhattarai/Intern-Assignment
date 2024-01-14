import * as bootstrap from "bootstrap";
import Income from "../../interfaces/Income";

const createIncomeCard = (
  income: Income,
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
    "card"
  );

  const cardBody = document.createElement("div");
  cardBody.classList.add("row", "m-0", "align-items-center", "col-12");

  const amount = document.createElement("div");
  amount.classList.add("col", "text-success", "m-0", "align-middle");
  amount.innerHTML = `+Rs. ${income.amount}`;

  const source = document.createElement("div");
  source.classList.add("col-6");
  source.innerHTML = `<i class="fa-solid fa-building"></i> ${income.source}`;

  const date = document.createElement("div");
  date.classList.add("col");
  date.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${new Date(income.date as Date)
    .toUTCString()
    .substring(5, 16)}`;

  const actions = document.createElement("div");
  actions.classList.add("col");

  const editButton = document.createElement("button");
  editButton.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
  editButton.classList.add("btn", "btn-outline-primary", "col");
  editButton.setAttribute("data-bs-toggle", "tooltip");
  editButton.setAttribute("data-bs-placement", "top");
  editButton.setAttribute("data-bs-title", "Edit Income");
  const editToolTip = new bootstrap.Tooltip(editButton);
  editButton.addEventListener("click", () => {
    editOnClick();
    editToolTip.hide();
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
  deleteButton.classList.add("btn", "btn-outline-danger", "mx-2", "col");
  deleteButton.setAttribute("data-bs-toggle", "tooltip");
  deleteButton.setAttribute("data-bs-placement", "top");
  deleteButton.setAttribute("data-bs-title", "Delete Income");
  const deleteToolTip = new bootstrap.Tooltip(deleteButton);
  deleteButton.addEventListener("click", () => {
    deleteOnClick();
    deleteToolTip.hide();
  });

  cardBody.appendChild(amount);
  cardBody.appendChild(source);
  cardBody.appendChild(date);
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
  cardBody.appendChild(actions);
  cardContainer.appendChild(cardBody);
  return cardContainer;
};

export default createIncomeCard;
