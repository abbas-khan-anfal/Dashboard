import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  pro_title : { type : String, required : true },
  pro_description : { type : String, required : true },
  pro_qty : { type : Number, default : 0 },
  pro_category : { type : mongoose.Schema.Types.ObjectId, ref : 'productcategories', required : true },
  pro_brand : { type : String, required : true },
  original_price : { type : Number, default : 0 },
  selling_price : { type : Number, default : 0 },
  pro_img_paths : [{ type : String }],
  pro_img_pub_ids : [{ type : String }],
  pro_rating : { type : Number, default : 0 },
  author : { type : mongoose.Schema.Types.ObjectId, ref : 'users', required : true },
  timestamp : { type : Date, default : Date.now }
});

const ProductModel = mongoose.models.products || mongoose.model("products", productSchema);

export default ProductModel;