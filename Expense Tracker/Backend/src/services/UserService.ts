import * as userRepo from "../repositories/UserRepo";

export const getAllUsers = async () => {
  return await userRepo.getAllUsers();
};


