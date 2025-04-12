import { validationResult } from 'express-validator'
import { Request, Response } from "express";
import { loginService, registerService } from '../services/auth.service';
import { handlerAnyError } from '../utils/errorHandler';
import { hashPassword, verifyPassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

export async function login(req: Request, res: Response) {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body; // ambil email dan password dari request body
        const user = await loginService(email)

        // cek kesesuaian password
        const matchPassword = await verifyPassword(password, user.password);

        if (!matchPassword) return res.status(400).json({ message: "email atau password salah." });

        const token = await generateToken(user)
        return res.status(200).json({
            message: "Berhasil login",
            data: {
                token
            }
        })
    } catch (error: any) {
        return handlerAnyError(error, res)
    }
}

export async function register(req: Request, res: Response) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({
            message: "Validasi gagal.",
            errors: errors.array()
        })

        const { email, username, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const newUser = await registerService(email, username, hashedPassword!)

        return res.status(200).json({
            message: "Registrasi user berhasil.",
            data: newUser
        })
    } catch (error: any) {
        return handlerAnyError(error, res)
    }
}