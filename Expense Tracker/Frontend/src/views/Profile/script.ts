import renderNavBar from "../../components/Navbar/navbar";
import "../../assets/scss/style.scss";
import http from "../../service/HttpClient";
import { HttpStatusCode } from "axios";
import * as bootstrap from "bootstrap";
import Budget from "../../interfaces/budget";
import Category from "../../interfaces/Category";
const navBar = document.getElementById("nav-placeholder") as HTMLElement;
const budgetCarousel = document.getElementById(
  "budget-carousel"
) as HTMLElement;
const categoryContainer = document.getElementById(
  "category-container"
) as HTMLElement;
window.onload = async () => {
  renderNavBar(navBar, "nav-profile");
  const userBudgets = await getUserBudgets();
  const userCategories = await getUserCategories();
  userBudgets.forEach((budget: Budget, index: number) => {
    budgetCarousel.appendChild(createBudgetCard(budget, index));
  });

  new bootstrap.Carousel(budgetCarousel, {
    interval: 2000,
    touch: false,
  });

  userCategories.forEach((category: Category) => {
    categoryContainer.appendChild(createCategoryCard(category));
  });
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
    console.log(error);
  }
};

const getUserCategories = async () => {
  try {
    const categories = await http.get("/categories/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    if (categories.status == HttpStatusCode.Ok) {
      const data = categories.data.result;
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const createBudgetCard = (budget: Budget, index: number) => {
  const activeClass = index === 0 ? "active" : "notactive";
  const card = document.createElement("div");
  card.classList.add("carousel-item", activeClass);
  const remainingAmountPercentage =
    (budget.remainingAmount / budget.amount) * 100;
  const progressColor = remainingAmountPercentage > 20 ? "success" : "danger";
  const cardContent = `
    <div class="container col-md-6 card bg-primary text-white px-5 ">
      <div class="card-body row">
        <h5 class="card-title col">${budget.title}</h5>
        <p class="card-text col">${budget.amount}</p>
        <!-- Add more details as needed -->
      </div>
      <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="${budget.remainingAmount}" aria-valuemin="0" aria-valuemax="${budget.amount}">
  <div class="progress-bar bg-${progressColor}" style="width: ${remainingAmountPercentage}%">${budget.remainingAmount}</div>
</div>

    </div>
  `;
  card.innerHTML = cardContent;
  return card;
};

const createCategoryCard = (category: Category) => {
  console.log(category);
  const row = document.createElement("tr");

  const title = document.createElement("td");
  title.textContent = category.title;

  const description = document.createElement("td");
  description.textContent = category.description;

  const actions = document.createElement("td");
  actions.setAttribute("colspan", "2");
  const editButton = document.createElement("button");
  editButton.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
  editButton.classList.add("btn", "btn-primary");
  editButton.addEventListener("click", () => {
    console.log("Edit clicked");
  });
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
  deleteButton.classList.add("btn", "btn-danger","mx-2");
  deleteButton.addEventListener("click", () => {
    console.log("Delete clicked");
  });
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
  row.appendChild(title);
  row.appendChild(description);
  row.appendChild(actions);
  return row;
};
