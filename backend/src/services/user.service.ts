import { prisma } from "../config/prisma"

export const getAllUserService = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            username: "asc"
        }
    })

    return users;
}