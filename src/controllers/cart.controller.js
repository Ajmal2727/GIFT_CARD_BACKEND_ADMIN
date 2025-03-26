import Cart from "../models/cart.model.js";

const addToCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Ensure items is always treated as an array
    const normalizedItems = Array.isArray(items) ? items : [items];

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: normalizedItems });
    } else {
      normalizedItems.forEach((newItem) => {
        const existingItem = cart.items.find((item) =>
          item._id.toString() === newItem._id
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity; // Update quantity if item exists
        } else {
          cart.items.push(newItem); // Add new item
        }
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Error adding to cart" });
  }
};
  
  // Get user cart
  const getUserCart =  async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId }).populate("items");
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      res.status(200).json(cart); 
    } catch (error) {
      res.status(500).json({ error: "Error fetching cart" });
    }
  }
  
  // Update item quantity
 const updateCart = async (req, res) => {
    try {
      const { userId, itemId, quantity } = req.body;
  
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const item = cart.items.find((item) => item._id.equals(itemId));
      if (!item) return res.status(404).json({ message: "Item not found" });
  
      item.quantity = quantity;
  
      // Remove item if quantity is zero
      if (item.quantity <= 0) {
        cart.items = cart.items.filter((item) => !item._id.equals(itemId));
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: "Error updating cart" });
    }
  }
  
  // Remove item from cart
  const deleteCart = async (req, res) => {
    try {
      const { userId, itemId } = req.body;
  
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      cart.items = cart.items.filter((item) => !item._id.equals(itemId));
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: "Error removing item" });
    }
  }
  
  // Clear cart
  const clearCart =  async (req, res) => {
    try {
      await Cart.findOneAndDelete({ userId: req.params.userId });
      res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ error: "Error clearing cart" });
    }
  }
  
export {addToCart , getUserCart , updateCart , deleteCart ,clearCart }