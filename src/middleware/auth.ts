import {
    type NextFunction,
    type Request,
    type Response,
} from "express";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
    id: number;
    name: string;
    role: string;
}

export const auth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization;

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server misconfiguration: JWT_SECRET is not set",
            });
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};