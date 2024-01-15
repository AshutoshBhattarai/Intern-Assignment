import Joi from "joi";

// Validation schema for joi validation
// Validates user input fields
export const userBodySchema = Joi.object({
  username: Joi.string().required().max(25),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
});

// Validation schema for Login form
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
// Validation schema for update
export const userUpdateSchema = Joi.object({
  username: Joi.string().max(25),
  email: Joi.string().email(),
  password: Joi.string().min(5),
})