import { API_BASE_URL } from './config';
import { authAPI } from './auth';

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

export const usersAPI = {
  getUsersByRole: async (role: string) => {
    let token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('No access token found');
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      console.log('Access token expired, attempting refresh...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      try {
        const refreshResponse = await authAPI.refreshToken(refreshToken);
        token = refreshResponse.accessToken;
        localStorage.setItem('access_token', token);
        console.log('Token refreshed successfully');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired, please login again');
      }
    }

    const response = await fetch(`${API_BASE_URL}/users/by-role?role=${role}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },
};
