import NotFoundError from "../errors/NotFound";
import User from "../models/User";
import * as userRepo from "../repositories/UserRepo";

export const getAllUsers = async (): Promise<User[]> => {
  const users = await userRepo.getAllUsers();
  return users.map((user) => filterUser(user));
};

export const getUserById = async (id: string): Promise<User> => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new NotFoundError(`User with id : ${id} not found`);
  return filterUser(user);
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const user = await userRepo.getUserByEmail(email);
  if (!user) throw new NotFoundError(`User with email : ${email} not found`);
  return filterUser(user);
};

export const deleteUser = async (id: string) => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new NotFoundError("User not found");
  await userRepo.deleteUser(user);
};

export const updateUser = async (id: string) => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new NotFoundError("User not found");
};

const filterUser = (user: User) => {
  const userInfo = new User();
  userInfo.id = user.id;
  userInfo.email = user.email;
  userInfo.username = user.username;
  userInfo.createdAt = user.createdAt;
  userInfo.updatedAt = user.updatedAt;
  return userInfo;
};
