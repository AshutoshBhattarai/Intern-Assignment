import { User } from "../models/User";
import * as userRepo from "../repositories/UserRepo";

export const getAllUsers = async (): Promise<User[]> => {
  return await userRepo.getAllUsers();
};

export const getUserById = async (id: string): Promise<User | null> => {
  return await userRepo.getUserById(id);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await userRepo.getUserByEmail(email);
};

export const deleteUser = async (id: string) => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new Error("User not found");
  await userRepo.deleteUser(user);
};

export const updateUser = async (id: string) => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new Error("User not found");
};

