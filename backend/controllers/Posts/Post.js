import path from 'path'
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import PostModel from '../../models/Posts/PostModel.js';
import PostCategoryModel from '../../models/Posts/PostCategoryModel.js';
import DeleteOldImgs from '../../utils/DeleteOldImgs.js';
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';

export const addPost = async (req, res, next) => {
    try
    {
        const { post_title, post_description, post_category } = req.body;
        const files = req.files || {};

        if(!mongoose.isValidObjectId(post_category))
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Category does not found", 404);
        }

        const categoryExist = await PostCategoryModel.findById(post_category);

        if(!categoryExist)
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Category does not found", 404);
        }

        if(post_title.trim() === "" || post_description.trim() === "")
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "All fields are required", 400);
        }

        categoryExist.total_posts = categoryExist.total_posts + 1;
        await categoryExist.save();

        const post_img_paths = Object.keys(files)
        .filter(file => files[file]?.[0]?.path) // Check if the file exists
        .map(file => files[file][0].path);

        const post_img_pub_ids = Object.keys(files)
        .filter(file => files[file]?.[0]?.filename)
        .map(file => files[file][0].filename);


        await PostModel.create({
            post_title,
            post_description,
            post_category,
            post_img_paths,
            post_img_pub_ids,
            author : req.dashUser._id
        });

        return SuccessResponse(res, "Post saved and published successfully", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}


export const deletePost = async (req, res, next) => {
    try
    {
        const { id } = req.query;

        if(!mongoose.isValidObjectId(id))
        {
            return ErrorResponse(res, "Post does not found", 404);
        }

        const post = await PostModel.findById(id);

        if(!post)
        {
            return ErrorResponse(res, "Post does not found", 404);
        }

        if(post.post_img_pub_ids.length > 0)
        {
            const deleteOldImages = post.post_img_pub_ids.map(pubId => cloudinary.uploader.destroy(pubId));
            await Promise.all(deleteOldImages);
        }

        // decrement in category in which this post added
        const updateCategory = await PostCategoryModel.findById(post.post_category);

        if(updateCategory)
        {
            updateCategory.total_posts = updateCategory.total_posts - 1;
            await updateCategory.save();
        }
        
        await post.deleteOne();

        return SuccessResponse(res, "Post deleted successfully", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const updatePost = async (req, res, next) => {
    try
    {
        const { post_title, post_description, post_category, id } = req.body;
        const files = req.files || {};
        

        if(!mongoose.isValidObjectId(id))
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Post does not found", 404);
        }

        if(!mongoose.isValidObjectId(post_category))
        {   
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return res.status(400).json({
                success : false,
                message : "Category does not found"
            });
        }

        if(post_title.trim() === "" || post_description.trim() === "")
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "All fields are required", 400);
        }

        let post = await PostModel.findById(id);

        if(!post)
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return ErrorResponse(res, "Post does not found", 404);
        }

        const newCategoryExist = await PostCategoryModel.findById(post_category);
        if(!newCategoryExist)
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);

            return(res, "Category does not found", 404);
        }
        
        if(post.post_category.toString() !== post_category.toString())
        {
            const oldCategoryExist = await PostCategoryModel.findById(post.post_category);

            if(oldCategoryExist)
            {
                oldCategoryExist.total_posts = oldCategoryExist.total_posts - 1;
                await oldCategoryExist.save();
            }

            newCategoryExist.total_posts = newCategoryExist.total_posts + 1;
            await newCategoryExist.save();
        }

        const updateFields = {};

        // ✅ Update only changed fields
        const fieldsToUpdate = { post_title, post_description, post_category };
        for (const key in fieldsToUpdate)
        {
            if(fieldsToUpdate[key] && post[key] !== fieldsToUpdate[key])
            {
                updateFields[key] = fieldsToUpdate[key];
            }
        }


        const updateImgPaths = [...post.post_img_paths];
        const updateImgPubIds = [...post.post_img_pub_ids];

        if(files)
        {
            for (const [index, key] of Object.keys(files).entries()) {
                const file = files[key]?.[0]; // Use optional chaining to avoid errors
                if(file)
                {
                    const oldImgPubId = post.post_img_pub_ids[index];
                    if (oldImgPubId) {
                        try
                        {
                            const result = await cloudinary.uploader.destroy(oldImgPubId);
                            if(result.result === "ok")
                            {
                                console.log('File deleted successfully : ' + result.result);
                            }
                        }
                        catch(error)
                        {
                            console.log(`Error deleting old file : `, error);
                        }
                    }
                    updateImgPaths[index] = file.path;
                    updateImgPubIds[index] = file.filename;
                }
            }
            
        }

        if(JSON.stringify(updateImgPaths) !== JSON.stringify(post.post_img_paths))
        {
            updateFields.post_img_paths = updateImgPaths;
        }
        if(JSON.stringify(updateImgPubIds) !== JSON.stringify(post.post_img_pub_ids))
        {
            updateFields.post_img_pub_ids = updateImgPubIds;
        }

        post = await PostModel.findByIdAndUpdate(
            id,
            {$set : updateFields},
            { new : true, runValidators : true }
        );

        if(!post)
        {
            // delete uploaded imgs
            await DeleteOldImgs(files);
            
            return ErrorResponse(res, "Post does not found", 404);
        }
        
        return SuccessResponse(res, "Post updated and published", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const fetchSinglePost = async (req, res, next) => {
    try
    {
        const { id } = req.params;

        if(!mongoose.isValidObjectId(id))
        {
            return ErrorResponse(res, "Post does not found", 404);
        }

        // find post by id and populate the the post_category and only get the c_name
        const post = await PostModel.findById(id);

        if(!post)
        {
            return ErrorResponse(res, "Post does not found", 404);
        }

        const categories = await PostCategoryModel.find({});


        res.status(200).json({
            success : true,
            post,
            categories
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const searchPostHandler = async (req, res, next) => {
    try
    {
        
        const searchTerm = req.query.searchTerm || ""
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const searchQuery = {
            $or : [
                { post_title : { $regex : searchTerm, $options : "i" } },
                { post_description : { $regex : searchTerm, $options : "i" } }
            ]
        };
        const posts = await PostModel.find(searchQuery)
        .sort({ _id : 1 })
        .skip(skip)
        .limit(limit);
        const totalPosts = await PostModel.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            success : true,
            posts,
            totalPages,
            currentPage : page,
        });
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const fetchPosts = async (req, res) => {
    try
    {

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 3;
      const filter = req.dashUser.role === "admin" ? {} : {author : req.dashUser._id};
      const posts = await PostModel.find(filter)
      .sort({_id : 1})
      .skip((page - 1) * limit)
      .limit(limit);

      const totalPosts = await PostModel.find(filter).countDocuments();
      const totalPages = Math.ceil(totalPosts / limit);

      res.status(200).json({
        success : false,
        posts,
        totalPages,
        currentPage : page
      });
    }
    catch(error)
    {
      return ErrorResponse(res, error.message, 500);
    }
  };