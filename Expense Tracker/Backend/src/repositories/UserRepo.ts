import { Repository } from "typeorm";
import database from "../database/config";
import { User } from "../models/User";
const userRepo: Repository<User> = database.getRepository("users");

export const getAllUsers = async () => {
  try {
    return await userRepo.find();
  } catch (error) {
    throw error;
  }
};

export const addUser = async (user: User) => {
  try {
    return await userRepo.save(user);
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return await userRepo.findOneBy({ email });
  } catch (error) {
    throw new Error(`User with email ${email} not found`);
  }
};

export const getUserById = async (id: string) => {
  try {
    return await userRepo.findOneBy({ id });
  } catch (error) {
    throw new Error(`User not found`);
  }
};

export const addRefreshToken = async (user: User) => {
  try {
    return await userRepo.update(user.id, user);
  } catch (error) {
    throw error;
  }
};
