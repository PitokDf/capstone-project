import { body } from "express-validator"
import { emailExists, usernameExists } from "../services/auth.service"

export const loginValidator = [
    body("email").notEmpty({ ignore_whitespace: true }).withMessage("email tidak boleh kosong"),
    body("password").notEmpty({ ignore_whitespace: true }).withMessage("password tidak boleh kosong")
]

export const registerValidator = [
    body("username").notEmpty({ ignore_whitespace: true }).withMessage("Username harus diisi.").bail()
        .isLength({ min: 5 }).withMessage("Username minimal 5 karakter.").bail().
        custom(async (username) => {
            const exists = await usernameExists(username);

            if (exists) throw new Error("Username sudah digunakan.");
            return true;
        }),
    body("email").notEmpty({ ignore_whitespace: true }).withMessage("Email harus diisi.").bail().
        isEmail().withMessage("Masukkan email yang valid.").bail().
        custom(async (email) => {
            const exists = await emailExists(email);

            if (exists) throw new Error("Email sudah digunakan.");
            return true;
        }),
    body("password").notEmpty({ ignore_whitespace: true }).withMessage("Password harus diisi").bail().
        isLength({ min: 8 }).withMessage("Password minimal 8 karakter.")
]
