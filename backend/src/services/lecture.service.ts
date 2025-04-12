import { prisma } from "../config/prisma"

export const getAllLectureService = async () => {
    const lectures = await prisma.lecture.findMany({ orderBy: { name: "asc" } })

    return lectures
}