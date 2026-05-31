import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";
import status from "http-status";
const registerUser = async (req, res) => {
    try {
        const result = await userService.registerUserIntoDB(req.body);
        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "User registered successfull",
            data: result.rows[0]
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: status.BAD_REQUEST,
            success: false,
            message: error.message,
            errors: error.detail
        });
    }
};
export const userController = {
    registerUser,
};
//# sourceMappingURL=user.controller.js.map