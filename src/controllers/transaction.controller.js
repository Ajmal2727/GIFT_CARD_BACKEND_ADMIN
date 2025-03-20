import { uploadOnCloudinary } from "../helper/cloudinary.helper.js";
import Transaction from "../models/transaction.model.js";


export const createTransaction = async(req,res) => {
    try {
        const { userId, paymentMethod, amount, transactionId, utrId } = req.body;
        if (!userId || !paymentMethod || !amount || !transactionId) {
          return res.status(400).json({ success: false, message: "Missing required fields" });
        }
    
        // Upload payment screenshot to Cloudinary or S3
        const screenshotUrl = await uploadOnCloudinary(req?.file?.path);
    
        const transaction = new Transaction({
          userId,
          paymentMethod,
          amount,
          transactionId,
          utrId: paymentMethod === "upi" || paymentMethod === "bank" ? utrId : undefined,
          paymentScreenshot: screenshotUrl.url,
        });
    
        await transaction.save();
        return res.status(201).json({ success: true, message: "Transaction submitted successfully", transaction });
    
      } catch (error) {
        console.error("Error processing transaction:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
      }
}

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
        const transaction = await Transaction.find({});

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
        const { transactionId } = req.params; // Get transaction ID from URL params
        const { status } = req.body; // Get new status from request body

        if (!transactionId || !status) {
            return res.status(400).json({
                statusCode:400,
                success: false,
                message: "Transaction ID and status are required.",
            });
        }

        const allowedStatuses = ["pending", "approved", "rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                statusCode:400,
                success: false,
                message: "Invalid status. Allowed values: pending, completed, failed, cancelled.",
            });
        }

        // Find and update the transaction
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            transactionId,
            { status },
            { new: true, runValidators: true } // Return updated transaction
        );

        if (!updatedTransaction) {
            return res.status(404).json({
                statusCode:404,
                success: false,
                message: "Transaction not found.",
            });
        }

        return res.status(200).json({
            statusCode:200,
            success: true,
            message: "Transaction status updated successfully.",
            data: updatedTransaction,
        });

    } catch (error) {
        console.error("Error updating transaction:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
