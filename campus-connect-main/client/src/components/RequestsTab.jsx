import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Users, Check, X as XIcon } from 'lucide-react';

const RequestsTab = () => {
  const [connectionRequests, setConnectionRequests] = useState([]);
    const [groupJoinRequests, setGroupJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch connection requests for the logged-in user
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const loggedInUserId = localStorage.getItem('userId');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/connection-requests/${loggedInUserId}`);
        console.log(response.data);
        let newConn = response.data.connectionRequests.filter((request) => request.status != "accepted");
        setConnectionRequests(newConn);
        let newGroup = response.data.groupJoinRequests.filter((request) => request.status != "accepted");
        setGroupJoinRequests(newGroup);
      } catch (error) {
        console.error('Error fetching connection requests:', error);
        setError(error.response?.data?.message || 'Failed to fetch connection requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    
  }, []);

  // Handle accepting a request
  const handleAccept = async (request) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/connect/accept/${request._id}`);
      alert('Connection request accepted!');

      // Update the UI to reflect the accepted request
      setConnectionRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== request._id)
      );
    } catch (error) {
      console.error('Error accepting connection request:', error);
      alert('Failed to accept connection request.');
    }
  };

  // Handle Group accepting a request
  const handleGroupAccept = async (request) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/groups/join/accept/${request._id}`);
        alert('Group join request accepted!');
        // Update the UI to reflect the accepted request
        setGroupJoinRequests((prevRequests) =>
            prevRequests.filter((req) => req._id !== request._id)
        );
    } catch (error) {
        console.error('Error accepting group join request:', error);
        alert('Failed to accept group join request.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (connectionRequests.length === 0 && groupJoinRequests.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No pending connection requests</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-blue-900 mb-4">Pending Connection Requests</h2>
      <div className="space-y-4">
        {connectionRequests.map((request) => (
          <div key={request._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-4">
                  {request.sender.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{request.sender.name} wants to connect with you</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Email: {request.sender.email}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(request)}
                  className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
                  title="Accept"
                >
                  <Check size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {groupJoinRequests.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-blue-900 mb-4">Pending Group Join Requests</h2>
            {groupJoinRequests.map((request) => (
              <div key={request._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-4">
                      <Users size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium">{request.group.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Requested by: {request.user.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGroupAccept(request)}
                      className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
                      title="Accept"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsTab;