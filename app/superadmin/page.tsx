'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Building,
  FileText,
  Briefcase,
  TrendingUp,
  TrendingDown,
  UserCheck,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Calendar,
  Eye,
  Download,
  Filter,
  ChevronRight,
  Globe,
  Shield,
  Zap,
  Sparkles
} from 'lucide-react';

export default function SuperadminDashboardPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Mock data for dashboard stats
  const dashboardStats = [
    { 
      id: 'candidates',
      label: 'Total Candidates', 
      value: '12,847', 
      icon: Users, 
      change: '+12.5%', 
      changeValue: 1256,
      color: 'from-blue-500 to-cyan-500',
      description: 'Active platform users',
      chartData: [65, 78, 82, 74, 85, 90, 95]
    },
    { 
      id: 'companies',
      label: 'Total Companies', 
      value: '2,489', 
      icon: Building, 
      change: '+8.3%', 
      changeValue: 189,
      color: 'from-emerald-500 to-teal-500',
      description: 'Verified company accounts',
      chartData: [45, 52, 48, 60, 65, 70, 72]
    },
    { 
      id: 'resumes',
      label: 'Total Resumes', 
      value: '15,624', 
      icon: FileText, 
      change: '+15.2%', 
      changeValue: 206,
      color: 'from-purple-500 to-pink-500',
      description: 'Uploaded CVs/Resumes',
      chartData: [80, 75, 82, 78, 85, 88, 92]
    },
    { 
      id: 'jobs',
      label: 'Total Job Posts', 
      value: '8,543', 
      icon: Briefcase, 
      change: '+18.7%', 
      changeValue: 1347,
      color: 'from-amber-500 to-orange-500',
      description: 'Active job listings',
      chartData: [30, 42, 48, 55, 60, 68, 75]
    },
  ];

  const recentActivities = [
    { id: 1, user: 'Sarah Chen', action: 'applied for', target: 'Senior Frontend Developer', time: '2 min ago', type: 'application' },
    { id: 2, user: 'TechCorp Inc.', action: 'posted new job', target: 'DevOps Engineer', time: '15 min ago', type: 'job' },
    { id: 3, user: 'Michael Rodriguez', action: 'updated profile', target: 'Skills & Experience', time: '30 min ago', type: 'profile' },
    { id: 4, user: 'DesignStudio', action: 'hired', target: 'Jane Smith as UX Designer', time: '1 hour ago', type: 'hire' },
    { id: 5, user: 'GlobalSoft', action: 'verified company', target: 'Account', time: '2 hours ago', type: 'verification' },
  ];

  const platformMetrics = [
    { label: 'Placement Rate', value: '86%', icon: UserCheck, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Avg Response Time', value: '2.4h', icon: Activity, color: 'bg-blue-100 text-blue-600' },
    { label: 'Revenue (MTD)', value: '$124.5K', icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
    { label: 'Avg. Time to Hire', value: '18 days', icon: Calendar, color: 'bg-amber-100 text-amber-600' },
  ];

  const topCompanies = [
    { name: 'TechCorp', jobs: 156, candidates: 2.4, rating: 4.8, trend: '+12%' },
    { name: 'GlobalSoft', jobs: 128, candidates: 1.9, rating: 4.7, trend: '+8%' },
    { name: 'DesignStudio', jobs: 89, candidates: 1.5, rating: 4.9, trend: '+15%' },
    { name: 'DataSystems', jobs: 104, candidates: 2.1, rating: 4.6, trend: '+5%' },
    { name: 'CloudTech', jobs: 92, candidates: 1.7, rating: 4.8, trend: '+11%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                  <p className="text-gray-600 mt-1">
                    Platform overview and management console
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last quarter</option>
                  <option value="1y">Last year</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </div>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
            <div className="absolute inset-0 bg-grid-white/10 bg-grid-8"></div>
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                    <Sparkles className="h-4 w-4 text-white mr-2" />
                    <span className="text-white text-sm font-medium">
                      Platform Overview
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Welcome back, Super Admin
                  </h2>
                  <p className="text-white/90 max-w-2xl">
                    Monitor platform performance, manage users, and access real-time analytics from your centralized dashboard.
                  </p>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-white text-2xl font-bold">99.2%</div>
                      <div className="text-white/80 text-sm">Uptime</div>
                    </div>
                    <div className="h-12 w-px bg-white/30"></div>
                    <div className="text-right">
                      <div className="text-white text-2xl font-bold">24/7</div>
                      <div className="text-white/80 text-sm">Monitoring</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Main Stats */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={stat.id}
                      className="group relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className={`flex items-center text-sm font-medium ${
                          stat.changeValue >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {stat.changeValue >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {stat.change}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-4">{stat.description}</div>
                      
                      {/* Mini Chart */}
                      <div className="relative h-12">
                        <div className="absolute inset-0 flex items-end space-x-0.5">
                          {stat.chartData.map((value, index) => (
                            <div 
                              key={index}
                              className="flex-1 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t"
                              style={{ height: `${value}%` }}
                            >
                              <div className={`absolute bottom-0 w-full rounded-t bg-gradient-to-t ${stat.color}`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Metrics & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Platform Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platformMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${metric.color.split(' ')[0]}`}>
                          <Icon className={`h-4 w-4 ${metric.color.split(' ')[1]}`} />
                        </div>
                        <div className="text-xs text-gray-500">Last 30d</div>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                      <div className="text-sm text-gray-600">{metric.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Chart Placeholder */}
              <div className="mt-8">
                <div className="h-64 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Performance analytics chart</p>
                    <p className="text-gray-400 text-sm mt-1">Interactive visualization of platform metrics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'application' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'job' ? 'bg-green-100 text-green-600' :
                      activity.type === 'profile' ? 'bg-purple-100 text-purple-600' :
                      activity.type === 'hire' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {activity.type === 'application' && <Briefcase className="h-4 w-4" />}
                      {activity.type === 'job' && <Building className="h-4 w-4" />}
                      {activity.type === 'profile' && <Users className="h-4 w-4" />}
                      {activity.type === 'hire' && <UserCheck className="h-4 w-4" />}
                      {activity.type === 'verification' && <Shield className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-gray-600">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Third Row - Companies & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Companies */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Companies</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View all companies
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Jobs</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Candidates/Job</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topCompanies.map((company, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-3">
                              <Building className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{company.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{company.jobs}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{company.candidates}K</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className={`w-4 h-4 ${
                                  i < Math.floor(company.rating) 
                                    ? 'text-amber-400 fill-current' 
                                    : 'text-gray-300'
                                }`}>
                                  ★
                                </div>
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{company.rating}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            company.trend.startsWith('+') 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {company.trend.startsWith('+') ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {company.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6 h-full">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Manage Users</div>
                      <div className="text-sm text-gray-500">View all platform users</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Company Management</div>
                      <div className="text-sm text-gray-500">Verify and manage companies</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Analytics Reports</div>
                      <div className="text-sm text-gray-500">Generate detailed reports</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-amber-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Platform Settings</div>
                      <div className="text-sm text-gray-500">Configure system settings</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}