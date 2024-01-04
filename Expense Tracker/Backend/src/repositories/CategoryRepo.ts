import { Repository } from "typeorm";
import Category from "../models/Category";
import database from "../database/config";
import User from "../models/User";

const repo: Repository<Category> = database.getRepository("categories");
export const createCategory = (category: Category) => {
  const result = repo.save(category);
  return result;
};

export const getAllCategories = async (user: User) => {
  return await repo.find({
    where: { user },
    relations: { user: true },
  });
};

export const getCategory = async (id: string) => {
  const category = await repo.findOneBy({ id });
  return category;
};

export const updateCategory = async (id: string, category: Category) => {
  return await repo.update({ id }, category);
};

export const deleteCategory = async (id: string) => {
  await repo.delete({ id });
};
