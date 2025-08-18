const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Custom ID
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Reference to User._id
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" }, // Reference to Product._id
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
