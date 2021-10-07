const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user: { type: String, required: false, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  schedule: [
    {
        date:{type: String, default: "WILL BE UPDATED"},
        time:{type: String, default: "WILL BE UPDATED"},
        location:{type: String, default: "WILL BE UPDATED"},
        headCount:{type: String, default: "WILL BE UPDATED"},
        supervisor:{type: String, default: "WILL BE UPDATED"},
        lead:{type: String, default: "WILL BE UPDATED"}
    }
  ] 
});

const User = mongoose.model("User", UserSchema);

module.exports = User;