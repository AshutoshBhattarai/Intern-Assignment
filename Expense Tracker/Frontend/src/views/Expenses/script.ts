/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatusCode } from "axios";
import * as bootstrap from "bootstrap";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import "../../assets/scss/style.scss";
import generateExpenseCard from "./card";
import renderNavBar from "../../components/Navbar/navbar";
import Category from "../../interfaces/Category";
import Expense from "../../interfaces/Expense";
import createDeleteRequest from "../../service/DeleteRequest";
import createGetRequest from "../../service/GetRequest";
import http from "../../service/HttpClient";
import createPutRequest from "../../service/PutRequest";
import createCategoryOptions from "../../utils/CategoryOptions";
import { showToast } from "../../components/Toast";
import showErrorResponse from "../../service/ErrorResponse";
/* ------------------------ Getting elements from DOM ----------------------- */
const navBar = document.getElementById("nav-placeholder") as HTMLElement;
const searchInput = document.getElementById(
  "filter-search"
) as HTMLInputElement;
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
const filterAmountSlider = document.getElementById(
  "filter-amount"
) as HTMLInputElement;
const toastContainer = document.getElementById("toast-message") as HTMLElement;

let expenseModal: bootstrap.Modal;
let dialogExpenseId: string = "";
let searchParams = "";
/* ----------------------------------- -- ----------------------------------- */
window.onload = async () => {
  renderNavBar(navBar, "nav-expenses");
  renderExpenseCards("");
  expenseModal = new bootstrap.Modal(addDialogBox);
  createCategoryOptions(categoryInput);
  new bootstrap.Dropdown(
    document.getElementById("filter-category-dropdown") as HTMLElement
  );
  const categories = await createGetRequest("/categories/");
  const dropDownMenu = document.getElementById(
    "filter-category-menu"
  ) as HTMLElement;
  const btnAll = document.createElement("button");
  btnAll.classList.add("dropdown-item");
  btnAll.textContent = "All";
  btnAll.addEventListener("click", () => {
    searchParams = "";
    renderExpenseCards(searchParams);
  });
  dropDownMenu.appendChild(btnAll);
  categories.forEach((category: Category) => {
    const btn = document.createElement("button");
    btn.classList.add("dropdown-item");
    btn.textContent = category.title;
    btn.textContent = category.title;
    btn.addEventListener("click", () => {
      searchParams += `&category=${category.id?.toString()}`;
      renderExpenseCards(searchParams);
      searchParams = "";
    });

    dropDownMenu.appendChild(btn);
  });
  flatpickr("#filter-date", {
    mode: "range",
    dateFormat: "YYYY-MM-DD",
    onClose: function (selectedDates, _dateStr, instance) {
      if (selectedDates.length === 2) {
        const startDate = moment(selectedDates[0]).format("YYYY-MM-DD");
        const endDate = moment(selectedDates[1]).format("YYYY-MM-DD");
        instance.input.value = `${startDate} to ${endDate}`;
        renderExpenseCards(`&startDate=${startDate}&endDate=${endDate}`);
      }
    },
  });
};

searchBtn.addEventListener("click", () => {
  const searchData = searchInput.value;
  searchData
    ? renderExpenseCards(`&description=${searchData}`)
    : renderExpenseCards("");
});

expenseAddBtn.addEventListener("click", () => {
  showDialog();
});

filterAmountSlider.addEventListener("change", () => {
  console.log(filterAmountSlider.value);
});

btnCloseDialog.addEventListener("click", () => {
  closeDialog();
});

btnSaveExpense.addEventListener("click", () => {
  saveExpense();
  closeDialog();
});
const closeDialog = () => {
  dialogExpenseId = "";
  expenseModal.hide();
  receiptInput.value = "";
  remarksInput.value = "";
  amountInput.value = "";
  categoryInput.value = "";
  dateInput.value = "";
};
const saveExpense = async () => {
  const remarks = remarksInput.value;
  const amount = amountInput.value;
  const category = categoryInput.value;
  const receipt = receiptInput.files?.[0];
  const date = (dateInput.value && new Date(dateInput.value)) || new Date();
  const formData = new FormData();
  formData.append("description", remarks);
  formData.append("amount", amount);
  formData.append("category", category);
  receipt && formData.append("image", receipt);
  formData.append("date", date.toISOString());

  if (dialogExpenseId === "") {
    createExpense(formData);
    dialogExpenseId = "";
  } else if (dialogExpenseId != "") {
    const expenseId = dialogExpenseId!;
    const expense: Expense = {
      id: expenseId,
      amount: parseFloat(amount),
      description: remarks,
      category: category,
      date: date.toISOString(),
    };
    await updateExpense(expense);
    dialogExpenseId = "";
  }
};
const showDialog = (data?: {
  remarks: string;
  amount: number;
  category: string;
  date: string;
}) => {
  expenseModal.show();
  receiptInput.value = "";
  remarksInput.value = data?.remarks || "";
  amountInput.value = data?.amount.toString() || "";
  categoryInput.value = data?.category || "";
  dateInput.value = data?.date.toString() || "";
};
const createExpenseCard = (data: Expense) => {
  // console.log(dialogExpenseId);
  // // Create the expense card element
  // const expenseCard = document.createElement("div");
  // expenseCard.classList.add("card", "mb-2", "col-md-8", "gx-3");
  // expenseCard.style.position = "relative"; // Set position relative for absolute positioning

  // // Create the card body element
  // const cardBody = document.createElement("div");
  // cardBody.classList.add("card-body", "mr-3");

  // // Create the card description element and assign the remarks from the data
  // const cardDescription = document.createElement("p");
  // cardDescription.classList.add("card-title", "text-primary", "m-0");
  // cardDescription.textContent = data.description;

  // // Create the card amount element and assign the amount from the data
  // const cardAmount = document.createElement("p");
  // cardAmount.classList.add("card-text", "text-danger", "m-0");
  // cardAmount.innerHTML = "<i class='fas fa-rupee'></i> " + data.amount;

  // const cardCategory = document.createElement("p");
  // cardCategory.classList.add("card-text", "m-0");
  // cardCategory.textContent = (data.category as Category).title;

  // // Create the card date element and assign the date from the data
  // const cardDate = document.createElement("p");
  // cardDate.classList.add("card-text");
  // cardDate.textContent = new Date(data.date as Date)
  //   .toUTCString()
  //   .substring(5, 16);

  // // Create the delete button container with absolute positioning
  // const btnDeleteContainer = document.createElement("div");
  // btnDeleteContainer.style.position = "absolute";
  // btnDeleteContainer.style.top = "5px";
  // btnDeleteContainer.style.right = "20px";

  // // Create the delete button element and add a click event listener
  // const btnDelete = document.createElement("button");
  // btnDelete.classList.add("btn", "btn-outline-danger", "round");
  // btnDelete.innerHTML = "<i class='fas fa-trash'></i>";
  // btnDelete.setAttribute("data-bs-toggle", "tooltip");
  // btnDelete.setAttribute("data-bs-placement", "top");
  // btnDelete.setAttribute("data-bs-title", "Delete Expense");
  // const btnDeletetooltip = new bootstrap.Tooltip(btnDelete);
  // btnDelete.addEventListener("click", () => {
  //   deleteExpense(data.id!);
  //   btnDeletetooltip.dispose();
  // });

  // // Append the delete button to its container
  // btnDeleteContainer.appendChild(btnDelete);

  // // Create the edit button container with absolute positioning
  // const btnEditContainer = document.createElement("div");
  // btnEditContainer.style.position = "absolute";
  // btnEditContainer.style.top = "5px";
  // btnEditContainer.style.right = "70px"; // Adjust the right value as needed

  // // Create the edit button element and add a click event listener
  // const btnEdit = document.createElement("button");
  // btnEdit.classList.add("btn", "btn-outline-primary");
  // btnEdit.innerHTML = "<i class='fas fa-edit'></i>";
  // btnEdit.addEventListener("click", () => {
  //   dialogExpenseId = data.id!;
  //   return showDialog({
  //     remarks: data.description,
  //     amount: data.amount!,
  //     date: data.date as string,
  //     category: (data.category as Category).id!,
  //   });
  // });
  // btnEdit.setAttribute("data-bs-toggle", "tooltip");
  // btnEdit.setAttribute("data-bs-placement", "top");
  // btnEdit.setAttribute("data-bs-title", "Edit Expense");
  // new bootstrap.Tooltip(btnEdit);
  // // Append the edit button to its container
  // btnEditContainer.appendChild(btnEdit);
  // // Create the view image link element and set the href and target
  // const viewImage = document.createElement("a");
  // viewImage.classList.add("btn", "btn-outline-warning");
  // viewImage.innerHTML = "<i class='fa-solid fa-file-invoice'></i>";
  // viewImage.href = data.image || "#";
  // viewImage.target = "_blank";
  // viewImage.setAttribute("data-bs-toggle", "tooltip");
  // viewImage.setAttribute("data-bs-placement", "top");
  // viewImage.setAttribute("data-bs-title", "View Receipt");
  // new bootstrap.Tooltip(viewImage);

  // // Append the card date, description, amount, delete button container, edit button, and view image link to the card body
  // cardBody.appendChild(cardAmount);
  // cardBody.appendChild(cardDescription);
  // cardBody.appendChild(cardCategory);
  // cardBody.appendChild(cardDate);
  // cardBody.appendChild(btnDeleteContainer);
  // cardBody.appendChild(btnEditContainer);
  // cardBody.appendChild(viewImage);

  // // Append the card body to the expense card
  // expenseCard.appendChild(cardBody);
  const deleteFunction = () => {
    deleteExpense(data.id!);
  };
  const editFunction = () => {
    dialogExpenseId = data.id!;
    return showDialog({
      remarks: data.description,
      amount: data.amount!,
      date: data.date as string,
      category: (data.category as Category).id!,
    });
  };
  const viewImageFunc = () => {};
  const expenseCard = generateExpenseCard(
    data,
    editFunction,
    deleteFunction
  );
  // Return the created expense card element
  return expenseCard;
};

const renderExpenseCards = async (filter: string) => {
  const userExpenses = await createGetRequest(`/expenses/filter?${filter}`);
  if (userExpenses.length == 0) {
    expensesContainer.innerHTML =
      // eslint-disable-next-line quotes
      '<h1 class="text-center h-75 p-5 ">Sorry No Data Found!</h1>';
    return;
  }
  expensesContainer.innerHTML = "";
  userExpenses.forEach((expense: Expense) => {
    expensesContainer.appendChild(createExpenseCard(expense));
  });
};

const createExpense = async (expense: Expense | FormData) => {
  try {
    const response = await http.post("/expenses/", expense, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    if (response.status == HttpStatusCode.Accepted) {
      closeDialog();
      renderExpenseCards("");
      showToast("Expense Added Successfully", toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
    closeDialog();
  }
};

const deleteExpense = async (id: string) => {
  try {
    const response = await createDeleteRequest(`/expenses/${id}`);
    if (response.status == HttpStatusCode.Accepted) {
      renderExpenseCards("");
      dialogExpenseId = "";
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
  }
};

const updateExpense = async (expense: Expense) => {
  try {
    const response = await createPutRequest("/expenses/", expense);
    if (response.status == HttpStatusCode.Accepted) {
      renderExpenseCards("");
      closeDialog();
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
    closeDialog();
  }
};

const showErrorToast = (error: any) => {
  const message = showErrorResponse(error) || error;
  showToast(message, toastContainer, "error");
};
