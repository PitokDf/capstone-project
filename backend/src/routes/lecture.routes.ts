import { Router } from "express";
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { login } from "../controllers/auth.controller";
import { getAllLecture } from "../controllers/lecture.controller";

const lectureRoute = Router()

lectureRoute.get("/", jwtCheckToken, getAllLecture)

export default lectureRoute