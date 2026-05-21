import { type Request, type Response } from "express";

import { issueService } from "./issue.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createIssue = catchAsync(
    async (req: Request, res: Response) => {
        const { title, description, type } =
            req.body;

        if (!title || !description || !type) {
            throw new Error("All fields are required");
        }

        if (description.length < 20) {
            throw new Error(
                "Description must be at least 20 characters"
            );
        }

        if (title.length > 150) {
            throw new Error(
                "Title cannot exceed 150 characters"
            );
        }

        if (
            type !== "bug" &&
            type !== "feature_request"
        ) {
            throw new Error("Invalid issue type");
        }

        const reporterId = req.user.id;

        const result =
            await issueService.createIssue(
                {
                    title,
                    description,
                    type,
                },
                reporterId
            );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result,
        });
    }
);

const getAllIssues = catchAsync(
    async (req: Request, res: Response) => {
        const sort =
            (req.query.sort as string) || "newest";

        const type = req.query.type as string;

        const status = req.query.status as string;

        const result =
            await issueService.getAllIssues(
                sort,
                type,
                status
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: result,
        });
    }
);

const getSingleIssue = catchAsync(
    async (req: Request, res: Response) => {
        const issueId = Number(req.params.id);

        const result =
            await issueService.getSingleIssue(issueId);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: result,
        });
    }
);

const updateIssue = catchAsync(
    async (req: Request, res: Response) => {
        const issueId = Number(req.params.id);

        const result =
            await issueService.updateIssue(
                issueId,
                req.body,
                req.user
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result,
        });
    }
);

const deleteIssue = catchAsync(
    async (req: Request, res: Response) => {
        const issueId = Number(req.params.id);

        await issueService.deleteIssue(
            issueId,
            req.user.role
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully",
        });
    }
);

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};