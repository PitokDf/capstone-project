import { Room } from "@/types/room";
import axiosInstance from "../axios";

export const addRoom = async (room: Omit<Room, 'id'>) => {
    const res = await axiosInstance.post("/room", room)
    return res.data.data
}

export const getRooms = async (): Promise<Room[]> => {
    const res = await axiosInstance.get("/room")
    return res.data.data
}

export const deleteRoom = async (room: Room) => {
    const res = await axiosInstance.delete(`/room/${room.id}`);
    return res.data.data
}

export const updateRoom = async (room: Room) => {
    const res = await axiosInstance.put(`/room/${room.id}`, room)
    return res.data.data
}