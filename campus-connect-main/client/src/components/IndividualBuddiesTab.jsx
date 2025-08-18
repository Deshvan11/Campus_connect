import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IndividualBuddiesTab = ({searchQuery}) => {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]); // Track pending requests

  // Fetch all users and the logged-in user's data
  useEffect(() => {
    const fetchUsersAndLoggedInUser = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/users`);
        const allUsers = usersResponse.data;

        // Fetch the logged-in user's data
        const loggedInUserId = localStorage.getItem('userId');
        const loggedInUserResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile/${loggedInUserId}`);
        const loggedInUserData = loggedInUserResponse.data;

        // Exclude the logged-in user from the users list
        const filteredUsers = allUsers.filter((user) => user._id !== loggedInUserData._id);
        console.log(filteredUsers, loggedInUserData);
        setUsers(filteredUsers);
        setLoggedInUser(loggedInUserData);
      } catch (error) {
        console.error('Error fetching users or logged-in user:', error);
        setError(error.response?.data?.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndLoggedInUser();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredUsers.length === 0) {
    return <div className="text-gray-500 text-center">No users found.</div>;
  }

  // Handle sending a connection request
  const handleSendRequest = async (receiverId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/connect`, {
        senderId: localStorage.getItem('userId'),
        receiverId,
      });
      setPendingRequests((prev) => [...prev, receiverId]); // Add to pending requests
      alert('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (users.length === 0) {
    return <div className="text-gray-500 text-center">No users found.</div>;
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-4">
                {user.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.interests?.join(', ')}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span className="mr-3">Email: {user.email}</span>
                </div>
              </div>
            </div>
            {loggedInUser?.following.includes(user._id) ? (
              <button className="bg-green-600 text-white py-1 px-4 rounded-md text-sm" disabled>
                Connected
              </button>
            ) : pendingRequests.includes(user._id) ? ( // Check if the request is pending
              <button className="bg-yellow-500 text-white py-1 px-4 rounded-md text-sm" disabled>
                Pending
              </button>
            ) : (
              <button
                className="bg-blue-600 text-white py-1 px-4 rounded-md text-sm hover:bg-blue-700"
                onClick={() => handleSendRequest(user._id)}
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndividualBuddiesTab;