import type { Request, Response } from "express"
import { issueService } from "./issue.service"
import sendResponse from "../../utility/sendResponse";
import status from "http-status";
import { type JwtPayload } from "jsonwebtoken";
import type { IGetIssuesQuery } from "./issue.interface";


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


const getAllIssues = async (
  req: Request<{}, {}, {}, IGetIssuesQuery>,
  res: Response
) => {
  try {
    const result = await issueService.getAllIssuesFromDB(req.query);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error : any) {

    sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};


export const issueController = {
    createIssue,
    getAllIssues
}






