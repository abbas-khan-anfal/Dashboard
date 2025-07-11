import path from 'path'
import productModel from '../../models/Products/ProductModel.js';
import productCategoryModel from '../../models/Products/ProCategoryModel.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import DeleteOldImgs from '../../utils/DeleteOldImgs.js';
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';

export const addProduct = async (req, res, next) => {
    try
    {
        const { pro_title, pro_description, pro_qty, pro_category, pro_brand, original_price, selling_price } = req.body;
        const files = req.files;

        if(!mongoose.isValidObjectId(pro_category))
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Invalid category", 400);
        }

        if(pro_title.trim() == "" || pro_description.trim() == "" || pro_qty.trim() == "" || original_price.trim() == "" || selling_price.trim() == "" || pro_brand.trim() == "")
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "All fields are required", 400);
        }

        // find category and brand 
        const proCategory = await productCategoryModel.findById(pro_category);

        if(!proCategory)
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Invalid category", 400);
        }

        // increment total_product document in proCategory and  in proBrand
        proCategory.total_products = proCategory.total_products + 1;
        await proCategory.save();

        const pro_img_paths = Object.keys(files)
        .filter(file => files[file]?.[0]?.path)
        .map(file => files[file][0].path);

        const pro_img_pub_ids = Object.keys(files)
        .filter(file => files[file]?.[0]?.filename)
        .map(file => files[file][0].filename);



        const product = await productModel.create({
            pro_title,
            pro_description,
            pro_qty,
            pro_category,
            pro_brand,
            original_price,
            selling_price,
            pro_img_paths,
            pro_img_pub_ids,
            author : req.dashUser._id
        });

        return SuccessResponse(res, "Product saved and published successfully", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}


export const deleteProduct = async (req, res, next) => {
    try
    {
        const { id } = req.query;

        if(!mongoose.isValidObjectId(id))
        {
            return ErrorResponse(res, "Invalid product id", 400);
        }

        const product = await productModel.findById(id);

        if(!product)
        {
            return ErrorResponse(res, "Product not found", 400);
        }

        if(product.pro_img_pub_ids.length > 0)
        {
            const deleteOldImages = product.pro_img_pub_ids.map(pubId => cloudinary.uploader.destroy(pubId));
            await Promise.all(deleteOldImages);
        }

        // find category and brand 
        const proCategory = await productCategoryModel.findById(product.pro_category);

        if(proCategory)
        {
            // decrement the total_products
            proCategory.total_products = proCategory.total_products - 1;
        }
        await proCategory.save();
        await product.deleteOne();

        return SuccessResponse(res, "Product deleted successfully", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const updateProduct = async (req, res, next) => {
    try
    {
        const { pro_title, pro_description, pro_qty, pro_category, pro_brand, original_price, selling_price, p_id } = req.body;
        const files = req.files || {};
        

        if(!mongoose.isValidObjectId(p_id))
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Post does not found", 400);
        }

        if(pro_title.trim() == "" || pro_description.trim() == "" || pro_qty.trim() == "" || original_price.trim() == "" || selling_price.trim() == "" || pro_brand.trim() == "")
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "All fields are required", 400);
        }

        let product = await productModel.findById(p_id);

        if(!product)
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Product does not found", 404);
        }

        if(!mongoose.isValidObjectId(pro_category))
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Invalid category", 400);
        }

        const newCategoryExist = await productCategoryModel.findById(pro_category);

        if(!newCategoryExist)
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Invalid category", 400);
        }

        if(newCategoryExist._id.toString() !== product.pro_category.toString())
        {
            const oldCategory = await productCategoryModel.findById(product.pro_category);
            if(oldCategory)
            {
                oldCategory.total_products = oldCategory.total_products - 1;
                await oldCategory.save();
            }

            newCategoryExist.total_products = newCategoryExist.total_products + 1;
            await newCategoryExist.save();
        }

        const updateFields = {};

        // ✅ Update only changed fields
        const fieldsToUpdate = { pro_title, pro_description, pro_qty, pro_category, pro_brand, original_price, selling_price, pro_brand };
        for (const key in fieldsToUpdate)
        {
            if(fieldsToUpdate[key] && product[key] !== fieldsToUpdate[key])
            {
                updateFields[key] = fieldsToUpdate[key];
            }
        }


        const updateImgPaths = [...product.pro_img_paths];
        const updateImgPubIds = [...product.pro_img_pub_ids];

        if(files)
        {
            for (const [index, key] of Object.keys(files).entries()) {
                const file = files[key]?.[0]; // Use optional chaining to avoid errors
                if(file)
                {
                    const oldImgPubId = product.pro_img_pub_ids[index];
                    if (oldImgPubId) {
                        try
                        {
                            const result = await cloudinary.uploader.destroy(oldImgPubId);
                            if(result.result === "ok")
                            {
                                console.log(`File deleted successfully : ${result.result}`);
                            }
                        }
                        catch(error)
                        {
                            console.log(`Error deleting file : `, error);
                        }
                    }
                    updateImgPaths[index] = file.path;
                    updateImgPubIds[index] = file.filename;
                }
            }
            
        }

        if(JSON.stringify(updateImgPaths) !== JSON.stringify(product.pro_img_paths))
        {
            updateFields.pro_img_paths = updateImgPaths;
        }
        if(JSON.stringify(updateImgPubIds) !== JSON.stringify(product.pro_img_pub_ids))
        {
            updateFields.pro_img_pub_ids = updateImgPubIds;
        }

        product = await productModel.findByIdAndUpdate(
            p_id,
            {$set : updateFields},
            { new : true, runValidators : true }
        );

        if(!product)
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);
            
            return ErrorResponse(res, "Product does not found", 400);
        }
        
        return SuccessResponse(res, "Product updated and published successfully", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const fetchSingleProduct = async (req, res, next) => {
    try
    {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id))
        {
            return ErrorResponse(res, "Product does not found", 400);
        }

        const product = await productModel.findById(id).populate("pro_category");

        if(!product)
        {
            return ErrorResponse(res, "Product does not found", 400);
        }

        const categories = await productCategoryModel.find({});

        res.status(200).json({
            success : true,
            product,
            categories
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const searchProductHandler = async (req, res, next) => {
    try
    {
        
        const searchTerm = req.query.searchTerm || ""
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const searchQuery = {
            $or : [
                { pro_title : { $regex : searchTerm, $options : "i" } },
                { pro_description : { $regex : searchTerm, $options : "i" } }
            ]
        };
        const products = await productModel.find(searchQuery)
        .sort({ _id : 1 })
        .skip(skip)
        .limit(limit);
        const totalProducts = await productModel.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            success : true,
            products,
            totalPages,
            currentPage : page,
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}


export const fetchProducts = async (req, res, next) => {
    try
    {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const filter = req.dashUser.role === "admin" ? {} : {author : req.dashUser._id};
        const products = await productModel.find(filter)
        .sort({ _id : 1 })
        .skip(skip)
        .limit(limit)

        const totalProducts = await productModel.find(filter).countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        
        res.status(200).json({
            success : true,
            products,
            totalPages,
            currentPage : page,
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}