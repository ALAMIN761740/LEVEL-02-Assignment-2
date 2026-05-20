import app from "./app";
import { pool } from "./db";
import { initDB } from "./db/init";

const PORT = 5000;

const startServer = async () => {
    try {
        await pool.query("SELECT NOW()");

        console.log("Database connected");

        await initDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();