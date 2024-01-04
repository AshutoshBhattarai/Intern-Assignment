import { Repository } from "typeorm";
import Category from "../models/Category";
import database from "../database/config";

const repo: Repository<Category> = database.getRepository("categories");
export const createCategory = (category: Category) => {
  const result = repo.save(category);
  return result;
};

export const getAllCategories = async () => {
  return await repo.find({
    relations: { user: true },
  });
};

export const getCategory = async (id: string) => {
  const category = await repo.findOne({
    where: { id },
    relations: { user: true },
  });
  return category;
};

export const updateCategory = async (id: string, category: Category) => {
  return await repo.update({ id }, category);
};

export const deleteCategory = async (id: string) => {
  await repo.delete({ id });
};
