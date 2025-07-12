import DashUserModel from '../../models/Users/DashUserModel.js'
import bcrypt from 'bcrypt';
import SaveDashCookie from '../../utils/SaveDashCookie.js';
import path from 'path';
import mongoose from 'mongoose';
import validator from 'validator';
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';
import { v2 as cloudinary } from 'cloudinary';


const deleteFile = async (publicId) => {
    if(publicId)
    {
        try
        {
            const result = await cloudinary.uploader.destroy(publicId);
            if(result.result === 'ok')
            {
                console.log(`File deleted successfully`);
            }
            return;
        }
        catch(error)
        {
            console.log(`Error deleting file : `, error);
        }
    }
};


// function for signup new user
export const signup = async (req, res) => {
    try
    {
        const { username, email, password, role } = req.body;

        if(!req.dashUser)
        {
            return ErrorResponse(res, "You are not authorized to perform this action", 401);
        }
        else if(req.dashUser.role !== "admin")
        {
            return ErrorResponse(res, "You are not authorized to perform this action", 401);
        }

        const isAdminExist = await DashUserModel.findOne({ _id : req.dashUser._id, role : "admin" });
        if(!isAdminExist)
        {
            return ErrorResponse(res, "You are not authorized to perform this action", 401);
        }

        if(username.trim() == "" || email.trim() == "" || password.trim() == "" || role == "")
        {
            return ErrorResponse(res, "All fields are required", 400);
        }

        // validate the email
        if(!validator.isEmail(email))
        {
            return ErrorResponse(res, "Invalid email", 400);
        }

        // validate the password to 8 caracters
        if(!validator.isLength(password, { min : 8 }))
        {
            return ErrorResponse(res, "Password must be at least 8 characters", 400);
        }

        // validate the username
        if(!validator.isLength(username, { min : 3, max : 10 }))
        {
            return ErrorResponse(res, "Username must be between 3 and 10 characters", 400);
        }

        const isUserExist = await DashUserModel.findOne({ email : email });

        if(isUserExist)
        {
            return ErrorResponse(res, "User already exist", 400);
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await DashUserModel.create({
            username : username.toLowerCase(),
            email : email.toLowerCase(),
            password : encryptedPassword,
            role : role || "user"
        });

        return SuccessResponse(res, "Signup successfull", 200);

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}


// function for login user
export const login = async (req, res) => {
    try
    {
        const { email, password } = req.body;

        if(email.trim() == "" || password.trim() == "")
        {
            return ErrorResponse(res, "All fields are required", 400);
        }

        // validate email with validator
        if(!validator.isEmail(email))
        {
            return ErrorResponse(res, "Invalid email", 400);
        }

        const isUserExist = await DashUserModel.findOne({ email : email.toLowerCase() });

        if(!isUserExist)
        {
            return ErrorResponse(res, "Incorrect email or password", 400);
        }

        const isMatch = await bcrypt.compare(password, isUserExist.password);

        if(!isMatch)
        {
            return ErrorResponse(res, "Incorrect Password", 400);
        }

        return SaveDashCookie(res, isUserExist._id, "Login successfull", 200);

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}


// function to logout user
export const logout = (req, res) => {
    return res.cookie('dash_token', '', {
        httpOnly : true,
        expires : new Date(0),
        secure: true, // Required for HTTPS
        sameSite: 'None', // Required for cross-site cookies
    }).status(200).json({
        success : true,
        message : "Logout successfull"
    })
}

// function to get user details
export const getUserDetails = async (req, res) => {
    try
    {

        if(!req.dashUser)
        {
            return ErrorResponse(res, "User not found", 404);
        }

        const isAdminExist = await DashUserModel.findById(req.dashUser._id).select("-password");

        if(!isAdminExist)
        {
            return ErrorResponse(res, "User not found", 404);
        }

        return res.status(200).json({
            success : true,
            user : isAdminExist
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}


// function to update user by admin
export const updateUser = async (req, res) => {
    try
    {
        const { username, id, bio, role } = req.body;
        const file = req.file || {};

        if(!mongoose.isValidObjectId(id))
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "User does not exist", 400);
        }

        // validate the username
        if(!validator.isLength(username, { min : 3, max : 10 }))
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "Username must be between 3 and 10 characters", 400);
        }
        
        if(!validator.isLength(bio, { max : 50 }))
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "Bio must be less than 50 characters", 400);
        }

        const trimmedUserName = username.trim().toLowerCase();

        if(trimmedUserName === "")
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "Username cannot be empty", 400);
        }

        const user = await DashUserModel.findById(id);

        if(!user)
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "User does not exist", 404);
        }

        if(trimmedUserName && user.username !== trimmedUserName)
        {
            user.username = trimmedUserName;
        }

        if(bio.trim() !== "" && user.bio !== bio)
        {
            user.bio = bio;
        }
        if(role.trim() !== "" && user.role !== role)
        {
            user.role = role;
        }

        if (file?.filename && file?.path) {
            const oldImgPubId = user.userImgPubId;
            
            if (oldImgPubId) {
                try {
                    await deleteFile(oldImgPubId);
                } catch (error) {
                    console.error("Error deleting old image:", error);
                }
            }
        
            user.userImgPath = file.path;
            user.userImgPubId = file.filename;
        }        
        

        await user.save();

        return SuccessResponse(res, "User updated successfully", 200);

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

// function to edit profile by user
export const editUserProfile = async (req, res) => {
    try
    {
        const { username, id, bio } = req.body;
        const file = req.file || {};

        if(!mongoose.isValidObjectId(id))
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "User does not exist", 400);
        }

        // validate the username
        if(!validator.isLength(username, { min : 3, max : 10 }))
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "Username must be between 3 and 10 characters", 400);
        }
        
        if(!validator.isLength(bio, { max : 50 }))
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "Bio must be less than 50 characters", 400);
        }

        const trimmedUserName = username.trim().toLowerCase();

        if(trimmedUserName === "")
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "Username cannot be empty", 400);
        }

        const user = await DashUserModel.findById(id);

        if(!user)
        {
            // check if file exist call deleted func
            if(file?.filename)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "User does not exist", 404);
        }

        if(trimmedUserName && user.username !== trimmedUserName)
        {
            user.username = trimmedUserName;
        }

        if(bio.trim() !== "" && user.bio !== bio)
        {
            user.bio = bio;
        }

        if (file?.filename && file?.path) {
            const oldImgPubId = user.userImgPubId;
            
            if (oldImgPubId) {
                try {
                    await deleteFile(oldImgPubId);
                } catch (error) {
                    console.error("Error deleting old image:", error);
                }
            }
        
            user.userImgPath = file.path;
            user.userImgPubId = file.filename;
        }        
        

        await user.save();

        return SuccessResponse(res, "Your profile updated", 200);

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

// function to fetch all users
export const fetchAllUsers = async (req, res) => {
    try
    {
        const page = req.query.page || 1;
        const limit = req.query.limit || 3;
        const skip = (page - 1) * limit;
        const users = await DashUserModel.find({})
        .sort({ _id : 1 })
        .skip(skip)
        .limit(limit);

        const totalDocs = await DashUserModel.countDocuments();
        const totalPages = Math.ceil(totalDocs / limit);

        return res.status(200).json({
            success : true,
            users,
            totalPages,
            currentPage : page
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}


// function to delete user
export const deleteUser = async (req, res) => {
    try
    {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id))
        {
            return ErrorResponse(res, "User does not exist", 400);
        }

        const user = await DashUserModel.findById(id);

        if(!user)
        {
            return ErrorResponse(res, "User does not exist", 404);
        }

        const oldImgPubId = user?.userImgPubId;
        if(oldImgPubId)
        {
            await deleteFile(oldImgPubId);
        }

        await user.deleteOne();

        return SuccessResponse(res, "User deleted successfully", 200);

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

// function to fetch single user
export const fetchSingleUser = async (req, res) => {
    try
    {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id))
        {
            return ErrorResponse(res, "User does not exist", 400);
        }

        const user = await DashUserModel.findById(id);

        if(!user)
        {
            return ErrorResponse(res, "User does not exist", 404);
        }

        res.status(200).json({
            success : true,
            user
        });

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}
