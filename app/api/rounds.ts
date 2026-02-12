import { API_BASE_URL } from './config';
import { isTokenExpired } from './auth';

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
  type: 'mcq' | 'interview' | 'technical' | 'hr' | 'coding';
  googleFormLink?: string | null;
  googleSheetLink?: string | null;
  platform?: string;
  duration?: string;
  instructions?: string;
  interviewMode?: string;
  interviewType?: string;
  scheduledAt?: string;
  interviewers?: { name: string; email: string }[];
  meetingLink?: string;
  locationDetails?: {
    venueName: string;
    address: string;
    city: string;
    landmark: string;
  };
  scheduling?: {
    interviewDate: string;
    interviewTime: string;
    reportingTime: string;
  };
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
  type?: 'mcq' | 'interview' | 'technical' | 'hr' | 'coding';
  googleFormLink?: string | null;
  googleSheetLink?: string | null;
  platform?: string;
  duration?: string;
  instructions?: string;
  interviewMode?: string;
  interviewType?: string;
  scheduledAt?: string;
  interviewers?: { name: string; email: string }[];
  meetingLink?: string;
  locationDetails?: {
    venueName: string;
    address: string;
    city: string;
    landmark: string;
  };
  scheduling?: {
    interviewDate: string;
    interviewTime: string;
    reportingTime: string;
  };
}

export interface UpdateRoundDto {
  name?: string;
  description?: string;
  order?: number;
  type?: 'mcq' | 'interview' | 'technical' | 'hr' | 'coding';
  googleFormLink?: string | null;
  googleSheetLink?: string | null;
  platform?: string;
  duration?: string;
  instructions?: string;
  interviewMode?: string;
  interviewType?: string;
  scheduledAt?: string;
  interviewers?: { name: string; email: string }[];
  meetingLink?: string;
  locationDetails?: {
    venueName: string;
    address: string;
    city: string;
    landmark: string;
  };
  scheduling?: {
    interviewDate: string;
    interviewTime: string;
    reportingTime: string;
  };
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


export type EvaluationStatus = 'pending' | 'in_progress' | 'completed' | 'passed' | 'failed' | 'skipped' | 'missed' | 'rescheduling' | 'rescheduled';

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

const getAuthHeaders = async () => {
  let token = localStorage.getItem('access_token');

  if (token && isTokenExpired(token)) {
    console.log('Access token expired, attempting refresh...');
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          token = data.accessToken;
          localStorage.setItem('access_token', token as string);
          console.log('Token refreshed successfully');
        } else {
          console.error('Token refresh failed');
        }
      } catch (error) {
        console.error('Error refreshing token', error);
      }
    }
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const roundsAPI = {
  createRound: async (data: CreateRoundDto): Promise<Round> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create round: ${response.status}`);
    }

    return response.json();
  },

  getAllRounds: async (): Promise<Round[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rounds: ${response.status}`);
    }

    return response.json();
  },

  getRoundsByJob: async (jobId: string): Promise<Round[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/job/${jobId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rounds for job: ${response.status}`);
    }

    return response.json();
  },

  getRoundById: async (id: string): Promise<Round> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch round: ${response.status}`);
    }

    return response.json();
  },

  updateRound: async (id: string, data: UpdateRoundDto): Promise<Round> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update round: ${response.status}`);
    }

    return response.json();
  },

  deleteRound: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete round: ${response.status}`);
    }
  },

  archiveRound: async (id: string): Promise<Round> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/${id}/archive`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to archive round: ${response.status}`);
    }

    return response.json();
  },

  activateRound: async (id: string): Promise<Round> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/${id}/activate`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to activate round: ${response.status}`);
    }

    return response.json();
  },

  getMcqResponses: async (roundId: string): Promise<MCQResponse[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/${roundId}/mcq/responses`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch MCQ responses: ${response.status}`);
    }

    return response.json();
  },

  updateEvaluationStatus: async (evaluationId: string, status: EvaluationStatus, notes?: string): Promise<RoundEvaluation> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/evaluation/${evaluationId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update evaluation status: ${response.status}`);
    }

    return response.json();
  },

  getAllMcqResponses: async (): Promise<MCQResponse[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/mcq/responses/all`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch all MCQ responses: ${response.status}`);
    }

    return response.json();
  },

  submitMcqResponse: async (roundId: string, data: SubmitMcqDto): Promise<MCQResponse> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/${roundId}/mcq/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit MCQ response: ${response.status}`);
    }

    return response.json();
  },

  fetchGoogleSheetData: async (googleSheetUrl: string): Promise<any[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/fetch-google-sheet`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ googleSheetUrl }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheets data: ${response.status}`);
    }

    return response.json();
  },


  getEvaluationsByApplications: async (applicationIds: string[]): Promise<RoundEvaluation[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/evaluations/by-applications`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ applicationIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch evaluations: ${response.status}`);
    }

    return response.json();
  },

  rescheduleRound: async (evaluationId: string): Promise<RoundEvaluation> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/evaluation/${evaluationId}/reschedule`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to reschedule round: ${response.status}`);
    }

    return response.json();
  },

  assignInterviewer: async (evaluationId: string, data: {
    interviewerId: string;
    interviewerName: string;
    interviewerEmail: string;
    scheduledAt: string;
    interviewMode: string;
    interviewType: string;
    platform?: string;
    meetingLink?: string;
    duration?: string;
    locationDetails?: any;
  }): Promise<RoundEvaluation> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rounds/evaluations/${evaluationId}/assign`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to assign interviewer: ${response.status}`);
    }

    return response.json();
  },
};
