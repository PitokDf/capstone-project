import { prisma } from "../config/prisma"
import { AppError } from "../utils/errorHandler"

export const loginService = async (email: string) => {
    const findUserEmail = await prisma.user.findFirst({ where: { email }, })

    if (!findUserEmail) throw new AppError("User belum terdaftar.");

    return findUserEmail;
}

export const registerService = async (email: string, username: string, password: string) => {
    const newUser = await prisma.user.create({
        data: {
            email, password, username
        }
    })

    return newUser;
}

export const emailExists = async (email: string) => {
    const user = await prisma.user.findFirst({ where: { email } });
    return user ? true : false
}
export const usernameExists = async (username: string) => {
    const user = await prisma.user.findFirst({ where: { username } });
    return user ? true : false
}
