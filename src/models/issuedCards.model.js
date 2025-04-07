import mongoose from "mongoose";

const issuedCardSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    isUsed: { type: Boolean, default: false },
    expiryDate: Date,
  }
,
{
    timestamps: true,
});


export const generateUniqueGiftCardCode = async (usedCodes = new Set()) => {
    let isUnique = false;
    let code = "";
  
    while (!isUnique) {
      code = `BALLYS${Math.floor(100000 + Math.random() * 900000)}`;
  
      const codeExistsInDb = await mongoose.model("IssuedCards").findOne({ code });
      const codeExistsInBatch = usedCodes.has(code);
  
      if (!codeExistsInDb && !codeExistsInBatch) {
        isUnique = true;
        usedCodes.add(code); // add to memory
      }
    }
  
    return code;
  };
  
issuedCardSchema.pre("save", async function (next) {
    if (!this.code) {
      this.code = await generateUniqueGiftCardCode();
    }
    if (!this.expiryDate) {
      this.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    }
    next();
  });

const issuedCardModel = new mongoose.model("IssuedCards", issuedCardSchema) 

export default issuedCardModel;


