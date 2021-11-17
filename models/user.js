const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user: { type: String, required: false, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  dark:{type: Boolean, default: false},
  schedule: [
    {
      googleId:{type: String, default: "WILL BE UPDATED"},
      date:{type: String, default: "WILL BE UPDATED"},
      scheduleContent:{type: String, default: "WILL BE UPDATED"},
      updated:{type: Boolean, default: false},
      dayOff:{type: Boolean, default: false},
      updatedContent:{type: String, default: "NOT-UPDATED"},
      start:{type: String, default: "00:00"},
      end:{type: String, default: "00:00"},
      lunch:{type: String, default: "00"},
      hours:{type: String, default: "00:00"}
    }
  ] 
});

const User = mongoose.model("User", UserSchema);

module.exports = User;