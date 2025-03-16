import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { cookieOpt } from "../constant.js";

const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(406).json({
        statusCode: 406,
        success: false,
        message: "Required fields missing",
      });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: "User not found",
        });
      }
  
      // Compare hashed password
      const isPasswordValid = await user.isPasswordCorrect(password);
  
      if (!isPasswordValid) {
        return res.status(401).json({
          statusCode: 401,
          success: false,
          message: "Invalid user credentials",
        });
      }
  
      const accessToken = user?.generateAccessToken();
      const refreshToken = user?.generateRefreshToken();
  
      if (!accessToken || !refreshToken) {
        return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "Something went wrong while generating tokens",
        });
      }
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

  
      const data = {
        userId: user._id,
        accessToken,
        userName: user.userName,
        email: user.email,
        country: user.country,
      };
  
      res
        .status(200)
        .cookie("accessToken", accessToken, cookieOpt)
        .cookie("refreshToken", refreshToken, cookieOpt)
        .json({
          success: true,
          statusCode: 200,
          message: "Login successfully",
          data,
        });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Server error in user login",
      });
    }
  };

  
  const registerUser = async (req, res) => {
    const { userName, email, country, password, mobileNumber } =
      req.body;
      console.log("Req body : ",req.body);

    // if (
    //   [userName, email, country, password, mobileNumber, userIdentity].some(
    //     (item) => !item
    //   )
    // ) {
    //   return res.status(406).json({
    //     statusCode: 406,
    //     success: false,
    //     message: "Required fields are missing",
    //   });
    // }
  
  
    try {
      // Check if user exists
      const isUserExist = await User.findOne({ email });
      if (isUserExist) {
        return res.status(406).json({
          statusCode: 406,
          success: false,
          message: "User already exists",
        });
      }
  
  
      // Create user (Middleware generates Unique ID & Referral Code)
      const user = new User({
        userName,
        email,
        country,
        password,
        mobileNumber,
      });
  
      await user.save(); // Triggers pre-save middleware
     // Send email after successful registration
    //  try {
    //   await sendMail({
    //     to: email,
    //     subject: "Welcome to Our Platform",
    //     text: `Hi ${userName},\n\nThank you for registering with us.\n\nBest regards,\nYour Team`,
    //   });
    //   console.log("Email sent successfully");
    // } catch (emailError) {
    //   console.error("Error sending email:", emailError);
    // }  
    
    return res.status(201).json({
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error in registerUser:", error);
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Server error in user registration",
      });
    }
  };

const getAllUsers = async(req,res) => {
  try {
      const user = await User.find({})
      if(!user){
        return res.status(404).json({statusCode:404,success:false , message:"User not found"})
      }
      return res.status(200).json({statusCode:200,success:true , data : user})

  } catch (error) {
    console.log(error)
    
  }
}


export {login , registerUser , getAllUsers}