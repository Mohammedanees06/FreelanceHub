import api from './authApi';

export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const getAllJobs = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/jobs?${params}`);
  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/jobs/${jobId}`, jobData);
  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await api.delete(`/jobs/${jobId}`);
  return response.data;
};

export const getMyJobs = async () => {
  const response = await api.get('/jobs/my-jobs');
  return response.data;
};

export const searchJobs = async (searchQuery) => {
  const response = await api.get(`/jobs/search?q=${searchQuery}`);
  return response.data;
};