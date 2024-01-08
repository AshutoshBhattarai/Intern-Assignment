/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
import { Chart } from "chart.js/auto";
import http from "../../service/HttpClient";
const navBar = document.getElementById("navbar-placeholder") as HTMLElement;
const expenseChart = document.getElementById(
  "expense-chart"
) as HTMLCanvasElement;
const expenseContext = expenseChart.getContext(
  "2d"
) as CanvasRenderingContext2D;
window.onload = async () => {
  renderNavBar(navBar, "nav-dashboard");
  const expenseResponse = await http.get("/expenses", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  const userResponse = await http.get("/users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  console.log(userResponse);

  const expenses = expenseResponse.data.data;
  const expenseLabels = expenses.map((expense: any) => expense.date);
  const expenseAmount = expenses.map((expense: any) => expense.amount);
  const myChart = new Chart(expenseContext, {
    type: "bar",
    data: {
      labels: expenseLabels,
      datasets: [
        {
          label: "Amount Spent",
          data: expenseAmount,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
