import { prisma } from "../config/prisma"

export const addClassService = async (name: string, code: string) => {
    const newClass = await prisma.class.create({
        data: { name, code }
    })

    return newClass
}

export const getAllClassesService = async () => {
    const classes = await prisma.class.findMany()

    return classes
}