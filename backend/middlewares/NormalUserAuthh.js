import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import UserModel from '../models/Users/DashUserModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const isUserAuthenticated = async (req, res, next) => {
    try
    {
        const { user_token } = req.cookies;

        if(!user_token)
        {
            return ErrorResponse(res, "Please login to continue", 404);
        }

        const decodedData = jwt.verify(user_token, process.env.JWT_SECRET);

        const user = await UserModel.findById(decodedData.userId);

        if(!user)
        {
            return ErrorResponse(res, "Please login to continue", 404);
        }

        req.user = user;
        next();
    }
    catch(error)
    {
        return ErrorResponse(res, "Invalid or expired token", 500);
    }
}

export default isUserAuthenticated;