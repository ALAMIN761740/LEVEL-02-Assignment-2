export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";

export interface IIssuePayload {
    title: string;
    description: string;
    type: IssueType;
}

export interface IIssue {
    id: number;
    title: string;
    description: string;
    type: IssueType;
    status: IssueStatus;
    reporter_id: number;
    created_at: string;
    updated_at: string;
    reporter?: {
        id: number;
        reporter_name: string;
        reporter_role: string;
    } | null;
}

export interface IIssueUpdate {
    title?: string;
    description?: string;
    type?: IssueType;
    status?: IssueStatus;
}
