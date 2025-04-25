import { body } from "express-validator";

export const updateUserValidator = [
    body("username")
]