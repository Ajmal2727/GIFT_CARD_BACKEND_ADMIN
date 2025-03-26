import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
  paymentMethod: { type: String, enum: ["upi", "bank", "usdt", "bitcoin"], required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  utrId: { type: String }, 
  paymentScreenshot: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
