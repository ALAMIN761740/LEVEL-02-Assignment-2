import { pool } from "../../db";

const createIssue = async (
    payload: {
        title: string;
        description: string;
        type: "bug" | "feature_request";
    },
    reporterId: number
) => {
    const { title, description, type } = payload;

    const result = await pool.query(
        `
      INSERT INTO issues(title, description, type, reporter_id)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `,
        [title, description, type, reporterId]
    );

    return result.rows[0];
};

export const issueService = {
    createIssue,
};