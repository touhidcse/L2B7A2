import type { Request, Response } from "express"
import { issueService } from "./issue.service"
import sendResponse from "../../utility/sendResponse";
import status from "http-status";
import { type JwtPayload } from "jsonwebtoken";
import type { IGetIssuesQuery } from "./issue.interface";


// 3. Create issue

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

// Get all issues

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

// 5. Get single issue


const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
console.log(id);
    if (isNaN(id)) {
      return sendResponse(res, {
        statusCode: status.BAD_REQUEST,
        success: false,
        message: "Invalid issue id",
        errors: "ID must be a number",
      });
    }

    const result = await issueService.getSingleIssueFromDB(id);

    return sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: status.NOT_FOUND,
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};



export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
}






