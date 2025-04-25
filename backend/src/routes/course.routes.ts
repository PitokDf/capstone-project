import { Router } from "express";
import { jwtCheckToken } from "../middlewares/jwtCheckToken";
import { addCourseValidator, updateCourseValidator } from "../validators/courseValidator";
import { checkValidasiRequest } from "../middlewares/checkValidasi";
import { createCourse, deleteCourse, getAllCourse, updateCourse } from "../controllers/course.controller";

const courseRouter = Router();

courseRouter.post("/", jwtCheckToken, addCourseValidator, checkValidasiRequest, createCourse)
courseRouter.get("/", jwtCheckToken, getAllCourse)
courseRouter.delete("/:id", jwtCheckToken, deleteCourse)
courseRouter.put("/:id", jwtCheckToken, updateCourseValidator, checkValidasiRequest, updateCourse)

export default courseRouter;