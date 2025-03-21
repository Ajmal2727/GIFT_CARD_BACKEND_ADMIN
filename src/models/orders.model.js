import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
  items: [
    {
      giftCardId: { type: mongoose.Schema.Types.ObjectId, ref: "GiftCard", required: true },
      giftCardName: { type: String, required: true },
      giftCardAmount: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
    }
  ],
  totalAmount: { type: Number, required: true }, // Store total order amount
  recipientEmail: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
