import { type Request, type Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
    try {
        const { title, description, type } = req.body;

        // basic validation
        if (!title || !description || !type) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const reporterId = req.user.id;

        const result = await issueService.createIssue(
            { title, description, type },
            reporterId
        );

        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message:
                error instanceof Error ? error.message : "Something went wrong",
        });
    }
};

export const issueController = {
    createIssue,
};