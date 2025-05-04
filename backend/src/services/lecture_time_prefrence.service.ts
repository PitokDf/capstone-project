import { LectureTimePrefrence } from "@prisma/client"
import { prisma } from "../config/prisma"

export const addLectureTimePrefrenceService = async (id: number, data: Omit<LectureTimePrefrence, 'id'>[]) => {

    if (data.length === 0) {
        await prisma.lectureTimePrefrence.deleteMany({ where: { lectureID: id } })
        return [{ count: 0 }]
    } else {
        const lectureID = data[0].lectureID
        const _ = await prisma.$transaction([
            prisma.lectureTimePrefrence.deleteMany({ where: { lectureID } }),
            prisma.lectureTimePrefrence.createMany({ data, skipDuplicates: true })
        ])
        return _
    }

}