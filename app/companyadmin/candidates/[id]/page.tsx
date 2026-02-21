// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { Eye, Download, User, Mail, FileText, Briefcase, ArrowLeft } from 'lucide-react';
// import { applicationsAPI, Application } from '../../../api/applications';
// import { API_BASE_URL } from '../../../api/config';

// interface CandidateWithApplications {
//   candidateId: {
//     _id: string;
//     name: string;
//     email: string;
//     phone?: string;
//   };
//   applications: Application[];
//   positions: string[];
//   resumeUrls: string[];
// }

// export default function CandidateDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const candidateId = params.id as string;
//   const [candidate, setCandidate] = useState<CandidateWithApplications | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchCandidateDetails();
//   }, [candidateId]);

//   const fetchCandidateDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Get company information for the logged-in company admin
//       const { companiesAPI } = await import('../../../api/companies');
//       const response = await companiesAPI.getMyCompany();

//       if (!response.company) {
//         setError('No company found for this user. Please contact support to set up your company profile.');
//         setLoading(false);
//         return;
//       }

//       const applications = await applicationsAPI.getApplicationsByCompany(response.company._id);

//       // Find applications for this specific candidate
//       const candidateApplications = applications.filter(app => app.candidateId._id === candidateId);

//       if (candidateApplications.length === 0) {
//         setError('Candidate not found.');
//         setLoading(false);
//         return;
//       }

//       // Group applications by candidate
//       const candidateData: CandidateWithApplications = {
//         candidateId: candidateApplications[0].candidateId,
//         applications: candidateApplications,
//         positions: candidateApplications.map(app => app.jobId.title),
//         resumeUrls: candidateApplications.map(app => app.resumeUrl).filter(url => url) as string[],
//       };

//       setCandidate(candidateData);
//     } catch (err) {
//       console.error('Failed to fetch candidate details:', err);
//       setError('Failed to load candidate details. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'APPLIED': return 'bg-blue-100 text-blue-800';
//       case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
//       case 'SHORTLISTED': return 'bg-purple-100 text-purple-800';
//       case 'HIRED': return 'bg-green-100 text-green-800';
//       case 'REJECTED': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//           <span className="text-red-600 text-2xl">!</span>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
//         <p className="text-gray-600">{error}</p>
//       </div>
//     );
//   }

//   if (!candidate) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate Not Found</h2>
//         <p className="text-gray-600">The candidate you're looking for doesn't exist.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
//           >
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             Back to Candidates
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Candidate Details</h1>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Candidate Info */}
//         <div className="lg:col-span-1">
//           <div className="bg-white shadow-sm rounded-lg p-6">
//             <div className="flex items-center space-x-4 mb-6">
//               <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
//                 <User className="h-8 w-8 text-gray-600" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">{candidate.candidateId.name}</h2>
//                 <p className="text-gray-600">{candidate.candidateId.email}</p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <p className="text-sm text-gray-900">{candidate.candidateId.email}</p>
//               </div>
//               {candidate.candidateId.phone && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <p className="text-sm text-gray-900">{candidate.candidateId.phone}</p>
//                 </div>
//               )}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Positions Applied</label>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {candidate.positions.map((position, index) => (
//                     <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                       {position}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//               {candidate.resumeUrls.length > 0 && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
//                   <div className="flex space-x-2">
//                     {candidate.resumeUrls.map((url, index) => (
//                       <a
//                         key={index}
//                         href={`${API_BASE_URL}${url}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
//                       >
//                         <Download className="h-4 w-4 mr-2" />
//                         Download Resume {candidate.resumeUrls.length > 1 ? index + 1 : ''}
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Applications */}
//         <div className="lg:col-span-2">
//           <div className="bg-white shadow-sm rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications</h3>
//             <div className="space-y-4">
//               {candidate.applications.map((application) => (
//                 <div key={application._id} className="border border-gray-200 rounded-lg p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <h4 className="text-lg font-medium text-gray-900">{application.jobId.title}</h4>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
//                       {application.status}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-3">
//                     Applied on: {new Date(application.createdAt).toLocaleDateString()}
//                   </p>
//                   {application.coverLetter && (
//                     <div className="mb-3">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
//                       <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded">{application.coverLetter}</p>
//                     </div>
//                   )}
//                   {application.resumeUrl && (
//                     <a
//                       href={getFileUrl(application.resumeUrl)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
//                     >
//                       <Download className="h-4 w-4 mr-2" />
//                       Download Resume
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Briefcase, FileText, Download, ArrowLeft, ChevronRight, MapPin } from 'lucide-react';
import { applicationsAPI, Application } from '../../../api/applications';
import { API_BASE_URL, getFileUrl } from '../../../api/config';

interface CandidateWithApplications {
  candidateId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  applications: Application[];
  positions: string[];
  resumeUrls: string[];
}

export default function CandidateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;
  const [candidate, setCandidate] = useState<CandidateWithApplications | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications'>('overview');

  useEffect(() => {
    fetchCandidateDetails();
  }, [candidateId]);

  const fetchCandidateDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { companiesAPI } = await import('../../../api/companies');
      const response = await companiesAPI.getMyCompany();

      if (!response.company) {
        setError('No company found. Please set up your company profile.');
        setLoading(false);
        return;
      }

      const applications = await applicationsAPI.getApplicationsByCompany(response.company._id);
      const candidateApplications = applications.filter(app => app.candidateId._id === candidateId);

      if (candidateApplications.length === 0) {
        setError('Candidate not found.');
        setLoading(false);
        return;
      }

      const candidateData: CandidateWithApplications = {
        candidateId: candidateApplications[0].candidateId,
        applications: candidateApplications,
        positions: candidateApplications.map(app => app.jobId.title),
        resumeUrls: candidateApplications.map(app => app.resumeUrl).filter(url => url) as string[],
      };

      setCandidate(candidateData);
    } catch (err) {
      console.error('Failed to fetch candidate details:', err);
      setError('Unable to load candidate details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const config = {
      'APPLIED': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🔄' },
      'UNDER_REVIEW': { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '👁️' },
      'SHORTLISTED': { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '⭐' },
      'HIRED': { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✅' },
      'REJECTED': { color: 'bg-red-50 text-red-700 border-red-200', icon: '✖️' },
    };
    return config[status as keyof typeof config] || { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '📄' };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading candidate information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-3xl">!</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Unable to Load</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Candidates
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Back to Candidates</span>
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{candidate.candidateId.name}</h1>
                  <p className="text-gray-500">Candidate Profile</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {(() => {
                const mostRecentWithResume = [...candidate.applications]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .find(app => app.resumeUrl);
                const resumeUrl = mostRecentWithResume?.resumeUrl;
                return resumeUrl ? (
                  <a
                    href={getFileUrl(resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume (most recent)
                  </a>
                ) : null;
              })()}
              <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download Profile
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applications ({candidate.applications.length})
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Candidate Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{candidate.candidateId.email}</p>
                    </div>
                  </div>
                  {candidate.candidateId.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900 font-medium">{candidate.candidateId.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Positions Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Positions Applied</h3>
                <div className="space-y-3">
                  {candidate.positions.map((position, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 font-medium">{position}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Applications Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Application Timeline</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {candidate.applications.map((application) => {
                      const statusConfig = getStatusConfig(application.status);
                      return (
                        <div key={application._id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig.color.split(' ')[0]}`}>
                              <span className="text-lg">{statusConfig.icon}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-base font-semibold text-gray-900 truncate">
                                {application.jobId.title}
                              </h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                {application.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              Applied on {formatDate(application.createdAt)}
                            </p>
                            {application.coverLetter && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter</p>
                                {application.coverLetter.startsWith('http://') || application.coverLetter.startsWith('https://') ? (
                                  <a href={application.coverLetter} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">View cover letter (file)</a>
                                ) : (
                                  <p className="text-sm text-gray-600 line-clamp-2">{application.coverLetter}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Applications Tab */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Applications</h3>
              <p className="text-sm text-gray-500 mt-1">
                {candidate.applications.length} position{candidate.applications.length !== 1 ? 's' : ''} applied
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {candidate.applications.map((application) => {
                const statusConfig = getStatusConfig(application.status);
                return (
                  <div key={application._id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{application.jobId.title}</h4>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(application.createdAt)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {application.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      {application.resumeUrl && (
                        <a
                          href={getFileUrl(application.resumeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 lg:mt-0 inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Application
                        </a>
                      )}
                    </div>

                    {application.coverLetter && (
                      <div className="mt-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h5>
                        <div className="bg-gray-50 rounded-lg p-4">
                          {application.coverLetter.startsWith('http://') || application.coverLetter.startsWith('https://') ? (
                            <a href={application.coverLetter} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View cover letter (file)</a>
                          ) : (
                            <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <a
                          href={getFileUrl(application.resumeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Resume
                        </a>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Add Note
                        </button>
                      </div>
                      <button className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors">
                        View Position Details
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}