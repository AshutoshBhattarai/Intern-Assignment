import { HttpStatusCode } from "axios";
import * as bootstrap from "bootstrap";
import "../../assets/scss/style.scss";
import renderNavBar from "../../components/Navbar/navbar";
import Category from "../../interfaces/Category";
import createDeleteRequest from "../../service/DeleteRequest";
import createGetRequest from "../../service/GetRequest";
import createPostRequest from "../../service/PostRequest";
import createPutRequest from "../../service/PutRequest";
import { showToast } from "../../components/Toast";
import showErrorResponse from "../../service/ErrorResponse";
// --------------------- Getting elements from DOM -----------------------
const navBar = document.getElementById("nav-placeholder") as HTMLElement;

const categoryContainer = document.getElementById(
  "category-container"
) as HTMLElement;

const addCategoryDialog = document.getElementById(
  "add-category-dialog"
) as HTMLElement;
const addCategoryBtn = document.getElementById(
  "btn-add-category"
) as HTMLElement;

const btnCloseCategoryDialog = document.getElementById(
  "btn-close-category-dialog"
) as HTMLElement;

const btnSaveCategory = document.getElementById(
  "btn-save-category"
) as HTMLElement;
const categoryTitleInput = document.getElementById(
  "add-category-title"
) as HTMLInputElement;
const categoryDescriptionInput = document.getElementById(
  "add-category-description"
) as HTMLInputElement;
const toastContainer = document.getElementById("toast-message") as HTMLElement;
// --------------------- Initializing Modals -----------------------

let categoryModal: bootstrap.Modal;
let categoryId: string = "";
window.onload = async () => {
  renderNavBar(navBar, "nav-profile");
  categoryModal = new bootstrap.Modal(addCategoryDialog);

  const userCategories = await getUserCategories();
  renderUserCategories(userCategories);
};

addCategoryBtn.addEventListener("click", () => {
  categoryModal.show();
});
btnCloseCategoryDialog.addEventListener("click", () => {
  closeDialog();
});
btnSaveCategory.addEventListener("click", async () => {
  const title = categoryTitleInput.value;
  const description = categoryDescriptionInput.value;
  const category: Category = {
    title: title,
    description: description,
  };
  if (categoryId === "") {
    await saveCategory(category);
  }
  if (categoryId !== "") {
    category.id = categoryId;
    await updateCategory(category);
    categoryId = "";
  }
  renderUserCategories(await getUserCategories());
  closeDialog();
});

const closeDialog = () => {
  categoryTitleInput.value = "";
  categoryDescriptionInput.value = "";
  categoryModal.hide();
  categoryId = "";
};

const renderUserCategories = (categories: Category[]) => {
  categoryContainer.innerHTML = "";
  if (categories.length === 0) {
    categoryContainer.innerHTML =
      "<h5 class='text-center text-primary'>No Categories found</h5>";
    return;
  }
  categories.forEach((category: Category) => {
    categoryContainer.appendChild(createCategoryCard(category));
  });
};

const createCategoryCard = (category: Category) => {
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
    categoryId = category.id!;
    categoryModal.show();
    categoryTitleInput.value = category.title;
    categoryDescriptionInput.value = category.description;
  });
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
  deleteButton.classList.add("btn", "btn-danger", "mx-2");
  deleteButton.addEventListener("click", () => {
    deleteCategory(category.id!);
  });
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
  row.appendChild(title);
  row.appendChild(description);
  row.appendChild(actions);
  return row;
};

/* -------------------------------------------------------------------------- */
/*                                  API Calls                                 */
/* -------------------------------------------------------------------------- */

/* ------------------------- Getting user categories ------------------------ */
const getUserCategories = async () => {
  try {
    const categories = await createGetRequest("/categories/");
    return categories!.data;
  } catch (error) {
    showErrorResponse(error);
  }
};

/* --------------------------- Adding new category -------------------------- */
const saveCategory = async (category: Category) => {
  try {
    const response = await createPostRequest("/categories/", category);
    if (response.status == HttpStatusCode.Accepted) {
      renderUserCategories(await getUserCategories());
      showToast(response.data.message, toastContainer, "success");
      closeDialog();
    }
  } catch (error) {
    showErrorToast(error);
    closeDialog();
  }
};

/* --------------------------- Deleting a category -------------------------- */
const deleteCategory = async (id: string) => {
  try {
    const response = await createDeleteRequest(`/categories/${id}`);
    if (response.status === HttpStatusCode.Ok) {
      renderUserCategories(await getUserCategories());
      showToast(response.data.message, toastContainer, "success");
    }
  } catch (error) {
    showErrorToast(error);
  }
};

const updateCategory = async (category: Category) => {
  try {
    const response = await createPutRequest("/categories/", category);
    if (response.status == HttpStatusCode.Accepted) {
      renderUserCategories(await getUserCategories());
      showToast(response.data.message, toastContainer, "success");
      closeDialog();
    }
  } catch (error) {
    closeDialog();
    showErrorToast(error);
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showErrorToast = (error: any) => {
  const message = showErrorResponse(error) || error;
  showToast(message, toastContainer, "error");
};
