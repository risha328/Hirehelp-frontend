import { API_BASE_URL } from './config';

export interface Round {
  _id: string;
  name: string;
  description?: string;
  jobId: string | {
    _id: string;
    title: string;
    companyId: string;
  };
  order: number;
  isArchived: boolean;
  isActive: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoundDto {
  name: string;
  description?: string;
  jobId: string;
  order?: number;
}

export interface UpdateRoundDto {
  name?: string;
  description?: string;
  order?: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const roundsAPI = {
  createRound: async (data: CreateRoundDto): Promise<Round> => {
    const response = await fetch(`${API_BASE_URL}/rounds`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create round');
    }

    return response.json();
  },

  getAllRounds: async (): Promise<Round[]> => {
    const response = await fetch(`${API_BASE_URL}/rounds`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rounds');
    }

    return response.json();
  },

  getRoundsByJob: async (jobId: string): Promise<Round[]> => {
    const response = await fetch(`${API_BASE_URL}/rounds/job/${jobId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rounds for job');
    }

    return response.json();
  },

  getRoundById: async (id: string): Promise<Round> => {
    const response = await fetch(`${API_BASE_URL}/rounds/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch round');
    }

    return response.json();
  },

  updateRound: async (id: string, data: UpdateRoundDto): Promise<Round> => {
    const response = await fetch(`${API_BASE_URL}/rounds/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update round');
    }

    return response.json();
  },

  deleteRound: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/rounds/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete round');
    }
  },

  archiveRound: async (id: string): Promise<Round> => {
    const response = await fetch(`${API_BASE_URL}/rounds/${id}/archive`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to archive round');
    }

    return response.json();
  },

  activateRound: async (id: string): Promise<Round> => {
    const response = await fetch(`${API_BASE_URL}/rounds/${id}/activate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to activate round');
    }

    return response.json();
  },
};
