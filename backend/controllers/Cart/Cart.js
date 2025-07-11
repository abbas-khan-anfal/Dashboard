import mongoose from 'mongoose';
import CartModel from '../../models/Cart/Cart.js';
import UserModel from '../../models/Users/DashUserModel.js';
import ProductModel from '../../models/Products/ProductModel.js';
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';

// add to cart the product
export const addToCartHandler = async (req, res, next) => {
    try
    {
        if(!req.user)
        {
            return ErrorResponse(res, "User not found, Please login to continue", 404);
        }
        
        const { product_id } = req.body;
        const user_id = req.user._id;

        if(!mongoose.isValidObjectId(product_id))
        {
            return ErrorResponse(res, "Product not found, Please refresh the website", 404);
        }

        if(!mongoose.isValidObjectId(user_id))
        {
            return ErrorResponse(res, "User not found, Please login to continue purchasing", 404);
        }

        let cart = await CartModel.findOne({
            user_id : user_id,
            pro_id : product_id
        });

        if(cart)
        {
            return ErrorResponse(res, "Product already in cart", 400);
        }


        const user =  await UserModel.findById(user_id);
        if(!user)
        {
            return ErrorResponse(res, "User not found, Please login to continue purchasing", 404);
        }
        const product = await ProductModel.findById(product_id);
        if(!product)
        {
            return ErrorResponse(res, "Product not found, Please refresh the website", 404);
        }

        await CartModel.create({
            user_id : user_id,
            pro_id : product_id
        });

        return SuccessResponse(res, "Product added to cart", 200);


    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

// add to cart the product
export const deleteFromCartHandler = async (req, res, next) => {
    try
    {

        if(!req.user)
        {
            return ErrorResponse(res, "User not found, Please login to continue", 404);
        }

        const { product_id } = req.body;
        const user_id = req.user._id;

        if(!mongoose.isValidObjectId(product_id))
        {
            return ErrorResponse(res, "Product does not found, Please refresh the website", 404);
        }

        if(!mongoose.isValidObjectId(user_id))
        {
            return ErrorResponse(res, "User not found, Please login to continue", 404);
        }

        let cart = await CartModel.findOne({
            user_id : user_id,
            pro_id : product_id
        });

        if(!cart)
        {
            return ErrorResponse(res, "Product does not found in cart", 404);
        }
        await cart.deleteOne();

        return SuccessResponse(res, "Product removed from cart", 200);


    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const fetchCartItems = async (req, res, next) => {
    try
    {
        if(!req.user)
        {
            return ErrorResponse(res, "User not found, Please login to continue", 404);
        }

        const user_id = req.user._id;

        if(!mongoose.isValidObjectId(user_id))
        {
            return ErrorResponse(res, "User not found, Please login to continue", 404);
        }

        const carts = await CartModel.find({ user_id : user_id }).populate('pro_id');

        let subTotal = 0;
        carts.forEach((cart, index) => {
            subTotal = subTotal + cart.pro_id.selling_price * cart.quantity;
        })

        res.status(200).json({
            success : true,
            carts,
            total : Math.round(subTotal * 100) / 100,
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const updateCartQtyHandler = async (req, res, next) => {
    try
    {
        if(!req.user)
        {
            return ErrorResponse(res, "User not found, Please login to continue", 404);
        }


        if(!mongoose.isValidObjectId(req.body.cart_id))
        {
            return ErrorResponse(res, "Cart item deos not found", 404);
        }

        const qty = parseInt(req.body.qty) || 1;

        if(qty < 1 || qty > 10)
        {
            return ErrorResponse(res, "Quantity must be between 1 and 10", 400);
        }

        const cartItem = await CartModel.findOne({_id : req.body.cart_id, user_id : req.user._id});

        if(!cartItem)
        {
            return ErrorResponse(res, "Cart item does not found", 404);
        }
        if(cartItem.quantity !== qty)
        {
            cartItem.quantity = qty;
            await cartItem.save();
        }
        
       return SuccessResponse(res, "Quantity updated", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}