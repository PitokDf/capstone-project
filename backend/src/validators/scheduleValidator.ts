import { body } from "express-validator";

export const validateSchedule = [
    body("classID").notEmpty().withMessage("Class is required"),
    body("lectureID").notEmpty().withMessage("Lecture is required"),
    body("courseID").notEmpty().withMessage("Course is required"),
    body("roomID").notEmpty().withMessage("Room is required"),
    body("timeSlotID").notEmpty().withMessage("Time slot is required"),
]