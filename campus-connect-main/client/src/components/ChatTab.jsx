import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ChatWindow from './ChatWindow';
import axios from 'axios';

const ChatTab = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch chats when the component mounts
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/chatwala/available/${localStorage.getItem("userId")}`);
        const allchats = [...response.data.groups, ...response.data.users];
        setChats(allchats);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-6">
      {selectedChat ? (
        <ChatWindow chat={selectedChat} onClose={() => setSelectedChat(null)} type={selectedChat.creator ? "group" : "solo"} />
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <div className="flex items-center p-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="h-64 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center p-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-3">
                    {chat.type === 'group' ? 'G' : chat.name.charAt(0)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{chat.name}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <p className="text-sm text-center text-gray-500">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatTab;