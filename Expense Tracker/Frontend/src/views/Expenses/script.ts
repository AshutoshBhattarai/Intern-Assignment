/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */
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
import SearchParams from "../../interfaces/SearchParams";
/* -------------------------------------------------------------------------- */
/*                          Getting elements from DOM                         */
/* -------------------------------------------------------------------------- */
const navBar = document.getElementById("nav-placeholder") as HTMLElement;
//Search bar element
const searchInput = document.getElementById(
  "filter-search"
) as HTMLInputElement;
//Search button
const searchBtn = document.getElementById("btn-search") as HTMLElement;
//Add expense button(opens dialog box)
const expenseAddBtn = document.getElementById("btn-add-expense") as HTMLElement;
//Save expense button(button inside the dialog box that saves expense)
const btnSaveExpense = document.getElementById(
  "btn-save-expense"
) as HTMLElement;
//Close dialog button
const btnCloseDialog = document.getElementById(
  "btn-close-expense-dialog"
) as HTMLElement;
//Add Expense dialog box(also used for edit dialog box)
const addDialogBox = document.getElementById(
  "add-expense-dialog"
) as HTMLElement;
/* ---------------------------- Dialog box inputs --------------------------- */
// Amount
const amountInput = document.getElementById("add-amount") as HTMLInputElement;
//Description
const remarksInput = document.getElementById("add-remarks") as HTMLInputElement;
//Category
const categoryInput = document.getElementById(
  "add-category"
) as HTMLInputElement;
//Receipt file/image
const receiptInput = document.getElementById("add-receipt") as HTMLInputElement;
//Date
const dateInput = document.getElementById("add-date") as HTMLInputElement;
/* --------------- Expense container to display expense cards --------------- */
const expensesContainer = document.getElementById(
  "expense-container"
) as HTMLElement;
/* --------------------------------- Filters -------------------------------- */
// Filter cards or search expenses by amount, category, date etc.
// Search by amount slider
const filterAmountSlider = document.getElementById(
  "filter-amount"
) as HTMLInputElement;
// Displays the amount selected by the user
const filterAmount = document.getElementById(
  "filter-amount-display"
) as HTMLElement;
// Clears filters or removes search parameters
const btnClearFilter = document.getElementById(
  "btn-clear-filter"
) as HTMLInputElement;

/* ---------------------------------- Toast --------------------------------- */
const toastContainer = document.getElementById("toast-message") as HTMLElement;
/* ------------------------- Pagination Container -------------------------- */
const paginationContainer = document.getElementById(
  "pagination-placeholder"
) as HTMLElement;

/* -----------------Initializing variables------------------------------------ */

let expenseModal: bootstrap.Modal;
let dialogExpenseId: string = "";
let pagination: { currentPage: number; totalPages: number };
const filters: SearchParams = {};
/* ----------------------------------- -- ----------------------------------- */
window.onload = async () => {
  
  renderNavBar(navBar, "nav-expenses");
 
  filters.page = pagination ? pagination.currentPage : 1;

  await renderExpenseCards(filters);
  
  expenseModal = new bootstrap.Modal(addDialogBox);
 
  createCategoryOptions(categoryInput);
  
  new bootstrap.Dropdown(
    document.getElementById("filter-category-dropdown") as HTMLElement
  );

  const categories = await createGetRequest("/categories/");
 
  const dropDownMenu = document.getElementById(
    "filter-category-menu"
  ) as HTMLElement;
  // Add "All" option to select all categories
  const btnAll = document.createElement("button");
  btnAll.classList.add("dropdown-item");
  btnAll.textContent = "All";
  btnAll.addEventListener("click", () => {
    filters.category = "";

    renderExpenseCards(filters);
  });
 
  dropDownMenu.appendChild(btnAll);

  categories!.data.forEach((category: Category) => {
    const btn = document.createElement("button");
    btn.classList.add("dropdown-item");
    btn.textContent = category.title;
    btn.textContent = category.title;
    btn.addEventListener("click", () => {
      // Render expense cards with selected category
      filters.category = category.id?.toString();
      renderExpenseCards(filters);
    });

    dropDownMenu.appendChild(btn);
  });

  // Configure date range picker for filtering/searching by date
  flatpickr("#filter-date", {
    // For multiple date
    mode: "range",
    dateFormat: "YYYY-MM-DD",
   
    onClose: function (selectedDates, _dateStr, instance) {
      if (selectedDates.length === 2) {
        const startDate = moment(selectedDates[0]).format("YYYY-MM-DD");
        const endDate = moment(selectedDates[1]).format("YYYY-MM-DD");
        // Display start and end dates in the date picker
        instance.input.value = `${startDate} to ${endDate}`;
        // Set start and end dates in filters
        filters.startDate = startDate;
        filters.endDate = endDate;
        
        renderExpenseCards(filters);
      }
    },
  });
};

// Handle pagination
const handlePageClicked = (buttonClicked: string | number) => {
  // Detects clicks from the pagination component and updates the current page
  if (buttonClicked === "previous") {
    if (pagination.currentPage > 1) {
      pagination.currentPage -= 1;
    }
  }
  else if (buttonClicked === "next") {
    if (pagination.currentPage < pagination.totalPages) {
      pagination.currentPage += 1;
    }
  }
  else {
    pagination.currentPage = buttonClicked as number;
  }
  filters.page = pagination.currentPage;

  renderExpenseCards(filters);
};

searchBtn.addEventListener("click", () => {
  const searchData = searchInput.value;

  filters.description = searchData ? searchData : "";
  renderExpenseCards(filters);
});

expenseAddBtn.addEventListener("click", () => {
  showDialog();
});

btnClearFilter.addEventListener("click", () => {
  const filterDate = document.getElementById("filter-date") as HTMLInputElement;
  searchInput.value = "";
  filterDate.value = "";
  filters.description = "";
  filters.category = "";
  filters.startDate = "";
  filters.endDate = "";
  filters.amount = 0;

  renderExpenseCards(filters);
});


filterAmountSlider.addEventListener("change", () => {
  filterAmount.textContent = "";
  filterAmount.textContent = `Rs. ${filterAmountSlider.value}`;
  filters.amount = parseInt(filterAmountSlider.value);
  renderExpenseCards(filters);
});


btnCloseDialog.addEventListener("click", () => {
  closeDialog();
});

btnSaveExpense.addEventListener("click", () => {
  saveExpense();
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
    if (
      
      validateInput({
        description: remarks,
        amount: parseFloat(amount),
        date: date.toISOString(),
        category,
      })
    ) {
      createExpense(formData);
      dialogExpenseId = "";
    }
  } 
  // if dialogExpenseId is not empty then update expense
  else if (dialogExpenseId != "") {
    const expenseId = dialogExpenseId!;
    if (
      
      validateInput({
        description: remarks,
        amount: parseFloat(amount),
        date: date.toISOString(),
        category,
      })
    ) {
      formData.append("id", expenseId);
      await updateExpense(formData);
      dialogExpenseId = "";
    }
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

// Create expense card
const createExpenseCard = (data: Expense) => {

  // Function to delete expense
  const deleteFunction = () => {
    deleteExpense(data.id!);
  };
  // Function to edit expense
  const editFunction = () => {
    dialogExpenseId = data.id!;
    return showDialog({
      remarks: data.description,
      amount: data.amount!,
      date: data.date as string,
      category: (data.category as Category).id!,
    });
  };
  // Create expense card element
  const expenseCard = generateExpenseCard(data, editFunction, deleteFunction);
  return expenseCard;
};
/* -------------------------------------------------------------------------- */
/*                                 API calls                                  */
/* -------------------------------------------------------------------------- */
// Render expense cards with filters by calling API
const renderExpenseCards = async (filter: SearchParams) => {
  let baseUrl = "/expenses/filter?";
  /* --------------------- Add filters to base url if any --------------------- */
  if (filter.startDate && filter.endDate) {
    baseUrl += `startDate=${filter.startDate}&endDate=${filter.endDate}`;
  }
  if (filter.amount) {
    baseUrl += `amount=${filter.amount}`;
  }
  if (filter.category) {
    baseUrl += `&category=${filter.category}`;
  }
  if (filter.description) {
    baseUrl += `&description=${filter.description}`;
  }
  if (filter.page) {
    baseUrl += `&page=${filter.page}`;
  }

 
  const response = await createGetRequest(baseUrl);
 
  const userExpenses = response?.data;
 
  const metaData: MetaData = response?.meta;
  pagination = {
    totalPages: metaData.totalPages,
    currentPage: pagination ? pagination.currentPage : 1,
  };
  // If there are no expenses then display message
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
  // Create or update pagination bar
  const paginationBar = createPagination(
    pagination.totalPages,
    pagination.currentPage,
    handlePageClicked
  );
  // Append pagination bar to pagination container
  paginationContainer.innerHTML = "";
  paginationContainer.appendChild(paginationBar);
};

// Create expense and show toast messages
const createExpense = async (expense: Expense | FormData) => {
  try {
    const response = await http.post("/expenses/", expense, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    if (response.status == HttpStatusCode.Accepted) {
      closeDialog();
      renderExpenseCards(filters);
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
    closeDialog();
  }
};

// Delete expense and show toast messages
const deleteExpense = async (id: string) => {
  try {
    const response = await createDeleteRequest(`/expenses/${id}`);
    if (response.status == HttpStatusCode.Accepted) {
      renderExpenseCards(filters);
      dialogExpenseId = "";
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
  }
};
// Update expense and show toast messages
const updateExpense = async (expense: Expense | FormData) => {
  try {
    const response = await http.put("/expenses/", expense, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    if (response.status == HttpStatusCode.Accepted) {
      closeDialog();
      renderExpenseCards(filters);
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
    closeDialog();
  }
};


// Show error toast
const showErrorToast = (error: unknown) => {
  const message = showErrorResponse(error) || error;
  showToast(message, toastContainer, "error");
};

// Validate input
const validateInput = (expense: Expense) => {
  if (expense.description === "") {
    showToast("Description cannot be empty", toastContainer, "error");
    return false;
  }
  if (isNaN(expense.amount!)) {
    showToast("Amount must be a number", toastContainer, "error");
    return false;
  }
  if (expense.amount === 0) {
    showToast("Amount cannot be zero", toastContainer, "error");
    return false;
  }
  if (expense.date === "") {
    showToast("Date cannot be empty", toastContainer, "error");
    return false;
  }
  if (expense.category === "") {
    showToast("Category cannot be empty", toastContainer, "error");
    return false;
  }
  return true;
};
