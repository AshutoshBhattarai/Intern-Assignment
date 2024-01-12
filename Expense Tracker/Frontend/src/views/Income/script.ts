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

const navBar = document.getElementById("nav-placeholder") as HTMLElement;
const searchInput = document.getElementById("search-bar") as HTMLInputElement;
const searchBtn = document.getElementById("btn-search") as HTMLElement;
const incomeAddBtn = document.getElementById("btn-add-income") as HTMLElement;
const btnSaveIncome = document.getElementById("btn-save-income") as HTMLElement;
const btnCloseDialog = document.getElementById(
  "btn-close-income-dialog"
) as HTMLElement;
const addDialogBox = document.getElementById(
  "add-income-dialog"
) as HTMLElement;
const sourceInput = document.getElementById("add-source") as HTMLInputElement;
const amountInput = document.getElementById("add-amount") as HTMLInputElement;
const dateInput = document.getElementById("add-date") as HTMLInputElement;

const incomeContainer = document.getElementById(
  "income-container"
) as HTMLElement;
const toastContainer = document.getElementById("toast-message") as HTMLElement;
let incomeModal: bootstrap.Modal;
let dialogIncomeId: string = "";
window.onload = () => {
  renderNavBar(navBar, "nav-income");
  incomeModal = new bootstrap.Modal(addDialogBox);
  renderIncomeCards("");
};
searchBtn.addEventListener("click", () => {
  const searchData = searchInput.value;
  console.log(searchData);
});

incomeAddBtn.addEventListener("click", () => {
  showDialog();
});

btnCloseDialog.addEventListener("click", () => {
  closeDialog();
});

btnSaveIncome.addEventListener("click", () => {
  saveIncome();
  closeDialog();
});

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
    createIncome(income);
  } else if (dialogIncomeId != "") {
    income.id = dialogIncomeId;
    updateIncome(income);
  }
};
const closeDialog = () => {
  incomeModal.hide();
  dialogIncomeId = "";
  sourceInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
};
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderIncomeCards = async (filter: any) => {
  console.log(filter);
  const userIncomes = await createGetRequest("/incomes/");
  if (userIncomes.length == 0) {
    incomeContainer.innerHTML =
      // eslint-disable-next-line quotes
      '<h1 class="text-center h-75 p-5 ">Sorry No Data Found!</h1>';
    return;
  }
  incomeContainer.innerHTML = "";
  userIncomes.forEach((income: Income) => {
    incomeContainer.appendChild(createIncomeCard(income));
  });
};

const createIncome = async (income: Income) => {
  try {
    const response = await createPostRequest("/incomes/", income);
    if (response.status == HttpStatusCode.Accepted) {
      renderIncomeCards("");
      showToast(response.data.message, toastContainer, "success");
      closeDialog();
    }
  } catch (error) {
    showErrorToast(error);
    closeDialog();
  }
};

const deleteIncome = async (id: string) => {
  try {
    const response = await createDeleteRequest(`/incomes/${id}`);
    if (response.status == HttpStatusCode.Accepted) {
      renderIncomeCards("");
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
  }
};

const updateIncome = async (income: Income) => {
  try {
    const response = await createPutRequest("/incomes/", income);
    if (response.status == HttpStatusCode.Accepted) {
      renderIncomeCards("");
      dialogIncomeId = "";
      showToast(response.data.message, toastContainer, "success");
      closeDialog();
    }
  } catch (error) {
    showErrorToast(error);
    closeDialog();
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showErrorToast = (error: any) => {
  const message = showErrorResponse(error) || error;
  showToast(message, toastContainer, "error");
};
