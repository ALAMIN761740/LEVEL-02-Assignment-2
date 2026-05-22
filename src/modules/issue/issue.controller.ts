import { type Request, type Response } from "express";

import { issueService } from "./issue.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IIssuePayload, IIssueUpdate } from "./issue.interface";
import { AppError } from "../../utils/AppError";

const createIssue = async (req: Request, res: Response) => {
    const { title, description, type } =
        req.body as IIssuePayload;

    if (!title || !description || !type) {
        throw new AppError(400, "All fields are required");
    }

    if (description.length < 20) {
        throw new AppError(400, "Description must be at least 20 characters");
    }

    if (title.length > 150) {
        throw new AppError(400, "Title cannot exceed 150 characters");
    }

    if (
        type !== "bug" &&
        type !== "feature_request"
    ) {
        throw new AppError(400, "Invalid issue type");
    }

    const reporterId = req.user.id as number;

    const created = await issueService.createIssue({ title, description, type }, reporterId);

    // console.log(created);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Issue created successfully",
        data: created,
    });
}

const getAllIssues = async (req: Request, res: Response) => {
    const sort =
        (req.query.sort as string) || "newest";

    const type = req.query.type as string;

    const status = req.query.status as string;

    const result = await issueService.fetchIssues(sort, type, status);
    const formattedData = result.map((issue) => ({

        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,

        reporter: {
            id: issue.reporter_id,
            name: issue.reporter_name,
            role: issue.reporter_role,
        },

        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }));

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Issues retrieved successfully",
        data: formattedData,
    });
}

const getSingleIssue = async (req: Request, res: Response) => {
    const result = await issueService.fetchIssueById(Number(req.params.id));
    if (!result) {
        throw new AppError(404, "Issue not found");
    }

    const formattedData = {
        id: result.id,
        title: result.title,
        description: result.description,
        type: result.type,
        status: result.status,

        reporter: {
            id: result.reporter_id,
            name: result.reporter_name,
            role: result.reporter_role,
        },

        created_at: result.created_at,
        updated_at: result.updated_at,
    };

    sendResponse(res, {
        statusCode: 200,
        success: true,
        data: formattedData,
    });
}
const updateIssue = catchAsync(
    async (req: Request, res: Response) => {
        const issueId = Number(req.params.id);

        const existing = await issueService.fetchIssueById(issueId);
        if (!existing) throw new AppError(404, "Issue not found");

        const user = req.user;

        // contributor rules
        if (user.role === "contributor") {
            if (existing.reporter_id !== user.id) throw new AppError(403, "You can only update your own issues");
            if (existing.status !== "open") throw new AppError(403, "You cannot update non-open issues");
        }

        const updates: IIssueUpdate = {};
        const { title, description, type, status } = req.body as IIssueUpdate;
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (type) updates.type = type;
        if (status && user.role === "maintainer") updates.status = status;

        const updated = await issueService.updateIssueById(issueId, updates);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: updated,
        });
    }
);

const deleteIssue = async (req: Request, res: Response) => {
    const issueId = Number(req.params.id);

    const existing = await issueService.fetchIssueById(issueId);
    if (!existing) throw new AppError(404, "Issue not found");

    const user = req.user;

    // Only maintainer can delete issues per spec
    if (user.role !== "maintainer") {
        throw new AppError(403, "Only maintainers can delete issues");
    }

    await issueService.deleteIssueById(issueId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Issue deleted successfully",
    });
};

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};