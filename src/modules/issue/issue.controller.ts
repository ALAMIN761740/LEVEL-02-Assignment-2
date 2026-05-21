import { type Request, type Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
    try {
        const { title, description, type } = req.body;


        if (!title || !description || !type) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (description.length < 20) {
            return res.status(400).json({
                success: false,
                message: "Description must be at least 20 characters",
            });
        }

        if (title.length > 150) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 150 characters",
            });
        }

        if (
            type !== "bug" &&
            type !== "feature_request"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue type",
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








const getAllIssues = async (req: Request, res: Response) => {
    try {
        const sort = (req.query.sort as string) || "newest";

        const type = req.query.type as string;

        const status = req.query.status as string;

        const result = await issueService.getAllIssues(
            sort,
            type,
            status
        );

        res.status(200).json({
            success: true,
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







const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const issueId = Number(req.params.id);

        const result = await issueService.getSingleIssue(issueId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                error instanceof Error ? error.message : "Something went wrong",
        });
    }
};









const updateIssue = async (
    req: Request,
    res: Response
) => {
    try {
        const issueId = Number(req.params.id);

        const result =
            await issueService.updateIssue(
                issueId,
                req.body,
                req.user
            );

        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};







const deleteIssue = async (
    req: Request,
    res: Response
) => {
    try {
        const issueId = Number(req.params.id);

        await issueService.deleteIssue(
            issueId,
            req.user.role
        );

        res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};








export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};