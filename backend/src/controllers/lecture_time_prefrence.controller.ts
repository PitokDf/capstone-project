import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addLectureTimePrefrenceService } from "../services/lecture_time_prefrence.service";

export const addLectureTimePrefrence = async (req: Request, res: Response) => {
    try {
        const { lectureID } = req.params
        const { preferenceIds } = req.body


        const data = (preferenceIds as number[]).map(id => ({
            lectureID: Number(lectureID),
            timeslotID: id
        })) as {
            lectureID: number;
            timeslotID: number;
            createedAt: Date;
            updatedAt: Date;
        }[]
        const newLectureTime = await addLectureTimePrefrenceService(Number(lectureID), data)
        return res.status(200).json({
            message: "Berhasil memperbarui prefrenesi waktu dosen",
            data: newLectureTime[0].count
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}