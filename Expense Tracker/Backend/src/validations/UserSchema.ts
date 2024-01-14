import Joi from "joi";

export const userBodySchema = Joi.object({
  username: Joi.string().required().max(25),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userUpdateSchema = Joi.object({
  username: Joi.string().max(25),
  email: Joi.string().email(),
  password: Joi.string().min(5),
})