import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";
import status from "http-status";
const loginUser = async (req, res) => {
    try {
        const result = await authService.loginUserIntoDB(req.body);
        const { token, user } = result;
        res.cookie("token", token, {
            secure: false,
            httpOnly: true,
            sameSite: "lax"
        });
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Login successful",
            data: {
                token,
                user
            }
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
export const authController = {
    loginUser,
};
//# sourceMappingURL=auth.controller.js.map