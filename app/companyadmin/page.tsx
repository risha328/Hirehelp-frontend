// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { companiesAPI } from '../api/companies';

// export default function CompanyAdminPage() {
//   const router = useRouter();
//   const [company, setCompany] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCompany = async () => {
//       try {
//         console.log('Fetching company...');
//         const response = await companiesAPI.getMyCompany();
//         console.log('getMyCompany response:', response);
//         setCompany(response);
//       } catch (error) {
//         console.error('Failed to fetch company:', error);
//         // Company not found or not registered yet
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompany();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-lg">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {company ? (
//         company.verificationStatus === 'verified' ? (
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center space-x-4 mb-4">
//               {company.logoUrl && (
//                 <img
//                   src={`${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`}
//                   alt={`${company.name} logo`}
//                   className="w-16 h-16 rounded-lg object-cover"
//                 />
//               )}
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
//                 <p className="text-gray-600">{company.industry} • {company.size}</p>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-500">Verification Status:</span>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     company.verificationStatus === 'verified'
//                       ? 'bg-green-100 text-green-800'
//                       : company.verificationStatus === 'rejected'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {company.verificationStatus === 'verified' ? 'Active' :
//                      company.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <p className="text-gray-700 mb-4">{company.description}</p>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               {company.website && (
//                 <div>
//                   <span className="font-medium">Website:</span> <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a>
//                 </div>
//               )}
//               <div>
//                 <span className="font-medium">Location:</span> {company.location}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center space-x-4 mb-4">
//               {company.logoUrl && (
//                 <img
//                   src={`${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`}
//                   alt={`${company.name} logo`}
//                   className="w-16 h-16 rounded-lg object-cover"
//                 />
//               )}
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Your Company: {company.name}</h2>
//                 <p className="text-gray-600">{company.industry} • {company.size}</p>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-500">Verification Status:</span>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     company.verificationStatus === 'verified'
//                       ? 'bg-green-100 text-green-800'
//                       : company.verificationStatus === 'rejected'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {company.verificationStatus === 'verified' ? 'Active' :
//                      company.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <p className="text-gray-700 mb-4">{company.description}</p>
//             <p className="text-gray-600 mb-4">
//               Your Registered your company but still now not verified.
//             </p>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               {company.website && (
//                 <div>
//                   <span className="font-medium">Website:</span> <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a>
//                 </div>
//               )}
//               <div>
//                 <span className="font-medium">Location:</span> {company.location}
//               </div>
//             </div>
//           </div>
//         )
//       ) : (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Company Admin</h2>
//           <p className="text-gray-600 mb-4">
//             You haven't registered a company yet. Register your company to start managing your hiring process.
//           </p>
//           <button
//             onClick={() => router.push('/companies')}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Register Your Company
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Jobs</h3>
//           <p className="text-3xl font-bold text-blue-600">12</p>
//           <p className="text-sm text-gray-500 mt-1">Posted this month</p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Applications</h3>
//           <p className="text-3xl font-bold text-green-600">156</p>
//           <p className="text-sm text-gray-500 mt-1">Across all jobs</p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Members</h3>
//           <p className="text-3xl font-bold text-purple-600">8</p>
//           <p className="text-sm text-gray-500 mt-1">Active recruiters</p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  Edit,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Download,
  Filter,
  Sparkles,
  Shield,
  Globe,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Eye,
  Calendar,
  Award,
  X,
  Upload,
  Save
} from 'lucide-react';
import { companiesAPI, jobsAPI } from '../api/companies';
import { applicationsAPI } from '../api/applications';
import { API_BASE_URL } from '../api/config';
import EditCompanyModal from '../components/EditCompanyModal';

export default function CompanyAdminPage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({
    activeJobs: 12,
    totalApplications: 156,
    teamMembers: 8,
    interviewsScheduled: 24
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [showAllActivities, setShowAllActivities] = useState(false);

  useEffect(() => {
    fetchCompany();
    fetchStats();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await companiesAPI.getMyCompany();
      console.log('getMyCompany response:', response);
      setCompany(response);
      // Fetch recent activities after company is loaded
      if (response) {
        await fetchRecentActivities(response);
      }
    } catch (error) {
      console.error('Failed to fetch company:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Mock stats data - replace with API call
    setTimeout(() => {
      setStats({
        activeJobs: 12,
        totalApplications: 156,
        teamMembers: 8,
        interviewsScheduled: 24
      });
    }, 500);
  };

  const fetchRecentActivities = async (companyData?: any) => {
    const currentCompany = companyData || company;
    if (!currentCompany) {
      console.log('fetchRecentActivities: company not loaded yet');
      return;
    }

    console.log('fetchRecentActivities: company loaded, id:', currentCompany._id);

    try {
      // Fetch recent jobs
      console.log('Fetching jobs for company:', currentCompany._id);
      const jobsResponse = await jobsAPI.getJobsByCompany(currentCompany._id);
      console.log('Jobs response:', jobsResponse);
      const recentJobs = jobsResponse.slice(0, 3).map((job: any) => ({
        id: `job-${job._id}`,
        action: 'Job published',
        target: job.title,
        time: new Date(job.createdAt).toLocaleString(),
        type: 'published'
      }));

      // Fetch recent applications
      console.log('Fetching applications for company:', currentCompany._id);
      const applicationsResponse = await applicationsAPI.getApplicationsByCompany(currentCompany._id);
      console.log('Applications response:', applicationsResponse);
      const recentApplications = applicationsResponse.slice(0, 3).map((app: any) => ({
        id: `app-${app._id}`,
        action: 'New application received',
        target: `${app.candidateId.name} - ${app.jobId.title}`,
        time: new Date(app.createdAt).toLocaleString(),
        type: 'application',
        count: applicationsResponse.filter((a: any) => a.jobId._id === app.jobId._id).length
      }));

      // Combine and sort by time (most recent first)
      const allActivities = [...recentJobs, ...recentApplications]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

      console.log('All activities:', allActivities);
      setRecentActivities(allActivities);
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      // Fallback to mock data if API fails
      setRecentActivities([
        {
          id: 1,
          action: 'New application received',
          target: 'Senior Frontend Developer',
          time: '10 min ago',
          count: 3
        },
        {
          id: 2,
          action: 'Interview scheduled',
          target: 'Jane Smith - UX Designer',
          time: '1 hour ago',
          type: 'interview'
        },
        {
          id: 3,
          action: 'Job published',
          target: 'DevOps Engineer',
          time: '3 hours ago',
          type: 'published'
        },
        {
          id: 4,
          action: 'Company profile updated',
          target: 'Website & Logo',
          time: '1 day ago',
          type: 'update'
        }
      ]);
    }
  };

  const getVerificationStatus = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          label: 'Verified',
          color: 'bg-emerald-100 text-emerald-800',
          icon: CheckCircle,
          description: 'Your company is fully verified and active'
        };
      case 'pending':
        return {
          label: 'Under Review',
          color: 'bg-amber-100 text-amber-800',
          icon: Clock,
          description: 'Your company is being reviewed by our team'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          description: 'Please update your company information'
        };
      default:
        return {
          label: 'Not Registered',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          description: 'Register your company to get started'
        };
    }
  };

  const quickActions = [
    {
      icon: Plus,
      label: 'Post New Job',
      description: 'Create a new job listing',
      color: 'from-blue-500 to-cyan-500',
      href: '/company/jobs/new'
    },
    {
      icon: Briefcase,
      label: 'Manage Jobs',
      description: 'View and edit job postings',
      color: 'from-purple-500 to-pink-500',
      href: '/company/jobs'
    },
    {
      icon: Users,
      label: 'View Candidates',
      description: 'Review applications',
      color: 'from-emerald-500 to-teal-500',
      href: '/company/applications'
    },
    {
      icon: Settings,
      label: 'Company Settings',
      description: 'Update company information',
      color: 'from-amber-500 to-orange-500',
      href: '/company/settings'
    }
  ];



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  const statusInfo = company ? getVerificationStatus(company.verificationStatus) : getVerificationStatus('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
                  <p className="text-gray-600 mt-1">
                    Manage your company profile, jobs, and hiring process
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {company?.verificationStatus === 'verified' && (
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </button>
              )}
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Status Banner */}
        <div className="mb-8">
          {company ? (
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start space-x-4 mb-6 lg:mb-0">
                    {/* Company Logo */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                        {company.logoUrl ? (
                          <img
                            src={`${API_BASE_URL}${company.logoUrl}`}
                            alt={company.name}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <Building className="h-10 w-10 text-white" />
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <div className={`p-1.5 rounded-full ${statusInfo.color} border-2 border-white`}>
                          <statusInfo.icon className="h-3 w-3" />
                        </div>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-white">{company.name}</h2>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <statusInfo.icon className="h-3 w-3 mr-1.5" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-white/90 mb-3">{company.industry} • {company.size}</p>
                      <p className="text-white/80 text-sm">{statusInfo.description}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {company.verificationStatus === 'verified' ? (
                      <>
                        <button
                          onClick={() => router.push('/company/jobs/new')}
                          className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Post New Job
                        </button>
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                        >
                          <Edit className="h-5 w-5 mr-2" />
                          Edit Company
                        </button>
                      </>
                    ) : company.verificationStatus === 'pending' ? (
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center text-white">
                          <Clock className="h-5 w-5 mr-2" />
                          <span className="font-medium">Verification in Progress</span>
                        </div>
                        <p className="text-white/80 text-sm mt-1">
                          Our team is reviewing your company information. This usually takes 1-2 business days.
                        </p>
                      </div>
                    ) : (
                      <button
                         onClick={() => setShowEditModal(true)}
                        className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="h-5 w-5 mr-2" />
                        Update Company Info
                      </button>
                    )}
                  </div>
                </div>

                {/* Company Details */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center text-white/90">
                      <MapPin className="h-5 w-5 mr-3 text-white/70" />
                      <span>{company.location}</span>
                    </div>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-white/90 hover:text-white"
                      >
                        <Globe className="h-5 w-5 mr-3 text-white/70" />
                        <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    )}
                    {company.email && (
                      <div className="flex items-center text-white/90">
                        <Mail className="h-5 w-5 mr-3 text-white/70" />
                        <span className="truncate">{company.email}</span>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center text-white/90">
                        <Phone className="h-5 w-5 mr-3 text-white/70" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to Company Admin</h2>
                <p className="text-white/90 mb-8">
                  Register your company to start managing your hiring process, posting jobs, 
                  and connecting with talented candidates.
                </p>
                <button
                  onClick={() => router.push('/companies')}
                  className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Register Your Company
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-emerald-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.activeJobs}</div>
              <div className="text-gray-600">Active Jobs</div>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2"></div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-emerald-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +24%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalApplications}</div>
              <div className="text-gray-600">Total Applications</div>
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2"></div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-emerald-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.teamMembers}</div>
              <div className="text-gray-600">Team Members</div>
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-emerald-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.interviewsScheduled}</div>
              <div className="text-gray-600">Interviews Scheduled</div>
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {company ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  <span className="text-sm text-gray-500">Get started quickly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => router.push(action.href)}
                        className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-5 text-left hover:border-indigo-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                              {action.label}
                            </h4>
                            <p className="text-sm text-gray-500">{action.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  {recentActivities.length > 2 && (
                    <button
                      onClick={() => setShowAllActivities(!showAllActivities)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {showAllActivities ? 'View Less' : 'View More'}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {(showAllActivities ? recentActivities : recentActivities.slice(0, 2)).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          {activity.type === 'interview' ? (
                            <Calendar className="h-5 w-5 text-indigo-600" />
                          ) : activity.type === 'published' ? (
                            <Briefcase className="h-5 w-5 text-indigo-600" />
                          ) : (
                            <Users className="h-5 w-5 text-indigo-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.action}</span>{' '}
                          <span className="text-gray-600">for</span>{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                      {activity.count && (
                        <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
                          {activity.count} new
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Profile Sidebar */}
            <div className="space-y-8">
              {/* Company Details Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">Company Profile</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Description</div>
                    <p className="text-sm text-gray-700 line-clamp-3">{company.description}</p>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Industry</div>
                    <div className="text-sm font-medium text-gray-900">{company.industry}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Company Size</div>
                    <div className="text-sm font-medium text-gray-900">{company.size}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Location</div>
                    <div className="text-sm font-medium text-gray-900">{company.location}</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full mt-6 py-2.5 text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm"
                >
                  Edit Company Profile
                </button>
              </div>

              {/* Performance Overview */}
              {/* <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Application Rate</span>
                    <span className="font-medium text-gray-900">12.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12.5%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Interview Rate</span>
                    <span className="font-medium text-gray-900">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hire Rate</span>
                    <span className="font-medium text-gray-900">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
              </div> */}

              {/* Support Card */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Need Help?</h3>
                </div>
                <p className="text-blue-100 text-sm mb-6">
                  Our support team is here to help you with any questions about your company account.
                </p>
                <button className="w-full py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                company?.verificationStatus === 'pending' ? 'bg-amber-100' : 'bg-red-100'
              }`}>
                {company?.verificationStatus === 'pending' ? (
                  <Clock className="h-10 w-10 text-amber-600" />
                ) : (
                  <AlertCircle className="h-10 w-10 text-red-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {company?.verificationStatus === 'pending'
                  ? 'Company Under Review'
                  : 'Company Verification Required'}
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                {company?.verificationStatus === 'pending'
                  ? `Thank you for registering ${company?.name}! Our team is currently reviewing your company information. You'll be notified once verification is complete.`
                  : `Your company registration requires attention. Please update your company information and resubmit for verification.`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Company Information
                </button>
                <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Company Modal */}
      <EditCompanyModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          fetchCompany();
          setShowEditModal(false);
        }}
      />
    </div>
  );
}
