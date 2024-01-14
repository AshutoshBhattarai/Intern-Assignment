/* eslint-disable @typescript-eslint/no-explicit-any */
/* --------------------------------- Imports -------------------------------- */
import { HttpStatusCode } from "axios";
import * as bootstrap from "bootstrap";
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
import Budget from "../../interfaces/Budget";
import Category from "../../interfaces/Category";
import createGetRequest from "../../service/GetRequest";
import createPostRequest from "../../service/PostRequest";
import createPutRequest from "../../service/PutRequest";
import createCategoryOptions from "../../utils/CategoryOptions";
import createDeleteRequest from "../../service/DeleteRequest";
import { showToast } from "../../components/Toast";
import showErrorResponse from "../../service/ErrorResponse";

/* -------------------------------------------------------------------------- */
/*                          Getting elements from DOM                         */
/* -------------------------------------------------------------------------- */
const navBar = document.getElementById("nav-placeholder") as HTMLElement;
const btnSaveBudget = document.getElementById("btn-save-budget") as HTMLElement;
const addBudgetBtn = document.getElementById("btn-add-budget") as HTMLElement;
const budgetContainer = document.getElementById(
  "budget-container"
) as HTMLElement;
const addBudgetCategory = document.getElementById(
  "add-budget-category"
) as HTMLInputElement;
const btnCloseBudgetDialog = document.getElementById(
  "btn-close-budget-dialog"
) as HTMLElement;
const budgetDialogBox = document.getElementById(
  "add-budget-dialog"
) as HTMLElement;
const budgetTitleInput = document.getElementById(
  "add-budget-title"
) as HTMLInputElement;
const budgetAmountInput = document.getElementById(
  "add-budget-amount"
) as HTMLInputElement;
const budgetTimeInput = document.getElementById(
  "add-budget-time"
) as HTMLInputElement;
const btnDeleteBudget = document.getElementById(
  "btn-delete-budget"
) as HTMLElement;
const toastContainer = document.getElementById("toast-message") as HTMLElement;
/* ------------------------- Initializing Variables ------------------------- */
let budgetModal: bootstrap.Modal;
let dialogBudgetId: string = "";
/* -------------------------------------------------------------------------- */
/*                       Initial tasks when page loads                        */
/* -------------------------------------------------------------------------- */
window.onload = async () => {
  renderNavBar(navBar, "nav-budget");
  const userBudgets = await getUserBudgets("");
  createCategoryOptions(addBudgetCategory);
  budgetModal = new bootstrap.Modal(budgetDialogBox);
  renderUserBudgets(userBudgets);
};

/* -------------------------------------------------------------------------- */
/*                           Button Event Listeners                           */
/* -------------------------------------------------------------------------- */
btnSaveBudget.addEventListener("click", async () => {
  const { startTime, endTime } = getTimeRange(budgetTimeInput.value);
  const budget: Budget = {
    title: budgetTitleInput.value,
    amount: parseFloat(budgetAmountInput.value ? budgetAmountInput.value : "0"),
    category: addBudgetCategory.value,
    startTime: startTime,
    endTime: endTime,
  };
  if (dialogBudgetId === "") {
    validateInput(budget) && (await saveBudget(budget));
  } else if (dialogBudgetId !== "") {
    validateInput(budget) && (await updateBudget(budget));
    dialogBudgetId = "";
  }
});
addBudgetBtn.addEventListener("click", () => {
  showDialog();
});

btnCloseBudgetDialog.addEventListener("click", () => {
  closeDialog();
});

const showDialog = () => {
  budgetModal.show();
};
const closeDialog = () => {
  budgetModal.hide();
  dialogBudgetId = "";
  budgetTitleInput.value = "";
  budgetAmountInput.value = "";
  budgetTimeInput.value = "";
  addBudgetCategory.value = "";
  if (!btnDeleteBudget.classList.contains("d-none")) {
    btnDeleteBudget.classList.add("d-none");
  }
};
const renderUserBudgets = (budgets: Budget[]) => {
  budgetContainer.innerHTML = "";
  if (!budgets.length) {
    budgetContainer.innerHTML =
      "<h5 class='text-center text-primary'>No Budgets found</h5>";
    return;
  }
  budgets.forEach((budget: Budget) => {
    budgetContainer.appendChild(createBudgetCard(budget));
  });
};

/* -------------------------------------------------------------------------- */
/*                             Create budget card                             */
/* -------------------------------------------------------------------------- */
const createBudgetCard = (budget: Budget) => {
  const spentPercent = (budget.spentAmount! / budget.amount) * 100;
  const progressColor = spentPercent < 80 ? "success" : "danger";
  const startDate = new Date(budget.startTime!).toUTCString().substring(5, 16);
  const endDate = new Date(budget.endTime!).toUTCString().substring(5, 16);
  const card = document.createElement("div");
  card.classList.add("card", "mb-2", "mx-3", "col-3");
  const cardTitle = document.createElement("h5");
  cardTitle.classList.add(
    "card-title",
    "text-dark",
    "col-12",
    "pt-3",
    "m-0",
    "fw-bold"
  );
  cardTitle.textContent = budget.title;
  const cardCategory = document.createElement("small");
  cardCategory.classList.add("card-text", "m-0");
  cardCategory.textContent = (budget.category as Category).title;

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "mr-3", "mt-0", "col-12");
  const cardRemaining = document.createElement("p");
  cardRemaining.classList.add("card-text", "m-0", "text-dark");
  cardRemaining.innerHTML = `<span class="text-success">Rs. ${budget.remainingAmount}</span> left`;

  const cardAmount = document.createElement("p");
  cardAmount.classList.add("card-text", "text-dark", "m-0");
  cardAmount.textContent = "From Rs. " + budget.amount;

  const cardProgress = document.createElement("div");
  cardProgress.classList.add("progress", "mt-2", "h-3");
  cardProgress.setAttribute("aria-valueNow", spentPercent.toString());
  cardProgress.setAttribute("aria-valueMax", "100");
  cardProgress.setAttribute("aria-valueMin", "0");

  const progressIndicator = document.createElement("div");
  progressIndicator.classList.add(
    "progress-bar-striped",
    "bg-" + progressColor,
    "round"
  );
  progressIndicator.setAttribute("style", `width: ${spentPercent}%`);
  cardProgress.appendChild(progressIndicator);

  const progressPercentIndicator = document.createElement("small");
  progressPercentIndicator.classList.add("text-muted", "m-0");
  progressPercentIndicator.textContent = spentPercent.toFixed(0) + "% is used";

  const dateContainer = document.createElement("div");
  dateContainer.classList.add("d-flex", "justify-content-between");
  const displayStartDate = document.createElement("small");
  displayStartDate.classList.add("m-0", "text-muted", "text-opacity-50");
  displayStartDate.textContent = startDate;
  const displayEndDate = document.createElement("small");
  displayEndDate.classList.add("m-0", "text-muted");
  displayEndDate.textContent = endDate;

  dateContainer.appendChild(displayStartDate);
  dateContainer.appendChild(displayEndDate);

  cardBody.appendChild(cardRemaining);
  cardBody.appendChild(cardAmount);
  cardBody.appendChild(cardProgress);
  cardBody.appendChild(progressPercentIndicator);
  cardBody.appendChild(dateContainer);
  card.appendChild(cardTitle);
  card.appendChild(cardCategory);
  card.appendChild(cardBody);

  card.addEventListener("click", () => {
    budgetTitleInput.value = budget.title;
    budgetAmountInput.value = budget.amount.toString();
    budgetTimeInput.value =
      getTimeType(budget.startTime!, budget.endTime!) || "";
    dialogBudgetId = budget.id!;
    addBudgetCategory.value = (budget.category as Category).id!;
    if (dialogBudgetId) {
      btnDeleteBudget.classList.remove("d-none");
    }

    btnDeleteBudget.addEventListener("click", () => {
      deleteBudget(dialogBudgetId);
    });
    showDialog();
  });

  card.addEventListener("mouseover", () => {
    card.style.backgroundColor = "#f8f9fa";
    card.style.cursor = "pointer";
  });

  card.addEventListener("mouseout", () => {
    card.style.backgroundColor = "";
  });
  return card;
};

/* -------------------------------------------------------------------------- */
/*                                  API Calls                                 */
/* -------------------------------------------------------------------------- */
const saveBudget = async (budget: Budget) => {
  try {
    const response = await createPostRequest("/budgets/", budget);
    if (response.status === HttpStatusCode.Accepted) {
      closeDialog();
      renderUserBudgets(await getUserBudgets(""));
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
  }
};

const getUserBudgets = async (filter: string) => {
  try {
    const budgets = await createGetRequest(`/budgets/filter?${filter}`);
    return budgets!.data;
  } catch (error) {
    showErrorToast(error);
  }
};
const updateBudget = async (budget: Budget) => {
  try {
    budget.id = dialogBudgetId;
    const response = await createPutRequest("/budgets/", budget);
    if (response.status === HttpStatusCode.Accepted) {
      closeDialog();
      showToast(response.data.message, toastContainer, "success");
      renderUserBudgets(await getUserBudgets(""));
    }
  } catch (error) {
    showErrorToast(error);
  }
};

const deleteBudget = async (id: string) => {
  try {
    const response = await createDeleteRequest(`/budgets/${id}`);
    if (response.status === HttpStatusCode.Accepted) {
      renderUserBudgets(await getUserBudgets(""));
      showToast(response.data.message, toastContainer, "success");
      closeDialog();
    }
  } catch (error) {
    showErrorToast(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
const getTimeRange = (time: string) => {
  let startTime = new Date();
  let endTime = new Date();
  if (time === "weekly") {
    startTime.setDate(startTime.getDate() - 7);
    endTime.setDate(startTime.getDate() + 7);
  } else if (time === "monthly") {
    startTime.setDate(1);
    endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0);
  } else if (time === "yearly") {
    startTime = new Date(startTime.getFullYear(), 0, 1);
    endTime = new Date(startTime.getFullYear(), 11, 31);
  }
  return {
    startTime,
    endTime,
  };
};
const getTimeType = (startTime: Date, endTime: Date): string | null => {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const diffInDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffInDays <= 7) {
    return "weekly";
  }
  if (diffInDays <= 30 && diffInDays > 7) {
    return "monthly";
  } else if (diffInDays <= 365 && diffInDays > 30) {
    return "yearly";
  }
  return null;
};

const showErrorToast = (error: any) => {
  const message = showErrorResponse(error) || error.message;
  showToast(message, toastContainer, "error");
};

const validateInput = (budget: Budget) => {
  if (budget.title === "") {
    showToast("Title cannot be empty", toastContainer, "error");
    return false;
  }
  if (budget.amount === 0) {
    showToast("Amount cannot be zero", toastContainer, "error");
    return false;
  }
  if (budget.startTime?.toString() === "") {
    showToast("Time cannot be empty", toastContainer, "error");
    return false;
  }
  if (budget.category === "") {
    showToast("Category cannot be empty", toastContainer, "error");
    return false;
  }
  return true;
};
