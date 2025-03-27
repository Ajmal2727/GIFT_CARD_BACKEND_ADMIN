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


const generateUniqueGiftCardCode = async function () {
    let isUnique = false;
    let code = "";
  
    while (!isUnique) {
      code = `BALLYS${Math.floor(100000 + Math.random() * 900000)}`;
      const existingCard = await mongoose.model("Card").findOne({ code });
      if (!existingCard) isUnique = true;
    }
  
    return code;
  };
  
  // Pre-save hook to auto-generate code and expiryDate
  cardSchema.pre("save", async function (next) {
    if (!this.code) {
      this.code = await generateUniqueGiftCardCode(); // Assign unique gift card code
    }
    if (!this.expiryDate) {
      this.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year expiry
    }
    next();
  });


const cardModel = mongoose.model("Card", cardSchema);
export default cardModel;