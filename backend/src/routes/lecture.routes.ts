import { Router } from "express";
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { addLecture, deleteLecture, getAllLecture, getLectureById, updateLecture } from "../controllers/lecture.controller";
import { addLectureValidator, updateLectureValidator } from "../validators/lectureValidator";
import { checkValidasiRequest } from "../middlewares/checkValidasi";

const lectureRoute = Router()

lectureRoute.get("/", jwtCheckToken, getAllLecture)
lectureRoute.get("/:id", jwtCheckToken, getLectureById)
lectureRoute.delete("/:id", jwtCheckToken, deleteLecture)
lectureRoute.put("/:id", jwtCheckToken, updateLectureValidator, checkValidasiRequest, updateLecture)
lectureRoute.post("/", jwtCheckToken, addLectureValidator, checkValidasiRequest, addLecture)

export default lectureRoute