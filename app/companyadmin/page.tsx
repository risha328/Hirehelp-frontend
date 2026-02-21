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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { companiesAPI, jobsAPI } from '../api/companies';
import { applicationsAPI } from '../api/applications';
import { analyticsAPI } from '../api/analytics';
import { API_BASE_URL, getFileUrl } from '../api/config';
import EditCompanyModal from '../components/EditCompanyModal';
import RegisterCompanyModal from '../components/RegisterCompanyModal';
import Loader from '../components/Loader';

export default function CompanyAdminPage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [stats, setStats] = useState({
    activeJobs: 12,
    totalApplications: 156,
    teamMembers: 8,
    interviewsScheduled: 24
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [jobPerformanceData, setJobPerformanceData] = useState<any[]>([]);
  const [applicationSourceData, setApplicationSourceData] = useState<any[]>([]);
  const [hiredCandidates, setHiredCandidates] = useState<any[]>([]);
  const [showAllHired, setShowAllHired] = useState(false);

  useEffect(() => {
    fetchCompany();
    fetchStats();
    fetchChartData();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await companiesAPI.getMyCompany();
      console.log('getMyCompany response:', response);
      setCompany(response.company);
      // Fetch recent activities after company is loaded
      if (response.company) {
        await fetchRecentActivities(response.company);
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

  const fetchChartData = async () => {
    console.log('fetchChartData: starting...');
    try {
      // Fetch Job Performance Data
      const performanceData = await analyticsAPI.getCompanyJobPerformance();
      console.log('fetchChartData: performanceData received:', performanceData);
      setJobPerformanceData(performanceData);

      // Fetch Application Stats for Pie Chart
      const stats = await analyticsAPI.getCompanyApplicationStats();
      console.log('fetchChartData: stats received:', stats);
      const colors = {
        'APPLIED': '#3b82f6',
        'UNDER_REVIEW': '#f59e0b',
        'SHORTLISTED': '#8b5cf6',
        'HIRED': '#10b981',
        'REJECTED': '#ef4444',
        'HOLD': '#6b7280'
      };

      const pieData = stats.map((s: any) => ({
        name: s.status.replace('_', ' '),
        value: s.count,
        color: colors[s.status as keyof typeof colors] || '#94a3b8'
      }));
      setApplicationSourceData(pieData);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      // Fallback to mock data if API fails or for new companies
      if (jobPerformanceData.length === 0) {
        setJobPerformanceData([
          { name: 'No Data yet', applications: 0 }
        ]);
        setApplicationSourceData([
          { name: 'No Applications', value: 1, color: '#e2e8f0' }
        ]);
      }
    }
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

      // Fetch hired candidates
      const hiredApplications = applicationsResponse.filter((app: any) => app.status === 'HIRED');
      const hiredCandidatesData = hiredApplications.slice(0, 5).map((app: any) => ({
        id: app._id,
        name: app.candidateId.name,
        position: app.jobId.title,
        hireDate: new Date(app.updatedAt).toLocaleDateString(),
        email: app.candidateId.email
      }));
      setHiredCandidates(hiredCandidatesData);

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

      // Fallback hired candidates data
      setHiredCandidates([
        {
          id: '1',
          name: 'John Smith',
          position: 'Senior Frontend Developer',
          hireDate: '2024-01-15',
          email: 'john.smith@email.com'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          position: 'UX Designer',
          hireDate: '2024-01-10',
          email: 'sarah.johnson@email.com'
        },
        {
          id: '3',
          name: 'Mike Davis',
          position: 'Backend Developer',
          hireDate: '2024-01-08',
          email: 'mike.davis@email.com'
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
    return <Loader variant="container" text="Loading Dashboard" subText="Fetching your company data..." />;
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

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
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
                            src={getFileUrl(company.logoUrl)}
                            alt={company.name}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <Building className="h-10 w-10 text-white" />
                        )}
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
                        {/* <button
                          onClick={() => setShowEditModal(true)}
                          className="inline-flex items-center px-3 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-colors border border-white/30 cursor-pointer"
                          title="Edit Company"
                        >
                          <Edit className="h-5 w-5" />
                        </button> */}
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
                        className="inline-flex items-center px-3 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        title="Edit Company Info"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Company Details */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="flex flex-wrap items-center gap-y-4 gap-x-8">
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
                  onClick={() => setShowRegisterModal(true)}
                  className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Register Your Company
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        {company && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Performance Chart */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">Job Performance Chart</h3>
                    <p className="text-sm text-gray-500">Applications per job</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="applications" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Application Source Distribution */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">Application Status Distribution</h3>
                    <p className="text-sm text-gray-500">Breakdown of candidates across stages</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicationSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {applicationSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {company ? (
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
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

              {/* Hired Candidates */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">Hired Candidates</h3>
                      <p className="text-sm text-gray-500">Recently hired team members</p>
                    </div>
                  </div>
                  {hiredCandidates.length > 2 && (
                    <button
                      onClick={() => setShowAllHired(!showAllHired)}
                      className="text-sm text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer"
                    >
                      {showAllHired ? 'View Less' : 'View More'}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {hiredCandidates.length > 0 ? (
                    (showAllHired ? hiredCandidates : hiredCandidates.slice(0, 2)).map((candidate) => (
                      <div key={candidate.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Award className="h-5 w-5 text-emerald-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{candidate.name}</span>
                          </p>
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                          <p className="text-xs text-gray-500 mt-1">Hired on {candidate.hireDate}</p>
                        </div>
                        <div className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                          Hired
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No hired candidates yet</p>
                      <p className="text-gray-400 text-xs mt-1">Candidates will appear here once hired</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${company?.verificationStatus === 'pending' ? 'bg-amber-100' : 'bg-red-100'
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

      {/* Register Company Modal */}
      <RegisterCompanyModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          fetchCompany();
          setShowRegisterModal(false);
        }}
      />
    </div>
  );
}
