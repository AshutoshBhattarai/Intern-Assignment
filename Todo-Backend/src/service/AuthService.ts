import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../model/UserModel";
import * as userRepo from "../Repositories/UserRepo";
import config from "../utils/config";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  SALT,
} from "../utils/constants";
const refreshTokens: string[] = [];
export const signup = async (user: UserModel) => {
  const hashedPassword = await bcrypt.hash(user.password, SALT);
  user.password = hashedPassword;
  return userRepo.addUser(user);
};

export const login = async (user: UserModel) => {
  const foundUser : any = await userRepo.getUserByEmail(user.email);

  if (!foundUser) {
    return { message: "User not found" };
  }

  const isMatch = await bcrypt.compare(user.password, foundUser.password);

  if (isMatch) {
    const accessToken = createJwtToken(foundUser, "accessToken");

    const refreshToken = createJwtToken(foundUser, "refreshToken");

    refreshTokens.push(refreshToken);

    return {
      message: "Login Successful",
      accessToken,
      refreshToken,
    };
  } else {
    return { message: "Invalid Credentials" };
  }
};

export const refreshToken = (token: string) => {
  if (!token) {
    return { message: "Unauthorized" };
  }

  if (!refreshTokens.includes(token)) {
    return { message: "Unauthorized" };
  }

  try {
    const user = jwt.verify(token, config.jwt.refreshTokenSecret!) as any;
    const accessToken = createJwtToken(user, "accessToken");
    return {
      accessToken,
    };
  } catch {
    return { message: "Unauthorized" };
  }
};

const createJwtToken = (user: UserModel, type: string) => {
  const secretKey =
    type === "accessToken"
      ? config.jwt.accessTokenSecret!
      : config.jwt.refreshTokenSecret!;
  const expiresIn =
    type === "accessToken" ? ACCESS_TOKEN_EXPIRY : REFRESH_TOKEN_EXPIRY;
  return jwt.sign(
    {
      id: user.id,
      email: user.email as string,
    },
    secretKey,
    {
      expiresIn,
    }
  );
};
