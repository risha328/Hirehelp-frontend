// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import {
//   MapPin,
//   Briefcase,
//   Clock,
//   DollarSign,
//   Building,
//   Star,
//   Bookmark,
//   ArrowLeft,
//   ExternalLink,
//   Calendar,
//   Users,
//   Award,
//   CheckCircle,
//   Globe,
//   Mail,
//   Phone,
//   Share2,
//   Heart
// } from 'lucide-react';
// import Link from 'next/link';
// import { jobsAPI } from '../../api/companies';
// import { applicationsAPI } from '../../api/applications';
// import ApplyModal from '../../components/ApplyModal';

// interface Job {
//   _id: string;
//   title: string;
//   description: string;
//   requirements: string;
//   skills: string[];
//   location: string;
//   jobType: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
//   salary: string;
//   experienceLevel: string;
//   companyId: {
//     _id: string;
//     name: string;
//     logoUrl?: string;
//     description?: string;
//     website?: string;
//     industry?: string;
//     size?: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// export default function JobDetailsPage() {
//   const params = useParams();
//   const jobId = params.id as string;

//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [saved, setSaved] = useState(false);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [hasApplied, setHasApplied] = useState(false);

//   useEffect(() => {
//     fetchJobDetails();
//     checkApplicationStatus();
//   }, [jobId]);

//   const checkApplicationStatus = async () => {
//     try {
//       const applications = await applicationsAPI.getApplicationsByCandidate();
//       const hasAppliedForJob = applications.some(app => app.jobId._id === jobId);
//       setHasApplied(hasAppliedForJob);
//     } catch (err) {
//       console.error('Failed to check application status:', err);
//       // If there's an error (e.g., not logged in), assume not applied
//       setHasApplied(false);
//     }
//   };

//   const fetchJobDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const jobData = await jobsAPI.getJobById(jobId);
//       setJob(jobData);
//     } catch (err) {
//       console.error('Failed to fetch job details:', err);
//       setError('Failed to load job details. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSave = () => {
//     setSaved(!saved);
//     // Here you would typically save/unsave the job in the backend
//   };

//   const getJobTypeColor = (type: string) => {
//     switch (type) {
//       case 'full-time': return 'bg-blue-100 text-blue-800';
//       case 'part-time': return 'bg-green-100 text-green-800';
//       case 'contract': return 'bg-purple-100 text-purple-800';
//       case 'remote': return 'bg-cyan-100 text-cyan-800';
//       case 'internship': return 'bg-amber-100 text-amber-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getJobTypeIcon = (type: string) => {
//     switch (type) {
//       case 'full-time': return <Clock className="h-4 w-4" />;
//       case 'part-time': return <Users className="h-4 w-4" />;
//       case 'contract': return <Briefcase className="h-4 w-4" />;
//       case 'remote': return <Globe className="h-4 w-4" />;
//       case 'internship': return <Award className="h-4 w-4" />;
//       default: return <Briefcase className="h-4 w-4" />;
//     }
//   };

//   const getExperienceColor = (exp: string) => {
//     switch (exp) {
//       case 'Entry Level': return 'bg-emerald-100 text-emerald-800';
//       case 'Mid Level': return 'bg-blue-100 text-blue-800';
//       case 'Senior': return 'bg-purple-100 text-purple-800';
//       case 'Executive': return 'bg-amber-100 text-amber-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error || !job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <span className="text-red-600 text-2xl">!</span>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
//           <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
//           <Link
//             href="/jobs"
//             className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Jobs
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20 lg:pt-24">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <Link
//             href="/jobs"
//             className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Jobs
//           </Link>

//           <div className="flex items-start justify-between">
//             <div className="flex items-start space-x-4">
//               {/* Company Logo */}
//               <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
//                 <img
//                   src={job.companyId.logoUrl
//                     ? `${process.env.NEXT_PUBLIC_API_URL}${job.companyId.logoUrl}`
//                     : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}&backgroundColor=6366f1`
//                   }
//                   alt={job.companyId.name}
//                   className="w-14 h-14"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`;
//                   }}
//                 />
//               </div>

//               {/* Job Title and Company */}
//               <div className="flex-1">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
//                 <div className="flex items-center space-x-2 mb-3">
//                   <Building className="h-5 w-5 text-gray-400" />
//                   <span className="text-xl text-gray-700 font-medium">{job.companyId.name}</span>
//                 </div>

//                 {/* Job Meta */}
//                 <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
//                   <div className="flex items-center">
//                     <MapPin className="h-4 w-4 mr-1.5" />
//                     {job.location}
//                   </div>
//                   <div className="flex items-center">
//                     <DollarSign className="h-4 w-4 mr-1.5" />
//                     {job.salary}
//                   </div>
//                   <div className="flex items-center">
//                     <Calendar className="h-4 w-4 mr-1.5" />
//                     Posted {new Date(job.createdAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={toggleSave}
//                 className={`p-3 rounded-lg transition-colors ${
//                   saved
//                     ? 'text-red-600 bg-red-50 hover:bg-red-100'
//                     : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
//                 }`}
//               >
//                 <Heart className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
//               </button>
//               <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Share2 className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={() => setShowApplyModal(true)}
//                 disabled={hasApplied}
//                 className={`px-6 py-3 font-medium rounded-lg transition-colors ${
//                   hasApplied
//                     ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
//                     : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                 }`}
//               >
//                 {hasApplied ? 'Already Applied' : 'Apply Now'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Job Tags */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <div className="flex flex-wrap items-center gap-3 mb-6">
//                 <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
//                   {getJobTypeIcon(job.jobType)}
//                   <span className="ml-1.5">{job.jobType.replace('-', ' ')}</span>
//                 </span>
//                 <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getExperienceColor(job.experienceLevel)}`}>
//                   {job.experienceLevel}
//                 </span>
//               </div>

//               {/* Skills */}
//               {job.skills && job.skills.length > 0 && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {job.skills.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Job Description */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
//               <div className="prose prose-gray max-w-none">
//                 <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
//               </div>
//             </div>

//             {/* Requirements */}
//             {job.requirements && (
//               <div className="bg-white rounded-xl border border-gray-200 p-6">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
//                 <div className="prose prose-gray max-w-none">
//                   <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Company Info */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>

//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
//                   <img
//                     src={job.companyId.logoUrl
//                       ? `${process.env.NEXT_PUBLIC_API_URL}${job.companyId.logoUrl}`
//                       : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`
//                     }
//                     alt={job.companyId.name}
//                     className="w-10 h-10"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`;
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900">{job.companyId.name}</h4>
//                   {job.companyId.industry && (
//                     <p className="text-sm text-gray-600">{job.companyId.industry}</p>
//                   )}
//                 </div>
//               </div>

//               {job.companyId.description && (
//                 <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.companyId.description}</p>
//               )}

//               <div className="space-y-2">
//                 {job.companyId.website && (
//                   <a
//                     href={job.companyId.website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
//                   >
//                     <ExternalLink className="h-4 w-4 mr-2" />
//                     Visit Website
//                   </a>
//                 )}
//                 {job.companyId.size && (
//                   <div className="flex items-center text-gray-600 text-sm">
//                     <Users className="h-4 w-4 mr-2" />
//                     {job.companyId.size} employees
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Job Summary */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>

//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Job Type</span>
//                   <span className="font-medium text-gray-900">{job.jobType.replace('-', ' ')}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Experience</span>
//                   <span className="font-medium text-gray-900">{job.experienceLevel}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Location</span>
//                   <span className="font-medium text-gray-900">{job.location}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Salary</span>
//                   <span className="font-medium text-gray-900">{job.salary}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Posted</span>
//                   <span className="font-medium text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Apply Button */}
//             <div className="bg-indigo-600 rounded-xl p-6 text-center">
//               <h3 className="text-white font-semibold mb-2">Ready to Apply?</h3>
//               <p className="text-indigo-100 text-sm mb-4">Take the next step in your career</p>
//               <button
//                 onClick={() => setShowApplyModal(true)}
//                 disabled={hasApplied}
//                 className={`w-full px-6 py-3 font-medium rounded-lg transition-colors ${
//                   hasApplied
//                     ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
//                     : 'bg-white text-indigo-600 hover:bg-gray-50'
//                 }`}
//               >
//                 {hasApplied ? 'Already Applied' : 'Apply for this Job'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Apply Modal */}
//       <ApplyModal
//         isOpen={showApplyModal}
//         onClose={() => setShowApplyModal(false)}
//         jobId={jobId}
//         companyId={job.companyId._id}
//         jobTitle={job.title}
//         onSuccess={() => {
//           setShowApplyModal(false);
//           setHasApplied(true);
//         }}
//       />
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building,
  Star,
  Bookmark,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Users,
  Award,
  CheckCircle,
  Globe,
  Mail,
  Phone,
  Share2,
  Heart,
  TrendingUp,
  Shield,
  Target,
  Zap,
  ChevronRight,
  BookOpen,
  FileText,
  MessageSquare,
  Linkedin,
  Twitter,
  Facebook,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { jobsAPI } from '../../api/companies';
import { applicationsAPI } from '../../api/applications';
import ApplyModal from '../../components/ApplyModal';

interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
  salary: string;
  experienceLevel: string;
  companyId: {
    _id: string;
    name: string;
    logoUrl?: string;
    description?: string;
    website?: string;
    industry?: string;
    size?: string;
    founded?: string;
    rating?: number;
  };
  createdAt: string;
  updatedAt: string;
  benefits?: string[];
  workMode?: 'onsite' | 'hybrid' | 'remote';
  applicationDeadline?: string;
  vacancies?: number;
}

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
    fetchSimilarJobs();
  }, [jobId]);

  const fetchSimilarJobs = async () => {
    try {
      // Mock similar jobs data
      const mockSimilarJobs = [
        {
          id: '2',
          title: 'Senior Frontend Engineer',
          company: 'TechCorp',
          location: 'Bangalore',
          salary: '₹15-25 LPA',
          type: 'full-time',
          posted: '1 day ago',
          urgent: true
        },
        {
          id: '3',
          title: 'React Developer',
          company: 'DesignStudio',
          location: 'Remote',
          salary: '₹12-20 LPA',
          type: 'remote',
          posted: '2 days ago',
          featured: true
        },
        {
          id: '4',
          title: 'Full Stack Developer',
          company: 'StartupXYZ',
          location: 'Mumbai',
          salary: '₹10-18 LPA',
          type: 'full-time',
          posted: '3 days ago'
        }
      ];
      setSimilarJobs(mockSimilarJobs);
    } catch (err) {
      console.error('Failed to fetch similar jobs:', err);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const applications = await applicationsAPI.getApplicationsByCandidate();
      const hasAppliedForJob = applications.some(app => app.jobId._id === jobId);
      setHasApplied(hasAppliedForJob);
    } catch (err) {
      console.error('Failed to check application status:', err);
      setHasApplied(false);
    }
  };

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobData = await jobsAPI.getJobById(jobId);
      setJob(jobData);
    } catch (err) {
      console.error('Failed to fetch job details:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save/unsave the job in the backend
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'remote': return 'bg-cyan-100 text-cyan-800';
      case 'internship': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkModeColor = (mode?: string) => {
    switch (mode) {
      case 'remote': return 'bg-emerald-100 text-emerald-800';
      case 'hybrid': return 'bg-amber-100 text-amber-800';
      case 'onsite': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceColor = (exp: string) => {
    switch (exp) {
      case 'Entry Level': return 'bg-emerald-100 text-emerald-800';
      case 'Mid Level': return 'bg-blue-100 text-blue-800';
      case 'Senior': return 'bg-purple-100 text-purple-800';
      case 'Executive': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Job Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist or has been removed.'}</p>
          <Link
            href="/jobs"
            className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Browse Other Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 pt-20 lg:pt-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <Link
                  href="/jobs"
                  className="inline-flex items-center text-white/90 hover:text-white text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Jobs
                </Link>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                {/* Company Logo */}
                <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                  <img
                    src={job.companyId.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}&backgroundColor=6366f1`}
                    alt={job.companyId.name}
                    className="w-16 h-16"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`;
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{job.title}</h1>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-white/90">
                      <Building className="h-5 w-5 mr-2" />
                      <span className="text-lg font-medium">{job.companyId.name}</span>
                    </div>
                    {job.companyId.rating && (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(job.companyId.rating!) ? 'text-amber-400 fill-current' : 'text-white/40'}`}
                          />
                        ))}
                        <span className="ml-2 text-white/90 text-sm">({job.companyId.rating})</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                      <MapPin className="h-4 w-4 mr-1.5" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                      <DollarSign className="h-4 w-4 mr-1.5" />
                      {job.salary}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                      <Clock className="h-4 w-4 mr-1.5" />
                      {job.experienceLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={hasApplied}
                className={`px-8 py-4 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                  hasApplied
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-white text-indigo-600 hover:bg-gray-50 shadow-lg hover:shadow-xl'
                }`}
              >
                {hasApplied ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Applied Successfully
                  </span>
                ) : (
                  'Apply Now'
                )}
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={toggleSave}
                  className={`flex-1 px-4 py-3 rounded-xl transition-colors flex items-center justify-center ${
                    isBookmarked
                      ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="ml-2">Save</span>
                </button>
                <button className="px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Highlights */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 ml-3">Job Highlights</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{job.jobType.replace('-', ' ')}</div>
                      <div className="text-sm text-gray-600">Employment Type</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <Target className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{job.experienceLevel}</div>
                      <div className="text-sm text-gray-600">Experience Level</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                    <DollarSign className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{job.salary}</div>
                      <div className="text-sm text-gray-600">Annual Salary</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-amber-50 rounded-xl">
                    <Clock className="h-5 w-5 text-amber-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Open until filled'}
                      </div>
                      <div className="text-sm text-gray-600">Apply Before</div>
                    </div>
                  </div>
                </div>

                {/* Skills Tags */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg font-medium border border-indigo-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 ml-3">Job Description</h2>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 ml-3">Similar Jobs</h2>
                    </div>
                    <Link href="/jobs" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      View all jobs
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarJobs.map((similarJob) => (
                      <Link
                        key={similarJob.id}
                        href={`/jobs/${similarJob.id}`}
                        className="block group"
                      >
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {similarJob.title}
                            </h4>
                            {similarJob.urgent && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full ml-2 flex-shrink-0">
                                Urgent
                              </span>
                            )}
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">{similarJob.company}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{similarJob.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium text-gray-900">{similarJob.salary}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{similarJob.posted}</span>
                            <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                              {similarJob.type}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.trim() && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 ml-3">Requirements & Qualifications</h2>
                  </div>

                  <div className="space-y-4">
                    {job.requirements.split('\n').map((requirement, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 ml-3">Benefits & Perks</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center p-3 bg-amber-50 rounded-lg">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Profile */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 ml-3">About Company</h3>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-white shadow-sm mx-auto mb-4 flex items-center justify-center">
                    <img
                      src={job.companyId.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`}
                      alt={job.companyId.name}
                      className="w-16 h-16"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{job.companyId.name}</h4>
                  {job.companyId.industry && (
                    <p className="text-gray-600 mt-1">{job.companyId.industry}</p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{job.companyId.size || 'Not specified'}</span>
                  </div>
                  {job.companyId.founded && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                      <span>Founded {job.companyId.founded}</span>
                    </div>
                  )}
                  {job.companyId.website && (
                    <a
                      href={job.companyId.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-3" />
                      Company Website
                    </a>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h5 className="font-semibold text-gray-900 mb-3">Company Description</h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {job.companyId.description || 'No company description available.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Quick Facts */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Job Quick Facts</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Job Type</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.jobType.replace('-', ' ')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-emerald-600 mr-3" />
                    <span className="text-gray-700">Experience</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.experienceLevel}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">Location</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.location}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-amber-600 mr-3" />
                    <span className="text-gray-700">Salary</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.salary}</span>
                </div>

                {job.workMode && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-cyan-600 mr-3" />
                      <span className="text-gray-700">Work Mode</span>
                    </div>
                    <span className="font-semibold text-gray-900">{job.workMode}</span>
                  </div>
                )}

                {job.vacancies && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">Vacancies</span>
                    </div>
                    <span className="font-semibold text-gray-900">{job.vacancies} positions</span>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Now Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to Apply?</h3>
              <p className="text-indigo-100 mb-6">
                {hasApplied 
                  ? 'Your application has been submitted successfully!'
                  : 'Take the next step in your career journey'
                }
              </p>
              
              {hasApplied ? (
                <div className="space-y-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-center text-white mb-2">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Application Submitted</span>
                    </div>
                    <p className="text-indigo-100 text-sm">
                      We'll review your application and get back to you soon.
                    </p>
                  </div>
                  <Link
                    href="/profile/applications"
                    className="w-full px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center block"
                  >
                    View Application Status
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full px-6 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Apply Now
                </button>
              )}
            </div>


          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobId={jobId}
        companyId={job.companyId._id}
        jobTitle={job.title}
        onSuccess={() => {
          setShowApplyModal(false);
          setHasApplied(true);
        }}
      />
    </div>
  );
}