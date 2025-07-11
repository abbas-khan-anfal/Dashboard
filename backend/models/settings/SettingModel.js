import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  site_name : { type : String, required : true },
  site_logo_img_path : { type : String, required : true, default : "" },
  site_logo_img_pub_id : { type : String, required : true, default : "" },
  site_copyright : { type : String, required : true },
  site_email : { type : String, required : true },
  site_address : { type : String, required : true },
  site_phone : { type : String, required : true },
  site_description : { type : String, required : true },
  site_youtube : { type : String, default : "" },
  site_instagram : { type : String, default : "" },
  site_twitter : { type : String, default : "" },
  site_facebook : { type : String, default : "" },
  site_linkedin : { type : String, default : "" },
  site_pinterest : { type : String, default : "" },
  timestamp : { type : Date, default : Date.now }
});

const settingModel = mongoose.models.settings || mongoose.model("settings", settingSchema);

export default settingModel;