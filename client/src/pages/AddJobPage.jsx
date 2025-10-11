import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AddJobPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    budget: "",
    skills: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Checks if user can post jobs
    if (user.role !== 'employer' && user.role !== 'admin') {
      setMessage("Only employers and admins can post jobs");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const skillsArray = jobData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const payload = {
        title: jobData.title,
        description: jobData.description,
        budget: parseFloat(jobData.budget),
        skills: skillsArray,
      };

      if (user.role === 'employer' || user.role === 'admin') {
        payload.employer = user._id;
      }

      const res = await axios.post(
        "http://localhost:5000/api/jobs",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Job added:', res.data);
      setMessage("Job added successfully!");
      setJobData({ title: "", description: "", budget: "", skills: "" });
    } catch (err) {
      console.error('Error:', err.response?.data);
      setMessage(err.response?.data?.message || "Error adding job. Try again.");
    }
  };

  // Adds role check for UI
  if (user.role !== 'employer' && user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold text-center text-red-600">
          Access Denied
        </h2>
        <p className="text-center mt-4 text-gray-600">
          Only employers and admins can post jobs.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Add a New Job</h2>
      {user.role === 'admin' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            ℹ️ Posting as Admin
          </p>
        </div>
      )}
      {message && (
        <p
          className={`mb-6 text-center ${
            message.includes("success")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Full Stack Developer"
            value={jobData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Describe the job requirements, responsibilities, etc."
            value={jobData.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="skills"
            placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
            value={jobData.skills}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter skills separated by commas
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="budget"
            placeholder="e.g., 5000"
            value={jobData.budget}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AddJobPage;