import { Router } from "express";
import { createCard ,updateCard , deleteCard, getAllGiftCards,getCategoriesGiftCards,getGiftCardById} from "../controllers/card.controller.js";
// import { createCard ,updateCard , deleteCard, getAllGiftCards,getCategoriesGiftCards,getGiftCardById} from "../controllers/card.controller.js";
import { upload } from "../helper/multer.helper.js";
export const cardRoute = Router();

cardRoute.route("/create-card").post(upload.single('img'),createCard);
cardRoute.route("/update-card/:id").put(upload.single('img'),updateCard);
cardRoute.route("/delete-card/:id").delete(deleteCard);
cardRoute.route("/get-all-cards").get(getAllGiftCards);
cardRoute.route("/get-card/:id").get(getGiftCardById);

cardRoute.route("/get-cards-by-category/:category").get(getCategoriesGiftCards);
cardRoute.route("/get-card/:id").get(getGiftCardById);

