import mongoose from "mongoose";

const proCategorySchema = new mongoose.Schema({
  c_name : { type : String, required : true },
  total_products : { type : Number, required : true, default : 0 },
  timestamp : { type : Date, default : Date.now }
});

const ProCategoryModel = mongoose.models.productcategories || mongoose.model("productcategories", proCategorySchema);

export default ProCategoryModel;