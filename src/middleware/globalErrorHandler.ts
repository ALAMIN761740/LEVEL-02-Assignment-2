import {
    type NextFunction,
    type Request,
    type Response,
} from "express";

export const globalErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(400).json({
        success: false,
        message: error.message || "Something went wrong",
    });
};