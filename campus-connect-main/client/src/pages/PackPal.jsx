import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const userId = localStorage.getItem("userId");
const API = `${import.meta.env.VITE_API_URL}/api/subscription`;

const PackPal = () => {
    const [services, setServices] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [upcomingRenewals, setUpcomingRenewals] = useState([]);
    const [activeTab, setActiveTab] = useState("subscriptions");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, subsRes, renewalsRes] = await Promise.all([
                    axios.get(`${API}/services`),
                    axios.get(`${API}/subscriptions/${userId}`),
                    axios.get(`${API}/upcoming-renewals/${userId}`)
                ]);
                setServices(servicesRes.data);
                setSubscriptions(subsRes.data);
                setUpcomingRenewals(renewalsRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        if (userId) fetchData();
    }, []);

    const handleSubscribe = async (serviceId, planName) => {
        try {
            const response = await axios.post(`${API}/subscribe`, {
                userId,
                serviceId,
                planName,
            });
            alert("Subscription successful!");
            // console.log("Subscription response:", response.data.subscription, subscriptions);
            setSubscriptions([...subscriptions, response.data.subscription]);
        } catch (error) {
            console.error("Error subscribing", error);
            alert("Subscription failed");
        }
    };

    return (
        <div className="bg-white min-h-screen">

            <Navbar />

            {/* Hero Section with a cleaner blue background */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-4 text-center">
                <h1 className="text-5xl font-bold mb-3">Packages</h1>
                <p className="text-xl max-w-2xl mx-auto">
                    Manage subscriptions for meals, laundry, and essential services in your college community
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex border-b mb-6">
                    <button 
                        onClick={() => setActiveTab("subscriptions")}
                        className={`mr-6 py-2 font-medium text-lg ${activeTab === "subscriptions" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                    >
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                            </svg>
                            My Subscriptions
                        </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab("renewals")}
                        className={`mr-6 py-2 font-medium text-lg ${activeTab === "renewals" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                    >
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                            </svg>
                            Upcoming Renewals
                        </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab("services")}
                        className={`py-2 font-medium text-lg ${activeTab === "services" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                    >
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                            </svg>
                            Available Services
                        </span>
                    </button>
                </div>

                {/* Content based on active tab */}
                <div className="py-4">
                    {activeTab === "subscriptions" && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Active Subscriptions</h2>
                            {subscriptions.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {subscriptions.map((sub) => {
                                        const startDate = new Date(sub.startDate);
                                        const renewalDate = new Date(sub.renewalDate);
                                        const duration = Math.ceil((renewalDate - startDate) / (1000 * 60 * 60 * 24));

                                        return (
                                            <div key={sub.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                                                <div className="bg-blue-100 p-4">
                                                    <h3 className="text-xl font-bold text-blue-800">{sub.service.name}</h3>
                                                    <span className="text-sm font-medium text-blue-600">{sub.plan}</span>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-600 mb-2">
                                                        <span className="font-semibold">Price:</span> ₹{sub.amount}
                                                    </p>
                                                    <p className="text-gray-600 mb-2">
                                                        <span className="font-semibold">Duration:</span> {duration} days
                                                    </p>
                                                    <p className="text-gray-600 mb-2">
                                                        <span className="font-semibold">Active since:</span> {startDate.toLocaleDateString()}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        <span className="font-semibold">Renew on:</span> {renewalDate.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p className="text-xl text-gray-500">No active subscriptions</p>
                                    <button 
                                        onClick={() => setActiveTab("services")} 
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Browse available services
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "renewals" && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Upcoming Renewals</h2>
                            {upcomingRenewals.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {upcomingRenewals.map((renewal) => (
                                        <div key={renewal.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-yellow-500 transition-transform hover:scale-105">
                                            <div className="p-4">
                                                <h3 className="text-xl font-bold text-gray-800">{renewal.service.name}</h3>
                                                <div className="mt-3">
                                                    <p className="text-gray-600 mb-2">
                                                        <span className="font-semibold">Plan:</span> {renewal.planName}
                                                    </p>
                                                    <p className="text-gray-600 mb-2">
                                                        <span className="font-semibold">Amount:</span> ₹{renewal.amount}
                                                    </p>
                                                    <p className="text-gray-600 mb-2">
                                                        <span className="font-semibold">Start Date:</span> {new Date(renewal.startDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-gray-600 mb-2">
                                                        <span className="font-semibold">Status:</span> 
                                                        <span className="ml-1 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            {renewal.status}
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-600 font-semibold text-lg mt-3">
                                                        Renews on: {new Date(renewal.renewalDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <p className="text-xl text-gray-500">No upcoming renewals</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "services" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Available Services</h2>
                                
                            </div>
                            {services.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {services.map((service) => (
                                        <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                                            <div className="bg-blue-600 p-4">
                                                <h3 className="text-xl font-bold text-white">{service.name}</h3>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-gray-600 mb-4">{service.description}</p>
                                                <div className="space-y-3">
                                                    {service.plans.map((plan) => (
                                                        <div key={plan.name} className="border rounded-lg p-3">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="font-semibold">{plan.name}</span>
                                                                <span className="text-blue-600 font-bold">₹{plan.price}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-500">{plan.duration} days</span>
                                                                <button
                                                                    onClick={() => handleSubscribe(service._id, plan.name)}
                                                                    className="px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                                                >
                                                                    Subscribe
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p className="text-xl text-gray-500">No services available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />

        </div>
    );
};

export default PackPal;