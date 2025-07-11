import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  post_title : { type : String, required : true },
  post_description : { type : String, required : true },
  post_category : { type : mongoose.Schema.Types.ObjectId, ref : 'postCategories', required : true },
  author : { type : mongoose.Schema.Types.ObjectId, ref : 'users', required : true },
  post_img_paths : [{ type : String }],
  post_img_pub_ids : [{ type : String }],
  timestamp : { type : Date, default : Date.now }
});

const PostModel = mongoose.models.posts || mongoose.model("posts", PostSchema);

export default PostModel;