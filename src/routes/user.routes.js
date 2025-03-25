import { Router } from "express";
import { registerUser, loginUser, forgotPassword ,refreshAccessToken,resetPassword,logout , getAllUsers , updateUser ,deleteUser, verifyUserToken} from '../controllers/user.controller.js'
import { verifyToken } from "../middleware/auth.middleware.js";

export const userRoute = Router();


userRoute.route('/register').post(registerUser);
userRoute.route('/login').post(loginUser);
userRoute.route('/forgot-password').post(forgotPassword);
userRoute.route('/reset-password').put(resetPassword);
userRoute.route('/refresh').get(refreshAccessToken);
userRoute.route('/logout').get(logout);
userRoute.route('/update-user/:id').put(updateUser);
userRoute.route('/delete-user/:id').delete(deleteUser);
userRoute.route('/get-all-users').get(getAllUsers);
userRoute.route('/verify-token/:token').get(verifyUserToken);


// protected routes
userRoute.use(verifyToken);

// upi
// bank account
// usdt
// bitcoin


