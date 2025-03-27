import { uploadOnCloudinary } from "../helper/cloudinary.helper.js";
import Transaction from "../models/transaction.model.js";
import Order from "../models/orders.model.js"
import Notification from "../models/notification.model.js";
import { sendEmail } from "../helper/email.helper.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const createTransaction = async (req, res) => {
    console.log(req.body)
    try {
      const { userId, paymentMethod, transactionId, utrId, recipientEmail,recipientFullName,totalAmount  } = req.body;
      const items = JSON.parse(req.body.items);

      if (!userId || !paymentMethod || !totalAmount || !transactionId || !items || items.length === 0) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      // Upload payment screenshot
      const screenshotUrl = req.file ? await uploadOnCloudinary(req.file.path) : null;  
      // Create the transaction
      const transaction = new Transaction({
        userId,
        paymentMethod,
        amount:totalAmount,
        transactionId,
        utrId: (paymentMethod === "upi" || paymentMethod === "bank") ? utrId : undefined,
        paymentScreenshot: screenshotUrl?.url,
        status: "pending"
      });
  
      await transaction.save();
  
      // Create the order linked to the transaction
    //   const totalAmount = items.reduce((acc, item) => acc + item.giftCardAmount * item.quantity, 0);
      const order = new Order({
        userId,
        transactionId: transaction._id,
        items,
        totalAmount,
        recipientEmail,
        recipientFullName,
        status: "pending"
      });
  
      await order.save();

      await Notification.create({
        userId,
        message: "Your order has been placed successfully.",
      });
  
      return res.status(201).json({
        success: true,
        message: "Transaction and order created successfully",
        transaction,
        order
      });
  
    } catch (error) {
      console.error("Error processing transaction and order:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };



export const getTransactionByUserId = async (req,res) => {
    try {
        const transaction = await Transaction.find({userId: req.params.id});

        if(!transaction){
            return res.status(200).json({statusCode:404 ,success: false, message: "Transaction not found" });
        }

        return res.status(200).json({ statusCode:200 , success: true, message: "Transaction found", transaction });
    } catch (error) {
        console.log(error)
    }
}

export const getTransactionByStatus = async (req, res) => {
    try {
        const transaction = await Transaction.find({status: req.params.status});

        if(!transaction){
            return res.status(200).json({statusCode:404 ,success: false, message: "Transaction not found" });
        }
        return res.status(200).json({ statusCode:200 , success: true, message: "Transaction found", transaction });
    } catch (error) {
        console.log(error)
    }
}

export const getAllTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.find({})

        if(!transaction){
            return res.status(200).json({statusCode:404 ,success: false, message: "Transaction not found" });
        }
        return res.status(200).json({ statusCode:200 , success: true, message: "Transaction found", transaction });
    } catch (error) {
        console.log(error)
    }
}


export const updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId } = req.params; 
        const { status } = req.body; 

        if (!transactionId || !status) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Transaction ID and status are required.",
            });
        }

        const allowedStatuses = ["pending", "approved", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Invalid status. Allowed values: pending, approved, rejected.",
            });
        }

        // Update Transaction Status
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            transactionId,
            { status },
            { new: true, runValidators: true } // Return updated transaction
        );

        if (!updatedTransaction) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Transaction not found.",
            });
        }

        // Update Order Status (assuming transactionId is linked to order)
        const updatedOrder = await Order.findOneAndUpdate(
            { transactionId }, 
            { status },     
            { new: true }
        ).populate("items._id")
       console.log("updatedOrder : " , updatedOrder)

        if (!updatedOrder) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Order not found for this transaction.",
            });
        }
        // Send Notification if status is 'approved'
        if (status === "approved") {
            
            await Notification.create({
                userId: updatedTransaction.userId,
                message: "Your order has been approved. Please check your email to redeem gift card.",
            });
            const templatePath = path.join(
                __dirname,
                "../giftcardRedeemTemplate.html"
              );
              const giftCardCodes = updatedOrder.items.map(item => item._id.code).join(", ");

              let emailTemplate = fs.readFileSync(templatePath, "utf8");
              emailTemplate = emailTemplate
              .replace("{{userName}}", updatedOrder.recipientFullName)
        .replace("{{giftAmount}}", updatedOrder.totalAmount)
        .replace("{{giftCardCode}}",giftCardCodes)
        .replace("{{redeemLink}}", `https://ballysfather.com/redeem/${updatedOrder.giftCardCode}`);

            await sendEmail(updatedOrder.recipientEmail,"Gift card Redeem",emailTemplate)
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Transaction and order status updated successfully.",
            data: { updatedTransaction, updatedOrder },
        });

    } catch (error) {
        console.error("Error updating transaction and order:", error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal server error.",
        });
    }
};

