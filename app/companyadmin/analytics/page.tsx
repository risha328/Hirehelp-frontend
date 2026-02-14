'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  Users,
  Building,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';
import { applicationsAPI, Application } from '../../api/applications';
import { companiesAPI } from '../../api/companies';
import { usersAPI } from '../../api/users';
import Loader from '../../components/Loader';

interface AnalyticsData {
  totalApplications: number;
  totalJobs: number;
  totalCandidates: number;
  applicationsByStatus: { [key: string]: number };
  applicationsOverTime: { date: string; count: number }[];
  topJobPositions: { title: string; applications: number }[];
}

export default function CompanyAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Get company information for the logged-in company admin
        const companyData = await companiesAPI.getMyCompany();
        setCompany(companyData);

        // Fetch applications for this company
        const applications = await applicationsAPI.getApplicationsByCompany(companyData._id);

        // Fetch jobs for this company
        const { jobsAPI } = await import('../../api/companies');
        const jobs = await jobsAPI.getJobsByCompany(companyData._id);

        // Calculate analytics
        const analytics: AnalyticsData = {
          totalApplications: applications.length,
          totalJobs: jobs.length,
          totalCandidates: 0, // Will be calculated from unique candidates
          applicationsByStatus: {},
          applicationsOverTime: [],
          topJobPositions: [],
        };

        // Count applications by status
        applications.forEach((app: Application) => {
          analytics.applicationsByStatus[app.status] = (analytics.applicationsByStatus[app.status] || 0) + 1;
        });

        // Count applications over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyCounts: { [key: string]: number } = {};
        applications.forEach((app: Application) => {
          const date = new Date(app.createdAt).toISOString().split('T')[0];
          if (new Date(app.createdAt) >= thirtyDaysAgo) {
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
          }
        });

        analytics.applicationsOverTime = Object.entries(dailyCounts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Count unique candidates
        const uniqueCandidates = new Set(applications.map((app: Application) => app.candidateId._id));
        analytics.totalCandidates = uniqueCandidates.size;

        // Top job positions by applications
        const jobCounts: { [key: string]: { title: string; count: number } } = {};
        applications.forEach((app: Application) => {
          const jobId = app.jobId._id;
          const jobTitle = app.jobId.title;
          if (!jobCounts[jobId]) {
            jobCounts[jobId] = { title: jobTitle, count: 0 };
          }
          jobCounts[jobId].count++;
        });

        analytics.topJobPositions = Object.values(jobCounts)
          .map(job => ({ title: job.title, applications: job.count }))
          .sort((a, b) => b.applications - a.applications)
          .slice(0, 5);

        setAnalyticsData(analytics);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'SHORTLISTED': return 'bg-purple-100 text-purple-800';
      case 'HIRED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'HOLD': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <Loader variant="container" text="Analytics" subText="Processing company metrics..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!analyticsData || !company) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">{company.name}</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCandidates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Applications/Job</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.totalJobs > 0
                  ? (analyticsData.totalApplications / analyticsData.totalJobs).toFixed(1)
                  : '0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.applicationsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-600">{count} applications</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {analyticsData.totalApplications > 0
                    ? Math.round((count / analyticsData.totalApplications) * 100)
                    : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Over Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Over Time (Last 30 Days)</h3>
          <div className="space-y-2">
            {analyticsData.applicationsOverTime.length > 0 ? (
              analyticsData.applicationsOverTime.slice(-7).map((item) => (
                <div key={item.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((item.count / Math.max(...analyticsData.applicationsOverTime.map(d => d.count))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No applications in the last 30 days</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Job Positions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Job Positions by Applications</h3>
        <div className="space-y-3">
          {analyticsData.topJobPositions.length > 0 ? (
            analyticsData.topJobPositions.map((job, index) => (
              <div key={job.title} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{job.title}</span>
                </div>
                <span className="text-sm text-gray-600">{job.applications} applications</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No job application data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
