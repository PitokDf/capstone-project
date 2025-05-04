import { body } from "express-validator";

export const validateClass = [
    body("name").notEmpty({ ignore_whitespace: true })
        .withMessage("Nama kelas harus diisi."),
    body("code").notEmpty({ ignore_whitespace: true })
        .withMessage("Kode kelas harus diisi."),
]