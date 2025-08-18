import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-xl font-bold text-campus-purple">
              Campus<span className="text-campus-blue">Connect</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Connecting campus life through innovative solutions for students.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-campus-purple">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-campus-purple">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-campus-purple">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-campus-purple">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-campus-purple">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-campus-purple">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-campus-purple">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-campus-purple">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-campus-purple">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Our Modules
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/study-buddy" className="text-gray-600 hover:text-campus-purple">
                  Study Buddy
                </Link>
              </li>
              <li>
                <Link to="/budget-buddy" className="text-gray-600 hover:text-campus-purple">
                  Budget Buddy
                </Link>
              </li>
              <li>
                <Link to="/market-mingle" className="text-gray-600 hover:text-campus-purple">
                  MarketMingle
                </Link>
              </li>
              <li>
                <Link to="/pack-pal" className="text-gray-600 hover:text-campus-purple">
                  PackPal
                </Link>
              </li>
              <li>
                <Link to="/faculty-finder" className="text-gray-600 hover:text-campus-purple">
                  Faculty Finder
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin size={18} className="mt-1 text-purple-500 mr-2" />
                <span className="text-gray-600">
                  MIT Art Design & Technology University, Pune, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-purple-500 mr-2" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-purple-500 mr-2" />
                <span className="text-gray-600">info@campusconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} CampusConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;