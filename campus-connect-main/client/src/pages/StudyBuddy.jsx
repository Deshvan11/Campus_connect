import React, { useState, useEffect } from 'react';
import { Search, User, Users, Book, MessageCircle } from 'lucide-react';
import IndividualBuddiesTab from '../components/IndividualBuddiesTab';
import StudyGroupsTab from '../components/StudyGroupTabs';
import ChatTab from '../components/ChatTab';
import StatsCard from '../components/StatsCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import RequestsTab from '../components/RequestsTab';
import axios from 'axios';


const StudyBuddy = () => {
    const [activeTab, setActiveTab] = useState('individual');
    const [statsData, setStatsData] = useState({
        connections: 0,
        groupsJoined: 0,
        groupsCreated: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/study-buddy/stats/` + localStorage.getItem("userId")); // Replace with your backend endpoint
                setStatsData(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    // Function to render the active tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'individual':
                return <IndividualBuddiesTab searchQuery={searchQuery} />;
            case 'groups':
                return <StudyGroupsTab searchQuery={searchQuery} />;
            case 'chat':
                return <ChatTab />;
            case 'requests':
                return <RequestsTab />;
            default:
                return <IndividualBuddiesTab searchQuery={searchQuery} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Navigation */}
            <Navbar />

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <div className="bg-blue-900 text-white py-12 px-10 md:px-20 lg:px-32">
                    <div className="container mx-auto px-4 text-center mb-10">
                        <h1 className="text-4xl font-bold mb-2">Study Buddy</h1>
                        <p className="max-w-2xl mx-auto">Find Your Perfect Study Partner</p>
                        <p className="mb-8 max-w-2xl mx-auto">Connect with fellow students, join study groups, and ace your exams together!</p>

                        <div className="max-w-2xl mx-auto relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by subject, topic, or study group..."
                                className="w-full py-3 px-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white "
                            />
                            <button className="absolute right-2 top-2 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700">
                                <Search size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="container mx-auto px-10 md:px-20 lg:px-40 py-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 -mt-8">
                            <StatsCard
                                icon={<User size={24} />}
                                title="Connections"
                                value={statsData.connections}
                                color="blue"
                            />
                            <StatsCard
                                icon={<Users size={24} />}
                                title="Groups Joined"
                                value={statsData.groupsJoined}
                                color="blue"
                            />
                            <StatsCard
                                icon={<Book size={24} />}
                                title="Groups Created"
                                value={statsData.groupsCreated}
                                color="blue"
                            />
                        </div>
                    </div>

                </div>

                {/* Tabs */}
                <div className="container mx-auto px-5 md:px-20 lg:px-32 py-20">
                    <div className="bg-white rounded-lg shadow-md mb-8">
                        <div className="flex border-b">
                            <button
                                className={`flex-1 py-4 text-center font-medium ${activeTab === 'individual' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('individual')}
                            >
                                <User size={20} className="inline mr-2" />
                                Individual Buddies
                            </button>
                            <button
                                className={`flex-1 py-4 text-center font-medium ${activeTab === 'groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('groups')}
                            >
                                <Users size={20} className="inline mr-2" />
                                Study Groups
                            </button>
                            <button
                                className={`flex-1 py-4 text-center font-medium ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('chat')}
                            >
                                <MessageCircle size={20} className="inline mr-2" />
                                Chat
                            </button>
                            <button
                                className={`flex-1 py-4 text-center font-medium ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('requests')}
                            >
                                <Users size={20} className="inline mr-2" />
                                Requests
                            </button>
                        </div>
                        <div className="p-4">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default StudyBuddy;