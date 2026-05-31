import sendResponse from "../utility/sendResponse";
import status from "http-status";
const globalErrorHandler = (err, req, res, next) => {
    sendResponse(res, {
        statusCode: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: err.message || "Internal Server Error"
    });
};
export default globalErrorHandler;
//# sourceMappingURL=globalErrrorHnadler.js.map