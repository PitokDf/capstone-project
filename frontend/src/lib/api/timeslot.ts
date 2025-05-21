import { Timeslot } from "@/types/timeslot";
import axiosInstance from "../axios";

export async function getTimeslots(): Promise<Timeslot[]> {
    const res = await axiosInstance.get('/timeslot');
    return res.data.data;
}

export async function addTimeslot(data: Omit<Timeslot, 'id'>): Promise<Timeslot> {
    console.log(`Data: `, data);
    const res = await axiosInstance.post('/timeslot', data);

    return res.data.data;
}

export async function updateTimslot(data: Timeslot): Promise<Timeslot> {
    const res = await axiosInstance.put(`/timeslot/${data.id}`, data);

    return res.data.data
}


export async function deleteTimeslot(id: number) {
    const res = await axiosInstance.delete(`/timeslot/${id}`)
    return res.data.data
}

export async function bulkDelete(ids: any[]) {
    const res = await axiosInstance.delete(`/timeslot/bulk-delete/${ids}`)
    return res.data.data
}

export async function createTimeSlotToNext(days: string[]) {
    const res = await axiosInstance.post("/timeslot/copy-next", { days })

    return res.data
}