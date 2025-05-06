import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addScheduleService, deleteScheduleService, generateScheduleService, getSchedulesService, updateScheduleService } from "../services/schedule.service";

export async function getSchedules(req: Request, res: Response) {
    try {
        const schedules = await getSchedulesService()

        return res.status(200).json({
            message: "Berhasil mendapatkan data.",
            data: schedules
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function addSchedules(req: Request, res: Response) {
    try {
        const {
            classID,
            courseID,
            lectureID,
            roomID,
            timeSlotID } = req.body
        const schedules = await addScheduleService(Number(classID), Number(courseID), Number(lectureID), Number(roomID), Number(timeSlotID))

        return res.status(200).json({
            message: "Berhasil menambahkan data.",
            data: schedules
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}


export async function updateSchedules(req: Request, res: Response) {
    try {
        const {
            classID,
            courseID,
            lectureID,
            roomID,
            timeSlotID } = req.body

        const { id } = req.params
        const schedules = await updateScheduleService(Number(id), Number(classID), Number(courseID), Number(lectureID), Number(roomID), Number(timeSlotID))

        return res.status(200).json({
            message: "Berhasil mengupdate data.",
            data: schedules
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function deleteSchedules(req: Request, res: Response) {
    try {
        const { id } = req.params
        const schedules = await deleteScheduleService(Number(id))

        return res.status(200).json({
            message: "Berhasil menghapus data.",
            data: schedules
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function generateSchedule(req: Request, res: Response) {
    try {
        const { options } = req.body
        console.log(req.body);

        const generatedSchedule = await generateScheduleService(options)
        return res.status(200).json({
            message: `Schedule generated successfully with ${generatedSchedule.length} entries`,
            data: generatedSchedule
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}