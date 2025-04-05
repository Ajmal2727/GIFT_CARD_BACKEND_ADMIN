import {Router} from "express"
import {createTransaction,getTransactionByUserId,getTransactionByStatus,getAllTransaction , updateTransactionStatus,claimGiftCard} from "../controllers/transaction.controller.js"
import { upload } from "../helper/multer.helper.js";

export const transactionRoute = Router();

transactionRoute.route("/create-transaction").post(upload.single('paymentScreenshot') , createTransaction);
transactionRoute.route("/get-transaction/:id").get(getTransactionByUserId);
transactionRoute.route("/get-transaction-by-status/:status").get(getTransactionByStatus);
transactionRoute.route("/get-all-transactions").get(getAllTransaction);
transactionRoute.route("/update-transactions/:transactionId").put(updateTransactionStatus);
transactionRoute.route("/claim-gift-card").post(claimGiftCard);