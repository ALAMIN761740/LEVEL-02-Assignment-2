import express from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/auth";



const router = express.Router();



router.post("/", auth, issueController.createIssue);
router.get("/", issueController.getAllIssues);



export const issueRoutes = router;