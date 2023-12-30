import * as userRepo from "../Repositories/UserRepo";
import { UserModel } from "../model/UserModel";

export const getAllUsers = () => {
  return userRepo.getAllUsers();
};

export const getUserById = (id: number): UserModel | null => {
  const user = userRepo.getUserById(id);
  if (user) return user;
  else return null;
};

export const getUserByEmail = (email: string): UserModel | null => {
  const user = userRepo.getUserByEmail(email);
  if (user) return user;
  else return null;
};
