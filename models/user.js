const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user: { type: String, required: false, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  schedule: [
    {
      googleId:{type: String, default: "WILL BE UPDATED"},
      content:{type: Schema.Types.Mixed, default:{data:{snippet:"NO CONTENT SOMTHING WENT WRONG!"}}},
      date:{type: String, default: "WILL BE UPDATED"},
      time:{type: String, default: "WILL BE UPDATED"},
      building:{type: String, default: "WILL BE UPDATED"},
      location:{type: String, default: "WILL BE UPDATED"},
      scope:{type: String, default: "WILL BE UPDATED"},
      headCount:{type: String, default: "WILL BE UPDATED"},
      supervisor:{type: String, default: "WILL BE UPDATED"},
      lead:{type: String, default: "WILL BE UPDATED"},
      updated:{type: Boolean, default: false},
      updatedContent:{type: String, default: "NOT-UPDATED"},
      shift:{
        start:{type: String, default: "00:00 AM"},
        end:{type: String, default: "00:00 PM"},
        lunch:{type: String, default: "00"},
        hours:{type: String, default: "00"}
      }
    }
  ] 
});

const User = mongoose.model("User", UserSchema);

module.exports = User;