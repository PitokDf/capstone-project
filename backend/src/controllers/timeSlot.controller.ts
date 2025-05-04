import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addTimeSlotService, deleteTimeSlotService, getAllTimeSlotService, updateTimeSlotService } from "../services/timeSlot.service";

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const getTimeSlots = async (req: Request, res: Response) => {
    try {
        const timeslots = await getAllTimeSlotService();
        timeslots.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
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

export const statTimeSlot = async (req: Request, res: Response) => {
    try {
        const timeSlot = await getAllTimeSlotService()
        const dayCounts = timeSlot.reduce((acc: Record<string, number>, slot) => {
            const day = slot.day;
            acc[day] = acc[day] ? acc[day] + slot.Schedule.length : slot.Schedule.length;
            return acc;
        }, {});

        const statClasses = Object.entries(dayCounts).map(([day, count]) => ({
            name: day,
            value: count
        }))

        statClasses.sort((a, b) => dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name))

        const statSlotUsage = timeSlot.map(slot => ({
            name: `${slot.day} ${slot.starTime.toTimeString().slice(0, 5)}-${slot.endTime.toTimeString().slice(0, 5)}`,
            value: slot.Schedule.length
        }))

        return res.status(200).json({
            message: "Berhasil mendapatkan data.",
            data: {
                statClasses,
                statSlotUsage
            }
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}