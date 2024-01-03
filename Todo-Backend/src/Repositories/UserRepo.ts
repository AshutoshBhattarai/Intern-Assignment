import { UserModel } from "../model/UserModel";
import BaseRepo from "./BaseRepo";

const query = BaseRepo.queryBuilder();
export const getAllUsers = () => {
  return query.select(selectFormat).from("users");
};

export const getUserById = (id: number) => {
  return query.select(selectFormat).from("users").where({ id }).first();
};
export const getUserByEmail = (email: string) => {
  return query.select(selectFormat).from("users").where({ email }).first();
};
export const addUser = async (user: UserModel) => {
  const existingUser = await query
    .select(selectFormat)
    .from("users")
    .where({ email: user.email })
    .first();
  if (existingUser) {
    return "Email already exists";
  }
  await query.insert(user).into("users");
  return "User Signed Up Sucessfully";
};

export const updateUser = (user: UserModel) => {
  return query.update(user).from("users").where({ id: user.id });
};

export const deleteUser = (id: number) => {
  return query.from("users").where({ id }).del();
};
const selectFormat = {
  id: "users.id",
  password: "users.password",
  email: "users.email",
};
