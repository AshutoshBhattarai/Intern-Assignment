import Category from "../interfaces/Category";
import createGetRequest from "../service/GetRequest";

const createCategoryOptions = async (select: HTMLElement) => {
  const userCategories = await createGetRequest("/categories/");
  if(!userCategories) throw new Error("User categories not found");
  const data = userCategories.data as Category[];
  select.innerHTML = "";
  data.forEach((category: Category) => {
    const option = document.createElement("option");
    option.value = category.id!;
    option.text = category.title;
    select.appendChild(option);
  });
};
export default createCategoryOptions;
