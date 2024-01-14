import Joi from "joi";

export const categoryBodySchema = Joi.object({
    title : Joi.string().required(),
    description : Joi.string().default(""),
})

export const categoryQuerySchema = Joi.object({
    id : Joi.string(),
    title : Joi.string(),
    page : Joi.number().default(1),
})

export const budgetBodySchema = Joi.object({
    title : Joi.string().required(),
    amount : Joi.number().required(),
    startTime : Joi.date().required(),
    endTime : Joi.date().required(),
    category : Joi.string().required(),
})

export const budgetQuerySchema = Joi.object({
    id : Joi.string(),
    title : Joi.string(),
    date : Joi.date(),
    page : Joi.number().default(1),
});

export const incomeBodySchema = Joi.object({
    source : Joi.string().required(),
    amount : Joi.number().required(),
    date  : Joi.date(),
})

export const incomeQuerySchema = Joi.object({
    id: Joi.string(),
    source : Joi.string(),
    startDate : Joi.date(),
    amount : Joi.number(),
    endDate : Joi.date(),
    page : Joi.number().default(1),
})

export const expenseBodySchema = Joi.object({
    amount : Joi.number().required(),
    date : Joi.date().required(),
    description : Joi.string().default(""),
    category : Joi.string().required(),
    image : Joi.string(),
})

export const expenseQuerySchema = Joi.object({
    id : Joi.string(),
    startDate : Joi.date(),
    endDate : Joi.date(),
    category : Joi.string(),
    amount : Joi.number(),
    description: Joi.string(),
    page : Joi.number().default(1),
})