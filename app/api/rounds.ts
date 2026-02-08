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
  type: 'mcq' | 'interview' | 'technical' | 'hr';
  googleFormLink?: string | null;
  googleSheetLink?: string | null;
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
  type?: 'mcq' | 'interview' | 'technical' | 'hr';
  googleFormLink?: string | null;
  googleSheetLink?: string | null;
}

export interface UpdateRoundDto {
  name?: string;
  description?: string;
  order?: number;
  type?: 'mcq' | 'interview' | 'technical' | 'hr';
  googleFormLink?: string | null;
  googleSheetLink?: string | null;
}

export interface MCQResponse {
  _id: string;
  roundId: {
    _id: string;
    name: string;
    googleFormLink?: string;
  };
  applicationId: {
    _id: string;
    candidateId: {
      _id: string;
      name: string;
      email: string;
    };
    jobId: {
      _id: string;
      title: string;
    };
  };
  answers: number[];
  isCorrect?: boolean[];
  score?: number;
  isSubmitted: boolean;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitMcqDto {
  applicationId: string;
  answers: number[];
}

export type EvaluationStatus = 'pending' | 'in_progress' | 'completed' | 'passed' | 'failed' | 'skipped';

export interface RoundEvaluation {
  _id: string;
  roundId: string;
  applicationId: string;
  evaluatorId: string;
  status: EvaluationStatus;
  score?: number;
  notes?: string;
  feedback?: string;
  scheduledAt?: string;
  completedAt?: string;
  isFinal: boolean;
  createdAt: string;
  updatedAt: string;
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update round');
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

  getMcqResponses: async (roundId: string): Promise<MCQResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/rounds/${roundId}/mcq/responses`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch MCQ responses');
    }

    return response.json();
  },

  updateEvaluationStatus: async (evaluationId: string, status: EvaluationStatus, notes?: string): Promise<RoundEvaluation> => {
    const response = await fetch(`${API_BASE_URL}/rounds/evaluation/${evaluationId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      throw new Error('Failed to update evaluation status');
    }

    return response.json();
  },

  getAllMcqResponses: async (): Promise<MCQResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/rounds/mcq/responses/all`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all MCQ responses');
    }

    return response.json();
  },

  submitMcqResponse: async (roundId: string, data: SubmitMcqDto): Promise<MCQResponse> => {
    const response = await fetch(`${API_BASE_URL}/rounds/${roundId}/mcq/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit MCQ response');
    }

    return response.json();
  },

  fetchGoogleSheetData: async (googleSheetUrl: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/rounds/fetch-google-sheet`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ googleSheetUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Google Sheets data');
    }

    return response.json();
  },
};
