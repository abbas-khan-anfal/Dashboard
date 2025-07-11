import mongoose from 'mongoose';
import PostCategoryModel from '../../models/Posts/PostCategoryModel.js';
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';

// function to add post category
export const addPostCategory = async (req, res) => {
  try
  {
    const { c_name } = req.body;
    
    const trimmedCategory = c_name.trim();

    if(trimmedCategory === "")
    {
        return ErrorResponse(res, "Please enter category name", 400);
    }

    const categoryExist = await PostCategoryModel.findOne({ c_name : trimmedCategory.toLowerCase() });

    if(categoryExist)
    {
        return ErrorResponse(res, "Category already exists", 400);
    }

    await PostCategoryModel.create({
        c_name : trimmedCategory
    });

    return SuccessResponse(res, "Post category added successfully", 200);
  }
  catch(error)
  {
    return ErrorResponse(res, error.message, 500);
  }
};


// function to delete post category
export const deletePostCategory = async (req, res) => {
    try
    {
        const { id } = req.query;

        if(!mongoose.isValidObjectId(id))
        {
            return ErrorResponse(res, "Category does not exist", 400);
        }

        const categoryExist = await PostCategoryModel.findById(id);

        if(!categoryExist)
        {
            return ErrorResponse(res, "Category does not exist", 400);
        }

        await categoryExist.deleteOne();
  
        return SuccessResponse(res, "Category deleted successfully", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
  };

  // function to update post category
export const updatePostCategory = async (req, res) => {
    try
    {
        const { id, c_name } = req.body;

        if(!mongoose.isValidObjectId(id))
        {
            return ErrorResponse(res, "Category does not exist", 400);
        }

        const trimmedCategory = c_name.trim().toLowerCase();
        
        if(trimmedCategory === "")
        {
            return ErrorResponse(res, "Please enter category name", 400);
        }

        const category = await PostCategoryModel.findById(id);

        if(!category)
        {
            return ErrorResponse(res, "Category does not exist", 400);
        }

        // check if category exist by name
        const categoryExist = await PostCategoryModel.findOne({ c_name : trimmedCategory });
        if(category.c_name === trimmedCategory)
        {
            return SuccessResponse(res, "Category updated successfully", 200);
        }
        else if(categoryExist && categoryExist.c_name === trimmedCategory)
        {
            return ErrorResponse(res, "Category already exists", 400);
        }
        else
        {
          category.c_name = trimmedCategory;
          await category.save();
        }
  
        return SuccessResponse(res, "Category updated successfully", 200);
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
  };


  export const fetchPostCategories = async (req, res) => {
    try
    {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 3;
      const postCategories = await PostCategoryModel.find({})
      .sort({_id : 1})
      .skip((page - 1) * limit)
      .limit(limit);

      const totalcategories = await PostCategoryModel.countDocuments();
      const totalPages = Math.ceil(totalcategories / limit);

      res.status(200).json({
        success : false,
        categories : postCategories,
        totalPages,
        currentPage : page
      });
    }
    catch(error)
    {
      return ErrorResponse(res, error.message, 500);
    }
  };

  export const fetchAllCategories = async (req, res) => {
    try
    {
      const categories = await PostCategoryModel.find({});

      res.status(200).json({
        success : false,
        categories,
      });
    }
    catch(error)
    {
      return ErrorResponse(res, error.message, 500);
    }
};

export const fetchSigleCategory = async (req, res) => {
  try
  {
    const { id } = req.params;

    if(!mongoose.isValidObjectId(id))
    {
      return res.status(400).json({
        success : false,
        message : "Category not found"
      })
    }

    const category = await PostCategoryModel.findById(id);

    res.status(200).json({
      success : false,
      category,
    });
  }
  catch(error)
  {
    return ErrorResponse(res, error.message, 500);
  }
};