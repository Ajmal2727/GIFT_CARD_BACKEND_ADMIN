import { uploadOnCloudinary } from "../helper/cloudinary.helper.js";
import Card from "../models/card.model.js"


export const createCard = async (req, res) => {
    try {
      const { name, desc, price, quantity, categories } = req.body;
      const cardImg = req?.file?.path;
  
      // Validate required fields
      if (!name || !desc || !price || !quantity) {
        return res.status(406).json({
          statusCode: 406,
          success: false,
          message: "Required fields are missing",
        });
      }
  
      // Ensure price is stored correctly (convert to an array of numbers)
      const priceArray = Array.isArray(price)
        ? price.map((p) => Number(p))
        : price.split(",").map((p) => Number(p.trim()));
  
      // Check for invalid prices (e.g., if conversion fails)
      if (priceArray.some(isNaN)) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: "Invalid price format",
        });
      }
  
      // Upload image to Cloudinary
      const uploadedImage = await uploadOnCloudinary(cardImg);
  
      // Create and save the card
      const card = new Card({
        name,
        desc,
        price: priceArray,
        quantity,
        img: uploadedImage.url,
        categories,
      });
  
      await card.save();
  
      return res.status(201).json({
        statusCode: 201,
        success: true,
        data: card,
      });
    } catch (error) {
      console.error("Error in createCard:", error);
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Server error while creating card",
      });
    }
  };
  



// Update Card
export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = { ...req.body };

        // Check if a file is uploaded
        if (req.file) {
            const uploadedImage = await uploadOnCloudinary(req.file.path);
            if (!uploadedImage || !uploadedImage.url) {
                return res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: "Error uploading image to Cloudinary",
                });
            }
            updatedData.img = uploadedImage.url; // Save Cloudinary URL in the database
        }

        // Update the card
        const card = await Card.findByIdAndUpdate(id, updatedData, { new: true });

        if (!card) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Card not found",
            });
        }

        res.json({
            statusCode: 200,
            success: true,
            data: card,
        });
    } catch (error) {
        console.error("Update card error:", error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Server error while updating card",
        });
    }
};


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
         if(!cards){
           return res.status(404).json({statusCode:404,success:false,message:"Card not found"})
         }
         return res.status(200).json({statusCode:200,success:true,data:cards})
    } catch (error) {
        console.log(error)
        
    }
}

export const getGiftCardById = async (req, res) => {
    try {
      const { id } = req.params; // Extract id from URL
      const card = await Card.findById(id);
  
      if (!card) {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: "Card not found",
        });
      }
  
      return res.status(200).json({
        statusCode: 200,
        success: true,
        data: card,
      });
    } catch (error) {
      console.error("Error fetching card by ID:", error);
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Internal server error",
      });
    }
  };
  

export const getCategoriesGiftCards = async(req, res) => {
    try {
        const { category } = req.params;
    
        if (!category) {
          return res.status(400).json({ message: "Category is required" });
        }
    
        const giftCards = await Card.find({ categories: category });
    
        if (giftCards.length === 0) {
          return res.status(404).json({ message: "No gift cards found for this category" });
        }
    
        res.status(200).json({statusCode:200,success:true,data:giftCards});
      } catch (error) {
        console.error("Error fetching gift cards by category:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

