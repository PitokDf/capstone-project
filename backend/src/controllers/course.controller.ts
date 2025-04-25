import { Request, Response } from "express";
import { handlerAnyError } from "../utils/errorHandler";
import { createCourseService, deleteCourseService, getAllCourseService } from "../services/course.service";

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { code, name, sks, duration } = req.body;
        const newCourse = await createCourseService(code, name, sks, duration);

        return res.status(200).json({
            message: "Course created successfully",
            data: newCourse
        })
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export const getAllCourse = async (req: Request, res: Response) => {
    try {
        const courses = await getAllCourseService();
        return res.status(200).json({
            message: "Get all courses successfully",
            data: courses
        })
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const deletedCourse = await deleteCourseService(Number(id));
        return res.status(200).json({
            message: "Delete courses successfully",
            data: deletedCourse
        })
    } catch (error) {
        return handlerAnyError(error, res);
    }
}