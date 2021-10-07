const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user: { type: String, required: false, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  cookingId: {type: Number, default: 0},
  finishTime: {type: Date},
  washLoads: {type: Number, default: 0},
  date: { type: Date, default: Date.now },
  items: [
      {
          name:{type: String, required: true},
          quantity:{type: Number, default: 1},
          unit:{type: String, default: "gr"},
          image:{type: String},
          group:{type: String}
      }
  ],
  meals:[
    {
      id:{type: Number, required: true},
      image:{type: String},
      title:{type: String, required: true},
      readyInMinutes:{type: Number}
    }
  ]  
});

const User = mongoose.model("User", UserSchema);

module.exports = User;