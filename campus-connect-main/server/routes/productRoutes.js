const express = require("express");
const Product = require("../models/product");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

const getNextCustomId = async (prefix) => {
  try {
    // Find the latest document in the collection (sorted by ID)
    const lastDoc = await Product.findOne().sort({ id: -1 });

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

// Create a new product
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { title, description, price, category, sellerId } = req.body;

    // Find the user by userId
    const seller = await User.findOne({ userId: sellerId });
    console.log(sellerId, seller);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Generate custom product ID
    const productId = await getNextCustomId("P");

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const product = new Product({
      id: productId,
      title,
      description,
      price,
      category,
      images: imagePaths,
      sellerId: seller._id, // Store ObjectId instead of userId
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "sellerId",
      select: "name userId phoneNumber", // Get name and userId from User model
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).populate({
      path: "sellerId",
      select: "name userId phoneNumber", // Get name and userId from User model
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/seller/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user with this userId
    const seller = await User.findOne({ userId });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" }).populate({
        path: "sellerId",
        select: "name userId phoneNumber", // Get name and userId from User model
      });;
    }

    // Find products where sellerId matches the seller's userId
    const products = await Product.find({ sellerId: seller._id })
      ;

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/seller-products", async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
);

module.exports = router;
