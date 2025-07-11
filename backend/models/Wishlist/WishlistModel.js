import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  user_id : { type : mongoose.Schema.Types.ObjectId, ref : "users", required : true},
  pro_id : { type : mongoose.Schema.Types.ObjectId, ref : "products", required : true},
  timestamp : { type : Date, default : Date.now }
});

const wishlistModel = mongoose.models.wishlists || mongoose.model("wishlists", wishlistSchema);

export default wishlistModel;