import {Router} from "express"
import {addToCart , getUserCart , updateCart , deleteCart ,clearCart} from "../controllers/cart.controller.js"
export const cartRouter = Router();

cartRouter.post("/add-to-cart",addToCart)
cartRouter.get("/get-user-cart/:userId",getUserCart)
cartRouter.put("/update-cart",updateCart)
cartRouter.put("/delete-cart",deleteCart)
cartRouter.delete("/clear-cart/:userId",clearCart)