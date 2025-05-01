import { body } from "express-validator";
import { existingSlot } from "../services/timeSlot.service";

export const validateTimeslot = [
    body("day").
        notEmpty().withMessage("Hari harus diisi.").bail()
        .isString().withMessage("Hari harus berupa string."),
    body("starTime")
        .notEmpty().withMessage("Waktu mulai harus diisi.").bail()
        .isISO8601().withMessage("Format waktu awal tidak valid."),
    body("endTime")
        .notEmpty().withMessage("Waktu berakhir harus diisi.").bail()
        .isISO8601().withMessage("Format Waktu berakhir tidak valid").bail()
        .custom(async (value, { req }) => {
            const day = req.body.day
            const start = new Date(req.body.starTime)
            const end = new Date(value)
            if (!(end > start)) {
                throw new Error("Waktu berakhir harus besar dari waktu mulai.")
            }

            const checkExistingSlot = await existingSlot(day, req.body.starTime, req.body.endTime)

            if (checkExistingSlot) throw new Error("TimeSlot bentrok dengan jadwal yang sudah ada di hari yang sama");


            return true
        })
]

export const validateUpdateTimeslot = [
    body("day").
        notEmpty().withMessage("Hari harus diisi.").bail()
        .isString().withMessage("Hari harus berupa string."),
    body("starTime")
        .notEmpty().withMessage("Waktu mulai harus diisi.").bail()
        .isISO8601().withMessage("Format waktu awal tidak valid."),
    body("endTime")
        .notEmpty().withMessage("Waktu berakhir harus diisi.").bail()
        .isISO8601().withMessage("Format Waktu berakhir tidak valid").bail()
        .custom(async (value, { req }) => {
            const id = (req.params?.id as number)
            const day = req.body.day
            const start = new Date(req.body.starTime)
            const end = new Date(value)
            if (!(end > start)) {
                throw new Error("Waktu berakhir harus besar dari waktu mulai.")
            }

            const checkExistingSlot = await existingSlot(day, req.body.starTime, req.body.endTime, Number(id))

            if (checkExistingSlot) throw new Error("TimeSlot bentrok dengan jadwal yang sudah ada di hari yang sama");

            return true
        })
]