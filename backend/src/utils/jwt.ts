import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECREET || "123456";
export const generateToken = async (payload: Record<string, string | number | Date>) => {
    console.log(JWT_SECRET);

    const token = sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "30d" })

    return token;
}