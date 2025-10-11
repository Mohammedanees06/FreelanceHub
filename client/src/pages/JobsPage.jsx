import React, { useEffect, useState } from "react";
import JobCard from "../components/jobs/JobCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs, setFilters, clearFilters } from "../redux/slices/jobSlice";

const JobsPage = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error, totalJobs, filters } = useSelector((state) => state.jobs);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchJobs({ page: 1, filters: {} }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchJobs({ page: 1, filters: { search: searchTerm } }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    dispatch(clearFilters());
    dispatch(fetchJobs({ page: 1, filters: {} }));
  };

  const handleJobUpdate = () => {
    dispatch(fetchJobs({ page: 1, filters }));
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Jobs
          </h1>
          <p className="text-gray-600">
            {totalJobs} {totalJobs === 1 ? 'job' : 'jobs'} available
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, description, or skills..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Search
            </button>
            {(searchTerm || filters.search) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error loading jobs</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => dispatch(fetchJobs({ page: 1, filters }))}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && jobs.length > 0 && (
          <div className="text-center py-4">
            <p className="text-gray-600">Updating jobs...</p>
          </div>
        )}

        {/* Jobs Grid */}
        {jobs.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filters.search
                ? "Try adjusting your search criteria"
                : "Check back later for new opportunities"}
            </p>
            {(searchTerm || filters.search) && (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} onUpdate={handleJobUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;