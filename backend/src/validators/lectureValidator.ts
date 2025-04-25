import { body } from "express-validator";
import { nipExistsService } from "../services/lecture.service";


export const addLectureValidator = [
    body("nip").notEmpty().withMessage("Nip harus diisi.").bail().
        custom(async (nip) => {
            const exists = await nipExistsService(nip);
            if (exists) throw new Error("Nip sudah tersedia.");
            return true;
        }),
    body("name").notEmpty().withMessage("Nama dosen harus diisi."),
    body("preference").notEmpty().withMessage("Preference harus diisi.")
]

export const updateLectureValidator = [
    body("name").optional()
        .isString().withMessage("Nama harus berupa alfabet.").bail()
        .notEmpty({ ignore_whitespace: true }).withMessage("Nama tidak boleh kosong."),
    body("preference").optional()
        .notEmpty({ ignore_whitespace: true }).withMessage("Preference tidak boleh kosong.")
]