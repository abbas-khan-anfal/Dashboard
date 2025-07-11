import mongoose from "mongoose";

const PostCategorySchema = new mongoose.Schema({
  c_name : { type : String, required : true },
  total_posts : { type : Number, default : 0 },
  timestamp : { type : Date, default : Date.now }
});

const PostCategoryModel = mongoose.models.postCategories || mongoose.model("postCategories", PostCategorySchema);

export default PostCategoryModel;