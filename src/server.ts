import app from "./app";
import { pool } from "./db";
import { initDB } from "./db/init";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        if (process.env.DATABASE_URL || process.env.CONNECTION_STRING) {
            await pool.query("SELECT NOW()");
            console.log("Database connected");

            await initDB();
        } else {
            console.log("No DATABASE_URL or CONNECTION_STRING found — skipping DB connection");
        }

        if (!process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error(error);
    }
};

if (!process.env.VERCEL) {
    startServer();
}

export default app;
// Ensure CommonJS consumers (like @vercel/node) can use the exported app
// @ts-ignore
(module as any).exports = app;