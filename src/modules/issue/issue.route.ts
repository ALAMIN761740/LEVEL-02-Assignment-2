import express from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/user";



const router = express.Router();



router.post("/", auth, issueController.createIssue);
router.get("/", auth, issueController.getAllIssues);
router.get("/:id", auth, issueController.getSingleIssue);
router.patch("/:id", auth, issueController.updateIssue);
router.delete("/:id", auth, issueController.deleteIssue);



export const issueRoutes = router;