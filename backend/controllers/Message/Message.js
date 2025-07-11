import mongoose from "mongoose";
import messageModel from "../../models/Messages/MessageModel.js";
import ErrorResponse from '../../utils/ErrorResponse.js';
import SuccessResponse from '../../utils/SuccessResponse.js';

// add user message
export const addUserMessage = async (req, res) => {
  try
  {
    const {fullName, email, message} = req.body;

    const userEmail = email.toLowerCase();

    const userMessage = await messageModel.create({
        fullName,
        email : userEmail,
        message
    });

    return SuccessResponse(res, "Message sent successfully", 200);

  }
  catch(error)
  {
    return ErrorResponse(res, error.message, 500);
  }
};



export const deleteUserMessage = async (req, res) => {
    try
    {
      const { id } = req.query;

      if(!mongoose.isValidObjectId(id))
      {
        return ErrorResponse(res, "Message does not found", 404);
      }

      // check if message exists
      const message = await messageModel.findById(id);

      if(!message)
      {
        return ErrorResponse(res, "Message deso not found", 404);
      }

      // delete message
      await message.deleteOne();
      
      return SuccessResponse(res, "Message deleted successfully", 200);
  
    }
    catch(error)
    {
      return ErrorResponse(res, error.message, 500);
    }
  };


  export const fetchSingleMessage = async (req, res) => {
    try
    {
      const { id } = req.query;

      if(!mongoose.isValidObjectId(id))
      {
        return ErrorResponse(res, "Message does not found", 404);
      }

      // fetch message
      const message = await messageModel.findById(id);

      if(!message)
      {
        return ErrorResponse(res, "Message does not found", 404);
      }
  
      res.status(200).json({
          success : true,
          message : message
      });
  
    }
    catch(error)
    {
      return ErrorResponse(res, error.message, 500);
    }
  };



  export const fetchMessages = async (req, res) => {
    try
    {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 3;
      const messages = await messageModel.find({})
      .sort({_id : 1})
      .skip((page - 1) * limit)
      .limit(limit);

      const totalMessage = await messageModel.countDocuments();
      const totalPages = Math.ceil(totalMessage / limit);

      res.status(200).json({
        success : false,
        messages,
        totalPages,
        currentPage : page
      });
    }
    catch(error)
    {
      return ErrorResponse(res, error.message, 500);
    }
  };

