/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatusCode } from "axios";
import * as bootstrap from "bootstrap";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
import { showToast } from "../../components/Toast";
import Category from "../../interfaces/Category";
import Expense from "../../interfaces/Expense";
import createDeleteRequest from "../../service/DeleteRequest";
import showErrorResponse from "../../service/ErrorResponse";
import createGetRequest from "../../service/GetRequest";
import http from "../../service/HttpClient";
import createCategoryOptions from "../../utils/CategoryOptions";
import generateExpenseCard from "./card";
import createPagination from "../../components/Pagination";
import MetaData from "../../interfaces/MetaData";
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
const paginationContainer = document.getElementById(
  "pagination-placeholder"
) as HTMLElement;
const filterAmount = document.getElementById(
  "filter-amount-display"
) as HTMLElement;
let expenseModal: bootstrap.Modal;
let dialogExpenseId: string = "";
let searchParams = "";
let pagination: { currentPage: number; totalPages: number };
/* ----------------------------------- -- ----------------------------------- */
window.onload = async () => {
  renderNavBar(navBar, "nav-expenses");
  await renderExpenseCards("");
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
  categories!.data.forEach((category: Category) => {
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

const handlePageClicked = (buttonClicked: string | number) => {
  if (buttonClicked === "previous") {
    if (pagination.currentPage > 1) {
      pagination.currentPage -= 1;
    }
  } else if (buttonClicked === "next") {
    if (pagination.currentPage < pagination.totalPages) {
      pagination.currentPage += 1;
    }
  } else {
    pagination.currentPage = buttonClicked as number;
  }
  renderExpenseCards("&page=" + pagination.currentPage);
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
  filterAmount.textContent = "";
  filterAmount.textContent = `Rs. ${filterAmountSlider.value}`;
  renderExpenseCards(`&amount=${filterAmountSlider.value}`);
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
    formData.append("id", expenseId);
    await updateExpense(formData);
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
  const expenseCard = generateExpenseCard(data, editFunction, deleteFunction);
  // Return the created expense card element
  return expenseCard;
};
/* -------------------------------------------------------------------------- */
/*                                 API calls                                  */
/* -------------------------------------------------------------------------- */
const renderExpenseCards = async (filter: string) => {
  const response = await createGetRequest(`/expenses/filter?${filter}`);
  const userExpenses = response?.data;
  const metaData: MetaData = response?.meta;
  pagination = {
    totalPages: metaData.totalPages,
    currentPage: pagination != undefined ? pagination.currentPage : 1,
  };
  if (userExpenses!.length == 0) {
    expensesContainer.innerHTML =
      "<h1 class='text-center h-75 p-5'>Sorry No Data Found!</h1>";
    paginationContainer.innerHTML = "";
    return;
  }
  expensesContainer.innerHTML = "";
  await userExpenses!.forEach((expense: Expense) => {
    expensesContainer.appendChild(createExpenseCard(expense));
  });
  const paginationBar = createPagination(
    pagination.totalPages,
    pagination.currentPage,
    handlePageClicked
  );
  paginationContainer.innerHTML = "";
  paginationContainer.appendChild(paginationBar);
};

const createExpense = async (expense: Expense | FormData) => {
  try {
    const response = await http.post("/expenses/", expense, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    if (response.status == HttpStatusCode.Accepted) {
      closeDialog();
      renderExpenseCards("");
      showToast(response.data.message, toastContainer, "success");
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

const updateExpense = async (expense: Expense | FormData) => {
  try {
    const response = await http.put("/expenses/", expense, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    if (response.status == HttpStatusCode.Accepted) {
      closeDialog();
      renderExpenseCards("");
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
