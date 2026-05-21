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

const getAllIssues = async (
    sort: string,
    type?: string,
    status?: string
) => {
    let query = `SELECT * FROM issues`;
    const conditions: string[] = [];
    const values: string[] = [];

    // filtering
    if (type) {
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // sorting
    if (sort === "oldest") {
        query += ` ORDER BY created_at ASC`;
    } else {
        query += ` ORDER BY created_at DESC`;
    }

    // fetch issues
    const issuesResult = await pool.query(query, values);

    const issues = issuesResult.rows;

    // reporter ids
    const reporterIds = [
        ...new Set(issues.map((issue) => issue.reporter_id)),
    ];

    // fetch reporters separately
    let reporters: any[] = [];

    if (reporterIds.length > 0) {
        const reporterQuery = `
      SELECT id, name, role
      FROM users
      WHERE id = ANY($1)
    `;

        const reporterResult = await pool.query(reporterQuery, [reporterIds]);

        reporters = reporterResult.rows;
    }

    // merge reporter data
    const finalIssues = issues.map((issue) => {
        const reporter = reporters.find(
            (user) => user.id === issue.reporter_id
        );

        return {
            ...issue,
            reporter,
        };
    });

    return finalIssues;
};

export const issueService = {
    createIssue,
    getAllIssues,
};