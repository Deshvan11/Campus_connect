import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Signup = () => {
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!enrollmentNumber || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        console.log('Signup attempt:', { enrollmentNumber, email, password });

        const API = axios.create({
            baseURL: `${import.meta.env.VITE_API_URL}/api`,
            headers: { "Content-Type": "application/json" },
        });

        try {
            const response = await API.post("/auth/signup", { enrollmentNumber, email, password });
            console.log(response.data);
            localStorage.setItem('userId', response.data.userId);
            sessionStorage.setItem('userId', response.data.userId) // Store user ID in local storage
            alert("Signup successful");
            navigate('/onboarding');
        } catch (error) {
            console.error("Signup error:", error);
            alert(`Signup failed. Please try again. ${error.response?.data?.message}`);
            // throw error.response?.data?.message || "Signup failed. Please try again.";
        }

        // For demonstration, navigate to onboarding on any signup attempt
        // In a real app, you would register the user with a backend
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
                            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-campus-purple hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter your email address"
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
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="input-field pr-10"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start mt-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-campus-purple focus:ring-campus-purple border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-gray-600">
                                        I agree to the{' '}
                                        <a href="#" className="text-campus-purple hover:underline">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-campus-purple hover:underline">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary py-3 mt-4"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Signup;