const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
        errors: data.errors
    });
};
export default sendResponse;
//# sourceMappingURL=sendResponse.js.map