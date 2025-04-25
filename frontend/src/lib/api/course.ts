import { Course } from "@/types/course";
import axiosInstance from "../axios";

export async function getCourses() {
    const res = await axiosInstance.get('/course');
    return res.data.data
}

export async function addCourse(course: Omit<Course, 'id'>) {
    const res = await axiosInstance.post('/course', course)

    return res.data.data
}

export async function deleteCourse(id: number) {
    const res = await axiosInstance.delete(`/course/${id}`)
    return res.data.data
}

export async function updateCourse(course: Course) {
    const res = await axiosInstance.put(`/course/${course.id}`, course)
    return res.data.data
}