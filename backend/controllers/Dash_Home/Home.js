import ProductModel from "../../models/Products/ProductModel.js";
import PostModel from "../../models/Posts/PostModel.js";
import userModel from "../../models/Users/DashUserModel.js";
import messageModel from "../../models/Messages/MessageModel.js";
import PostCategoryModel from "../../models/Posts/PostCategoryModel.js";
import ProCategoryModel from "../../models/Products/ProCategoryModel.js";
import ErrorResponse from '../../utils/ErrorResponse.js';

// add user message
export const fetchDashboardCardsData = async (req, res) => {
    try
    {
        // get the count of all collections using the promise.all
        if(req.dashUser.role === "admin" )
        {
            const [products, posts, users, messages, postCategories, proCategories] = await Promise.all([
                ProductModel.countDocuments(),
                PostModel.countDocuments(),
                userModel.countDocuments(),
                messageModel.countDocuments(),
                PostCategoryModel.countDocuments(),
                ProCategoryModel.countDocuments(),
            ]);
    
            
            res.status(200).json({
                success : true,
                data : {
                    products,
                    posts,
                    users,
                    messages,
                    postCategories,
                    proCategories
                }
            });
        }
        else
        {
            const [products, posts, users, messages] = await Promise.all([
                ProductModel.countDocuments({author : req.dashUser._id}),
                PostModel.countDocuments({author : req.dashUser._id}),
            ]);


            res.status(200).json({
                success : true,
                data : {
                    products,
                    posts,
                    users : 0,
                    messages : 0,
                    postCategories : 0,
                    proCategories : 0
                }
            });
        }
  
    }
    catch(error)
    {
        return ErrorResponse(res, error.message, 500);
    }
  };