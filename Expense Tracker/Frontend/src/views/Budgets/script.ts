/* --------------------------------- Imports -------------------------------- */
import renderNavBar from "../../components/Navbar/navbar";
import "../../assets/scss/style.scss";
import { HttpStatusCode } from "axios";
import http from "../../service/HttpClient";
import * as bootstrap from "bootstrap";
import Budget from "../../interfaces/Budget";
import createCategoryOptions from "../../utils/CategoryOptions";

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

/* ------------------------- Initializing Variables ------------------------- */
let budgetModal: bootstrap.Modal;

/* -------------------------------------------------------------------------- */
/*                       Initial tasks when page loads                        */
/* -------------------------------------------------------------------------- */
window.onload = async () => {
  renderNavBar(navBar, "nav-budget");
  const userBudgets = await getUserBudgets();
  createCategoryOptions(addBudgetCategory);
  budgetModal = new bootstrap.Modal(budgetDialogBox);
  renderUserBudgets(userBudgets);
};

/* -------------------------------------------------------------------------- */
/*                           Button Event Listeners                           */
/* -------------------------------------------------------------------------- */
btnSaveBudget.addEventListener("click", async () => {
  const title = document.getElementById("add-budget-title") as HTMLInputElement;
  const amount = document.getElementById(
    "add-budget-amount"
  ) as HTMLInputElement;
  const time = document.getElementById("add-budget-time") as HTMLInputElement;
  await saveBudget(
    title.value,
    amount.value,
    addBudgetCategory.value,
    time.value
  );
});
addBudgetBtn.addEventListener("click", () => {
  budgetModal.show();
});

btnCloseBudgetDialog.addEventListener("click", () => {
  budgetModal.hide();
});

const renderUserBudgets = (budgets: Budget[]) => {
  budgetContainer.innerHTML = "";
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
  const startDate = new Date(budget.startTime).toUTCString().substring(5, 16);
  const endDate = new Date(budget.endTime).toUTCString().substring(5, 16);
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
  card.appendChild(cardBody);
  return card;
};

/* -------------------------------------------------------------------------- */
/*                                  API Calls                                 */
/* -------------------------------------------------------------------------- */
const saveBudget = async (
  title: string,
  amount: string,
  category: string,
  time: string
) => {
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
  try {
    const response = await http.post(
      "/budgets/",
      {
        title,
        category,
        amount,
        startTime,
        endTime,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      }
    );

    if (response.status === HttpStatusCode.Accepted) {
      budgetModal.hide();
      renderUserBudgets(await getUserBudgets());
    }
  } catch (error) {
    //Todo show Toast
  }
};

const getUserBudgets = async () => {
  try {
    const budgets = await http.get("/budgets/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    if (budgets.status == HttpStatusCode.Ok) {
      const data = budgets.data.result;
      return data;
    }
  } catch (error) {
    //Todo Remove
    console.log(error);
  }
};
