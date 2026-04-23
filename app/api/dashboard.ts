import { API_BASE_URL } from './config';
import { isTokenExpired } from './auth';

async function getValidAccessToken(): Promise<string> {
  let token: string | null = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found');

  if (isTokenExpired(token)) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token found');

    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      throw new Error('Session expired, please login again');
    }

    const refreshData = await refreshResponse.json();
    token = refreshData.accessToken as string;
    if (!token) throw new Error('Session expired, please login again');
    localStorage.setItem('access_token', token);
  }

  if (!token) throw new Error('No access token found');
  return token;
}

async function authedGet<T>(path: string): Promise<T> {
  const token = await getValidAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let message = `Failed to fetch dashboard data (${response.status})`;
    try {
      const err = await response.json();
      if (err?.message) message = Array.isArray(err.message) ? err.message.join(', ') : err.message;
    } catch {
      // ignore json parse issues
    }
    throw new Error(message);
  }

  return response.json();
}

export interface CompanyAdminDashboardResponse {
  company: any | null;
  stats: {
    activeJobs: number;
    totalApplications: number;
    teamMembers: number;
    interviewsScheduled: number;
  };
  jobPerformanceData: Array<{ name: string; applications: number; statuses?: Record<string, number> }>;
  applicationSourceData: Array<{ name: string; value: number; color: string }>;
  recentActivities: Array<{
    id: string;
    action: string;
    target: string;
    time: string;
    type: 'published' | 'application' | 'interview' | 'update';
    count?: number;
    sortAt: string;
  }>;
  hiredCandidates: Array<{
    id: string;
    name: string;
    position: string;
    hireDate: string;
    email: string;
    offerStatus: 'not_sent' | 'accepted' | 'pending' | 'declined';
  }>;
  acceptedOfferCount: number;
}

export interface CandidateDashboardResponse {
  applications: any[];
  summary: {
    totalApplications: number;
    byStatus: Record<string, number>;
    offers: {
      sent: number;
      accepted: number;
      declined: number;
      pending: number;
    };
    onboarding: {
      totalAcceptedOffers: number;
      docsCompleted: number;
      readyToJoin: number;
      converted: number;
    };
  };
}

export interface SuperAdminDashboardResponse {
  kpiData: {
    companies: { value: string };
    candidates: { value: string };
    jobs: { value: string };
    applications: { value: string };
  };
  companyGrowthData: Array<{ month: string; companies: number; growth: number }>;
  hiringActivityData: Array<{ week: string; jobs: number; applications: number }>;
  topCompanies: Array<{
    name: string;
    jobs: number;
    applications: number;
    hires: number;
    score: number;
    engagement: number;
  }>;
  pendingVerificationCount: number;
}

export const dashboardAPI = {
  getCompanyAdminDashboard: (): Promise<CompanyAdminDashboardResponse> =>
    authedGet('/dashboard/company-admin'),
  getCandidateDashboard: (): Promise<CandidateDashboardResponse> =>
    authedGet('/dashboard/candidate'),
  getSuperAdminDashboard: (): Promise<SuperAdminDashboardResponse> =>
    authedGet('/dashboard/super-admin'),
};

