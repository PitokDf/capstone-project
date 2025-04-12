import { Response } from "express";

export class AppError extends Error {
    public errors?: any[];

    constructor(messsage: string, errors?: any[]) {
        super(messsage)
        this.errors = errors

        Object.setPrototypeOf(this, AppError.prototype)
        Error.captureStackTrace(this, this.constructor)
    }
}

export const handlerAnyError = (error: any, res: Response) => {
    if (error instanceof AppError) {
        return res.status(400).json({
            message: error.message,
            errors: error.errors
        })
    }
    console.log(error.message);

    return res.status(500).json({
        message: "Internal server error"
    })
}