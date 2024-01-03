import * as userRepo from "../Repositories/UserRepo";

export const getAllUsers = () => {
  return userRepo.getAllUsers();
};

export const getUserById = (id: number) => {
  const user = userRepo.getUserById(id);
  if (user) return user;
  else return null;
};

export const getUserByEmail = (email: string) => {
  const user = userRepo.getUserByEmail(email);
  if (user) return user;
  else return null;
};
