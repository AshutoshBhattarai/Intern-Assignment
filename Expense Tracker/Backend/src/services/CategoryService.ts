/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */
import ForbiddenError from "../errors/Forbidden";
import NotFoundError from "../errors/NotFound";
import Category from "../models/Category";
import User from "../models/User";
import * as categoryRepo from "../repositories/CategoryRepo";
import * as userRepo from "../repositories/UserRepo";
/* ----------------------------------- -- ----------------------------------- */

/* -------------------- Function that creates a category -------------------- */
export const createCategory = async (category: Category) => {
  //Creates a new category
  const user = await userRepo.getUserById(category.user.id);
  if (!user) throw new NotFoundError("User not found");
  // Check if category with same title already exists
  const exists = await categoryRepo.getCategoryTitle(user, category.title);
  if (exists) throw new ForbiddenError("Category already exists");
  return categoryRepo.createCategory(category);
};

// ------------------------ Function that gets all categories ------------------------//
export const getAllCategories = async (user: User) => {
  // Gets all categories
  const categories = await categoryRepo.getAllCategories(user);
  return categories.filter((category) => categoryResponse(category));
};

// ------------------------ Function that gets a category ------------------------//
export const getCategory = async (id: string) => {
  // Gets a specific category with the given id
  const category = await categoryRepo.getCategory(id);
  if (!category) throw new NotFoundError("Category not found");
  return categoryResponse(category);
};
// ------------------------ Function that updates a category ------------------------//
export const updateCategory = async (user: User, category: Category) => {
  // Updates the category if it exists
  const exists = await categoryRepo.getCategory(category.id);
  if (!exists) throw new NotFoundError("Category does not exist");
  if (user.id != (exists.user as any))
    throw new ForbiddenError("You are not authorized to update this category");
  return categoryRepo.updateCategory(category.id, category);
};
// ------------------------ Function that deletes a category ------------------------//
export const deleteCategory = async (user: User, categoryId: string) => {
  // Check if category exists
  const exists = await categoryRepo.getCategory(categoryId);
  if (!exists) throw new NotFoundError("Category does not exist");
  // Get the user's categories count
  const categoriesCount = await categoryRepo.getUserCategoryCount(user.id);
  // Don't allow to delete if there is only one category
  if (categoriesCount == 1) {
    throw new ForbiddenError("Sorry! There should be at least one category");
  }
  // Check if user in category's details and current user are same
  if (user.id != (exists.user as any)) {
    throw new ForbiddenError("You are not authorized to delete this category");
  }
  return categoryRepo.deleteCategory(categoryId);
};

// Filter category response to send only the necessary fields
const categoryResponse = (category: Category) => {
  const responseCategory = new Category();
  responseCategory.id = category.id;
  responseCategory.title = category.title;
  responseCategory.description = category.description;
  return responseCategory;
};
