import { Timeslot } from "@/types/timeslot";
import axiosInstance from "../axios";

export async function getTimeslots(): Promise<Timeslot[]> {
    const res = await axiosInstance.get('/course');
    return res.data.data;
}

export async function addTimeslot(data: Omit<Timeslot, 'id'>): Promise<Timeslot> {
    const res = await axiosInstance.post('/timeslots', data);
    return res.data.data;
}