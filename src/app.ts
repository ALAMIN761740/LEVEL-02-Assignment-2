import express from "express";
import cors from "cors";
import { authRoutes } from "./modules/user/user.route";
import { issueRoutes } from "./modules/issue/issue.route";
// global error handler removed per instructions




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
app.use("/api/issues", issueRoutes);
// global error handler removed



export default app;