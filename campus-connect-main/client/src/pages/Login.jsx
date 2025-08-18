import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Login = () => {
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!enrollmentNumber || !password) {
      setError('Please fill in all fields');
      return;
    }

    console.log('Login attempt:', { enrollmentNumber, password });

    const API = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/api`,
      headers: { "Content-Type": "application/json" },
    });

    try {
      const response = await API.post("/auth/login", { enrollmentNumber, password });
      console.log(response.data);
      localStorage.setItem('token', response.data.token); // Store token in local storage
      localStorage.setItem('userId', response.data.userId);
      sessionStorage.setItem('userId', response.data.userId) // Store user ID in local storage
      const profileResponse = await API.get(`/user/profile/complete/${response.data.userId}`);
      sessionStorage.setItem('isComplete', profileResponse.data.isComplete); // Store profile completion status
      if (profileResponse.data.isComplete) {
        alert("Login successful. Redirecting to dashboard...");
        navigate('/dashboard');
      } else {
        alert("Login Successful.!!\nYour profile is incomplete. Redirecting to onboarding...");
        navigate('/onboarding');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(`Login failed. Please check your credentials. ${error.response?.data?.message}`);
    }

    // For demonstration, navigate to dashboard on any login attempt
    // In a real app, you would validate credentials with a backend
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <div className="text-center mb-6">
              <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-campus-purple mb-6">
                <ArrowLeft size={16} className="mr-2" />
                Back to home
              </Link>
              <h2 className="text-2xl font-bold text-gray-900">Log in to CampusConnect</h2>
              <p className="mt-2 text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-campus-purple hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="enrollment" className="block text-sm font-medium text-gray-700 mb-1">
                  Enrollment Number
                </label>
                <input
                  id="enrollment"
                  type="text"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  className="input-field"
                  placeholder="Enter your enrollment number"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <a href="#" className="text-xs text-campus-purple hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;