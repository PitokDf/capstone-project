import { Class } from "@/types/class";
import axiosInstance from "../axios";

export async function addClass(data: Omit<Class, 'id'>): Promise<void> {
    const res = await axiosInstance.post("/classes", data)
    return res.data.data
}

export async function getClasses(): Promise<Class[]> {
    const res = await axiosInstance.get("/classes")
    return res.data.data
}