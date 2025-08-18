import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  DollarSign,
  ShoppingCart,
  Package,
  Bell,
  Calendar,
  UserSearch
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import ModuleCard from '../components/ModuleCard';

const Dashboard = () => {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({});

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
        setUserProfile(response.data);

      } catch (error) {
        console.error("Error fetching user profile:", error.response?.data?.message || error.message);
        alert("Failed to load profile data. Please try again.");
      }
    };

    fetchUserProfile();
  }, [])

  const userData = {
    name: userProfile.name || "John Doe",
    enrollmentNumber: userProfile.enrollmentNumber || "123456789",
    recentActivity: [
      { type: "Study", message: "New study group formed for Data Structures", time: "1 hour ago" },
      { type: "Budget", message: "Monthly spending report available", time: "Yesterday" },
      { type: "Market", message: "Your item 'Calculus Textbook' has a new offer", time: "2 days ago" }
    ],
    upcomingEvents: [
      { title: "Algorithm Study Group", date: "Tomorrow, 4:00 PM" },
      { title: "Campus Market Fair", date: "This Weekend, 10:00 AM" }
    ]
  };

  const handleModuleClick = (module) => {
    // In a real app, you would navigate to specific module pages
    console.log(`Navigating to ${module} module`);
    navigate(`/${module}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        {/* Welcome Hero */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-row md:items-center md:justify-between bg-campus-purple text-white p-6 rounded-lg shadow-md">
              <div>
                <h1 className="text-2xl font-bold ">
                  Welcome back, {userData.name}!
                </h1>
                <p className=" mt-1">
                  What would you like to explore today?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Main Modules Section */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold mb-4">Your Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ModuleCard
                    title="Study Buddy"
                    description="Connect with students, join study groups, collaborate on projects."
                    icon={BookOpen}
                    color="bg-campus-purple"
                    onClick={() => handleModuleClick('study-buddy')}
                  />
                  <ModuleCard
                    title="Budget Buddy"
                    description="Track expenses, manage budgets, get AI-powered financial insights."
                    icon={DollarSign}
                    color="bg-campus-green"
                    onClick={() => handleModuleClick('budget-buddy')}
                  />
                  <ModuleCard
                    title="MarketMingle"
                    description="Buy and sell items within your college community."
                    icon={ShoppingCart}
                    color="bg-campus-blue"
                    onClick={() => handleModuleClick('market-mingle')}
                  />
                  <ModuleCard
                    title="Packages"
                    description="Manage subscriptions for meals, laundry, and other services."
                    icon={Package}
                    color="bg-campus-orange"
                    onClick={() => handleModuleClick('pack-pal')}
                  />
                  <ModuleCard
                    title="Faculty Finder"
                    description="Check real-time faculty availability and location"
                    icon={UserSearch}
                    color="bg-red-500"
                    onClick={() => handleModuleClick('faculty-finder')}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;