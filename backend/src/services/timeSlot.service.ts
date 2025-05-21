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

function convertToWIB(date: Date): Date {
    // konversi ke waktu UTC, lalu tambahkan offset 7 jam (WIB)
    const wibOffset = 7 * 60 * 60 * 1000; // 7 jam dalam ms
    return new Date(date.getTime() + wibOffset);
}

export const addTimeSlotService = async (day: string, starTime: Date, endTime: Date) => {
    const timeSlot = await prisma.timeSlot.create({
        data: {
            day,
            starTime: convertToWIB(starTime),
            endTime: convertToWIB(endTime)
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

export async function bulkDeleteTimeSlotService(ids: number[]) {
    const deleted = await prisma.timeSlot.deleteMany({ where: { id: { in: ids } } })

    return deleted
}

export async function createTimeSlotToNext(days: string[]) {
    const alreadyDay = (await getAllTimeSlotService())
    const data: any[] = []
    days.forEach(day => {
        alreadyDay.forEach((slot) => {
            data.push({
                day,
                starTime: slot.starTime,
                endTime: slot.endTime
            })
        })
    })

    const created = await prisma.timeSlot.createMany({
        data: data,
        skipDuplicates: true
    })

    return created
}