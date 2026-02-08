import { API_BASE_URL } from './config';
import { isTokenExpired } from './auth';

export const companiesAPI = {
  createCompany: async (companyData: any) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create company');
    }

    return response.json();
  },

  getMyCompany: async () => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/companies/my-company`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch company data');
    }

    return response.json();
  },

  updateCompany: async (companyId: string, data: any) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update company');
    }

    return response.json();
  },

  uploadLogo: async (file: File) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetch(`${API_BASE_URL}/companies/upload-logo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload logo');
    }

    return response.json();
  },

  verifyCompany: async (companyId: string) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/verify`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify company');
    }

    return response.json();
  },

  rejectCompany: async (companyId: string) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/reject`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to reject company');
    }

    return response.json();
  },

  getAllCompanies: async () => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }

    return response.json();
  },

  getCompanyAdmins: async (companyId: string) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/admins`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch company admins');
    }

    return response.json();
  },
};

export const jobsAPI = {
  getAllJobs: async () => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  },

  getJobsByCompany: async (companyId: string) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/jobs/company/${companyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs by company');
    }

    return response.json();
  },

  getJobById: async (jobId: string) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job details');
    }

    return response.json();
  },

  createJob: async (jobData: any) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create job');
    }

    return response.json();
  },

  updateJob: async (jobId: string, jobData: any) => {
    let token = localStorage.getItem('access_token');

    if (!token || token === null) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token!)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const refreshData = await refreshResponse.json();
        token = refreshData.accessToken;
        localStorage.setItem('access_token', token!);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update job');
    }

    return response.json();
  },
};
