import type { Request, Response } from "express"
import { issueService } from "./issue.service"
import sendResponse from "../../utility/sendResponse";
import status from "http-status";
import { type JwtPayload } from "jsonwebtoken";


const createIssue = async (req: Request, res: Response) => {
    // console.log(req.body);
    try {
        const reporter_id = (req.user as JwtPayload).id;

        // console.log(reporter_id);
        const result = await issueService.createIssueIntoDB(req.body, reporter_id);
        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: status.UNAUTHORIZED,
            success: false,
            message: "Unauthorized access",
            // errors: error

        })
    }
}


export const issueController = {
    createIssue,
}






