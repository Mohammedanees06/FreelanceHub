import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center min-h-screen px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-gray-900 drop-shadow-md mt-10">
            Freelancer <span className="text-blue-600">HUB</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-700 font-light">
            Connect clients and freelancers seamlessly
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto text-gray-600">
            The platform where talent meets opportunity. Find projects, hire experts, and collaborate effortlessly.
          </p>

          {!user ? (
            <div className="space-x-6 mb-16">
              <Link
                to="/register"
                className="inline-block bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-block bg-white hover:bg-gray-50 transition-all duration-200 text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl border-2 border-blue-600 transform hover:scale-105"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="mb-16">
              <p className="mb-6 text-gray-800 text-xl">
                Welcome back, <span className="font-semibold">{user.name}</span>!
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 mb-4">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find Projects</h3>
              <p className="text-gray-600">
                Browse thousands of freelance opportunities across various industries and skill levels.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-green-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hire Talent</h3>
              <p className="text-gray-600">
                Connect with skilled professionals ready to bring your projects to life.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-purple-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Collaborate</h3>
              <p className="text-gray-600">
                Seamless communication tools to keep your projects on track and organized.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Freelancers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5K+</div>
              <div className="text-blue-100">Projects Posted</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and showcase your skills or post your project requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect & Collaborate</h3>
              <p className="text-gray-600">
                Find the perfect match and start working together on projects.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Paid & Grow</h3>
              <p className="text-gray-600">
                Complete projects, receive payments, and build your reputation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white mb-10 opacity-90">
            Join thousands of freelancers and clients already using Freelancer HUB
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-block bg-white hover:bg-gray-100 transition-all duration-200 text-blue-600 font-semibold px-10 py-4 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Sign Up Free
            </Link>
          )}
        </div>
      </div>

     
    </div>
  );
};

export default Home;