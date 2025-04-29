import { Lecture } from "@/types/lecture";
import axiosInstance from "../axios";

export const addLecturer = async (lecturer: Omit<Lecture, "id">) => {
    const res = await axiosInstance.post("/lecture", lecturer)
    return res.data.data
}

export const getLectures = async () => {
    const res = await axiosInstance.get("/lecture")
    return res.data.data
}

export const updateLecture = async (lecture: Lecture) => {
    const res = await axiosInstance.put(`/lecture/${lecture.id}`, lecture)
    return res.data.data
}

export const deleteLecturer = async (id: number) => {
    const res = await axiosInstance.delete(`/lecture/${id}`)
    return res.data.data
}