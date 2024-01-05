import Joi from "joi";
import { DEFAULT_PAGE } from "../utils/constants";

export const todoSchema = Joi.object({
    title : Joi.string().required(),
    completed : Joi.boolean().required(),
})

export const todoQuerySchema = Joi.object({
    id : Joi.number(),
    userid : Joi.number(),
    completed : Joi.boolean(),
    page : Joi.number().min(1).max(20).default(DEFAULT_PAGE),
})
