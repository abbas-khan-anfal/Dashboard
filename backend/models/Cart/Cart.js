import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user_id : { type : mongoose.Schema.Types.ObjectId, ref : "users", required : true},
  pro_id : { type : mongoose.Schema.Types.ObjectId, ref : "products", required : true},
  quantity : { type : Number, default : 1 },
  timestamp : { type : Date, default : Date.now }
});

const cartModel = mongoose.models.carts || mongoose.model("carts", cartSchema);

export default cartModel;