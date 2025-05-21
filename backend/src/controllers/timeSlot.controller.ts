import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addTimeSlotService, bulkDeleteTimeSlotService, createTimeSlotToNext, deleteTimeSlotService, getAllTimeSlotService, updateTimeSlotService } from "../services/timeSlot.service";

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const colors = [
    "bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800",
    "bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800",
    "bg-blue-100 border-blue-300 dark:bg-blue-950 dark:border-blue-800",
    "bg-yellow-100 border-yellow-300 dark:bg-yellow-950 dark:border-yellow-800",
    "bg-purple-100 border-purple-300 dark:bg-purple-950 dark:border-purple-800",
    "bg-pink-100 border-pink-300 dark:bg-pink-950 dark:border-pink-800",
    "bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800",
];

const getColor = (id: number) => {
    return colors[id % colors.length];
};

export const getTimeSlots = async (req: Request, res: Response) => {
    try {
        const timeslots = await getAllTimeSlotService();
        timeslots.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
        const refactorTimeslot = timeslots.map((slot) => ({
            id: slot.id,
            day: slot.day,
            starTime: slot.starTime,
            endTime: slot.endTime,
            Schedule: slot.Schedule.map((schedule) => ({
                id: schedule.id,
                classID: schedule.classID,
                className: schedule.class.name,
                courseID: schedule.courseID,
                courseName: schedule.course.name,
                lectureID: schedule.lectureID,
                lecturerName: schedule.lecture.name,
                roomID: schedule.roomID,
                roomName: schedule.room.name,
                day: slot.day,
                startTime: "11:30",
                endTime: "13:30",
                color: getColor(schedule.id)
            }))
        }))
        return res.status(200).json({ message: "berhasil mendapatkan data timeslot", data: refactorTimeslot });
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

export async function timeSlotBulkDelete(req: Request, res: Response) {
    try {
        const { ids } = req.params
        const selectedIds = ids.split(",").map(item => Number(item))
        const deleted = await bulkDeleteTimeSlotService(selectedIds)

        return res.status(200).json({
            message: "Berhasil menghapus data",
            data: deleted.count
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function createTimeSlotToNextController(req: Request, res: Response) {
    try {
        const { days } = req.body
        const created = await createTimeSlotToNext(days)

        return res.status(201).json({
            message: `Berhasil memnyalin slot waktu ${created.count}`
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}