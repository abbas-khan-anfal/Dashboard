
const ErrorResponse = (res, message = 'Internal Server Error', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message: message
    })
}

export default ErrorResponse;