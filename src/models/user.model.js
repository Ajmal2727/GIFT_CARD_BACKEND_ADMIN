import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const gcuserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    
    },
    userName: {
        type: String,
        required: true,
        unique: true,
      
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        // required: true,
    },
    currency: {
        code: { type: String },
        symbol: { type: String}
    },
    status: {
     type: String,
     enum : ["active", "inactive", "suspended"],
      default: "active"
    },
    verificationToken: { type: String },
    refreshToken: { type: String }, // Storing refresh tokens
}, {
    timestamps: true
});

// Hash password before saving
gcuserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    
    try {
        // const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});
gcuserSchema.methods.generateAccessToken = function () {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
        throw new Error("Missing JWT secret or expiry in environment variables");
    }

    return jwt.sign(
        {
            userId: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

gcuserSchema.methods.generateRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
        throw new Error("Missing JWT secret or expiry in environment variables");
    }
    return jwt.sign(
        {
            _id: this._id,
            email: this.email, // Including email for reference
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

gcuserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};



const User = mongoose.model("User", gcuserSchema);

export default User;
