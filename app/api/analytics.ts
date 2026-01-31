import { API_BASE_URL } from './config';
import { isTokenExpired } from './auth';

export const analyticsAPI = {
  getCompanyGrowth: async () => {
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

    const response = await fetch(`${API_BASE_URL}/analytics/company-growth`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch company growth data');
    }

    return response.json();
  },

  getHiringActivity: async () => {
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

    const response = await fetch(`${API_BASE_URL}/analytics/hiring-activity`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hiring activity data');
    }

    return response.json();
  },

  getTopCompanies: async () => {
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

    const response = await fetch(`${API_BASE_URL}/analytics/top-companies`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top companies data');
    }

    return response.json();
  },
};
