import { API_BASE_URL } from './config';

export interface Application {
  _id: string;
  candidateId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  jobId: {
    _id: string;
    title: string;
    companyId: {
      _id: string;
      name: string;
      logoUrl?: string;
    };
    location: string;
    salary: string;
    jobType: string;
  };
  companyId: {
    _id: string;
    name: string;
  };
  coverLetter?: string;
  resumeUrl?: string;
  status: 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'HIRED' | 'REJECTED' | 'HOLD';
  notes?: string;
  currentRound?: {
    _id: string;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
  offerLetterUrl?: string;
  offerSentAt?: string;
  offerAccepted?: boolean | null;
  offerAcceptedAt?: string;
  offerDetails?: {
    position?: string;
    salary?: string;
    startDate?: string;
    expiryDate?: string;
    terms?: string;
    companyName?: string;
    jobTitle?: string;
    candidateName?: string;
  };
}

export interface CreateApplicationDto {
  jobId: string;
  companyId: string;
  coverLetter?: string;
  resumeUrl?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const applicationsAPI = {
  createApplication: async (data: CreateApplicationDto): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create application');
    }

    return response.json();
  },

  submitApplication: async (formData: FormData): Promise<Application> => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to submit application');
    }

    return response.json();
  },

  getApplicationsByCompany: async (companyId: string): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/company/${companyId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    return response.json();
  },

  getApplicationsByCandidate: async (): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/candidate`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    return response.json();
  },

  getAllApplications: async (): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all applications');
    }

    return response.json();
  },

  getApplicationById: async (id: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }

    return response.json();
  },

  updateApplicationStatus: async (id: string, status: string, notes?: string, currentRound?: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes, currentRound }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update status error:', response.status, errorText);
      throw new Error(`Failed to update application status: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  getOfferPreview: async (applicationId: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/offer-preview`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to load offer preview');
    }
    return response.json();
  },

  sendOffer: async (applicationId: string, payload: { position: string; salary: string; startDate: string; expiryDate?: string; terms?: string }) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/send-offer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to send offer');
    }
    return response.json();
  },

  acceptOffer: async (applicationId: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/offer/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to accept offer');
    }
    return response.json();
  },

  declineOffer: async (applicationId: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/offer/decline`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to decline offer');
    }
    return response.json();
  },

  getOfferDownloadLink: async (applicationId: string): Promise<{ downloadUrl: string }> => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/offer-download-link`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to get offer letter link');
    }
    return response.json();
  },
};
