import { uploadOnCloudinary } from "../helper/cloudinary.helper.js";
import Card from "../models/card.model.js"


export const createCard = async (req, res) => {
    try {
        const { name, desc, price, code, quantity , categories } = req.body;
         const cardImg = req?.file?.path;
        // Validate required fields
        if (!name || !desc || !price || !code || !quantity ) {
            return res.status(406).json({
                statusCode: 406,
                success: false,
                message: "Required fields are missing"
            });
        }

        // Upload image to Cloudinary
        const uploadedImage = await uploadOnCloudinary(cardImg);

        // Create and save the card
        const card = new Card({
            name,
            desc,
            price,
            code,
            quantity,
            img: uploadedImage.url,
            categories
        });

        await card.save();

        return res.status(201).json({
            statusCode: 201,  // Corrected status code
            success: true,
            data: card
        });
    } catch (error) {
        console.error("Error in createCard:", error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Server error while creating card"
        });
    }
};


// Update Card
export  const updateCard =  async (req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!card) {
            return res.status(404).json({ success: false, message: "Card not found" });
        }
        res.json({ success: true, card });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Delete Card
export const deleteCard = async (req, res) => {
    try {
        const card = await Card.findByIdAndDelete(req.params.id);
        if (!card) {
            return res.status(404).json({ success: false, message: "Card not found" });
        }
        res.json({ success: true, message: "Card deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getAllGiftCards = async(req,res) => {
    try {
         const cards = await Card.find({});
         if(cards){
           return res.status(404).json({statusCode:404,success:false,message:"Card not found"})
         }
         return res.status(200).json({statusCode:200,success:true,data:cards})
    } catch (error) {
        console.log(error)
        
    }
}