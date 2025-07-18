import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  fullName : { type : String, required : true },
  email : { type : String, required : true },
  message : { type : String, required : true },
  timestamp : { type : Date, default : Date.now }
});

const messageModel = mongoose.models.messages || mongoose.model("messages", messageSchema);

export default messageModel;