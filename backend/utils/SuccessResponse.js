
const SuccessResponse = (res, message, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message: message
    })
}

export default SuccessResponse;