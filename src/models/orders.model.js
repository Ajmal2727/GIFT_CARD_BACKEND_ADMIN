import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Card", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
    }
  ],
  totalAmount: { type: Number, required: true }, // Store total order amount
  recipientEmail: { type: String, required: true },
  recipientFullName: { type: String, required: true },
  status: { type: String, enum: ["pending", "Approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
