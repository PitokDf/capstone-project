import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addClassService, deleteClassService, getAllClassesService, updateClassService } from "../services/class.service";

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
export async function deleteClass(req: Request, res: Response) {
    try {
        const { id } = req.params
        const classes = await deleteClassService(Number(id));

        return res.status(201).json({
            message: "Berhasil menghapus kelas baru.",
            data: classes
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}
export async function updateClass(req: Request, res: Response) {
    try {
        const { id } = req.params
        const { name, code } = req.body
        const classes = await updateClassService(Number(id), name, code);

        return res.status(201).json({
            message: "Berhasil mengupdate kelas baru.",
            data: classes
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}
