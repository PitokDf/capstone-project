import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { getAllUserService } from "../services/user.service";

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await getAllUserService();
        return res.status(200).json({
            message: "Berhasil  mendapatkan data user.",
            data: users
        })
    } catch (error) {
        return handlerAnyError(error, res);
    }
}