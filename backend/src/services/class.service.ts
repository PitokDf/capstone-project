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

export const deleteClassService = async (id: number) => {
    const deletedClass = await prisma.class.delete({ where: { id } })
    return deletedClass
}

export const updateClassService = async (id: number, name: string, code: string) => {
    const updatedClass = await prisma.class.update({
        where: { id },
        data: { name, code }
    })

    return updatedClass
}