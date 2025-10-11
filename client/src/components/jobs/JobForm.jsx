import React, { useState } from 'react';
import { createJob, updateJob } from '../../api/jobApi';

const JobForm = ({ job = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    budget: job?.budget || '',
    duration: job?.duration || '',
    skills: job?.skills?.join(', ') || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        duration: formData.duration,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      };

      if (job) {
        await updateJob(job._id, jobData);
      } else {
        await createJob(jobData);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-2xl font-bold">{job ? 'Edit Job' : 'Create New Job'}</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Job Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field"
          rows="5"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Budget ($)</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="input-field"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Duration</label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., 2 weeks, 1 month"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="input-field"
          placeholder="React, Node.js, MongoDB"
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? 'Saving...' : (job ? 'Update Job' : 'Create Job')}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default JobForm;