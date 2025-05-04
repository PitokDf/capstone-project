import { Router } from "express";
import { getStats } from "../controllers/admin.controller";

const adminRouter = Router()

adminRouter.get('/dashboard', getStats)

export default adminRouter