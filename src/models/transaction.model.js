import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
  paymentMethod: { type: String, enum: ["upi", "bank", "usdt", "bitcoin","reward-point"], required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String},
  utrId: { type: String }, 
  paymentScreenshot: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
