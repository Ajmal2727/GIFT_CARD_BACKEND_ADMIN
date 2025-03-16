import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { saltOrRounds } from '../constant.js';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userImage: { type: String }, 
    email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    },
    dob: {
        type: Date,
        default: null
    },
},
    { timestamps: true }
);


userSchema.methods.generateAccessToken = function () {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
        throw new Error("Missing JWT secret or expiry in environment variables");
    }

    return jwt.sign(
        {
            userId: this._id, // Ensure _id is correctly included
            email: this.email, // Including email for reference
            userIdentity: this.userIdentity // Adding userIdentity for role-based checks
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email, // Including email for reference
            userIdentity: this.userIdentity // Adding userIdentity for role-based checks

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, saltOrRounds);
    next();
});

  

userSchema.methods.isPasswordCorrect = async function (passowrd) {
    return await bcrypt.compare(passowrd, this.password);
};


const User = new mongoose.model("Admin", userSchema);
export default User;