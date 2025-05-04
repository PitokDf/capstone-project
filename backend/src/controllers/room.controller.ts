import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { addRoomService, deleteRoomService, findRoomByIdService, getAllRoomService, updateRoomService } from "../services/room.service";

export const addRoom = async (req: Request, res: Response) => {
    try {
        const { code, capacity, location, name } = req.body;
        const newRoom = await addRoomService(capacity, code, location, name);
        return res.status(201).json({
            message: "Berhasil menambahkan ruangan baru.",
            data: newRoom
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const findRoomById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const room = await findRoomByIdService(Number(id));

        return res.status(200).json({
            message: "Berhasil mendapatkan data.",
            data: room
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}
export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedRoom = await deleteRoomService(Number(id));

        return res.status(200).json({
            message: "Berhasil menghapus data.",
            data: deletedRoom
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const { capacity, code, location, name } = req.body;
        const { id } = req.params;
        const updatedRomm = await updateRoomService(Number(id), code, capacity, location, name);
        return res.status(200).json({
            message: "Berhasil memperbarui data ruangan.",
            data: updatedRomm
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const getAllRoom = async (req: Request, res: Response) => {
    try {
        const rooms = await getAllRoomService();

        return res.status(200).json({
            message: "Berhasil mendapatkan data ruangan.",
            data: rooms
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}