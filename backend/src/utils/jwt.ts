import { sign } from "jsonwebtoken";

export const generateToken = async (payload: Record<string, string | number | Date>) => {
    const token = sign(payload, process.env.JWT_SECREET ?? "123456", { algorithm: "HS256", expiresIn: "1d" })

    return token;
}