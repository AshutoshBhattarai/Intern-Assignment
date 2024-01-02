import Joi from "joi";

export const todoSchema = Joi.object({
    title : Joi.string().required(),
    completed : Joi.boolean().required(),
})

export const todoQuerySchema = Joi.object({
    id : Joi.number(),
    userid : Joi.number(),
    completed : Joi.boolean()
})
