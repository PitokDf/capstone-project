import { prisma } from "../config/prisma"
import { AppError } from "../utils/errorHandler";

export const addRoomService = async (capacity: string, code: string, location: string) => {
    const newRoom = await prisma.room.create({
        data: { capacity, code, location }
    })

    return newRoom;
}

export const checkCodeRoomExists = async (code: string) => {
    const check = await prisma.room.findFirst({ where: { code } })

    return check ? true : false;
}

export const getAllRoomService = async () => {
    const rooms = await prisma.room.findMany();

    return rooms;
}

const checkRoomId = async (id: number) => {
    const check = await prisma.room.findFirst({ where: { id } })

    return check ? true : false
}

export const findRoomByIdService = async (id: number) => {
    const check = await checkRoomId(id)
    if (!check) throw new AppError(`Ruangan dengan id: ${id} tidak ditemukan.`, 404)

    const room = await prisma.room.findFirst({ where: { id } })

    return room
}

export const updateRoomService = async (id: number, capacity: string, location: string) => {
    const check = await checkRoomId(id)
    if (!check) throw new AppError(`Ruangan dengan id: ${id} tidak ditemukan.`, 404)

    const updatedRomm = await prisma.room.update({
        where: { id },
        data: { location, capacity }
    })

    return updatedRomm;
}

export const deleteRoomService = async (id: number) => {
    const check = await checkRoomId(id)
    if (!check) throw new AppError(`Ruangan dengan id: ${id} tidak ditemukan.`, 404)

    const deletedRoom = await prisma.room.delete({
        where: { id }
    })

    if (!deletedRoom) throw new AppError(`Ruangan dengan id: ${id} tidak ditemukan.`, 404)

    return deletedRoom;
}

