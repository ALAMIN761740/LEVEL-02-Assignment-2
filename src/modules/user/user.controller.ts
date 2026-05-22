import { type Request, type Response } from "express";
import { authService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";

const isEmail = (email: unknown) => {
    if (typeof email !== "string") return false;
    return /^\S+@\S+\.\S+$/.test(email);
};

const signupUser = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body as {
        name?: string;
        email?: string;
        password?: string;
        role?: string;
    };

    if (!name || !email || !password) {
        throw new AppError(400, "name, email and password are required");
    }

    if (!isEmail(email)) {
        throw new AppError(400, "Invalid email format");
    }

    if (typeof password !== "string" || password.length < 6) {
        throw new AppError(400, "Password must be at least 6 characters");
    }

    if (role && role !== "contributor" && role !== "maintainer") {
        throw new AppError(400, "role must be 'contributor' or 'maintainer'");
    }

    const userRole = (role as "contributor" | "maintainer") || undefined;
    const result = await authService.signupUser({ name, email, password, role: userRole });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
        throw new AppError(400, "email and password are required");
    }

    if (!isEmail(email)) {
        throw new AppError(400, "Invalid email format");
    }

    const result = await authService.loginUser({ email, password });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: result,
    });
});

export const authController = {
    signupUser,
    loginUser,
};
