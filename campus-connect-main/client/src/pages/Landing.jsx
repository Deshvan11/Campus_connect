import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  DollarSign,
  ShoppingCart,
  Package,
  ArrowRight,
  UserSearch
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModuleCard from '../components/ModuleCard';
import TestimonialCard from '../components/Testimonial';
import TeamMemberCard from '../components/TeamMember';
import AryaJoshi from '../assets/AryaJoshi.jpg';
import ShrikunjRathi from '../assets/ShrikunjRathi.jpg';
import TanmayDeshmukh from '../assets/TanmayDeshmukh.jpg';
import AditiShinde from '../assets/AditiShinde.png';

const Landing = () => {

  const navigate = useNavigate();
  const isProfileComplete = sessionStorage.getItem('isComplete') === 'true'; // Check if profile is complete

  // Check if the user is logged in
  const isLoggedIn = !!sessionStorage.getItem('userId'); // Replace 'userId' with your auth key if different

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0 animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome to CampusConnect
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Your all-in-one platform for smarter, more connected campus life.
                Study, save, shop, and manage your university experience with ease.
              </p>
              <div className="flex space-x-4">
                {!isLoggedIn ? (
                  <>
                    <Link to="/signup" className="btn-primary">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn-secondary">
                      Log In
                    </Link>
                  </>) : isProfileComplete ? (
                  <Link to="/dashboard" className="btn-primary">
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/onboarding" className="btn-primary">
                    Complete Your Profile
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600"
                alt="Students collaborating"
                className="rounded-xl shadow-lg max-w-full md:max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Modules</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              CampusConnect offers comprehensive tools to enhance your university experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModuleCard
              title="Study Buddy"
              description="Connect with students, join study groups, and collaborate on projects."
              icon={BookOpen}
              color="bg-campus-purple"
            />
            <ModuleCard
              title="Budget Buddy"
              description="Track expenses, manage budgets, and get AI-powered financial insights."
              icon={DollarSign}
              color="bg-campus-green"
            />
            <ModuleCard
              title="MarketMingle"
              description="Buy and sell items within your college community safely and easily."
              icon={ShoppingCart}
              color="bg-campus-blue"
            />
            <ModuleCard
              title="PackPal"
              description="Manage subscriptions for meals, laundry, and other essential services."
              icon={Package}
              color="bg-campus-orange"
            />
            <ModuleCard
              title="Faculty Finder"
              description="Check real-time faculty availability and location"
              icon={UserSearch}
              color="bg-red-500"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Student Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Hear from students who have transformed their campus experience with CampusConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Alex Johnson"
              role="Computer Science, Junior"
              text="Study Buddy helped me find the perfect study group for my advanced algorithms class. My GPA improved significantly!"
              image="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=100"
            />
            <TestimonialCard
              name="Samantha Lee"
              role="Business Administration, Senior"
              text="Budget Buddy's expense tracking changed how I manage my finances. I've saved over $2000 this semester alone!"
              image="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100"
            />
            <TestimonialCard
              name="Marcus Williams"
              role="Engineering, Sophomore"
              text="I sold my old textbooks on MarketMingle and found affordable lab equipment. This platform is a game-changer!"
              image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              The passionate individuals behind CampusConnect
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <TeamMemberCard
              name="Aditi Shinde"
              image={AditiShinde}
            />
            <TeamMemberCard
              name="Arya Joshi"
              image={AryaJoshi}
            />
            <TeamMemberCard
              name="Shrikunj Rathi"
              image={ShrikunjRathi}
            />
            <TeamMemberCard
              name="Tanmay Deshmukh"
              image={TanmayDeshmukh}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-campus-purple text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Campus Experience?</h2>
          <p className="text-xl mb-8 max-w-xl mx-auto">
            Join thousands of students already using CampusConnect
          </p>
          <Link to="/signup" className="inline-flex items-center bg-white text-campus-purple px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
            Get Started <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;