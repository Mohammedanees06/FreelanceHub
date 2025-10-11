import React, { useState, useEffect } from 'react';
import { getMyApplications, withdrawApplication } from '../api/applicationApi';
import { Briefcase, Calendar, DollarSign, Building2, User, Filter, Clock, CheckCircle, XCircle, Award, Search } from 'lucide-react';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = [...applications];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.job?.title?.toLowerCase().includes(query) ||
        app.job?.description?.toLowerCase().includes(query) ||
        app.job?.employer?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchQuery]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getMyApplications();
      setApplications(response.applications || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      setWithdrawing(applicationId);
      await withdrawApplication(applicationId);
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setWithdrawing(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        label: 'Pending'
      },
      shortlisted: {
        color: 'bg-blue-100 text-blue-800',
        icon: Award,
        label: 'Shortlisted'
      },
      accepted: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        label: 'Accepted'
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
        label: 'Rejected'
      },
      hired: {
        color: 'bg-purple-100 text-purple-800',
        icon: Award,
        label: 'Hired'
      }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStats = () => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      hired: applications.filter(a => a.status === 'hired').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track all your job applications in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
            <div className="text-2xl font-bold text-blue-800">{stats.shortlisted}</div>
            <div className="text-sm text-blue-700">Shortlisted</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
            <div className="text-2xl font-bold text-green-800">{stats.accepted}</div>
            <div className="text-sm text-green-700">Accepted</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200">
            <div className="text-2xl font-bold text-purple-800">{stats.hired}</div>
            <div className="text-sm text-purple-700">Hired</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
            <div className="text-2xl font-bold text-red-800">{stats.rejected}</div>
            <div className="text-sm text-red-700">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
            </h3>
            <p className="text-gray-600">
              {applications.length === 0 
                ? 'Start applying to jobs to see them here'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={application._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {application.job?.title || 'Job Deleted'}
                          </h3>
                          {application.job?.employer && (
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                              <Building2 className="w-4 h-4 mr-1" />
                              {application.job.employer.name}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">
                            Budget: <span className="font-medium">${application.job?.budget?.toLocaleString()}</span>
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">
                            Your Bid: <span className="font-medium">${application.bid?.toLocaleString()}</span>
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">
                            Applied: {formatDate(application.appliedAt)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Proposal Preview */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          <span className="font-medium">Your Proposal:</span> {application.proposal}
                        </p>
                      </div>

                      {/* Skills */}
                      {application.job?.skills && application.job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {application.job.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Section */}
                    <div className="flex lg:flex-col gap-2 lg:ml-4">
                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleWithdraw(application._id)}
                          disabled={withdrawing === application._id}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                          {withdrawing === application._id ? 'Withdrawing...' : 'Withdraw'}
                        </button>
                      )}
                      <button
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;