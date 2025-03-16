import { Router } from "express";
import { createCard ,updateCard , deleteCard, getAllGiftCards} from "../controllers/card.controller.js";
import { upload } from "../helper/multer.helper.js";
export const cardRoute = Router();

cardRoute.route("/create-card").post(upload.single('userIdentity'),createCard);
cardRoute.route("/update-card/:id").put(updateCard);
cardRoute.route("/delete-card/:id").delete(deleteCard);
cardRoute.route("/get-all-cards").get(getAllGiftCards);

