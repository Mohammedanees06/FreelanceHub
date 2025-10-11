import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllJobs } from "../api/jobApi";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalJobs: 0,
    appliedJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await getAllJobs();

      //it  Handles different response formats
      let jobsArray = [];

      if (Array.isArray(response)) {
        // If response is directly an array
        jobsArray = response;
      } else if (response?.jobs && Array.isArray(response.jobs)) {
        // If response has jobs property
        jobsArray = response.jobs;
      } else if (response?.data && Array.isArray(response.data)) {
        // If response has data property
        jobsArray = response.data;
      } else if (response?.data?.jobs && Array.isArray(response.data.jobs)) {
        // If nested data.jobs
        jobsArray = response.data.jobs;
      }

      setRecentJobs(jobsArray.slice(0, 5)); // Get latest jobs

      // Mock stats - replace with actual API calls
      setStats({
        totalJobs: jobsArray.length,
        appliedJobs: 12,
        activeJobs: 8,
        totalApplications: 24,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setRecentJobs([]); 
    } finally {
      setLoading(false);
    }
  };

  const isEmployer = user?.role === "employer";

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link to={link} className="block">
      <div
        className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-opacity-80 text-sm font-medium mb-1">
              {title}
            </p>
            <p className="text-white text-3xl font-bold">{value}</p>
          </div>
          <div className="text-white text-opacity-80">{icon}</div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-gray-600">
            {isEmployer
              ? "Manage your job postings and review applications"
              : "Find your next opportunity and track your applications"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isEmployer ? (
            <>
              <StatCard
                title="Active Jobs"
                value={stats.activeJobs}
                color="from-blue-500 to-blue-600"
                link="/jobs"
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Total Applications"
                value={stats.totalApplications}
                color="from-green-500 to-green-600"
                link="/applications"
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Messages"
                value="8"
                color="from-purple-500 to-purple-600"
                link="/chat"
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Profile Views"
                value="156"
                color="from-pink-500 to-pink-600"
                link="/profile"
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                }
              />
            </>
          ) : (
            <>
              <StatCard
                title="Jobs Applied"
                value={stats.appliedJobs}
                color="from-indigo-500 to-indigo-600"
                link="/my-applications"
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Available Jobs"
                value={stats.totalJobs}
                color="from-green-500 to-green-600"
                link="/jobs"
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Messages"
                value="5"
                color="from-purple-500 to-purple-600"
                link="/chat"
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Saved Jobs"
                value="7"
                color="from-yellow-500 to-yellow-600"
                link="/jobs"
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                }
              />
            </>
          )}
        </div>

        {/* Recent Jobs Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEmployer
                ? "Your Recent Job Posts"
                : "Recent Job Opportunities"}
            </h2>
            <Link
              to="/jobs"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
            >
              View All
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          {recentJobs.length > 0 ? (
            recentJobs.map((job, index) => (
              <Link
                key={job._id || index}
                to={`/jobs/${job._id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-indigo-300 transition duration-200 cursor-pointer mb-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-600 transition">
                      {job.title || "Job Title"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {job.company || "Company Name"} • {job.location || "Remote"}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {job.description || "Job description goes here..."}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {job.type || "Full-time"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-600">
                    ${job.budget?.toLocaleString() || "N/A"} budget
                  </span>
                  <span className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    View Details →
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-4 text-gray-600">No jobs available yet</p>
              <Link
                to="/jobs"
                className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to={isEmployer ? "/jobs/create" : "/jobs"}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 text-center"
          >
            <div className="text-indigo-600 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEmployer ? "Post New Job" : "Find Jobs"}
            </h3>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 text-center"
          >
            <div className="text-green-600 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Profile
            </h3>
          </Link>

          <Link
            to="/chat"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 text-center"
          >
            <div className="text-purple-600 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;