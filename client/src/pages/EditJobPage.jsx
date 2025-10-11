import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    budget: "",
    skills: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState(null);

  const fetchJob = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const job = res.data.job || res.data;
       
      setJobData({
        title: job.title,
        description: job.description,
        budget: job.budget,
        skills: job.skills.join(', '),
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching job:', err);
      console.error('Error response:', err.response?.data);
      setMessage("Failed to load job details");
      setErrorDetails(err.response?.data);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorDetails(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Parse skills
      const skillsArray = jobData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const updateData = {
        title: jobData.title,
        description: jobData.description,
        budget: parseFloat(jobData.budget),
        skills: skillsArray,
      };

      const response = await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        updateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage("Job updated successfully!");
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      console.error('Error updating job:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      "Error updating job";
      
      setMessage(errorMsg);
      setErrorDetails(err.response?.data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10 mb-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Job</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes("success") 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <p className="font-medium">{message}</p>
          {errorDetails && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">Show error details</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
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
            value={jobData.budget}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Update Job
          </button>
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobPage;