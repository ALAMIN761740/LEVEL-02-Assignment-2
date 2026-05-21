import {
    type NextFunction,
    type Request,
    type Response,
} from "express";

import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Something went wrong";

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof Error) {
        message = error.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};