import Joi from "joi";

export const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required()
})

export const userParamsSchema = Joi.object({
    email : Joi.string().email().required(),
    id : Joi.number().required(),
})

export const signupSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required().min(5),
})

