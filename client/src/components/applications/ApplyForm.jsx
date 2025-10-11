// src/components/applications/ApplyForm.jsx
import React, { useState } from 'react';
import { applyToJob } from '../../api/applicationApi';
import { useAuth } from '../../contexts/AuthContext';

const ApplyForm = ({ job, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    proposal: '',
    bid: job?.budget || '',
    estimatedDuration: '',
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Character count for proposal
  const proposalCharCount = formData.proposal.length;
  const maxProposalLength = 1000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate bid amount
    if (name === 'bid') {
      if (value < 0) return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                          'image/jpeg', 'image/png'];
    
    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        setError(`${file.name} has invalid format. Only PDF, DOC, DOCX, JPG, PNG allowed`);
        return false;
      }
      return true;
    });
    
    setFormData(prev => ({
      ...prev,
      attachments: validFiles
    }));
  };

  const validateForm = () => {
    if (!formData.proposal.trim()) {
      setError('Please write a proposal');
      return false;
    }
    
    if (formData.proposal.length < 50) {
      setError('Proposal must be at least 50 characters');
      return false;
    }
    
    if (!formData.bid || formData.bid <= 0) {
      setError('Please enter a valid bid amount');
      return false;
    }
    
    if (!formData.estimatedDuration.trim()) {
      setError('Please provide estimated duration');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const applicationData = {
        jobId: job._id,
        proposal: formData.proposal.trim(),
        bid: parseFloat(formData.bid),
        estimatedDuration: formData.estimatedDuration.trim(),
      };

      await applyToJob(job._id, applicationData);
      
      setSuccess('Application submitted successfully!');
      
      // Clear form
      setFormData({
        proposal: '',
        bid: job?.budget || '',
        estimatedDuration: '',
        attachments: []
      });
      
      // Call success callback after a short delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
      
    } catch (err) {
      console.error('Application error:', err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already applied')) {
        setError('You have already applied to this job');
      } else {
        setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if user is freelancer
  if (user?.role !== 'freelancer') {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Only freelancers can apply to jobs
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Apply to Job</h3>
        <div className="text-sm text-gray-600">
          <p className="font-semibold">{job?.title}</p>
          <p>Budget: ${job?.budget}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Proposal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Proposal <span className="text-red-500">*</span>
          </label>
          <textarea
            name="proposal"
            value={formData.proposal}
            onChange={handleChange}
            rows="6"
            maxLength={maxProposalLength}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Explain why you're the best fit for this job. Include your relevant experience, approach to the project, and any questions you have..."
            required
          />
          <div className="mt-1 text-sm text-gray-500 text-right">
            {proposalCharCount} / {maxProposalLength} characters
          </div>
        </div>

        {/* Bid Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Bid Amount ($) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              name="bid"
              value={formData.bid}
              onChange={handleChange}
              min="1"
              step="0.01"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your bid amount"
              required
            />
          </div>
          {job?.budget && (
            <p className="mt-1 text-sm text-gray-500">
              Client's budget: ${job.budget}
            </p>
          )}
        </div>

        {/* Estimated Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Duration <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="estimatedDuration"
            value={formData.estimatedDuration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 2 weeks, 1 month, 30 days"
            required
          />
        </div>

        {/* File Attachments  */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments 
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload portfolio samples or relevant documents (PDF, DOC, DOCX, JPG, PNG - Max 5MB each)
          </p>
          {formData.attachments.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Selected files:</p>
              <ul className="mt-1 text-sm text-gray-600">
                {formData.attachments.map((file, index) => (
                  <li key={index}>• {file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 mr-2"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I understand that this is a binding proposal and I am committed to 
              delivering quality work within the specified timeframe if selected.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Application Tips */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Tips for a successful application:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about your relevant experience</li>
            <li>• Explain your approach to completing this project</li>
            <li>• Ask clarifying questions if needed</li>
            <li>• Provide realistic timelines</li>
            <li>• Include portfolio samples when relevant</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;