import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../model/UserModel";
import * as userRepo from "../Repositories/UserRepo";
import config from "../utils/config";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../utils/constants";
const SALT = 10;
export const signup = async (user: UserModel) => {
  const hash = await bcrypt.hash(user.password, SALT);
  user.password = hash;
  return userRepo.addUser(user);
};

export const login = async (user: UserModel) => {
  const foundUser = userRepo.getUserByEmail(user.email);
  if (!foundUser) return { message: "User not found" };
  const isMatch = await bcrypt.compare(user.password, foundUser.password);
  if (isMatch) {
    const accessToken = jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email,
      },
      config.jwt.accessTokenSecret!,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }
    );
    const refreshToken = jwt.sign(
      {
        user: {
          id: foundUser.id,
          email: foundUser.email,
        },
      },
      config.jwt.refreshTokenSecret!,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      }
    );
    return {
      message: "Login Successful",
      accessToken,
      refreshToken,
    };
  } else return { message: "Invalid Credentials" };
};
