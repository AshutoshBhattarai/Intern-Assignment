import Joi from "joi";

export const todoSchema = Joi.object({
    title : Joi.string().required(),
    completed : Joi.boolean().required(),
})