import { prisma } from "../config/prisma"
import { AppError } from "../utils/errorHandler";

export const getAllTimeSlotService = async () => {
    const timeSlots = await prisma.timeSlot.findMany({
        orderBy: [{ day: "desc" }, { starTime: "asc" }], include:
        {
            Schedule: {
                include: {
                    lecture: { select: { name: true } },
                    course: { select: { name: true } },
                    class: { select: { name: true } },
                    room: { select: { name: true } }
                }
            }
        }
    });

    return timeSlots;
}

export const findTimeSlotById = async (id: number) => {
    const timeSlot = await prisma.timeSlot.findFirstOrThrow({ where: { id } })
    if (!timeSlot) throw new AppError("Slot waktu tidak tersedia.", 404);
    return timeSlot
}

export const existingSlot = async (day: string, starTime: Date, endTime: Date, ignoredId?: number) => {
    const whereClause: any = {
        day,
        starTime: { lt: new Date(endTime) },
        endTime: { gt: new Date(starTime) }
    }

    if (ignoredId) {
        whereClause.id = { not: ignoredId }
    }
    const isOverlap = await prisma.timeSlot.findFirst({
        where: whereClause
    })

    return isOverlap ? true : false
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

export const updateTimeSlotService = async (id: number, day: string, starTime: Date, endTime: Date) => {
    await findTimeSlotById(id)

    const updatedTimeSlot = await prisma.timeSlot.update({
        where: { id },
        data: { day, endTime, starTime }
    })

    return updatedTimeSlot
}

export const deleteTimeSlotService = async (id: number) => {
    await findTimeSlotById(id)

    const deletedTimeSlot = await prisma.timeSlot.delete({ where: { id } })

    return deletedTimeSlot
}