import express from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/auth";



const router = express.Router();



router.post("/", auth, issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id", auth, issueController.updateIssue);
// cast factory middleware to `any` to satisfy Express typings
router.delete("/:id", (auth('maintainer') as unknown) as any, issueController.deleteIssue);



export const issueRoutes = router;