import Chart from "chart.js/auto";
import "chartjs-adapter-moment";
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
import UserSummary from "../../interfaces/UserSummary";
import createGetRequest from "../../service/GetRequest";
/* -------------------------------------------------------------------------- */
/*                          Getting elements from DOM                         */
/* -------------------------------------------------------------------------- */
const navBar = document.getElementById("navbar-placeholder") as HTMLElement;
const displayName = document.getElementById("display-username") as HTMLElement;
const displayIncome = document.getElementById("summary-income") as HTMLElement;
const displayExpense = document.getElementById(
  "summary-expense"
) as HTMLElement;
const displayBudget = document.getElementById("summary-budget") as HTMLElement;
const expenseChart = document.getElementById(
  "expense-chart"
) as HTMLCanvasElement;
const expenseContext = expenseChart.getContext(
  "2d"
) as CanvasRenderingContext2D;
const categoryChart = document.getElementById(
  "category-chart"
) as HTMLCanvasElement;
const categoryContext = categoryChart.getContext(
  "2d"
) as CanvasRenderingContext2D;

window.onload = async () => {
  renderNavBar(navBar, "nav-dashboard");
  const userSummaryResponse = await createGetRequest("/users/summary");
  const userSummary: UserSummary = userSummaryResponse?.data;
  if (userSummary) {
    renderSummary(userSummary);
    createExpenseChart(expenseContext, userSummary.totalExpenseByDate!);
    createPieChart(categoryContext, userSummary.totalExpenseByCategory!);
  }
};

const renderSummary = (userSummary: UserSummary) => {
  displayName.innerHTML = userSummary.username ? userSummary.username : "User";
  displayIncome.innerHTML = `Rs.${userSummary.totalIncome?.toLocaleString()}`;
  displayIncome.style.cursor = "pointer";
  displayIncome.addEventListener("click", () => {
    window.location.href = "/views/income/";
  });
  displayExpense.innerHTML = `Rs.${userSummary.totalExpense?.toLocaleString()}`;
  displayExpense.style.cursor = "pointer";
  displayExpense.addEventListener("click", () => {
    window.location.href = "/views/expenses/";
  });
  displayBudget.innerHTML = `Rs.${(
    userSummary.totalIncome! - userSummary.totalExpense!
  ).toLocaleString()}`;
};
/* -------------------------------------------------------------------------- */
/*                               Chart Section                                */
/* -------------------------------------------------------------------------- */
const createExpenseChart = (
  ctx: CanvasRenderingContext2D,
  data: UserSummary["totalExpenseByDate"]
) => {
  const dates = data!.map((item) => item.date);
  const amounts = data!.map((item) => item.total);
  // const counts = data!.map((item) => item.count);
  new Chart(ctx, {
    type: "bubble",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Total Expenses",
          data: amounts,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          yAxisID: "y-axis-1",
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
          title: {
            display: true,
            text: "Date",
          },
        },
      },
    },
  });
};
const createPieChart = (
  ctx: CanvasRenderingContext2D,
  data: UserSummary["totalExpenseByCategory"]
) => {
  const amounts = data?.map((item) => item.total);
  const labels = data?.map((item) => item.category);
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: amounts,
          borderWidth: 1,
        },
      ],
    },
    options: {},
  });
};
