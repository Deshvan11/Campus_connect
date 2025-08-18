import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FacultyTimeSlot = () => {
  const [facultyName, setFacultyName] = useState("");
  const [facultyData, setFacultyData] = useState(null);
  const [error, setError] = useState("");

  const fetchFacultyData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/faculty/${facultyName}`
      );
      console.log(res.data);
      setFacultyData(res.data);
      setError("");
    } catch (err) {
      setFacultyData(null);
      setError("Faculty not found or server error.");
    }
  };

  const getStatus = () => {
    if (!facultyData?.isWorking) {
      return {
        text: "Faculty not available (outside working hours)",
        color: "bg-gray-500"
      };
    } else if (facultyData?.isFree) {
      return {
        text: "Faculty is Free",
        color: "bg-green-500"
      };
    } else {
      return {
        text: "Faculty is Busy",
        color: "bg-red-500"
      };
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Blue header section styled like the image */}
      <div className="bg-blue-700 w-full py-16 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Faculty Finder</h1>
        <p className="text-xl max-w-3xl mx-auto">
          Find faculty availability status in your college community
        </p>
      </div>

      {/* Single search tab */}
      <div className="w-full max-w-6xl mx-auto px-4 mt-8">
        <div className="flex space-x-4 mb-8">
          <button
            className="flex items-center px-4 py-2 rounded-md bg-blue-100 text-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Search Faculty
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Faculty</h2>
        
        {/* Search section */}
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Faculty Name"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
            />
            <button
              onClick={fetchFacultyData}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        
        {/* Results section */}
        {facultyData && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-16">
            <div className="bg-blue-50 rounded-lg overflow-hidden shadow-md border border-blue-100">
              <div className="bg-blue-600 text-white py-3 px-4 font-semibold">
                Faculty Profile
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-blue-800 mb-3">{facultyData.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <p className="text-gray-700"><span className="font-medium">Cabin:</span> {facultyData.cabin}</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-700"><span className="font-medium">Current Time:</span> {facultyData.currentTime}</p>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`px-4 py-2 rounded-full text-white font-medium ${getStatus().color}`}
                    >
                      {getStatus().text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default FacultyTimeSlot;