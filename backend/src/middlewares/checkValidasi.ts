import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"

export const checkValidasiRequest = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json({ message: "Validasi gagal.", errors: errors.array() }) // return status 400 jika terdapat errors pada request (validasi input)
    else next() // jika tidak terdapat error (Validasi input) maka lanjutkan ke tindakan selanjutnya

}