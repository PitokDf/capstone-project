import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { getAllLectureService } from "../services/lecture.service";

export const getAllLecture = async (req: Request, res: Response) => {
    try {
        const lectures = await getAllLectureService();

        return res.status(200).json({
            message: "Berhasil mendapatkan data.",
            data: lectures
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}