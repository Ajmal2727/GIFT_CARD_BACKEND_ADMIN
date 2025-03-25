import { Router } from "express";
import { registerUser, loginUser, forgotPassword ,refreshAccessToken,resetPassword,logout} from '../controllers/user.controller.js'
import { verifyToken } from "../middleware/auth.middleware.js";

export const userRoute = Router();


userRoute.route('/register').post(registerUser);
userRoute.route('/login').post(loginUser);
userRoute.route('/forgot-password').post(forgotPassword);
userRoute.route('/reset-password').put(resetPassword);
userRoute.route('/refresh').get(refreshAccessToken);
userRoute.route('/logout').get(logout);

// protected routes
userRoute.use(verifyToken);

// upi
// bank account
// usdt
// bitcoin


