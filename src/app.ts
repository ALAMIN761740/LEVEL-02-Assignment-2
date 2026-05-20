import express from "express";
import cors from "cors";
import { authRoutes } from "./modules/auth/auth.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LEVEL  2 assignment 2",
    });
});

app.use("/api/auth", authRoutes);

export default app;