import { Router } from "express";
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { validateClass } from "../validators/classValidator";
import { checkValidasiRequest } from "../middlewares/checkValidasi";
import { addClass, deleteClass, getAllClass, updateClass } from "../controllers/class.controller";

const classRouter = Router()

classRouter.post("/", jwtCheckToken, validateClass, checkValidasiRequest, addClass)
classRouter.get("/", jwtCheckToken, getAllClass)
classRouter.put("/:id", jwtCheckToken, validateClass, checkValidasiRequest, updateClass)
classRouter.delete("/:id", jwtCheckToken, deleteClass)

export default classRouter