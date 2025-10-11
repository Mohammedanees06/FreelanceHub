import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateApplicationStatus } from "../api/applicationApi";

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/applications/employer",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      let data = response.data;
      
      
      if (!Array.isArray(data)) {
        data = data?.applications || data?.jobs || [];
      }
      
      console.log("📋 Fetched applications:", data);
      setApplications(data);
      
    } catch (err) {
      console.error("Error fetching applications:", err);
      alert(err.response?.data?.message || "Failed to fetch applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      alert(`Application ${newStatus} successfully!`);
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update application status");
    }
  };

  // Group applications by job
  const jobsWithApplications = applications.reduce((acc, app) => {
    const jobId = app.jobId;
    
    if (!acc[jobId]) {
      acc[jobId] = {
        _id: jobId,
        title: app.jobTitle,
        company: app.company || "Confidential",
        location: app.location || "N/A",
        salary: app.jobBudget,
        applications: []
      };
    }
    
    acc[jobId].applications.push(app);
    return acc;
  }, {});

  const jobsArray = Object.values(jobsWithApplications);

  // Filter applications
  const filteredApplications = applications.filter(app => 
    (filter === "all" || app.status === filter) &&
    (selectedJob === "all" || app.jobId === selectedJob)
  );

  // Group filtered applications by job
  const filteredJobsWithApplications = filteredApplications.reduce((acc, app) => {
    const jobId = app.jobId;
    
    if (!acc[jobId]) {
      acc[jobId] = {
        _id: jobId,
        title: app.jobTitle,
        company: app.company || "Confidential",
        location: app.location || "N/A",
        salary: app.jobBudget,
        applications: []
      };
    }
    
    acc[jobId].applications.push(app);
    return acc;
  }, {});

  const filteredJobsArray = Object.values(filteredJobsWithApplications);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
          <p className="mt-2 text-gray-600">
            Review and manage applications for your job postings
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Job Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Job
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Jobs</option>
                {jobsArray.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} ({job.applications.length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {applications.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-800">
                {applications.filter((a) => a.status === "pending").length}
              </div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-800">
                {applications.filter((a) => a.status === "accepted").length}
              </div>
              <div className="text-sm text-green-700">Accepted</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-800">
                {applications.filter((a) => a.status === "rejected").length}
              </div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
          </div>
        </div>

        {/* Applications List - Grouped by Job */}
        {filteredJobsArray.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-xl mb-2">No applications found</div>
            <p className="text-gray-500">
              {filter !== "all" || selectedJob !== "all"
                ? "Try adjusting your filters"
                : "You haven't received any applications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobsArray.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Job Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{job.title}</h2>
                      <p className="text-blue-100">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{job.applications.length}</div>
                      <div className="text-sm text-blue-100">
                        {job.applications.length === 1 ? "Application" : "Applications"}
                      </div>
                    </div>
                  </div>
                  {job.salary && (
                    <div className="mt-2 text-blue-100">
                      <span className="font-medium">Budget:</span> ${job.salary.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Applications for this job */}
                <div className="divide-y divide-gray-200">
                  {job.applications.map((application) => (
                    <div
                      key={application._id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {application.freelancerName || "Unknown Freelancer"}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {application.status.charAt(0).toUpperCase() +
                                application.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Email:</span>{" "}
                            {application.freelancerEmail || "N/A"}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Proposed Rate:</span> $
                            {application.bid?.toLocaleString() || application.proposedRate?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Applied on{" "}
                          {new Date(application.appliedAt || application.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Cover Letter / Proposal */}
                      {application.proposal && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Cover Letter / Proposal
                          </h4>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {application.proposal}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {application.status === "pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleStatusChange(application._id, "accepted")}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                          >
                            Accept Application
                          </button>
                          <button
                            onClick={() => handleStatusChange(application._id, "rejected")}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                          >
                            Reject Application
                          </button>
                          <button
                            onClick={() => navigate(`/jobs/${job._id}`)}
                            className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors font-medium"
                          >
                            View Job
                          </button>
                        </div>
                      )}

                      {application.status !== "pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/jobs/${job._id}`)}
                            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
                          >
                            View Job Details
                          </button>
                          {application.status === "accepted" && (
                            <button
                              onClick={() => handleStatusChange(application._id, "rejected")}
                              className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-colors font-medium"
                            >
                              Reject
                            </button>
                          )}
                          {application.status === "rejected" && (
                            <button
                              onClick={() => handleStatusChange(application._id, "accepted")}
                              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors font-medium"
                            >
                              Accept
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;