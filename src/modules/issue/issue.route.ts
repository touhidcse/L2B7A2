import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";
import {USER_ROLE } from "../../types";


const router = Router()


router.post('/issues',auth(USER_ROLE.maintainer,USER_ROLE.contributor),issueController.createIssue)

router.get("/issues", issueController.getAllIssues);

router.get('/issues/:id',issueController.getSingleIssue)

router.patch('/issues/:id',auth(USER_ROLE.maintainer, USER_ROLE.contributor), issueController.updateIssue)

router.delete('/issues/:id',auth(USER_ROLE.maintainer),issueController.deleteIssue)

export const issueRouter = router;