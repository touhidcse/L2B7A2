import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import sendResponse from "../utility/sendResponse";
import status from "http-status";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";


const auth = (...roles: ROLES[]) =>{

    return async (req: Request, res: Response, next: NextFunction) => {

        // console.log(roles)

        try {
            const token = req.headers.authorization;

            if(!token){
                sendResponse(res,{
                    statusCode:status.UNAUTHORIZED,
                    success: false,
                    message: "Unauthorized Access"
                     
                });
            };
            
            const decoded = jwt.verify(
                token as string,
                config.secret as string,
            ) as JwtPayload


            const userData = await pool.query(`
                SELECT * FROM users WHERE email=$1

                `,
                [decoded.email]
            );

            const user = userData.rows[0];

            if(userData.rows.length ===0){
                sendResponse(res,{
                    statusCode:status.NOT_FOUND,
                    success: false,
                    message: "User not found"
                });
            };

            if(roles.length && !roles.includes(user.role)){
                sendResponse(res,{
                    statusCode: status.UNAUTHORIZED,
                    success: false,
                    message: "Unauthorized"
                });
            };

            req.user = decoded;

            next();
            
        } catch (error) {
            next(error);
        }
        
    }
}


export default auth;