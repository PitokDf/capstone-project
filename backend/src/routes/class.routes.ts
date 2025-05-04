import { Router } from "express";
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { validateClass } from "../validators/classValidator";
import { checkValidasiRequest } from "../middlewares/checkValidasi";
import { addClass, getAllClass } from "../controllers/class.controller";

const classRouter = Router()

classRouter.post("/", jwtCheckToken, validateClass, checkValidasiRequest, addClass)
classRouter.get("/", jwtCheckToken, getAllClass)

export default classRouter