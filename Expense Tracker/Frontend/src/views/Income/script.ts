/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */
import { HttpStatusCode } from "axios";
import * as bootstrap from "bootstrap";
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
import Income from "../../interfaces/Income";
import createDeleteRequest from "../../service/DeleteRequest";
import createGetRequest from "../../service/GetRequest";
import createPostRequest from "../../service/PostRequest";
import createPutRequest from "../../service/PutRequest";
import showErrorResponse from "../../service/ErrorResponse";
import { showToast } from "../../components/Toast";
import generateIncomeCard from "./card";
import createPagination from "../../components/Pagination";
import MetaData from "../../interfaces/MetaData";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import SearchParams from "../../interfaces/SearchParams";

/* ------------------------ Getting elements from DOM ----------------------- */
// Navbar placeholder
const navBar = document.getElementById("nav-placeholder") as HTMLElement;
// Search bar input field
const searchInput = document.getElementById(
  "filter-source"
) as HTMLInputElement;
// Search button
const searchBtn = document.getElementById("btn-search") as HTMLElement;
// Add income button
const incomeAddBtn = document.getElementById("btn-add-income") as HTMLElement;
// Save income button
const btnSaveIncome = document.getElementById("btn-save-income") as HTMLElement;
// Close dialog button
const btnCloseDialog = document.getElementById(
  "btn-close-income-dialog"
) as HTMLElement;
// Add/Update Income dialog box
const addDialogBox = document.getElementById(
  "add-income-dialog"
) as HTMLElement;
// Source input field
const sourceInput = document.getElementById("add-source") as HTMLInputElement;
// Amount input field
const amountInput = document.getElementById("add-amount") as HTMLInputElement;
// Date input field
const dateInput = document.getElementById("add-date") as HTMLInputElement;
// Income cards container
const incomeContainer = document.getElementById(
  "income-container"
) as HTMLElement;
// Toast container
const toastContainer = document.getElementById("toast-message") as HTMLElement;
// Pagination container
const paginationContainer = document.getElementById(
  "pagination-placeholder"
) as HTMLElement;
/* ------------------------ Filters/Search Parameters ----------------------- */
// Filter amount slider
const filterAmountSlider = document.getElementById(
  "filter-amount"
) as HTMLInputElement;
// Displays the selected amount
const filterAmount = document.getElementById(
  "filter-amount-display"
) as HTMLElement;
// Clears filters/removes search parameters
const btnClearFilter = document.getElementById(
  "btn-clear-filter"
) as HTMLInputElement;

/* ------------------------- Initializing variables ------------------------- */
let incomeModal: bootstrap.Modal;

let dialogIncomeId: string = "";

let pagination: {
  currentPage: number;
  totalPages: number;
};
const filters: SearchParams = {};

/* ---------------------------- Handle page load ---------------------------- */
window.onload = () => {
  renderNavBar(navBar, "nav-income");

  incomeModal = new bootstrap.Modal(addDialogBox);

  filters.page = pagination ? pagination.currentPage : 1;

  renderIncomeCards(filters);
  // Initialize date picker
  flatpickr("#filter-date", {
    mode: "range",
    dateFormat: "YYYY-MM-DD",
    onClose: function (selectedDates, _dateStr, instance) {
      if (selectedDates.length === 2) {
        const startDate = moment(selectedDates[0]).format("YYYY-MM-DD");
        const endDate = moment(selectedDates[1]).format("YYYY-MM-DD");
        instance.input.value = `${startDate} to ${endDate}`;
        // Set start and end dates in filters
        filters.startDate = startDate;
        filters.endDate = endDate;
        // Render income cards
        renderIncomeCards(filters);
      }
    },
  });
};

// Handle pagination click
const handlePageClicked = (buttonClicked: string | number) => {
  // Detects clicks from the pagination component and updates the current page
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

  filters.page = pagination.currentPage;

  renderIncomeCards(filters);
};

// Handle amount slider change event
filterAmountSlider.addEventListener("change", () => {
  // Display selected amount
  filterAmount.innerHTML = `Rs.${filterAmountSlider.value}`;

  filters.amount = parseInt(filterAmountSlider.value);

  renderIncomeCards(filters);
});

// Handle search click
searchBtn.addEventListener("click", () => {
  const searchData = searchInput.value;

  filters.source = searchData;

  renderIncomeCards(filters);
});

// Handle clear filter button by clearing all filters
btnClearFilter.addEventListener("click", () => {
  const dateField = document.getElementById("filter-date") as HTMLInputElement;
  dateField.value = "";
  searchInput.value = "";
  filters.source = "";
  filters.amount = 0;
  filters.startDate = "";
  filters.endDate = "";
  renderIncomeCards(filters);
});

incomeAddBtn.addEventListener("click", () => {
  showDialog();
});

btnCloseDialog.addEventListener("click", () => {
  closeDialog();
});

btnSaveIncome.addEventListener("click", () => {
  saveIncome();
});

// Save income
const saveIncome = () => {
  const source = sourceInput.value;
  const amount = amountInput.value;
  const date = dateInput.value || new Date();

  const income: Income = {
    source,
    amount: parseFloat(amount),
    date,
  };

  if (dialogIncomeId === "") {
    validateInput(income) && createIncome(income);
  }
  // If dialogIncomeId has value then update income
  else if (dialogIncomeId != "") {
    {
      income.id = dialogIncomeId;
      validateInput(income) && updateIncome(income);
    }
  }
};

const closeDialog = () => {
  incomeModal.hide();
  dialogIncomeId = "";
  sourceInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
};

// Show dialog box when edit or add button is clicked
const showDialog = (data?: {
  source: string;
  amount: number;
  date: string;
}) => {
  incomeModal.show();
  sourceInput.value = data?.source || "";
  amountInput.value = data?.amount.toString() || "";
  dateInput.value = data?.date.toString() || "";
};

// Create income card with edit and delete functions
const createIncomeCard = (data: Income) => {
  const editIncomeFunc = () => {
    dialogIncomeId = data.id!;
    return showDialog({
      source: data.source,
      amount: data.amount!,
      date: data.date as string,
    });
  };
  const deleteIncomeFunc = () => {
    deleteIncome(data.id!);
  };
  const expenseCard = generateIncomeCard(
    data,
    editIncomeFunc,
    deleteIncomeFunc
  );
  return expenseCard;
};

/* -------------------------------------------------------------------------- */
/*                                  API Calls                                 */
/* -------------------------------------------------------------------------- */
// Render income cards with filters by calling API
const renderIncomeCards = async (filter: SearchParams) => {
  let baseUrl = "/incomes/filter?";
  // Add filters to base url if any
  if (filter.startDate && filter.endDate) {
    baseUrl += `startDate=${filter.startDate}&endDate=${filter.endDate}`;
  }
  if (filter.source) {
    baseUrl += `&source=${filter.source}`;
  }
  if (filter.amount) {
    baseUrl += `&amount=${filter.amount}`;
  }

  const response = await createGetRequest(baseUrl);
  const userIncomes = response?.data;
  const metaData: MetaData = response?.meta;
  pagination = {
    totalPages: metaData.totalPages,
    currentPage: pagination ? pagination.currentPage : 1,
  };
  // If no data found then display message
  if (userIncomes.length == 0) {
    incomeContainer.innerHTML =
      "<h1 class='text-center h-75 p-5 '>Sorry No Data Found!</h1>";
    return;
  }
  
  incomeContainer.innerHTML = "";
  userIncomes.forEach((income: Income) => {
    incomeContainer.appendChild(createIncomeCard(income));
  });
  
  const paginationBar = createPagination(
    pagination.totalPages,
    pagination.currentPage,
    handlePageClicked
  );
  // Append pagination bar to pagination container
  paginationContainer.innerHTML = "";
  paginationContainer.appendChild(paginationBar);
};

// Create income and render income cards
const createIncome = async (income: Income) => {
  try {
    const response = await createPostRequest("/incomes/", income);
    if (response.status == HttpStatusCode.Accepted) {
      renderIncomeCards(filters);
      showToast(response.data.message, toastContainer, "success");
      closeDialog();
    }
  } catch (error) {
    showErrorToast(error);
  }
};

// Delete income and show toast messages
const deleteIncome = async (id: string) => {
  try {
    const response = await createDeleteRequest(`/incomes/${id}`);
    if (response.status == HttpStatusCode.Accepted) {
      renderIncomeCards(filters);
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
  }
};

// Update income and show toast messages
const updateIncome = async (income: Income) => {
  try {
    const response = await createPutRequest("/incomes/", income);
    if (response.status == HttpStatusCode.Accepted) {
      renderIncomeCards(filters);
      dialogIncomeId = "";
      showToast(response.data.message, toastContainer, "success");
      closeDialog();
    }
  } catch (error) {
    showErrorToast(error);
  }
};
// Show error toast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showErrorToast = (error: any) => {
  const message = showErrorResponse(error) || error;
  showToast(message.response.data.message, toastContainer, "error");
};

// Validate input
const validateInput = (income: Income) => {
  if (income.source === "") {
    showToast("Source cannot be empty", toastContainer, "error");
    return false;
  }
  if (isNaN(income.amount!)) {
    showToast("Amount must be a number", toastContainer, "error");
    return false;
  }
  if (income.amount === 0) {
    showToast("Amount cannot be empty", toastContainer, "error");
    return false;
  }
  return true;
};
