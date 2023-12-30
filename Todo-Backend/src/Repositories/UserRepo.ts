import Users from "../Database/User";
import { UserModel } from "../model/UserModel";

const users: UserModel[] = Users;

export const getAllUsers = (): UserModel[] => {
  return users;
};

export const getUserById = (id: number): UserModel | undefined => {
  return users.find((user) => user.id === id);
};
export const getUserByEmail = (email: string): UserModel | undefined => {
  return users.find((user) => user.email == email);
};
export const addUser = (user: UserModel): string => {
  if (users.some((u) => u.email === user.email)) {
    return "Email already exists";
  }
  user.id = users.length + 1;
  users.push(user);
  return "User Signed Up Sucessfully";
};

export const updateUser = (user: UserModel): string => {
  const index = users.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    return "User data updated successfully";
  } else {
    return "User not found";
  }
};

export const deleteUser = (id: number): string => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return "User deleted successfully";
  } else {
    return "User not found";
  }
};
