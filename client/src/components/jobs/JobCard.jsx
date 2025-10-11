import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { applyToJob } from "../../api/applicationApi";
import { isFreelancer } from "../../utils/roleCheck";

const JobCard = ({ job, onUpdate }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState("");

  // Check if user can manage this job (owner or admin)
  const canManage = user && (
    job.employer === user._id || 
    job.employer?._id === user._id || 
    user.role === 'admin'
  );

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await applyToJob(job._id, {
        proposal: coverLetter,
        bid: parseFloat(proposedRate),
      });
      alert("Application submitted successfully!");
      setShowApplyForm(false);
      setCoverLetter("");
      setProposedRate("");
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to apply. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/jobs/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job deleted successfully');
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/jobs/edit/${job._id}`);
  };

  const handleShowApplyForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowApplyForm(true);
  };

  const handleCancelApply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowApplyForm(false);
  };

  const handleCardClick = () => {
    if (!showApplyForm) {
      navigate(`/jobs/${job._id}`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-indigo-300">
      {/* Clickable area - only when form is not shown */}
      <div 
        onClick={handleCardClick}
        className={!showApplyForm ? "cursor-pointer" : ""}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors flex-1">
            {job.title}
          </h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ml-2 ${
            job.status === 'open' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {job.status === 'open' ? 'Open' : 'Closed'}
          </span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <p>
            <span className="font-semibold text-gray-800">Budget:</span> $
            {job.budget?.toLocaleString() || 'N/A'}
          </p>
          {job.duration && (
            <p>
              <span className="font-semibold text-gray-800">Duration:</span>{" "}
              {job.duration}
            </p>
          )}
          <p>
            <span className="font-semibold text-gray-800">Posted by:</span>{" "}
            {job.employer?.name || job.client?.name || "Unknown"}
          </p>
          <p className="text-xs text-gray-500">
            {job.applicants?.length || 0} applicants
          </p>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Edit/Delete buttons for owner or admin */}
      {canManage && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleEdit}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {/* Apply button for freelancers */}
      {isFreelancer(user) && !showApplyForm && (
        <button
          onClick={handleShowApplyForm}
          className="bg-blue-600 text-white py-2 rounded-md w-full hover:bg-blue-700 transition-colors"
        >
          Apply Now
        </button>
      )}

      {showApplyForm && (
        <form onSubmit={handleApply} className="mt-4 space-y-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Cover Letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Proposed Rate ($)
            </label>
            <input
              type="number"
              value={proposedRate}
              onChange={(e) => setProposedRate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={applying}
              className="bg-blue-600 text-white py-2 flex-1 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying ? "Submitting..." : "Submit Application"}
            </button>
            <button
              type="button"
              onClick={handleCancelApply}
              className="bg-gray-300 text-gray-700 py-2 flex-1 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JobCard;