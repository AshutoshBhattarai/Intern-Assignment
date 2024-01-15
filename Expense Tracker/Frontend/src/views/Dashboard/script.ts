import Chart from "chart.js/auto";
import "chartjs-adapter-moment";
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
import UserSummary from "../../interfaces/UserSummary";
import createGetRequest from "../../service/GetRequest";
/* -------------------------------------------------------------------------- */
/*                          Getting elements from DOM                         */
/* -------------------------------------------------------------------------- */
// Navbar placeholder
const navBar = document.getElementById("navbar-placeholder") as HTMLElement;
// Username Display
const displayName = document.getElementById("display-username") as HTMLElement;
// User's income display
const displayIncome = document.getElementById("summary-income") as HTMLElement;
// User's expense display
const displayExpense = document.getElementById(
  "summary-expense"
) as HTMLElement;
// User's savings display
const displaySavings = document.getElementById("summary-savings") as HTMLElement;
// User's expense chart container
const expenseChart = document.getElementById(
  "expense-chart"
) as HTMLCanvasElement;
// User's expense chart container context 
const expenseContext = expenseChart.getContext(
  "2d"
) as CanvasRenderingContext2D;
// User's category chart container
const categoryChart = document.getElementById(
  "category-chart"
) as HTMLCanvasElement;
// User's category chart container context
const categoryContext = categoryChart.getContext(
  "2d"
) as CanvasRenderingContext2D;

window.onload = async () => {
  // Render navbar
  renderNavBar(navBar, "nav-dashboard");
  // Get user summary
  const userSummaryResponse = await createGetRequest("/users/summary");
  // Get user summary from response
  const userSummary: UserSummary = userSummaryResponse?.data;
  if (userSummary) {
    // Render summary in dashboard
    renderSummary(userSummary);
    createExpenseChart(expenseContext, userSummary.totalExpenseByDate!);
    createPieChart(categoryContext, userSummary.totalExpenseByCategory!);
  }
};

// Render summary
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
  displaySavings.innerHTML = `Rs.${(
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
          backgroundColor: "#4bc0c0",
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
