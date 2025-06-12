import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const jwtCheckToken = (req: Request, res: Response, next: NextFunction) => {
    // const token = req.headers.cookie?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1] ?? null;
    const authHeader = req.headers?.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token required' });
    }
    const token = authHeader.substring(7);

    const JWT_SECRET = process.env.JWT_SECREET || "123456";

    verify(token, JWT_SECRET, {
        algorithms: ["HS256"]
    }, (err, decode) => {
        if (err) {
            console.log(err);

            return res.status(401).json({ message: "Token invalid atau sudah kadaluarsa." })
        }
        (req as any).user = decode

        next()
    });

}