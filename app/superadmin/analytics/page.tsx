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
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { applicationsAPI, Application } from '../../api/applications';
import { companiesAPI } from '../../api/companies';
import { usersAPI } from '../../api/users';

interface AnalyticsData {
  totalApplications: number;
  totalCompanies: number;
  totalCandidates: number;
  totalJobs: number;
  applicationsByStatus: { [key: string]: number };
  applicationsOverTime: { date: string; count: number }[];
  applicationsLast30DaysByStatus: { name: string; value: number; color: string }[];
  topCompanies: { name: string; applications: number }[];
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Fetch all required data
        const [applications, companies, candidates, companyAdmins] = await Promise.all([
          applicationsAPI.getAllApplications(),
          companiesAPI.getAllCompanies(),
          usersAPI.getUsersByRole('CANDIDATE'),
          usersAPI.getUsersByRole('COMPANY_ADMIN'),
        ]);

        // Calculate analytics
        const analytics: AnalyticsData = {
          totalApplications: applications.length,
          totalCompanies: companies.length,
          totalCandidates: candidates.length,
          totalJobs: 0, // Will be calculated from applications
          applicationsByStatus: {},
          applicationsOverTime: [],
          applicationsLast30DaysByStatus: [],
          topCompanies: [],
        };

        // Count applications by status
        applications.forEach((app: Application) => {
          analytics.applicationsByStatus[app.status] = (analytics.applicationsByStatus[app.status] || 0) + 1;
        });

        // Count applications over time and status (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyCounts: { [key: string]: number } = {};
        const statusCounts30Days: { [key: string]: number } = {};

        applications.forEach((app: Application) => {
          const appDate = new Date(app.createdAt);
          const date = appDate.toISOString().split('T')[0];

          if (appDate >= thirtyDaysAgo) {
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
            statusCounts30Days[app.status] = (statusCounts30Days[app.status] || 0) + 1;
          }
        });

        analytics.applicationsOverTime = Object.entries(dailyCounts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        const statusColors: { [key: string]: string } = {
          'APPLIED': '#3b82f6',
          'UNDER_REVIEW': '#f59e0b',
          'SHORTLISTED': '#8b5cf6',
          'HIRED': '#10b981',
          'REJECTED': '#ef4444',
        };

        analytics.applicationsLast30DaysByStatus = Object.entries(statusCounts30Days).map(([status, count]) => ({
          name: status.replace('_', ' '),
          value: count,
          color: statusColors[status] || '#6b7280',
        }));

        // Count unique jobs
        const uniqueJobs = new Set(applications.map((app: Application) => app.jobId._id));
        analytics.totalJobs = uniqueJobs.size;

        // Top companies by applications
        const companyCounts: { [key: string]: { name: string; count: number } } = {};
        applications.forEach((app: Application) => {
          const companyId = app.companyId._id;
          const companyName = app.companyId.name;
          if (!companyCounts[companyId]) {
            companyCounts[companyId] = { name: companyName, count: 0 };
          }
          companyCounts[companyId].count++;
        });

        analytics.topCompanies = Object.values(companyCounts)
          .map(company => ({ name: company.name, applications: company.count }))
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading analytics...</div>
        </div>
      </div>
    );
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

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
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
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCandidates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalJobs}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Application Status Distribution</h3>
              <p className="text-sm text-gray-500">All-time applications by their current stage</p>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <div className="h-64">
            {Object.keys(analyticsData.applicationsByStatus).length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(analyticsData.applicationsByStatus).map(([status, count]) => ({
                    name: status.replace('_', ' '),
                    value: count,
                    status: status
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  >
                    {Object.entries(analyticsData.applicationsByStatus).map(([status, count], index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={{
                          'APPLIED': '#8b5cf6', // Purple as in design
                          'UNDER_REVIEW': '#3b82f6', // Blue
                          'SHORTLISTED': '#10b981', // Green as in design
                          'HIRED': '#059669', // Darker Green
                          'REJECTED': '#ef4444', // Red
                        }[status] || '#6b7280'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No application data available
              </div>
            )}
          </div>
        </div>

        {/* Applications Over Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Over Time (Last 30 Days)</h3>
          <div className="h-64">
            {analyticsData.applicationsLast30DaysByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.applicationsLast30DaysByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.applicationsLast30DaysByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No applications in the last 30 days
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Companies by Applications</h3>
        <div className="space-y-3">
          {analyticsData.topCompanies.length > 0 ? (
            analyticsData.topCompanies.map((company, index) => (
              <div key={company.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{company.name}</span>
                </div>
                <span className="text-sm text-gray-600">{company.applications} applications</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No company data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
