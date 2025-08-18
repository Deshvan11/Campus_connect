const express = require("express");
const Favorite = require("../models/favorite");
const User = require("../models/user");
const Product = require("../models/product");

const router = express.Router();

const getNextCustomId = async (prefix) => {
    try {
      // Find the latest document in the collection (sorted by ID)
      const lastDoc = await Favorite.findOne().sort({ id: -1 });
  
      let nextNumber = 1; // Default for first record
  
      if (lastDoc) {
        // Extract the numeric part and increment it
        const lastId = lastDoc.id; // Example: "P0001"
        const lastNumber = parseInt(lastId.replace(prefix, ""), 10);
        nextNumber = lastNumber + 1;
      }
  
      // Format the new ID with leading zeros (e.g., P0002, P0010)
      return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
    } catch (error) {
      console.error("Error generating custom ID:", error);
      throw new Error("ID generation failed");
    }
  };

// Add product to favorites
router.post("/", async (req, res) => {
    try {
      const { productId, userId } = req.body;
      // Check if product is already in favorites

        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
            }

            console.log(user);
      const existingFavorite = await Favorite.findOne({ productId });
      if (existingFavorite) {
        // If exists, remove from favorites
        await Favorite.deleteOne({ id: existingFavorite.id });
        return res.json({ message: "Removed from favorites" });
      }
  
      // Generate new Favorite ID
      const favoriteId = await getNextCustomId("F");
      const favorite = new Favorite({
        id: favoriteId,
        userId: user._id,
        productId,
      });
  
      await favorite.save();
      res.json(favorite);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

  router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId) // Get userId from query parameters
        const user = await User.findOne({ userId: userId });
        console.log(user) // Get userId from query parameters
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

      const favorites = await Favorite.find({ userId: user._id }).populate({
        path: "productId", // Populate productId from Product model
        populate: {
          path: "sellerId", // Nested populate for sellerId from User model
          select: "name userId phoneNumber", // Select specific fields from User model
        },
      });
      res.json(favorites);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
