import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addLectureService, deleteLectureService, getAllLectureService, getLectureByIdService, updateLectureService } from "../services/lecture.service";

export const getAllLecture = async (req: Request, res: Response) => {
    try {
        const lectures = await getAllLectureService();

        return res.status(200).json({
            message: "Berhasil mendapatkan data.",
            data: lectures.map((lecture) => ({
                name: lecture.name,
                id: lecture.id,
                nip: lecture.nip,
                preference: lecture.preference || "-",
                prefrredSlots: lecture.prefrredSlots.map(time => ({
                    day: time.timeslot.day,
                    timeslotID: time.timeslot.id,
                    starTime: time.timeslot.starTime,
                    endTime: time.timeslot.endTime
                })) || [],
            }))
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const getLectureById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const lecture = await getLectureByIdService(Number(id));

        return res.status(200).json({
            message: "Berhasil mendapatkan data dosen.",
            data: lecture
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const addLecture = async (req: Request, res: Response) => {
    try {

        const { nip, name, preference } = req.body;
        const newLecture = await addLectureService(nip, name, preference)

        return res.status(200).json({
            message: "Berhasil menambahkan dosen baru.",
            data: newLecture
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const updateLecture = async (req: Request, res: Response) => {
    try {
        const { name, preference } = req.body
        const { id } = req.params

        const updatedLecture = await updateLectureService(Number(id), name, preference)

        return res.status(200).json({
            message: "Berhasil update data dosen.",
            data: updatedLecture
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}
export const deleteLecture = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const deletedLecture = await deleteLectureService(Number(id))

        return res.status(200).json({
            message: "Berhasil menghapus data dosen.",
            data: deletedLecture
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}