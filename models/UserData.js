const mongoose = require("mongoose");
const { Schema } = mongoose;


const userdataSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, 
  },
  role: {
    type: String,
    enum: ["superadmin", "instituteadmin", "student"], 
    required: true,
  },
});


const UserData = mongoose.model("UserData", userdataSchema); 

module.exports = UserData; 
