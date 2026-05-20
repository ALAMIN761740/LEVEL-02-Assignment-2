import { type Request, type Response } from "express";
import { authService } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.signupUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
};




const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUser(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
};

export const authController = {
    signupUser,
    loginUser,
};