import { Router } from "express";
const router = Router();
import {getIncome,createIncome} from "../controllers/IncomeController";
router.route("/").get(getIncome).post(createIncome);
router.route("/:id").get().patch().delete();

export default router;
