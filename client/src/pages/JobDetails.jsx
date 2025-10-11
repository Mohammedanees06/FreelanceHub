import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getJobById } from '../api/jobApi';
import { getMyApplications, applyToJob } from '../api/applicationApi';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await getJobById(id);
        
        // Handle different response formats
        let jobData = null;
        
        if (response?.data?.job) {
          jobData = response.data.job;
        } else if (response?.data) {
          jobData = response.data;
        } else if (response?.job) {
          jobData = response.job;
        } else {
          jobData = response;
        }
        
        setJob(jobData);
        setError(null);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // Check if user has already applied to this job
  useEffect(() => {
    const checkIfApplied = async () => {
      if (!user || user.role !== 'freelancer' || !id) {
        setCheckingApplication(false);
        return;
      }

      try {
        setCheckingApplication(true);
        const response = await getMyApplications();
        
        // Handle different response formats
        let applications = [];
        
        if (Array.isArray(response)) {
          applications = response;
        } else if (response?.applications && Array.isArray(response.applications)) {
          applications = response.applications;
        } else if (response?.data && Array.isArray(response.data)) {
          applications = response.data;
        } else if (response?.data?.applications && Array.isArray(response.data.applications)) {
          applications = response.data.applications;
        }
        
        // Check if any application matches this job ID
        const applied = applications.some(
          (app) => app.job?._id === id || app.job === id || app.jobId === id
        );
        
        setHasApplied(applied);
      } catch (error) {
        console.error('Error checking application status:', error);
        setHasApplied(false);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkIfApplied();
  }, [id, user]);

  const handleApplyClick = () => {
    if (!user) {
      alert('Please login to apply for jobs');
      navigate('/login');
      return;
    }
    
    if (!user.resume) {
      alert('Please upload your resume first');
      navigate('/profile');
      return;
    }
    
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplying(true);

    const formData = new FormData(e.target);
    const applicationData = {
      proposal: formData.get('proposal'),
      bid: parseFloat(formData.get('bid')),
    };

    try {
      await applyToJob(id, applicationData);
      alert('Application submitted successfully!');
      setHasApplied(true);
      setShowApplicationModal(false);
    } catch (error) {
      console.error('Application error:', error);
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Job not found'}
          </h2>
          <Link
            to="/jobs"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const isFreelancer = user?.role === 'freelancer';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        {/* Job Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-indigo-100 text-lg">
              {job.employer?.name || 'Company Name'}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                {job.status === 'open' ? '🟢 Open' : '🔴 Closed'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-lg font-bold text-gray-900">${job.budget?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Applicants</p>
                  <p className="text-lg font-bold text-gray-900">{job.applicants?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description || 'No description available'}
              </p>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Employer Info */}
            {job.employer && (
              <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About the Employer</h2>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {job.employer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{job.employer.name}</p>
                    <p className="text-sm text-gray-600">{job.employer.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Posted Date */}
            <div className="mb-8">
              <p className="text-sm text-gray-600">
                Posted on {new Date(job.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Action Buttons - Only show Apply for Freelancers */}
            {isFreelancer ? (
              <div className="flex gap-4">
                <button 
                  onClick={handleApplyClick}
                  disabled={hasApplied || checkingApplication}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-lg ${
                    hasApplied 
                      ? 'bg-green-600 text-white cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {checkingApplication ? 'Checking...' : hasApplied ? '✓ Applied' : 'Apply Now'}
                </button>
                <button className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition duration-200">
                  Save Job
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-600">
                  {user?.role === 'employer' 
                    ? 'This is your job posting. View applicants from your dashboard.'
                    : 'Only freelancers can apply to jobs.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter / Proposal *
                  </label>
                  <textarea
                    name="proposal"
                    rows="6"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Explain why you're a great fit for this job..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount ($) *
                  </label>
                  <input
                    type="number"
                    name="bid"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={`Budget: $${job.budget?.toLocaleString()}`}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Job budget: ${job.budget?.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;