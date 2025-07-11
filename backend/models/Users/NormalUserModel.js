import mongoose from "mongoose";

const normalUserSchema = new mongoose.Schema({
  username : { type : String, required : true },
  email : { type : String, required : true, unique : true },
  bio : { type : String, default : ""  },
  password : { type : String, required : true },
  userImgPath : { type : String, default : "" },
  userImgPubId : { type : String, default : "" },
  timestamp : { type : Date, default : Date.now }
});

const normalUserModel = mongoose.models.normal_user || mongoose.model("normal_user", normalUserSchema);

export default normalUserModel;