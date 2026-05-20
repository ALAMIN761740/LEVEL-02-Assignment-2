import { type Request, type Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
    try {
        const reporterId = req.user.id;

        const result = await issueService.createIssue(
            req.body,
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
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
};

export const issueController = {
    createIssue,
};