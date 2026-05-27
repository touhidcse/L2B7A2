import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";
import status from "http-status";

const globalErrorHandler = (
    err: any, 
    req:Request, 
    res : Response, 
    next: NextFunction
) => {

        sendResponse(res,{
            statusCode:status.INTERNAL_SERVER_ERROR,
            success: false,
            message: err.message || "Internal Server Error"
        })
}

export default globalErrorHandler;