import { Schedule } from "@/types/schedule";
import axiosInstance from "../axios";

export async function getSchedules(): Promise<Schedule[]> {
    const res = await axiosInstance.get("/schedule")
    return res.data.data
}

export async function addSchedule(data: Schedule): Promise<void> {
    const res = await axiosInstance.post("/schedule", data)
    return res.data.data
}

export async function editSchedule(data: Schedule): Promise<void> {
    const res = await axiosInstance.put(`/schedule/${data.id}`, data)
    return res.data.data
}

export async function deleteSchedule(id: number) {
    const res = await axiosInstance.delete(`/schedule/${id}`)
    return res.data.data
}