import argon2 from "argon2";
import { User } from "../models/User";
import * as userRepo from "../repositories/UserRepo";

export const getAllUsers = async () => {
  return await userRepo.getAllUsers();
};

export const addUser = async (user: User) => {
  try {
    if (await userRepo.findUserByEmail(user.email))
      throw new Error(`User with email ${user.email} already exists`);
    const hashedPassword = await argon2.hash(user.password);
    const newUser = new User(user.name, user.email, hashedPassword);
    await userRepo.addUser(newUser);
  } catch (err) {
    throw err;
  }
};
