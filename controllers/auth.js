const JWT = require("jsonwebtoken");
const { comparePassword, hashPassword } = require("../helper/authHelper");
const User = require("../model/userSchema");

const registerController = async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;
  console.log(req.body);

  try {
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!cpassword) {
      return res.send({ message: "Confrim Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }

    //check user
    const exisitingUser = await User.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: true,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new User({
      name,
      email,
      phone,
      password: hashedPassword,
      cpassword: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

const signinController = async (req, res) => {
  try {
    // let token;
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    //compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).send({
      success: true,
      message: "Logined successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
  
};



///Test Controller

const testController = (req, res) => {
  try {
    res.send({
      success: true,
      message: "protected route",
    });
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
module.exports = {
  registerController,
  signinController,
  // forgotPasswordController,
  testController,
};
