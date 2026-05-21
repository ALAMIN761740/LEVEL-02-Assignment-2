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

    let reporters: {
        id: number;
        name: string;
        role: string;
    }[] = [];

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






const getSingleIssue = async (id: number) => {
    // fetch issue
    const issueResult = await pool.query(
        `
      SELECT * FROM issues
      WHERE id = $1
    `,
        [id]
    );

    const issue = issueResult.rows[0];

    // issue not found
    if (!issue) {
        throw new Error("Issue not found");
    }

    // fetch reporter
    const reporterResult = await pool.query(
        `
      SELECT id, name, role
      FROM users
      WHERE id = $1
    `,
        [issue.reporter_id]
    );

    const reporter = reporterResult.rows[0];

    // merge data
    return {
        ...issue,
        reporter,
    };
};






const updateIssue = async (
    issueId: number,
    payload: {
        title?: string;
        description?: string;
        type?: "bug" | "feature_request";
        status?: "open" | "in_progress" | "resolved";
    },
    user: {
        id: number;
        role: string;
    }
) => {
    // find issue
    const issueResult = await pool.query(
        `
      SELECT * FROM issues
      WHERE id = $1
    `,
        [issueId]
    );

    const issue = issueResult.rows[0];

    // issue not found
    if (!issue) {
        throw new Error("Issue not found");
    }

    // contributor rules
    if (user.role === "contributor") {
        // own issue check
        if (issue.reporter_id !== user.id) {
            throw new Error(
                "You can only update your own issues"
            );
        }

        // status check
        if (issue.status !== "open") {
            throw new Error(
                "You cannot update non-open issues"
            );
        }
    }

    // dynamic fields
    const updates: string[] = [];
    const values: (
        | string
        | number
    )[] = [];

    if (payload.title) {
        values.push(payload.title);
        updates.push(`title = $${values.length}`);
    }

    if (payload.description) {
        values.push(payload.description);
        updates.push(`description = $${values.length}`);
    }

    if (payload.type) {
        values.push(payload.type);
        updates.push(`type = $${values.length}`);
    }

    // maintainer can update status
    if (
        payload.status &&
        user.role === "maintainer"
    ) {
        values.push(payload.status);
        updates.push(`status = $${values.length}`);
    }

    // updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // issue id
    values.push(issueId);

    const query = `
    UPDATE issues
    SET ${updates.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

    const result = await pool.query(query, values);

    return result.rows[0];
};











export const issueService = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
};