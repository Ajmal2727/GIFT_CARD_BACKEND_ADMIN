import User from "../models/user.model.js";
import { sendEmail } from "../helper/email.helper.js";
import { getCurrencyByCountry } from "../helper/country.helper.js";

const registerUser = async (req, res) => {
  console.log(req.body.formData)
    const { fullName, userName, email, phone, password,country } = req.body.formData;
    if (!fullName || !userName || !email || !phone || !password ) {
        return res.status(406).json({
            statusCode: 406,
            success: false,
            message: "Required fields missing",
        });
    }

    try {
        // Check if user already exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(406).json({
                statusCode: 406,
                success: false,
                message: "User already exists",
            });
        }

        const currency = getCurrencyByCountry(country);
        console.log(`Currency for ${country}:`, currency); // Debugging ke liye console par output

        // Create new user
        const newUser = new User({
            fullName,
            userName,
            email,
            phone,
            password,
            country,
            currency
        });

        await newUser.save();

        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: newUser,
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



const loginUser = async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(406).json({
            statusCode: 406,
            success: false,
            message: "Required fields missing",
        });
    }

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }

        // Debugging: Check stored password
        console.log("Entered Password:", password);
        console.log("Hashed Password from DB:", user.password);

        // Compare hashed password
        const isPasswordValid = await user.isPasswordCorrect(password);
        console.log("Password Match Result:", isPasswordValid); 
        if (!isPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Invalid user credentials",
            });
        }
        // Generate Tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

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
            accessToken,
            userName: user.userName
        };

        res
            .status(200)
            .cookie("accessToken", accessToken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json({
                success: true,
                statusCode: 200,
                message: "Login successful",
                data:user,
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



const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }

        // Send Reset Email
        const fullName = user.fullName || `${user.firstName} ${user.lastName}` || "User";
        await sendEmail(email, fullName);


        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Password reset email sent successfully",
        });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Server error in forgot password",
        });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { userId, newPassword, confirmPassword } = req.body;

        if (!userId || !newPassword || !confirmPassword) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Passwords do not match",
            });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }
        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Server error in resetting password",
        });
    }
};


const logout = async (req, res) => {
    try {
      const userId = req?.user?.userId; // Get user ID from auth middleware
      console.log(`Logging out user: ${userId}`); // ✅ Use userId for debugging

  
      res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .status(200)
        .json({
          success: true,
          statusCode: 200,
          message: "User logged out successfully",
        });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        success: false,
        message: "server error in logout user",
      });
    }
  };


const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    console.log("incomingRefreshToken :", incomingRefreshToken);
  
    if (!incomingRefreshToken) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "unauthorized request",
      });
    }
  
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      console.log("Decoded Token:", decodedToken);
  
      const user = await User.findById(decodedToken?._id);
      console.log(user);
  
      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          success: false,
          message: "invalid refresh token: user not found",
        });
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
        return res.status(401).json({
          statusCode: 401,
          success: false,
          message: "refresh token is expired or has been used",
        });
      }
  
      const accessToken = user?.generateAccessToken();
      const refreshToken = user?.generateRefreshToken();
  
      if (!accessToken || !refreshToken) {
        res.status(500).json({
          statusCode: 500,
          success: false,
          message: "something went wrong while generating tokens",
        });
        return;
      }
  
      user.refreshToken = refreshToken;
  
      await user.save({ validateBeforeSave: false });
  
      return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOpt)
        .cookie("refreshToken", refreshToken, cookieOpt)
        .json({
          statusCode: 200,
          success: true,
          data: { accessToken },
          message: "access token refreshed",
        });
    } catch (error) {
      return res.status(401).json({
        statusCode: 401,
        sucess: false,
        message: error?.message || "invalid refresh token",
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

  const updateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    console.log("updateData : ",updateData)
    try {
        // Find user by ID and update
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Server error in updating user",
        });
    }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
          return res.status(404).json({
              statusCode: 404,
              success: false,
              message: "User not found",
          });
      }

      return res.status(200).json({
          statusCode: 200,
          success: true,
          message: "User deleted successfully",
          data: deletedUser,
      });
  } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "Server error in deleting user",
      });
  }
};


  
export { registerUser, loginUser ,forgotPassword,refreshAccessToken,resetPassword,logout , getAllUsers , updateUser , deleteUser};

