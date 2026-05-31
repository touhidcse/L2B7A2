import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";
import status from "http-status";
import {} from "jsonwebtoken";
// 3. Create issue
const createIssue = async (req, res) => {
    // console.log(req.body);
    try {
        const reporter_id = req.user.id;
        // console.log(reporter_id);
        const result = await issueService.createIssueIntoDB(req.body, reporter_id);
        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: status.UNAUTHORIZED,
            success: false,
            message: error.message,
            errors: error.error
        });
    }
};
// Get all issues
const getAllIssues = async (req, res) => {
    try {
        const result = await issueService.getAllIssuesFromDB(req.query);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Issues retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: status.BAD_REQUEST,
            success: false,
            message: error.message,
            errors: error.message
        });
    }
};
// 5. Get single issue
const getSingleIssue = async (req, res) => {
    try {
        const id = Number(req.params.id);
        // console.log(id);
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
    }
    catch (error) {
        return sendResponse(res, {
            statusCode: status.NOT_FOUND,
            success: false,
            message: error.message,
            errors: error.message,
        });
    }
};
// 6. Update Issue
const updateIssue = async (req, res) => {
    try {
        const issueId = Number(req.params.id);
        const user = req.user;
        const result = await issueService.updateIssueIntoDB(req.body, issueId, user.id, user.role);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Issue updated successfully",
            data: result,
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: status.FORBIDDEN,
            success: false,
            message: error.message,
            errors: error.message,
        });
    }
};
// 7. Delete Issue
const deleteIssue = async (req, res) => {
    try {
        const issueId = Number(req.params.id);
        const result = await issueService.deleteIssueFromDB(issueId);
        // console.log('from delete portion of issue controller',result);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Issue deleted successfully"
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: status.FORBIDDEN,
            success: false,
            message: error.message,
        });
    }
};
export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
};
//# sourceMappingURL=issue.controller.js.map