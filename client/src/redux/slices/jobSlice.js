import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ page = 1, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page,
        ...filters,
      });
      
      const response = await axios.get(`${API_URL}/jobs?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job details');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/jobs`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/jobs/${jobId}`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobs/applyToJob',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/jobs/${jobId}/apply`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply to job');
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'jobs/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/jobs/applications/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

// Initial state
const initialState = {
  jobs: [],
  currentJob: null,
  myApplications: [],
  totalJobs: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salary: '',
    category: '',
  },
  loading: false,
  error: null,
  applicationStatus: 'idle', // idle, loading, succeeded, failed
};

// Slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addToSavedJobs: (state, action) => {
      const job = state.jobs.find(j => j.id === action.payload);
      if (job) {
        job.isSaved = true;
      }
    },
    removeFromSavedJobs: (state, action) => {
      const job = state.jobs.find(j => j.id === action.payload);
      if (job) {
        job.isSaved = false;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalJobs = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        console.error('❌ REDUX: Fetching jobs - FAILED', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch Job By ID
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        console.error('❌ REDUX: Fetching job by ID - FAILED', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
    
    // Create Job
    builder
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        console.error('❌ REDUX: Creating job - FAILED', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
    
    // Update Job
    builder
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        console.error('REDUX: Updating job - FAILED', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
    
    // Delete Job
    builder
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        console.error('❌ REDUX: Deleting job - FAILED', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
    
    // Apply to Job
    builder
      .addCase(applyToJob.pending, (state) => {
        console.log('🔄 REDUX: Applying to job - PENDING');
        state.applicationStatus = 'loading';
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.applicationStatus = 'succeeded';
        state.myApplications.push(action.payload);
        if (state.currentJob) {
          state.currentJob.hasApplied = true;
        }
      })
      .addCase(applyToJob.rejected, (state, action) => {
        console.error('REDUX: Applying to job - FAILED', action.payload);
        state.applicationStatus = 'failed';
        state.error = action.payload;
      });
    
    // Fetch My Applications
    builder
      .addCase(fetchMyApplications.pending, (state) => {
      
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        console.error('❌ REDUX: Fetching my applications - FAILED', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  clearCurrentJob,
  clearError,
  addToSavedJobs,
  removeFromSavedJobs,
} = jobSlice.actions;

export default jobSlice.reducer;