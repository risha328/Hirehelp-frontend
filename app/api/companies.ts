import { API_BASE_URL } from './config';

// Helper function to check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Assume expired if can't decode
  }
}

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
      const errorText = await response.text();
      console.error('Failed to create company:', response.status, response.statusText, errorText);
      throw new Error(`Failed to create company: ${response.status} ${response.statusText}`);
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

  updateCompany: async (companyId: string, updateData: any) => {
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
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update company');
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
      throw new Error('Failed to fetch company');
    }

    const data = await response.json();
    return data.company; // Extract the company from the response
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
};

export const jobsAPI = {
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
      const errorText = await response.text();
      console.error('Failed to create job:', response.status, response.statusText, errorText);
      let errorMessage = `Failed to create job: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If parsing fails, use the raw error text
        if (errorText) {
          errorMessage = errorText;
        }
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

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
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  },

  getJobById: async (jobId: string) => {
    // Job details should be public - no authentication required
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return response.json();
  },
};
