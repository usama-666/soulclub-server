const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    cpassword: {
      type: String,
      required: true,
    },

    role: {
      type: Number,
      default: 0,
    },
    
  },
  { timestamps: true }
);



//generating jwt tokens
userSchema.methods.generateAuthToken = async function () {
  try {
    token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = await this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

//creating collection on databsae
const User = mongoose.model("USER", userSchema);

module.exports = User;
