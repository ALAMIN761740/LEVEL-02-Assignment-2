import express from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/auth";



const router = express.Router();



router.post("/", auth, issueController.createIssue);



export const issueRoutes = router;