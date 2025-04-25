import { prisma } from "../config/prisma"
import { AppError } from "../utils/errorHandler"

export const getAllCourseService = async () => {
    const courses = await prisma.course.findMany({ orderBy: { name: "asc" } })

    return courses
}

export const getCourseByCodeService = async (code: string) => {
    const course = await prisma.course.findFirst({
        where: { code, }
    })

    if (!course) throw new AppError(`Course dengan code: ${code} tidak ditemukan`, 404);
    return course
}

export const checkCourseByCodeExistsService = async (code: string, ignoreId?: number) => {
    const whereClause: any = { code }

    if (ignoreId) {
        whereClause.id = { not: ignoreId }
    }

    const course = await prisma.course.findFirst({
        where: whereClause,
    })

    return course ? true : false
}

export const createCourseService = async (code: string, name: string, sks: number, duration: number) => {
    const course = await prisma.course.create({
        data: {
            code, name, sks, duration
        }
    })

    if (!course) throw new AppError("Gagal menambahkan course baru.");

    return course
}

export const updateCourseService = async (id: number, code: string, name: string, sks: number, duration: number) => {
    await getCourseByCodeService(code);

    const updatedCourse = await prisma.course.update({
        where: { id },
        data: { code, name, sks, duration }
    })

    if (!updatedCourse) throw new AppError("Gagal update data course");

    return updatedCourse
}

export const deleteCourseService = async (id: number) => {
    const course = await prisma.course.delete({
        where: { id }
    })

    if (!course) throw new AppError("Gagal menghapus course");

    return course
}