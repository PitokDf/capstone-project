import { Request, Response } from "express";
import { loginService, registerService } from '../services/auth.service';
import { handlerAnyError } from '../utils/errorHandler';
import { hashPassword, verifyPassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { config } from "../config/config";

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body; // ambil email dan password dari request body
        const user = await loginService(email)

        // cek kesesuaian password
        const matchPassword = await verifyPassword(password, user.password);

        if (!matchPassword) return res.status(400).json({ message: "email atau password salah." });

        const token = await generateToken({ username: user.username, email: user.email, id: user.id, createdAt: user.createdAt })
        // res.setHeader('Access-Control-Allow-Credentials', 'true')
        // res.setHeader('Access-Control-Allow-Origin', config.clientUrl)

        // res.setHeader('Set-Cookie', [
        //     `token=${token}; ${config.isProduction && "HttpOnly"}; ${config.isProduction && "Secure"}; SameSite=None; Partitioned; Path=/; Max-Age=${30 * 24 * 60 * 60}; Domain=schedule-course.vercel.app`
        // ])
        // res.cookie('token', token, {
        //     httpOnly: config.isProduction,
        //     expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        //     secure: config.isProduction,
        //     sameSite: config.isProduction ? 'none' : 'lax',
        //     path: '/',
        //     ...(config.isProduction && { partitioned: true })
        // })

        console.log('Environment:', config.nodeEnv);
        console.log('Cookie secure:', config.isProduction);

        return res.status(200).json({
            message: "Berhasil login",
            data: {
                token,

            }
        })
    } catch (error: any) {
        return handlerAnyError(error, res)
    }
}

export async function register(req: Request, res: Response) {
    try {
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

export const logout = (req: Request, res: Response) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            success: true,
            message: "Logout berhasil."
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}