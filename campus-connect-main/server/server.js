const http = require('http');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const {Server} = require('socket.io');
require('dotenv').config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const path = require('path');
const User = require('./models/user');
const StudyGroup = require('./models/StudyGroup'); // Assuming you have a StudyGroup model

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
require('./socket')(io);
const PORT = process.env.PORT || 5000;
connectDB();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(cors())

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Campus Connect!');
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/expenses", expenseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/chat', require('./routes/chatRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));

app.get("/chatwala/available/:userId", async (req, res) => {
    try {
      const loggedInUserId = req.params.userId; // Assuming you have the logged-in user's ID from the request
      const loggedInUser = await User.findOne({ userId: loggedInUserId });
      console.log(loggedInUserId, loggedInUser);
        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }

      // 1. Get users where logged-in user is in their followers or following
      const chatUsers = await User.find({
        $or: [
          { followers: loggedInUser._id },
          { following: loggedInUser._id },
        ]
      }).select("_id name email studyDomain interests");
  
      // 2. Get groups where logged-in user is a member
      const chatGroups = await StudyGroup.find({
        members: loggedInUser._id
      }).select("_id name description domain creator");
  
      res.status(200).json({
        users: chatUsers,
        groups: chatGroups
      });
  
    } catch (err) {
      console.error("Error fetching chat data:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});