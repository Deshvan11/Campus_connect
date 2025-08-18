// socket.js
const Message = require('./models/Message');
const GroupMessage = require('./models/GroupMessage');
const User = require('./models/user');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('⚡ New client connected');
    console.log(Array.from(socket.rooms));

    // Join user-specific room
    socket.on('joinUserRoom', (userId) => {
      socket.join(userId);
    });

    // Private Message
    socket.on('privateMessage', async ({ sender, receiver, message }) => {

        console.log(sender, receiver, message, "private message");

        const senderUser = await User.findOne({userId: sender});
        if (!senderUser) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        const receiverUser = await User.findOne({_id: receiver});
        if (!receiverUser) {
            return res.status(404).json({ message: 'Receiver not found' });
        }
    
      const newMsg = await Message.create({ sender: senderUser._id, receiver, message });
      // console.log(Array.from(socket.rooms))
      io.to(receiverUser.userId).emit('newPrivateMessage', { ...newMsg._doc, sender: senderUser });
    });

    // Group Chat
    socket.on('groupMessage', async ({ sender, group, message }) => {
      
        const senderUser = await User.findOne({userId: sender});
        if (!senderUser) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        const newGroupMsg = await GroupMessage.create({ sender: senderUser._id, group, message });

      io.to(group).emit('newGroupMessage', { ...newGroupMsg._doc, sender: senderUser });
    });

    // Join group room
    socket.on('joinGroupRoom', (groupId) => {
      socket.join(groupId);
    });

    socket.on('disconnect', () => {
      console.log('🔥 User disconnected');
    });
  });
};
