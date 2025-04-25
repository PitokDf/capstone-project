import { body } from "express-validator";
import { checkCourseByCodeExistsService, getCourseByCodeService } from "../services/course.service";

export const addCourseValidator = [
    body("name")
        .notEmpty()
        .withMessage("Course name is required").bail()
        .isString()
        .withMessage("Course name must be a string"),
    body("code")
        .notEmpty()
        .withMessage("Course code is required").bail()
        .isString()
        .withMessage("Course code must be a string").bail()
        .custom(async (code) => {
            const check = await checkCourseByCodeExistsService(code)
            if (check) throw new Error("Course code sudah tersedia.")
            return true;
        }),
    body("duration")
        .notEmpty()
        .withMessage("Course duration is required").bail()
        .isInt({ min: 30 })
        .withMessage("Course duration must be a positive integer"),
    body("sks")
        .notEmpty()
        .withMessage("Course sks is required").bail()
        .isInt({ min: 1 })
        .withMessage("Course sks must be a positive number"),
]