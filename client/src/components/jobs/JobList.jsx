import React, { useState, useEffect } from 'react';
import { getAllJobs } from '../../api/jobApi';
import JobCard from './JobCard';
import Loader from '../common/Loader';

const JobList = ({ filters = {} }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAllJobs(filters);
        setJobs(data.jobs || data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  // Create a separate function for manual refresh (used by JobCard)
  const refreshJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllJobs(filters);
      setJobs(data.jobs || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onUpdate={refreshJobs} />
      ))}
    </div>
  );
};

export default JobList;