import { prisma } from "../config/prisma"
import { AppError } from "../utils/errorHandler";

export const getAllTimeSlotService = async () => {
    const timeSlots = await prisma.timeSlot.findMany();

    return timeSlots;
}

export const addTimeSlotService = async (day: string, starTime: Date, endTime: Date) => {
    const timeSlot = await prisma.timeSlot.create({
        data: {
            day,
            starTime,
            endTime
        }
    });

    if (!timeSlot) {
        throw new AppError("Failed to create time slot", 500);
    }

    return timeSlot;
}