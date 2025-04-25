import { prisma } from "../config/prisma"
import { AppError } from "../utils/errorHandler"

export const getAllLectureService = async () => {
    const lectures = await prisma.lecture.findMany({ orderBy: { name: "asc" } })

    return lectures
}

export const getLectureByIdService = async (id: number) => {
    const lecture = await prisma.lecture.findFirst({
        where: { id }
    })

    if (!lecture) throw new AppError(`Dosen dengan id: ${id} tidak ditemukan`, 404)

    return lecture;
}

export const nipExistsService = async (nip: string): Promise<boolean> => {
    const lecture = await prisma.lecture.findFirst({ where: { nip } });

    return lecture ? true : false
}


export const addLectureService = async (nip: string, name: string, preference: string) => {
    const newLecture = await prisma.lecture.create({
        data: {
            nip, name, preference
        }
    })

    if (!newLecture) throw new AppError("Gagal menambahkan dosen baru.")

    return newLecture
}

export const updateLectureService = async (id: number, name: string, preference: string) => {
    await getLectureByIdService(id);

    const updatedLecture = await prisma.lecture.update({
        where: { id },
        data: { name, preference }
    })

    if (!updatedLecture) throw new AppError("Gagal update data dosen");

    return updatedLecture
}

export const deleteLectureService = async (id: number) => {
    await getLectureByIdService(id);

    const deletedLecture = await prisma.lecture.delete({ where: { id } })
    return deletedLecture
}