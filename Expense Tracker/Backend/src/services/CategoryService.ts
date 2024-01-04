import ForbiddenError from "../errors/Forbidden";
import NotFoundError from "../errors/NotFound";
import Category from "../models/Category";
import * as categoryRepo from "../repositories/CategoryRepo";
export const createCategory = async (category: Category) => {
  return categoryRepo.createCategory(category);
};

export const getAllCategories = async () => {
  return await categoryRepo.getAllCategories();
};

export const getCategory = async (id: string) => {
  return await categoryRepo.getCategory(id);
};

export const updateCategory = async (userid: string, category: Category) => {
  const exists = await categoryRepo.getCategory(category.id);
  if (!exists) throw new NotFoundError("Category does not exist");
  if (userid != exists.user)
    throw new ForbiddenError("You are not authorized to update this category");
  return categoryRepo.updateCategory(category.id, category);
};

export const deleteCategory = async (userid: string, categoryId: string) => {
  const exists = await categoryRepo.getCategory(categoryId);
  if (!exists) throw new NotFoundError("Category does not exist");
  if (userid != exists.user)
    throw new ForbiddenError("You are not authorized to delete this category");
  return categoryRepo.deleteCategory(categoryId);
};
