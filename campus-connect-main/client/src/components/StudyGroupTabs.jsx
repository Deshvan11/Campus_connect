import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, PlusCircle } from 'lucide-react';
import CreateStudyGroupModal from './CreateStudyGroup';

const StudyGroupsTab = ({searchQuery}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]); // Track pending join requests

    // Fetch all study groups
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const loggedInUserId = localStorage.getItem('userId');
                const loggedInUserResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile/${loggedInUserId}`);
                setLoggedInUser(loggedInUserResponse.data);

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/groups`);
                setGroups(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching study groups:', error);
                setError(error.response?.data?.message || 'Failed to fetch study groups.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredGroups.length === 0) {
        return <div className="text-gray-500 text-center">No groups found.</div>;
      }

    // Handle sending a join request
    const handleJoinRequest = async (groupId) => {
        try {
            const userId = localStorage.getItem('userId');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/groups/join/${groupId}`, { senderId: userId });
            setPendingRequests((prev) => [...prev, groupId]); // Add groupId to pending requests
            alert('Join request sent!');
        } catch (error) {
            console.error('Error sending join request:', error);
            alert('Failed to send join request.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-blue-900">Active Study Groups</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    <PlusCircle size={18} className="mr-2" />
                    Create Study Group
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGroups.map((group) => (
                    <div key={group._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <h3 className="font-medium text-blue-900">{group.name}</h3>
                            <p className="text-gray-600">{group.domain}</p>
                            <div className="flex items-center mt-2">
                                <User size={16} className="text-gray-500 mr-1" />
                                <span className="text-sm text-gray-500">{group.members.length} members</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Created by: {group.creator.name}
                            </div>
                            {loggedInUser && !group.members.includes(loggedInUser._id) && (
                                pendingRequests.includes(group._id) ? ( // Check if the request is pending
                                    <button
                                        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md"
                                        disabled
                                    >
                                        Pending
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoinRequest(group._id)}
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Join Group
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <CreateStudyGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onGroupCreated={(newGroup) => setGroups((prevGroups) => [...prevGroups, newGroup])}
            />
        </div>
    );
};

export default StudyGroupsTab;