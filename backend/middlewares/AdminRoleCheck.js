import ErrorResponse from "../utils/ErrorResponse.js";

export const AdminRoleCheck = (req, res, next) => {
    try
    {
        const user = req.dashUser;

        if(user.role !== "admin")
        {
            return ErrorResponse(res, "You are not authorized to access this route", 401);
        }

        next();
    }
    catch(err)
    {
        return ErrorResponse(res, err.message, 500);
    }
}