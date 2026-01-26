'use client';

import {
  Users,
  Building,
  BarChart3,
  FileText,
  Briefcase,
  TrendingUp,
  TrendingDown,
  UserCheck,
} from 'lucide-react';

export default function SuperadminDashboardPage() {
  // Mock data for dashboard stats
  const dashboardStats = [
    { label: 'Total Candidates', value: '1,247', icon: Users, change: '+12%', color: 'bg-blue-500', trend: 'up' },
    { label: 'Active Companies', value: '89', icon: Building, change: '+8%', color: 'bg-green-500', trend: 'up' },
    { label: 'Job Postings', value: '456', icon: Briefcase, change: '+15%', color: 'bg-purple-500', trend: 'up' },
    { label: 'Placements', value: '234', icon: UserCheck, change: '+5%', color: 'bg-amber-500', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Super Admin Dashboard</h2>
        <p className="text-gray-600">
          Manage the entire platform, oversee companies, candidates, and analytics from this central dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {stat.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <Users className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Candidates</h3>
          <p className="text-sm text-gray-600">View and manage all platform candidates</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <Building className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Companies</h3>
          <p className="text-sm text-gray-600">Oversee company accounts and activities</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <BarChart3 className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
          <p className="text-sm text-gray-600">Access platform-wide analytics and reports</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <FileText className="h-8 w-8 text-amber-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Library</h3>
          <p className="text-sm text-gray-600">Manage uploaded resumes and documents</p>
        </div>
      </div>
    </div>
  );
}
