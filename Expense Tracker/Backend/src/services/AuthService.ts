/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */
import User from "../models/User";
import * as userRepo from "../repositories/UserRepo";
import * as categoryRepo from "../repositories/CategoryRepo";
import fs from "fs";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import config from "../configs";
import {
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY,
} from "../constants";
import NotFoundError from "../errors/NotFound";
import ForbiddenError from "../errors/Forbidden";
import BadRequestError from "../errors/BadRequest";
import Category from "../models/Category";

// Register User
export const register = async (user: User) => {
  try {
    // Check if the user is already registered
    const userExists = await userRepo.getUserByEmail(user.email);
    if (userExists) {
      throw new BadRequestError(`User with email ${user.email} already exists`);
    }
    // Hash the password if user is valid
    const hashedPassword = await argon2.hash(user.password);
    // create a new user object
    const newUser = new User();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password = hashedPassword;
    // Save the new user and get the object back with all required data
    const savedUser = await userRepo.addUser(newUser);
    // Create a folder with user's id
    fs.mkdirSync("./uploads/" + savedUser.id, { recursive: true });
    //Create a category by default
    const category = new Category();
    category.user = savedUser;
    category.title = "Miscellaneous";
    category.description =
      "A category for miscellaneous expenses(automatically created)";
    // Save the category
    await categoryRepo.createCategory(category);
  } catch (error) {
    throw error;
  }
};

//Login Function
export const login = async (user: User) => {
  try {
    // Check if the user exists or not
    const foundUser = await userRepo.getUserByEmail(user.email);
    if (!foundUser) {
      throw new NotFoundError(`User with email ${user.email} not found`);
    }

    // Validate the given password
    const isPasswordValid = await argon2.verify(
      foundUser.password,
      user.password
    );
    // Send error if the password is not valid
    if (!isPasswordValid) {
      throw new ForbiddenError("Invalid password");
    }

    // Create access tokens if the user's credentials are valid
    const accessToken = createAccessToken(foundUser.id);
    const refreshToken = createRefreshToken(foundUser.id);

    // Save the refresh token in the database
    foundUser!.refreshToken = refreshToken;
    // Update the refresh token in the database
    await userRepo.updateRefreshToken(foundUser.id, refreshToken);
    // Return the access token and refresh token to the user
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

// Logout Function
export const logout = async (user: User) => {
  try {
    // If the user exists set the refresh token to empty string in the database
    const userFound = await userRepo.getUserById(user.id);
    await userRepo.updateRefreshToken(userFound!.id, "");
  } catch (error) {
    throw error;
  }
};

// Function to provide new tokens to the user
export const refresh = async (refreshToken: string) => {
  try {
    // Verify the refresh token
    const verifyToken = jwt.verify(refreshToken, config.jwt.refreshSecret);

    // Get the userid from the token
    const userid = (verifyToken as any).userid;
    // Get the user from the database
    const user = await userRepo.getUserById(userid);
    // Check if the user exists
    if (!user) throw new NotFoundError("User not found");
    // Check if the refresh token is valid
    if (user.refreshToken !== refreshToken)
      throw new ForbiddenError("Invalid refresh token");

    // Create new access and refresh tokens
    const accessToken = createAccessToken(user.id);
    const newRefreshToken = createRefreshToken(user.id);

    // Update the refresh token in the database
    user.refreshToken = newRefreshToken;
    await userRepo.updateRefreshToken(user.id, newRefreshToken);
    // Return the new access token and refresh token
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/*                 Functions to create access and refresh tokens              */
/* -------------------------------------------------------------------------- */
const createAccessToken = (id: string) => {
  return jwt.sign({ userid: id }, config.jwt.accessSecret, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRY,
  });
};

const createRefreshToken = (id: string) => {
  return jwt.sign({ userid: id }, config.jwt.refreshSecret, {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRY,
  });
};
