import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "GiftCard", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
