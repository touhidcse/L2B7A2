import sendResponse from "../utility/sendResponse";
import status from "http-status";
import jwt, {} from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
const auth = (...roles) => {
    return async (req, res, next) => {
        // console.log(roles)
        try {
            const token = req.headers.authorization;
            if (!token) {
                return sendResponse(res, {
                    statusCode: status.UNAUTHORIZED,
                    success: false,
                    message: "Unauthorized Access"
                });
            }
            ;
            // This try-cathch block for invalid token check
            try {
                const decoded = jwt.verify(token, config.secret);
            }
            catch {
                return sendResponse(res, {
                    statusCode: status.UNAUTHORIZED,
                    success: false,
                    message: "Invalid token"
                });
            }
            const decoded = jwt.verify(token, config.secret);
            // console.log("From auth middleware",decoded);
            const userData = await pool.query(`
                SELECT * FROM users WHERE email=$1

                `, [decoded.email]);
            const user = userData.rows[0];
            if (userData.rows.length === 0) {
                return sendResponse(res, {
                    statusCode: status.NOT_FOUND,
                    success: false,
                    message: "User not found"
                });
            }
            ;
            if (roles.length && !roles.includes(user.role)) {
                return sendResponse(res, {
                    statusCode: status.UNAUTHORIZED,
                    success: false,
                    message: "Unauthorized"
                });
            }
            ;
            req.user = decoded;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default auth;
//# sourceMappingURL=auth.js.map