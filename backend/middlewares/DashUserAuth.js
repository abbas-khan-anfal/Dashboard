import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';
import UserModel from '../models/Users/DashUserModel.js';

const isDashboardUserAuthenticated = async (req, res, next) => {
    try
    {
        const { dash_token } = req.cookies;

        if(!dash_token)
        {
            return res.status(401).json({
                success : false,
                message : "You are not loged in"
            });
        }

        const decodedData = jwt.verify(dash_token, process.env.JWT_SECRET);

        const dashUser = await UserModel.findById(decodedData.dashUserId);

        if(!dashUser)
        {
            return res.status(401).json({
                success : false,
                message : "Invalid or expired token"
            });
        }

        req.dashUser = dashUser;
        next();
    }
    catch(error)
    {
        res.status(500).json({
            success : false,
            message : "Invalid or expired token"
        })
    }
}

export default isDashboardUserAuthenticated;