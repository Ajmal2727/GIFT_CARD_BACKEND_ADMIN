import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: [String],
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
});


const cardModel = mongoose.model("Card", cardSchema);
export default cardModel;