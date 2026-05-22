import { type Request, type Response } from "express";

import { issueService } from "./issue.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IIssuePayload, IIssueUpdate } from "./issue.interface";

const createIssue = catchAsync(
    async (req: Request, res: Response) => {
        const { title, description, type } =
            req.body as IIssuePayload;

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

        const reporterId = req.user.id as number;

        const created = await issueService.createIssue({ title, description, type }, reporterId);

        const reporter = await issueService.fetchUserById(reporterId);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: { ...created, reporter },
        });
    }
);

const getAllIssues = catchAsync(
    async (req: Request, res: Response) => {
        const sort =
            (req.query.sort as string) || "newest";

        const type = req.query.type as string;

        const status = req.query.status as string;

        const issues = await issueService.fetchIssues(sort, type, status);

        const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];
        const reporters = await issueService.fetchUsersByIds(reporterIds);

        const finalIssues = issues.map((issue) => ({
            ...issue,
            reporter: reporters.find((r) => r.id === issue.reporter_id) || null,
        }));

        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: finalIssues,
        });
    }
);

const getSingleIssue = catchAsync(
    async (req: Request, res: Response) => {
        const issueId = Number(req.params.id);

        const issue = await issueService.fetchIssueById(issueId);

        if (!issue) throw new Error("Issue not found");

        const reporter = await issueService.fetchUserById(issue.reporter_id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: { ...issue, reporter },
        });
    }
);

const updateIssue = catchAsync(
    async (req: Request, res: Response) => {
        const issueId = Number(req.params.id);

        const existing = await issueService.fetchIssueById(issueId);
        if (!existing) throw new Error("Issue not found");

        const user = req.user;

        // contributor rules
        if (user.role === "contributor") {
            if (existing.reporter_id !== user.id) throw new Error("You can only update your own issues");
            if (existing.status !== "open") throw new Error("You cannot update non-open issues");
        }

        const updates: IIssueUpdate = {};
        const { title, description, type, status } = req.body as IIssueUpdate;
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (type) updates.type = type;
        if (status && user.role === "maintainer") updates.status = status;

        const updated = await issueService.updateIssueById(issueId, updates);

        const reporter = await issueService.fetchUserById(updated.reporter_id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: { ...updated, reporter },
        });
    }
);

const deleteIssue = catchAsync(
    async (req: Request, res: Response) => {
        const issueId = Number(req.params.id);

        const user = req.user;
        if (user.role !== "maintainer") throw new Error("Only maintainers can delete issues");

        const existing = await issueService.fetchIssueById(issueId);
        if (!existing) throw new Error("Issue not found");

        await issueService.deleteIssueById(issueId);

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