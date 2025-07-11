import mongoose from "mongoose";

const dashUserSchema = new mongoose.Schema({
  username : { type : String, required : true },
  email : { type : String, required : true, unique : true },
  bio : { type : String, default : ""  },
  password : { type : String, required : true },
  userImgPath : { type : String, default : "" },
  userImgPubId : { type : String, default : "" },
  role : { type : String, default : "user" },
  timestamp : { type : Date, default : Date.now }
});

const dashUserModel = mongoose.models.dash_users || mongoose.model("dash_users", dashUserSchema);

export default dashUserModel;