import NormalUserModel from '../../models/Users/NormalUserModel.js';
import bcrypt from 'bcrypt';
import SaveNormalUserCookie from '../../utils/SaveNormalUserCookie.js';
import path from 'path';
import mongoose from 'mongoose';
import validator from 'validator';
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';


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
        const { username, email, password } = req.body;

        if(username.trim() == "" || email.trim() == "" || password.trim() == "")
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

        const isUserExist = await NormalUserModel.findOne({ email : email });

        if(isUserExist)
        {
            return ErrorResponse(res, "User already exist", 400);
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await NormalUserModel.create({
            username : username.toLowerCase(),
            email : email.toLowerCase(),
            password : encryptedPassword,
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
            // return ErrorResponse(res, "All fields are required", 400);
            return res.status(400).json({
                success : false,
                message : "All fields are required",
                field : "all"
            });
        }

        // validate email with validator
        if(!validator.isEmail(email))
        {
            // return ErrorResponse(res, "Invalid email", 400);
            return res.status(400).json({
                success : false,
                message : "Invalid email",
                field : "email"
            });
        }

        const isUserExist = await NormalUserModel.findOne({ email : email.toLowerCase() });

        if(!isUserExist)
        {
            // return ErrorResponse(res, "Incorrect email or password", 400);
            return res.status(400).json({
                success : false,
                message : "Incorrect email or password",
                field : "both"
            });

        }

        const isMatch = await bcrypt.compare(password, isUserExist.password);

        if(!isMatch)
        {
            // return ErrorResponse(res, "Incorrect Password", 400);
            return res.status(400).json({
                success : false,
                message : "Incorrect Password",
                field : "password"
            });
        }

        return SaveNormalUserCookie(res, isUserExist._id, "Login successfull", 200);

    }
    catch(error)
    {
        // return ErrorResponse(res, error.message, 500);
        return res.status(500).json({
            success : false,
            message : error.message,
            field : "server"
        });
    }
}


// function to logout user
export const logout = (req, res) => {
    return res.cookie('user_token', '', {
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

        if(!req.user)
        {
            return ErrorResponse(res, "User not found", 404);
        }

        const user = await NormalUserModel.findById(req.user._id).select("-password");

        if(!user)
        {
            return ErrorResponse(res, "User not found", 404);
        }

        return res.status(200).json({
            success : true,
            user : user
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}


// function to update user
export const updateUser = async (req, res) => {
    try
    {
        const { username, id, bio } = req.body;
        const file = req.file || {};

        if(!mongoose.isValidObjectId(id))
        {
            // check if file exist call deleted func
            if(Object.keys(file).length > 0)
            {
                await deleteFile(file.filename);
            }

            return ErrorResponse(res, "User does not exist", 400);
        }

        // validate the username
        if(!validator.isLength(username, { min : 3, max : 10 }))
        {
            // check if file exist call deleted func
            if(Object.keys(file).length > 0)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "Username must be between 3 and 10 characters", 400);
        }

        if(!validator.isLength(bio, { max : 50 }))
        {
            // check if file exist call deleted func
            if(Object.keys(file).length > 0)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "Bio must be less than 50 characters", 400);
        }

        const trimmedUserName = username.trim().toLowerCase();

        if(trimmedUserName === "")
        {
            // check if file exist call deleted func
            if(Object.keys(file).length > 0)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "Username cannot be empty", 400);
        }

        const user = await NormalUserModel.findById(id);

        if(!user)
        {
            // check if file exist call deleted func
            if(Object.keys(file).length > 0)
            {
                await deleteFile(file.filename);
            }
            return ErrorResponse(res, "User does not exist", 404);
        }

        if(trimmedUserName && user.username !== trimmedUserName)
        {
            user.username = trimmedUserName;
        }

        if(bio && user.bio !== bio)
        {
            user.bio = bio;
        }

        if(Object.keys(file).length > 0)
        {
            const oldImgPubId = user.userImgPubId;
            if(oldImgPubId)
            {
                await deleteFile(oldImgPubId);
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
        const users = await NormalUserModel.find({})
        .sort({ _id : 1 })
        .skip(skip)
        .limit(limit);

        const totalDocs = await NormalUserModel.countDocuments();
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

        const user = await NormalUserModel.findById(id);

        if(!user)
        {
            return ErrorResponse(res, "User does not exist", 404);
        }

        const oldImgPubId = user.userImgPubId;
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