import React, { useEffect, useState } from 'react';
import { 
  User, 
  Edit, 
  Save, 
  X 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  
  useEffect(() => {
    const API = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/api`,
      headers: { "Content-Type": "application/json" },
    });

    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await API.get(`/user/profile/${userId}`);
        console.log(response.data);
        setUserData(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error.response?.data?.message || error.message);
        alert("Failed to load profile data. Please try again.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const API = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/api`,
      headers: { "Content-Type": "application/json" },
    });

    const userId = localStorage.getItem('userId');
    try {
      const response = await API.put(`/user/profile/${userId}`, formData);
      console.log("Profile updated successfully:", response.data);
      setUserData(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message || error.message);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-campus-purple to-campus-blue p-8 text-white">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-24 h-24 rounded-full bg-campus-blue p-1 mb-4 md:mb-0 md:mr-6 flex items-center justify-center">
                    <User size={40} className="text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-campus-indigo text-2xl font-bold">{userData.name}</h1>
                  <p className="text-campus-indigo text-opacity-90">{userData.studyDomain} Student</p>
                </div>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="mt-4 md:mt-0 bg-white text-campus-purple py-2 px-4 rounded-lg flex items-center hover:bg-opacity-90 transition-colors"
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <button 
                      onClick={handleSave}
                      className="bg-white text-campus-purple py-2 px-4 rounded-lg flex items-center hover:bg-opacity-90 transition-colors"
                    >
                      <Save size={18} className="mr-2" />
                      Save
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-white bg-opacity-20 text-white py-2 px-4 rounded-lg flex items-center hover:bg-opacity-30 transition-colors"
                    >
                      <X size={18} className="mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                    activeTab === 'personal' 
                      ? 'text-campus-purple border-b-2 border-campus-purple' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Info
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-8">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-lg">{userData.name}</div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-lg">{userData.email}</div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-lg">{userData.phoneNumber}</div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="enrollmentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Enrollment Number
                      </label>
                      <div className="p-2 bg-gray-50 rounded-lg">{userData.enrollmentNumber}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-3">Academic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Study Domain
                    </label>
                    <div className="p-2 bg-gray-50 rounded-lg">{userData.studyDomain}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Areas of Interest
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {userData.interests?.map(interest => (
                        <span key={interest} className="bg-campus-purple bg-opacity-10 text-white px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;