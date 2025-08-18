const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateUserId = async () => {
  const lastUser = await User.findOne().sort({ createdAt: -1 });
  let nextId = "S0001";
  if (lastUser) {
    const lastIdNum = parseInt(lastUser.userId.substring(1)); // Remove "S" and convert
    nextId = "S" + String(lastIdNum + 1).padStart(4, "0"); // Increment and format
  }
  return nextId;
};

exports.signup = async (req, res) => {
  try {
    const { enrollmentNumber, email, password } = req.body;

    let existingUser = await User.findOne({ enrollmentNumber });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    let existingEmail = await User.findOne({email})
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await generateUserId();

    const newUser = new User({
      userId,
      enrollmentNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;

    const user = await User.findOne({ enrollmentNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.userId }, "SECRET_KEY", { expiresIn: "1h" });

    res.json({ message: "Login successful", token, userId: user.userId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
