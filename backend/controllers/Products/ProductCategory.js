import proCatModel from '../../models/Products/ProCategoryModel.js';
import mongoose from 'mongoose';
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';

export const fetchProductCategory = async (req, res) => {
    try
    {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 3;
      const productCategories = await proCatModel.find({})
      .sort({_id : 1})
      .skip((page - 1) * limit)
      .limit(limit);

      const totalcategories = await proCatModel.countDocuments();
      const totalPages = Math.ceil(totalcategories / limit);

      res.status(200).json({
        success : false,
        categories : productCategories,
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

export const addProductCategory = async (req, res, next) => {
    try
    {
        const { c_name } = req.body;

        const trimmedCategory = c_name.trim().toLowerCase();

        if(trimmedCategory === "")
        {
            return ErrorResponse(res, "Please enter category name", 404);
        }

        const categoryExists = await proCatModel.findOne({ c_name : trimmedCategory });
        
        if(categoryExists)
        {
            return ErrorResponse(res, "Category already exists", 400);
        }

        await proCatModel.create({
            c_name : trimmedCategory
        });

        return SuccessResponse(res, "Category saved successfully", 200);

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const deleteProductCategory = async (req, res, next) => {
    try
    {
        const { id } = req.query;

        if(!mongoose.isValidObjectId(id))
        {
            return res.status(400).json({
                success : false,
                message: "Category does not exist"
            });
        }

        const categoryExists = await proCatModel.findById(id);

        if(!categoryExists)
        {
            return res.status(404).json({
                success : false,
                message : "Category does not exist"
            })
        }

        await categoryExists.deleteOne();

        return SuccessResponse(res, "Category deleted successfully", 200);

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

export const updateProductCategory = async (req, res, next) => {
    try
    {
        const { c_name, id } = req.body;

        if(!mongoose.isValidObjectId(id))
        {
            return res.status(400).json({
                success : false,
                message: "Category does not exist"
            });
        }

        const trimmedCategory = c_name.trim().toLowerCase();
        
        if(trimmedCategory === "")
        {
            return res.status(400).json({
                success : false,
                message: "Please enter category name"
            });
        }

        const categoryExists = await proCatModel.findById(id);

        if(!categoryExists)
        {
            return res.status(404).json({
                success : false,
                message : "Category does not exist"
            });
        }

         if(categoryExists.c_name === trimmedCategory)
        {
            return SuccessResponse(res, "Category updated successfully", 200);
        }

        categoryExists.c_name = trimmedCategory;
        await categoryExists.save();
        
        return SuccessResponse(res, "Category updated successfully", 200);

    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
}

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
  
      const category = await proCatModel.findById(id);
  
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

    export const fetchAllProductCategories = async (req, res) => {
      try
      {
        const categories = await proCatModel.find({});
  
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