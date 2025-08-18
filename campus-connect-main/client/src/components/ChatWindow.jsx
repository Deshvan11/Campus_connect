import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
const socket = io(`${import.meta.env.VITE_API_URL}`);

const ChatWindow = ({ chat, onClose, type }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile/${userId}`);
        setLoggedInUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const api =
          type === 'group'
            ? `${import.meta.env.VITE_API_URL}/chat/${chat._id}`
            : `${import.meta.env.VITE_API_URL}/chat/${localStorage.getItem('userId')}/${chat._id}`;
        const response = await axios.get(api);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUserProfile();
    fetchMessages();

    if (type === 'group') {
      socket.emit('joinGroupRoom', chat._id);
    } else {
      const userId = localStorage.getItem('userId');
      socket.emit('joinUserRoom', userId);
    }

    // Listen for new messages
    const handleNewPrivateMessage = (message) => {
      console.log(message, type, chat._id, message.receiver);
      if (type !== 'group' && message.receiver === localStorage.getItem('userId') && message.sender === chat._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    const handleNewGroupMessage = (message) => {
      if (type === 'group' && message.group === chat._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on('newPrivateMessage', handleNewPrivateMessage);
    socket.on('newGroupMessage', handleNewGroupMessage);

    // Cleanup listeners on unmount or re-render
    return () => {
      socket.off('newPrivateMessage', handleNewPrivateMessage);
      socket.off('newGroupMessage', handleNewGroupMessage);
      socket.disconnect(); 
    };
  }, [chat, type]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const payload = {
        sender: localStorage.getItem('userId'), // Replace with the actual sender ID
        message: newMessage,
        ...(type === 'group' ? { group: chat._id } : { receiver: chat._id }),
      };
      console.log(payload);

      // Emit the message to the server
      if (type === 'group') {
        socket.emit('groupMessage', payload);
      } else {
        socket.emit('privateMessage', payload);
      }

      // Optimistically update the UI
      if(type !== 'group'){
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...payload, timestamp: new Date() },
        ]);
      }
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 mr-3">
            {type === 'group' ? 'G' : chat.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium">{chat.name}</h3>
            <p className="text-xs text-blue-200">
              {type === 'group' ? `${chat.members} members` : 'Direct Message'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-blue-200">
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50" style={{ height: '400px' }}>
        {messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`mb-4 flex ${message.sender._id === loggedInUser._id || message.sender == loggedInUser.userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.sender._id === loggedInUser._id || message.sender == loggedInUser.userId
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none'
                }`}
            >
              {message.sender._id !== loggedInUser._id && (
                <div className="font-medium text-sm mb-1 text-blue-800">{message.sender.name}</div>
              )}
              <p className="text-sm">{message.message}</p>
              <div
                className={`text-xs mt-1 ${message.sender._id === loggedInUser._id ? 'text-blue-200' : 'text-gray-500'
                  }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;