import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addClassService, getAllClassesService } from "../services/class.service";

export async function addClass(req: Request, res: Response) {
    try {
        const { name, code } = req.body
        const newClass = await addClassService(name, code);

        return res.status(201).json({
            message: "Berhasil menambahkan kelas baru.",
            data: newClass
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function getAllClass(req: Request, res: Response) {
    try {
        const classes = await getAllClassesService();

        return res.status(201).json({
            message: "Berhasil mendapatkan kelas baru.",
            data: classes
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}
