'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Clock, 
  FileText, 
  TrendingUp, 
  Bell, 
  Calendar,
  Award,
  User,
  Settings,
  Search,
  MapPin,
  DollarSign,
  Bookmark,
  Eye,
  CheckCircle,
  XCircle,
  ArrowRight,
  Filter,
  Download,
  Edit,
  Plus,
  Star,
  MessageSquare,
  Shield,
  Zap,
  BarChart3,
  Target,
  BellRing
} from 'lucide-react';

export default function CandidateDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);
  const [profileCompletion, setProfileCompletion] = useState(85);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data
  const dashboardStats = [
    { label: 'Applications', value: '24', icon: Briefcase, change: '+12%', color: 'bg-blue-500' },
    { label: 'Profile Views', value: '156', icon: Eye, change: '+8%', color: 'bg-green-500' },
    { label: 'Interviews', value: '3', icon: Calendar, change: '+1', color: 'bg-purple-500' },
    { label: 'Saved Jobs', value: '12', icon: Bookmark, change: '+3', color: 'bg-amber-500' },
  ];

  const recentApplications = [
    { 
      id: 1, 
      company: 'TechCorp Inc.', 
      position: 'Senior Frontend Developer', 
      status: 'Under Review', 
      date: '2 days ago',
      salary: '$120k - $150k',
      location: 'Remote',
      match: 95
    },
    { 
      id: 2, 
      company: 'DataSystems', 
      position: 'Backend Engineer', 
      status: 'Shortlisted', 
      date: '1 week ago',
      salary: '$130k - $160k',
      location: 'New York, NY',
      match: 88
    },
    { 
      id: 3, 
      company: 'CloudNative', 
      position: 'DevOps Engineer', 
      status: 'Applied', 
      date: '3 days ago',
      salary: '$100/hr',
      location: 'San Francisco, CA',
      match: 92
    },
  ];

  const recommendedJobs = [
    { 
      id: 1, 
      title: 'Full Stack Developer', 
      company: 'StartupXYZ', 
      type: 'Full-time', 
      location: 'Remote',
      salary: '$110k - $140k',
      match: 95,
      posted: '1 day ago'
    },
    { 
      id: 2, 
      title: 'React Specialist', 
      company: 'DesignFirst', 
      type: 'Contract', 
      location: 'Austin, TX',
      salary: '$90/hr',
      match: 88,
      posted: '3 days ago'
    },
    { 
      id: 3, 
      title: 'Node.js Engineer', 
      company: 'APITech', 
      type: 'Full-time', 
      location: 'Remote',
      salary: '$130k - $160k',
      match: 92,
      posted: '2 days ago'
    },
  ];

  const upcomingInterviews = [
    { id: 1, company: 'TechCorp', position: 'Senior Frontend Dev', date: 'Tomorrow, 2:00 PM', type: 'Video Call' },
    { id: 2, company: 'DataSystems', position: 'Backend Engineer', date: 'Mar 15, 10:30 AM', type: 'On-site' },
  ];

  const profileStats = {
    skills: 8,
    experience: '3 years',
    education: 'Bachelor\'s',
    certifications: 2
  };

  const skillTags = ['React', 'TypeScript', 'Next.js', 'Node.js', 'NestJS', 'MongoDB', 'AWS', 'Docker'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left: Logo & Search */}
            <div className="flex items-center flex-1">
              <Link href="/dashboard/candidate" className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 hidden md:inline">HireFlow</span>
              </Link>
              
              {/* Search Bar */}
              <div className="hidden md:block ml-8 flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right: Notifications & Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Senior Frontend Developer</p>
                </div>
                <button className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <Settings className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-600">Senior Frontend Developer</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="text-sm font-medium ml-1">4.8/5.0</span>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Strength</span>
                  <span className="text-sm font-bold text-blue-600">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Experience</span>
                  </div>
                  <span className="text-sm font-medium">{profileStats.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Skills</span>
                  </div>
                  <span className="text-sm font-medium">{profileStats.skills}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Education</span>
                  </div>
                  <span className="text-sm font-medium">{profileStats.education}</span>
                </div>
              </div>

              {/* Update Profile Button */}
              <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Edit className="h-4 w-4 mr-2" />
                Update Profile
              </button>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillTags.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button className="w-full mt-4 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Skills
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">Resume Builder</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">Job Analytics</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">Privacy Settings</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h1>
                  <p className="text-blue-100">
                    {recommendedJobs.length} new jobs match your profile. Keep up the great work!
                  </p>
                </div>
                <button className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center">
                  <BellRing className="h-4 w-4 mr-2" />
                  Job Alerts
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {['overview', 'applications', 'jobs', 'messages'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Recent Applications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Recent Applications
                    </h2>
                    <Link href="/dashboard/candidate/applications" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View all
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Briefcase className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{app.position}</h3>
                              <p className="text-gray-600">{app.company}</p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="flex items-center text-sm text-gray-500">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {app.location}
                                </span>
                                <span className="flex items-center text-sm text-gray-500">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  {app.salary}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                            app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {app.status}
                          </span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${app.match}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{app.match}% match</span>
                          </div>
                          <span className="text-sm text-gray-500">{app.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Interviews & Recommended Jobs */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Upcoming Interviews */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                      Upcoming Interviews
                    </h2>
                  </div>
                  <div className="p-6">
                    {upcomingInterviews.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingInterviews.map((interview) => (
                          <div key={interview.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-gray-900">{interview.position}</h3>
                                <p className="text-gray-600 text-sm">{interview.company}</p>
                              </div>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                                {interview.type}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2" />
                              {interview.date}
                            </div>
                            <div className="mt-4 flex space-x-2">
                              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Join Meeting
                              </button>
                              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                Reschedule
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No upcoming interviews scheduled</p>
                        <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                          Browse Jobs
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Jobs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                        Recommended For You
                      </h2>
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recommendedJobs.map((job) => (
                        <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-900">{job.title}</h3>
                              <p className="text-gray-600 text-sm">{job.company}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center justify-end">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${job.match}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-green-600">{job.match}%</span>
                              </div>
                              <span className="text-xs text-gray-500">{job.posted}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                              {job.type}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {job.location}
                            </span>
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {job.salary}
                            </span>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                              Apply Now
                            </button>
                            <button className="px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              <Bookmark className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Load More Jobs
                    </button>
                  </div>
                </div>
              </div>

              {/* Resume & Profile Tips */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-600" />
                    Profile Improvement Tips
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Add Portfolio Projects</h4>
                          <p className="text-sm text-gray-600">Increase profile visibility by 40%</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Update Resume</h4>
                          <p className="text-sm text-gray-600">Last updated 3 months ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Award className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Complete Skills Assessment</h4>
                          <p className="text-sm text-gray-600">Get certified in top skills</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Add References</h4>
                          <p className="text-sm text-gray-600">2 references recommended</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume Template
                    </button>
                    <button className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      View All Tips
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button className="flex flex-col items-center">
            <Search className="h-5 w-5 text-gray-500" />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button className="flex flex-col items-center">
            <Bookmark className="h-5 w-5 text-gray-500" />
            <span className="text-xs mt-1">Saved</span>
          </button>
          <button className="flex flex-col items-center">
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}