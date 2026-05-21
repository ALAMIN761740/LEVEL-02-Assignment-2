import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

export const config = {
    port: process.env.PORT || 5000,
    connectionString: (process.env.DATABASE_URL || process.env.CONNECTION_STRING) as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET?.trim() as string,
};