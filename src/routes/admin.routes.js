import { Router } from "express";
import { registerUser, login, getAllUsers} from '../controllers/admin.controller.js'
import { verifyToken } from "../middleware/auth.middleware.js";
// import { upload } from "../helper/multer.helper.js";

export const adminRoute = Router();


adminRoute.route('/register').post(registerUser);
adminRoute.route('/login').post(login);
adminRoute.route('/get-all-users').get(getAllUsers);


// protected routes
// userRoute.use(verifyToken);


