import e, { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addTimeSlotService, deleteTimeSlotService, getAllTimeSlotService, updateTimeSlotService } from "../services/timeSlot.service";

export const getTimeSlots = async (req: Request, res: Response) => {
    try {
        const timeslots = await getAllTimeSlotService();
        return res.status(200).json({ message: "berhasil mendapatkan data timeslot", data: timeslots });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export const addTimeSlot = async (req: Request, res: Response) => {
    try {
        const { day, starTime, endTime } = req.body;
        const timeSlot = await addTimeSlotService(day, starTime, endTime);
        return res.status(201).json({ message: "berhasil menambahkan data timeslot", data: timeSlot });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export const updateTimeSlot = async (req: Request, res: Response) => {
    try {
        const { day, starTime, endTime } = req.body
        const { id } = req.params
        const updatedTimeSlot = await updateTimeSlotService(Number(id), day, starTime, endTime)

        return res.status(200).json({
            message: "Berhasil mengeupdate Slot waktu.", data: updatedTimeSlot
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const deleteTimeSlot = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        console.log(id);

        const deletedTimeSlot = await deleteTimeSlotService(Number(id))
        return res.status(200).json({
            message: "Berhasil menghapus Slot waktu.", data: deletedTimeSlot
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}
