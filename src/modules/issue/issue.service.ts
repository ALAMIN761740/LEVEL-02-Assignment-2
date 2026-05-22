import { pool } from "../../db";
import type { IIssuePayload, IIssueUpdate, IIssue } from "./issue.interface";

const createIssue = async (payload: IIssuePayload, reporterId: number) => {
    const { title, description, type } = payload;

    const result = await pool.query(
        `INSERT INTO issues(title, description, type, reporter_id) VALUES($1, $2, $3, $4) RETURNING *`,
        [title, description, type, reporterId]
    );

    return result.rows[0] as IIssue;
};

const fetchIssues = async (sort: string, type?: string, status?: string) => {
    let query = `SELECT * FROM issues`;
    const conditions: string[] = [];
    const values: (string | number)[] = [];

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

    if (sort === "oldest") query += ` ORDER BY created_at ASC`;
    else query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows as IIssue[];
};

const fetchIssueById = async (id: number) => {
    const result = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);
    return result.rows[0] as IIssue | undefined;
};

const fetchUsersByIds = async (ids: number[]) => {
    if (ids.length === 0) return [];
    const result = await pool.query(`SELECT id, name, role FROM users WHERE id = ANY($1)`, [ids]);
    return result.rows as { id: number; name: string; role: string }[];
};

const fetchUserById = async (id: number) => {
    const result = await pool.query(`SELECT id, name, role FROM users WHERE id = $1`, [id]);
    return result.rows[0] as { id: number; name: string; role: string } | undefined;
};

const updateIssueById = async (issueId: number, updates: IIssueUpdate) => {
    const updatesArr: string[] = [];
    const values: (string | number)[] = [];

    if (updates.title) {
        values.push(updates.title);
        updatesArr.push(`title = $${values.length}`);
    }

    if (updates.description) {
        values.push(updates.description);
        updatesArr.push(`description = $${values.length}`);
    }

    if (updates.type) {
        values.push(updates.type);
        updatesArr.push(`type = $${values.length}`);
    }

    if (updates.status) {
        values.push(updates.status);
        updatesArr.push(`status = $${values.length}`);
    }

    updatesArr.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(issueId);

    const query = `UPDATE issues SET ${updatesArr.join(", ")} WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] as IIssue;
};

const deleteIssueById = async (issueId: number) => {
    await pool.query(`DELETE FROM issues WHERE id = $1`, [issueId]);
    return null;
};

export const issueService = {
    createIssue,
    fetchIssues,
    fetchIssueById,
    fetchUsersByIds,
    fetchUserById,
    updateIssueById,
    deleteIssueById,
};
