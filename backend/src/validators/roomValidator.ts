import { body } from "express-validator";
import { checkCodeRoomExists } from "../services/room.service";

export const addRoomValidator = [
    body("code").notEmpty({ ignore_whitespace: true }).withMessage("Kode ruangan harus diisi.").bail()
        .custom(async (code) => {
            const exists = await checkCodeRoomExists(code);

            if (exists) throw new Error("Kode ruangan suda tersedia.")
            return true;
        }),
    body("capacity").notEmpty({ ignore_whitespace: true }).withMessage("Kapasitas harus diisi.").bail()
        .isInt().withMessage("Kapasitas berupa numerik"),
    body("location").notEmpty({ ignore_whitespace: true }).withMessage("Lokasi harus diisi.")
]

export const updateRoomValidator = [
    body("capacity").optional()
        .notEmpty({ ignore_whitespace: true }).withMessage("Kapasitas harus diisi.").bail()
        .isInt().withMessage("Kapasitas berupa numerik"),
    body("location").optional()
        .notEmpty({ ignore_whitespace: true }).withMessage("Lokasi harus diisi."),
    body("name").notEmpty({ ignore_whitespace: true }).withMessage("Nama ruangan harus diisi."),
    body("code").notEmpty({ ignore_whitespace: true }).withMessage("Kode ruangan harus diisi.").bail()
        .custom(async (code, { req }) => {
            const id = req.params?.id
            const check = await checkCodeRoomExists(code, Number(id))
            if (check) throw new Error("Kode ruangan sudah tersedia.")
            return true
        }),
]