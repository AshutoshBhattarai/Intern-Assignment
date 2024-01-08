/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatusCode } from "axios";
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
import http from "../../service/HttpClient";
/* ------------------------ Getting elements from DOM ----------------------- */
const navBar = document.getElementById("nav-placeholder") as HTMLElement;
const searchInput = document.getElementById("search-bar") as HTMLInputElement;
const searchBtn = document.getElementById("btn-search") as HTMLElement;
const expenseAddBtn = document.getElementById("btn-add-expense") as HTMLElement;
const btnSaveExpense = document.getElementById(
  "btn-save-expense"
) as HTMLElement;
const btnCloseDialog = document.getElementById(
  "btn-close-expense-dialog"
) as HTMLElement;
const addDialogBox = document.getElementById(
  "add-expense-dialog"
) as HTMLElement;
const remarksInput = document.getElementById("add-remarks") as HTMLInputElement;
const amountInput = document.getElementById("add-amount") as HTMLInputElement;
const categoryInput = document.getElementById(
  "add-category"
) as HTMLInputElement;
const receiptInput = document.getElementById("add-receipt") as HTMLInputElement;
const dateInput = document.getElementById("add-date") as HTMLInputElement;

const expensesContainer = document.getElementById(
  "expense-container"
) as HTMLElement;

/* ----------------------------------- -- ----------------------------------- */
window.onload = async () => {
  renderNavBar(navBar, "nav-expenses");
  renderExpenseCards("");
  const userCategories = await http.get("/categories", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });

  if (userCategories.status == HttpStatusCode.Ok) {
    const data = userCategories.data.result;
    categoryInput.innerHTML = "";
    data.forEach((category: any) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.text = category.title;
      categoryInput.appendChild(option);
    });
  }
};

searchBtn.addEventListener("click", () => {
  const searchData = searchInput.value;
  console.log(searchData);
});

expenseAddBtn.addEventListener("click", () => {
  addDialogBox.style.display = "block";
  addDialogBox.style.opacity = "100";
});

btnCloseDialog.addEventListener("click", () => {
  closeDialog();
});

btnSaveExpense.addEventListener("click", () => {
  getAddData();
  closeDialog();
});

const getAddData = () => {
  const remarks = remarksInput.value;
  const amount = amountInput.value;
  const category = categoryInput.value;
  const receipt = receiptInput.value;
  const date = dateInput.value;
  console.log(receipt, amount, category, remarks, date);
  createExpense(parseFloat(amount), remarks, category, date);
};

const closeDialog = () => {
  addDialogBox.style.display = "none";
  receiptInput.value = "";
  remarksInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  dateInput.value = "";
};

const createExpenseCard = (data: any) => {
  // Create the expense card element
  const expenseCard = document.createElement("div");
  expenseCard.classList.add("card");
  expenseCard.classList.add("mb-3");
  // Create the card body element
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Create the card description element and assign the remarks from the data
  const cardDescription = document.createElement("h3");
  cardDescription.classList.add("card-title","text-primary");
  cardDescription.textContent = data.description;

  // Create the card amount element and assign the amount from the data
  const cardAmount = document.createElement("h5");
  cardAmount.classList.add("card-text","text-danger");
  cardAmount.textContent = "Rs. " + data.amount;

  // Create the card date element and assign the date from the data
  const cardDate = document.createElement("p");
  cardDate.classList.add("card-text");
  cardDate.textContent = "Date: " +data.date;
  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group","d-flex","justify-content-around","gap-5");
  // Create the delete button element and add a click event listener
  const btnDelete = document.createElement("button");
  btnDelete.classList.add("btn", "btn-danger","round");
  btnDelete.innerHTML = "<i class='fas fa-trash'></i> Delete";
  btnDelete.addEventListener("click", () => {
    deleteExpense(data.id);
  });

  // Create the edit button element and add a click event listener
  const btnEdit = document.createElement("button");
  btnEdit.classList.add("btn", "btn-primary");
  btnEdit.textContent = "Edit";
  btnEdit.addEventListener("click", () => {
    console.log("Edit", data.id);
  });

  // Create the view image link element and set the href and target
  const viewImage = document.createElement("a");
  viewImage.classList.add("btn", "btn-primary");
  viewImage.textContent = "View Receipt";
  viewImage.href = data.image;
  viewImage.target = "_blank";

  btnGroup.appendChild(btnDelete);
  btnGroup.appendChild(btnEdit);
  btnGroup.appendChild(viewImage);
  
  // Append the card date, description, amount, delete button, edit button, and view image link to the card body
  cardBody.appendChild(cardDescription);
  cardBody.appendChild(cardAmount);
  cardBody.appendChild(cardDate);
  cardBody.appendChild(btnGroup);

  // Append the card body to the expense card
  expenseCard.appendChild(cardBody);

  // Return the created expense card element
  return expenseCard;
};

const renderExpenseCards = async (filter: any) => {
  const userExpenses = await http.get(`/expenses/filter?${filter}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  if (userExpenses.status == HttpStatusCode.Ok) {
    const data = userExpenses.data.data;
    if (data.length == 0) {
      expensesContainer.innerHTML =
        // eslint-disable-next-line quotes
        '<h1 class="text-center h-75 p-5 ">Sorry No Data Found!</h1>';
      return;
    }
    expensesContainer.innerHTML = "";
    data.forEach((expense: any) => {
      expensesContainer.appendChild(createExpenseCard(expense));
    });
  }
};

const createExpense = async (
  amount: number,
  description: string,
  category: string,
  date: string
  // image: File
) => {
  const response = await http.post(
    "/expenses",
    {
      amount,
      description,
      category,
      date,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );

  if (response.status == HttpStatusCode.Accepted) {
    closeDialog();
    renderExpenseCards("");
  }
};

const deleteExpense = async (id: string) => {
  const response = await http.delete(`/expenses/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  if (response.status == HttpStatusCode.Accepted) {
    renderExpenseCards("");
  }
};
