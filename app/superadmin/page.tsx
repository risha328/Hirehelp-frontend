"use client";

// API imports
import { companiesAPI, jobsAPI } from '../api/companies';
import { usersAPI } from '../api/users';
import { applicationsAPI } from '../api/applications';
import { analyticsAPI } from '../api/analytics';
import {
  FileText,
  Download,
  ChevronRight,
  MoreVertical,
  Filter,
  Calendar,
  Building,
  Users,
  Briefcase,
} from 'lucide-react';

// Chart components
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBar,
  Bar,
  AreaChart,
  Area
} from 'recharts';

import { useState, useEffect } from 'react';

export default function SuperadminDashboardPage() {
  const [kpiData, setKpiData] = useState({
    companies: { value: '0' },
    candidates: { value: '0' },
    jobs: { value: '0' },
    applications: { value: '0' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from APIs
        const [companies, candidates, jobs, applications] = await Promise.all([
          companiesAPI.getAllCompanies(),
          usersAPI.getUsersByRole('CANDIDATE'),
          jobsAPI.getAllJobs(),
          applicationsAPI.getAllApplications(),
        ]);

        // Calculate metrics
        const totalCompanies = companies.length;
        const totalCandidates = candidates.length;
        const totalJobs = jobs.length;
        const totalApplications = applications.length;

        // For simplicity, using static change values; in a real app, calculate from historical data
        setKpiData({
          companies: { value: totalCompanies.toString() },
          candidates: { value: totalCandidates.toString() },
          jobs: { value: totalJobs.toString() },
          applications: { value: totalApplications.toString() },
        });
      } catch (err) {
        console.error('Error fetching KPI data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  // Simplified KPI Cards
  const platformKPIs = [
    {
      id: 'companies',
      label: 'Total Companies',
      value: loading ? 'Loading...' : kpiData.companies.value,
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      id: 'candidates',
      label: 'Total Candidates',
      value: loading ? 'Loading...' : kpiData.candidates.value,
      icon: Users,
      color: 'bg-emerald-500'
    },
    {
      id: 'jobs',
      label: 'Active Jobs',
      value: loading ? 'Loading...' : kpiData.jobs.value,
      icon: Briefcase,
      color: 'bg-purple-500'
    },
    {
      id: 'applications',
      label: 'Total Applications',
      value: loading ? 'Loading...' : kpiData.applications.value,
      icon: FileText,
      color: 'bg-amber-500'
    },
  ];

  const [companyGrowthData, setCompanyGrowthData] = useState([
    { month: 'Jul', companies: 240, growth: 15 },
    { month: 'Aug', companies: 288, growth: 20 },
    { month: 'Sep', companies: 340, growth: 18 },
    { month: 'Oct', companies: 401, growth: 22 },
    { month: 'Nov', companies: 459, growth: 14 },
    { month: 'Dec', companies: 504, growth: 10 },
  ]);

  const [hiringActivityData, setHiringActivityData] = useState([
    { week: 'W1', jobs: 210, applications: 4200 },
    { week: 'W2', jobs: 245, applications: 4900 },
    { week: 'W3', jobs: 280, applications: 5600 },
    { week: 'W4', jobs: 315, applications: 6300 },
  ]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [companyGrowth, hiringActivity] = await Promise.all([
          analyticsAPI.getCompanyGrowth(),
          analyticsAPI.getHiringActivity(),
        ]);

        // Transform company growth data
        const sortedGrowth = companyGrowth.sort((a: any, b: any) => a.period.localeCompare(b.period));
        let cumulative = 0;
        const transformedGrowth = sortedGrowth.map((item: any, index: number) => {
          cumulative += item.count;
          const growth = index === 0 ? item.count : item.count; // growth is the monthly addition
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const [, month] = item.period.split('-');
          const monthName = monthNames[parseInt(month) - 1];
          return { month: monthName, companies: cumulative, growth };
        });
        setCompanyGrowthData(transformedGrowth);

        // Transform hiring activity data - take last 4 weeks
        const sortedActivity = hiringActivity.sort((a: any, b: any) => a.period.localeCompare(b.period));
        const last4 = sortedActivity.slice(-4);
        const transformedActivity = last4.map((item: any, index: number) => ({
          week: `W${index + 1}`,
          jobs: item.jobs,
          applications: item.applications,
        }));
        setHiringActivityData(transformedActivity);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        // Keep default data on error
      }
    };

    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    const fetchTopCompaniesData = async () => {
      try {
        setLoadingTopCompanies(true);
        const topCompaniesData = await analyticsAPI.getTopCompanies();
        setTopCompanies(topCompaniesData);
      } catch (err) {
        console.error('Error fetching top companies data:', err);
      } finally {
        setLoadingTopCompanies(false);
      }
    };

    fetchTopCompaniesData();
  }, []);

  const [loadingTopCompanies, setLoadingTopCompanies] = useState(true);
  const [topCompanies, setTopCompanies] = useState<any[]>([]);



  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center mt-1">
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: pld.color }}
              />
              <span className="text-sm text-gray-600">{pld.dataKey}: </span>
              <span className="text-sm font-medium ml-1 text-gray-900">{pld.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
              <p className="text-gray-600 mt-1">Real-time platform metrics and analytics</p>
            </div>


            <div className="mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Simplified KPI Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformKPIs.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${kpi.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                    <div className="text-sm font-medium text-gray-700">{kpi.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart 1: Company Growth - Cleaner Design */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Company Growth</h3>
                <p className="text-sm text-gray-600">Cumulative company signups over time</p>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={companyGrowthData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="companies"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorCompanies)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Hiring Activity - Cleaner Design */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hiring Activity</h3>
                <p className="text-sm text-gray-600">Weekly job posts vs applications</p>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <Filter className="h-5 w-5" />
              </button>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBar
                  data={hiringActivityData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    stroke="#6b7280"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="jobs"
                    name="Jobs Posted"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="applications"
                    name="Applications"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBar>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Enhanced Top Performing Companies */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Companies</h3>
                <p className="text-sm text-gray-600">Ranked by hiring activity and engagement</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Jobs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Hires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingTopCompanies ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-gray-500 text-sm">Loading ranking data...</p>
                      </div>
                    </td>
                  </tr>
                ) : topCompanies.length > 0 ? (
                  topCompanies.map((company, index) => (
                    <tr key={company.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-amber-50' :
                            index === 1 ? 'bg-blue-50' :
                              index === 2 ? 'bg-purple-50' : 'bg-gray-50'
                            }`}>
                            <Building className={`h-5 w-5 ${index === 0 ? 'text-amber-600' :
                              index === 1 ? 'text-blue-600' :
                                index === 2 ? 'text-purple-600' : 'text-gray-600'
                              }`} />
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{company.name}</div>
                            <div className="text-xs text-gray-500">Active</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{company.jobs}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {company.applications.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 mr-2">{company.hires}</div>
                          <div className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                            {company.applications > 0 ? ((company.hires / company.applications) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-1.5 min-w-[100px]">
                            <div
                              className={`h-1.5 rounded-full ${company.engagement > 90 ? 'bg-emerald-500' :
                                company.engagement > 80 ? 'bg-blue-500' :
                                  'bg-amber-500'
                                }`}
                              style={{ width: `${Math.min(company.engagement, 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {company.engagement}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {company.score.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No performing companies found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  );
}
