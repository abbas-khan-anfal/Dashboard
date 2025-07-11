import mongoose from "mongoose";
import WishlistModel from './../../models/Wishlist/WishlistModel.js';
import wishlistModel from "./../../models/Wishlist/WishlistModel.js";
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';


export const addProductToWishlist = async (req, res, next) => {
    try
    {
        const { pro_id } = req.body;
        const user = req.user;

        if(!user)
        {
            return ErrorResponse(res, "Please Login first", 401);
        }

        if(!mongoose.isValidObjectId(pro_id))
        {
            return ErrorResponse(res, "Product does not found", 404);
        }

        let wishlist = await wishlistModel.findOne({ user_id : user._id, pro_id });

        if(wishlist)
        {
            // delete wishlist
            await wishlistModel.deleteOne();

            return ErrorResponse(res, "Product removed from wishlist", 200);
        }

        wishlist = await WishlistModel.create({
            user_id : user._id,
            pro_id
        });

        return SuccessResponse(res, "Product added to wishlist", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}


export const DeleteWishlist = async (req, res, next) => {
    try
    {
        const { wishlst_id } = req.body;
        const user = req.user;

        if(!user)
        {
            return ErrorResponse(res, "Please Login first", 401);
        }

        if(!mongoose.isValidObjectId(wishlst_id))
        {
            return ErrorResponse(res, "Wishlist Item does not found", 404);
        }
        const wishlist = await wishlistModel.findById(wishlst_id);

        if(!wishlist)
        {
            return ErrorResponse(res, "Wishlist Item does not found", 404);
        }

        await wishlistModel.deleteOne();

        return SuccessResponse(res, "Product removed from wishlist", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const fetchWishlistItems = async (req, res, next) => {
    try
    {
        const user = req.user;
        const page = req.query.page || 1;
        const limit = 3;

        if(!user)
        {
            return ErrorResponse(res, "Please Login first", 400);
        }

        const wishlist = await wishlistModel.find({ user_id : user._id }).populate('pro_id')
        .sort({ _id : 1 })
        .limit(limit)
        .skip((page - 1) * limit);

        const wishlistItemsCount = await wishlistModel.countDocuments({ user_id : user._id });
        const totalPages = Math.ceil(wishlistItemsCount / limit);

        res.status(200).json({
            success : true,
            wishlist,
            totalPages,
            currentPage : page
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}