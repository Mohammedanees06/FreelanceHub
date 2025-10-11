import api from './authApi';

export const applyToJob = async (jobId, applicationData) => {
  const response = await api.post(`/applications/${jobId}/apply`, applicationData);
  return response.data;
};


export const getMyApplications = async (status = null) => {
  const url = status ? `/applications/my?status=${status}` : '/applications/my';
  const response = await api.get(url);
  return response.data;
};


export const withdrawApplication = async (applicationId) => {
  const response = await api.delete(`/applications/${applicationId}`);
  return response.data;
};


export const getEmployerApplications = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.jobId) params.append('jobId', filters.jobId);
  
  const url = params.toString() 
    ? `/applications/employer?${params.toString()}` 
    : '/applications/employer';
  
  const response = await api.get(url);
  return response.data;
};


export const getJobApplications = async (jobId) => {
  const response = await api.get(`/applications/${jobId}`);
  return response.data;
};


export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/applications/${applicationId}/status`, { status });
  return response.data;
};


export const shortlistApplication = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'shortlisted');
};


export const acceptApplication = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'accepted');
};


export const rejectApplication = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'rejected');
};


export const hireFreelancer = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'hired');
};

// ===============================================
// USAGE EXAMPLES
// ===============================================

/* 
// FREELANCER EXAMPLES:

// Apply to a job
await applyToJob('job123', {
  proposal: 'I can complete this project...',
  bid: 5000
});

// Get all my applications
const allApps = await getMyApplications();

// Filter my applications by status
const pendingApps = await getMyApplications('pending');
const acceptedApps = await getMyApplications('accepted');

// Withdraw my application
await withdrawApplication('app123');

// EMPLOYER EXAMPLES:

// Get all applications for my jobs
const allApplications = await getEmployerApplications();

// Filter by status
const shortlisted = await getEmployerApplications({ status: 'shortlisted' });

// Filter by specific job
const jobApps = await getEmployerApplications({ jobId: 'job123' });

// Get applications for a specific job
const applications = await getJobApplications('job123');

// Update application status
await updateApplicationStatus('app123', 'shortlisted');

// Or use helper functions
await shortlistApplication('app123');
await acceptApplication('app123');
await hireFreelancer('app123');
await rejectApplication('app123');
*/