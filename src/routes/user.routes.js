import { Router } from "express";
import { registerUser, login, getAllUsers} from '../controllers/user.controller.js'
import { verifyToken } from "../middleware/auth.middleware.js";
// import { upload } from "../helper/multer.helper.js";

export const userRoute = Router();


userRoute.route('/register').post(registerUser);
userRoute.route('/login').post(login);
userRoute.route('/get-all-users').get(getAllUsers);


// protected routes
// userRoute.use(verifyToken);


