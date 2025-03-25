import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: [String], // Updated to store multiple prices as an array of numbers
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    categories: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    expiryDate: Date,
    issuedTo: String, // User email
    isUsed: { type: Boolean, default: false },
});

const cardModel = mongoose.model("Card", cardSchema);
export default cardModel;