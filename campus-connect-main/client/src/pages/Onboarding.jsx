import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const studyDomains = [
  'Computer Science',
  'Business',
  'Arts & Humanities',
  'Health Sciences',
  'Mechanical Engineering',
  'Civil Engineering',
  'Designing',
  'Indian Civil Services',
  'Vedic Science',
  'Marine Engineering (MANET)'
];

const interestsByDomain = {
  'Computer Science': [
    'Web Development',
    'Artificial Intelligence',
    'Data Science',
    'Cybersecurity',
    'Mobile App Development',
    'Cloud Computing'
  ],
  'Business': [
    'Marketing',
    'Finance',
    'Entrepreneurship',
    'Management',
    'Economics',
    'Accounting'
  ],
  'Arts & Humanities': [
    'Literature',
    'Philosophy',
    'History',
    'Languages',
    'Visual Arts',
    'Music'
  ],
  'Health Sciences': [
    'Medicine',
    'Nursing',
    'Public Health',
    'Pharmacy',
    'Nutrition',
    'Psychology'
  ],
  'Mechanical Engineering': [
    "CAD Designing (AutoCAD, SolidWorks)",  
    "Thermodynamics & Heat Transfer",  
    "Manufacturing Processes",  
    "Robotics & Automation",
    "Fluid Mechanics",
  ],
  'Civil Engineering': [
    'Structural Design (STAAD Pro, ETABS)',
    'Construction Planning & Management',
    'Geotechnical Engineering',
    'Surveying & Mapping',
    'Environmental Engineering'
  ],
  'Designing': [
    "Graphic Design (Photoshop, Illustrator)",
    "UI/UX Design (Figma, Adobe XD)",
    "Interior Design",
    "3D Modeling (Blender, AutoCAD)",
    "Visual Communication",
  ],
  "Indian Civil Services": [
    "Indian Polity & Constitution",
    "History & Geography",
    "Economics & Budgeting",
    "Ethics & Essay Writing",
    "General Knowledge & Current Affairs"
  ],
  'Vedic Science': [
    'Sanskrit & Ancient Text Interpretation',
    'Vedas & Upanishads',
    'Indian Philosophy',
    'Ayurveda & Yoga',
    'Jyotish Shastra (Vedic Astrology)'
  ],
  'Marine Engineering (MANET)': [
    'Marine Engines & Propulsion Systems',
    'Naval Architecture',
    'Ship Safety & Emergency Procedures',
    'Thermodynamics & Fluid Mechanics',
    'Workshop Skills & Practical Training'
  ]
};

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    studyDomain: '',
    interests: []
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDomainSelect = (domain) => {
    setFormData(prev => ({ 
      ...prev, 
      studyDomain: domain,
      interests: [] // Reset interests when domain changes
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend
    console.log('Form submitted:', formData);

    const API = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}/api`,
        headers: { "Content-Type": "application/json" },
    });

    try {
        const userId = localStorage.getItem('userId');
        const response = await API.put(`/user/profile/${userId}`, {
          name : formData.name,
          phoneNumber: formData.phoneNumber,
          interests : formData.interests,
            studyDomain: formData.studyDomain
        });
        console.log(response.data)
        alert("Profile updated successfully");
        navigate('/dashboard');
      } catch (error) {
        console.error("Profile update error:", error);
        alert(`Profile update failed. Please try again. ${error.response?.data?.message}`);
      }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center">Let's Set Up Your Profile</h2>
              <p className="text-gray-600 text-center mt-2">
                Tell us a bit about yourself so we can personalize your experience
              </p>
              
              {/* Progress Steps */}
              <div className="flex items-center justify-center mt-8">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-campus-purple text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > 1 ? <Check size={16} /> : '1'}
                  </div>
                  <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-campus-purple' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-campus-purple text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > 2 ? <Check size={16} /> : '2'}
                  </div>
                  <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-campus-purple' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 3 ? 'bg-campus-purple text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Basic Information</h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              )}
              
              {/* Step 2: Study Domain */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Study Domain</h3>
                  <p className="text-gray-600 mb-4">
                    Select your primary field of study
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {studyDomains.map((domain) => (
                      <div
                        key={domain}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.studyDomain === domain
                            ? 'border-campus-purple bg-campus-purple bg-opacity-10'
                            : 'border-gray-200 hover:border-campus-purple hover:bg-gray-50'
                        }`}
                        onClick={() => handleDomainSelect(domain)}
                      >
                        <div className="font-medium">{domain}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Step 3: Interests */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Study Interests</h3>
                  <p className="text-gray-600 mb-4">
                    Select specific areas within {formData.studyDomain} that interest you
                  </p>
                  
                  {formData.studyDomain ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {interestsByDomain[formData.studyDomain]?.map((interest) => (
                        <div
                          key={interest}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center ${
                            formData.interests.includes(interest)
                              ? 'border-campus-purple bg-campus-purple bg-opacity-10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleInterestToggle(interest)}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                            formData.interests.includes(interest)
                              ? 'bg-campus-purple border-campus-purple'
                              : 'border-gray-300'
                          }`}>
                            {formData.interests.includes(interest) && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                          <span>{interest}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Please select a study domain first
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div> // Empty div to maintain flex spacing
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary"
                    disabled={
                      (currentStep === 1 && (!formData.name || !formData.phoneNumber || !formData.email)) ||
                      (currentStep === 2 && !formData.studyDomain)
                    }
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={formData.interests.length === 0}
                  >
                    Complete Setup
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Onboarding;