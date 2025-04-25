import e, { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addTimeSlotService, getAllTimeSlotService } from "../services/timeSlot.service";

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