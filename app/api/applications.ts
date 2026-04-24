import { API_BASE_URL } from './config';
import { isTokenExpired } from './auth';

/** Onboarding phase (derived): PRE_JOINING | READY_TO_JOIN | CONVERTED */
export type OnboardingPhase = 'PRE_JOINING' | 'READY_TO_JOIN' | 'CONVERTED';

/** Background verification status */
export type BackgroundVerificationStatus = 'NOT_INITIATED' | 'IN_PROGRESS' | 'VERIFIED' | 'FAILED';

/** Onboarding document type */
export type OnboardingDocumentType =
  | 'GOVERNMENT_ID'
  | 'ADDRESS_PROOF'
  | 'ACADEMIC_CERTIFICATES'
  | 'RESUME'
  | 'PHOTO';

/** Onboarding document status */
export type OnboardingDocumentStatus =
  | 'NOT_UPLOADED'
  | 'UPLOADED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface OnboardingDocumentItem {
  _id: string;
  applicationId: string;
  documentType: OnboardingDocumentType;
  status: OnboardingDocumentStatus;
  fileUrl?: string;
  rejectedReason?: string;
  reviewedAt?: string;
  uploadedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
  currentRound?:
    | string
    | {
        _id: string;
        name: string;
        type: string;
        mode?: 'INTERNAL' | 'EXTERNAL';
        externalLink?: string;
        durationMinutes?: number;
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
  joiningDate?: string;
  onboardingProgress?: number;
  documentStatus?: 'pending' | 'completed';
  backgroundVerificationStatus?: string;
  convertedToEmployee?: boolean;
  /** Derived phase for onboarding list/detail */
  onboardingPhase?: OnboardingPhase;
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

const getValidAccessToken = async (): Promise<string> => {
  let token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found');

  if (isTokenExpired(token)) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token found');

    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      throw new Error('Session expired, please login again');
    }

    const refreshData = await refreshResponse.json();
    token = refreshData.accessToken;
    if (!token) throw new Error('Session expired, please login again');
    localStorage.setItem('access_token', token);
  }

  return token;
};

const getOfferAuthHeaders = async () => {
  const token = await getValidAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
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
      let message = 'Failed to submit application';
      try {
        const err = await response.json();
        const msg = err?.message;
        if (msg) message = Array.isArray(msg) ? msg.join(', ') : msg;
      } catch {
        // response may not be JSON
      }
      if (response.status === 401) {
        message = 'Please log in as a candidate to apply.';
      } else if (response.status === 403) {
        message = message || 'Only candidates can apply for this job.';
      }
      throw new Error(message);
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
    const headers = await getOfferAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/offer-preview`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to load offer preview');
    }
    return response.json();
  },

  sendOffer: async (applicationId: string, payload: { position: string; salary: string; startDate: string; expiryDate?: string; terms?: string }) => {
    const headers = await getOfferAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/send-offer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to send offer');
    }
    return response.json();
  },

  acceptOffer: async (applicationId: string) => {
    const headers = await getOfferAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/offer/accept`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to accept offer');
    }
    return response.json();
  },

  declineOffer: async (applicationId: string) => {
    const headers = await getOfferAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/offer/decline`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to decline offer');
    }
    return response.json();
  },

  getOfferDownloadLink: async (applicationId: string): Promise<{ downloadUrl: string }> => {
    const headers = await getOfferAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/offer-download-link`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to get offer letter link');
    }
    return response.json();
  },

  convertToEmployee: async (applicationId: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/convert-to-employee`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to convert to employee');
    }
    return response.json();
  },

  getOnboardingDocuments: async (applicationId: string): Promise<OnboardingDocumentItem[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/onboarding-documents`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch onboarding documents');
    }
    return response.json();
  },

  uploadOnboardingDocument: async (
    applicationId: string,
    documentId: string,
    file: File,
  ): Promise<OnboardingDocumentItem> => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(
      `${API_BASE_URL}/applications/${applicationId}/onboarding-documents/${documentId}/upload`,
      {
        method: 'POST',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        body: formData,
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to upload document');
    }
    return response.json();
  },

  reviewOnboardingDocument: async (
    applicationId: string,
    documentId: string,
    status: 'APPROVED' | 'REJECTED',
    rejectedReason?: string,
  ): Promise<OnboardingDocumentItem> => {
    const response = await fetch(
      `${API_BASE_URL}/applications/${applicationId}/onboarding-documents/${documentId}/review`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, rejectedReason }),
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to review document');
    }
    return response.json();
  },

  updateBackgroundVerification: async (
    applicationId: string,
    status: BackgroundVerificationStatus,
    options?: { notes?: string; failedReason?: string },
  ): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/background-verification`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes: options?.notes, failedReason: options?.failedReason }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update background verification');
    }
    return response.json();
  },
};
