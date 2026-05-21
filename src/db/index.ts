import { Pool } from "pg";
import dotenv from "dotenv";
import { AppError } from "../utils/AppError";

dotenv.config();

let _pool: Pool;

if (process.env.DATABASE_URL || process.env.CONNECTION_STRING) {
    _pool = new Pool({
        connectionString: process.env.DATABASE_URL || process.env.CONNECTION_STRING,
    });
} else {
    console.log("No DATABASE_URL or CONNECTION_STRING found — database disabled (queries will return 503)");

    // Provide a stub that throws a 503 AppError on any query to surface a clear error
    // while keeping the same `pool.query` API shape used across the codebase.
    // Cast to `Pool` to avoid changing call sites; queries will reject with AppError.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    _pool = {
        query: async () => {
            throw new AppError(503, "Database not configured (DATABASE_URL/CONNECTION_STRING missing)");
        },
    } as unknown as Pool;
}

export const pool = _pool;