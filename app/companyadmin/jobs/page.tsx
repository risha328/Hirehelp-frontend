// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { jobsAPI } from '../../api/companies';
// import { companiesAPI } from '../../api/companies';

// interface Job {
//   _id: string;
//   title: string;
//   description: string;
//   location: string;
//   salary?: string;
//   jobType?: string;
//   experienceLevel?: string;
//   skills?: string[];
//   applicationDeadline?: string;
//   status: string;
//   createdAt: string;
// }

// interface Company {
//   _id: string;
//   name: string;
//   logoUrl?: string;
//   verificationStatus: string;
// }

// export default function CompanyJobsPage() {
//   const router = useRouter();
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [company, setCompany] = useState<Company | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [posting, setPosting] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     location: '',
//     salary: '',
//     jobType: 'full-time',
//     experienceLevel: 'entry',
//     skills: '',
//     applicationDeadline: '',
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const companyResponse = await companiesAPI.getMyCompany();
//         const companyData = companyResponse.company;

//         setCompany(companyData);

//         if (companyData && companyData._id) {
//           const jobsData = await jobsAPI.getJobsByCompany(companyData._id);
//           setJobs(jobsData || []);
//         } else {
//           setJobs([]);
//         }
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//         setJobs([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.title.trim()) {
//       newErrors.title = 'Job title is required';
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'Job description is required';
//     }

//     if (!formData.location.trim()) {
//       newErrors.location = 'Location is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm() || !company || !company._id || company._id.trim() === '') {
//       console.error('Validation failed:', {
//         hasCompany: !!company,
//         hasCompanyId: !!(company && company._id),
//         companyId: company?._id,
//         companyIdTrimmed: company?._id?.trim(),
//         company
//       });
//       alert('Unable to post job: Company information is missing. Please refresh the page and try again.');
//       return;
//     }

//     setPosting(true);

//     try {
//       const jobData = {
//         ...formData,
//         companyId: company._id.trim(),
//         skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
//         status: 'active',
//       };

//       console.log('Submitting job data:', jobData);
//       await jobsAPI.createJob(jobData);

//       // Refresh jobs list
//       const updatedJobs = await jobsAPI.getJobsByCompany(company._id);
//       setJobs(updatedJobs || []);

//       setShowModal(false);
//       setFormData({
//         title: '',
//         description: '',
//         location: '',
//         salary: '',
//         jobType: 'full-time',
//         experienceLevel: 'entry',
//         skills: '',
//         applicationDeadline: '',
//       });

//       alert('Job posted successfully!');
//     } catch (error) {
//       console.error('Failed to post job:', error);
//       const errorMessage = error instanceof Error ? error.message : 'Failed to post job. Please try again.';

//       // Check if the error is related to company verification
//       if (errorMessage.includes('Company must be verified')) {
//         alert('Your company is not verified Still now');
//       } else {
//         alert(errorMessage);
//       }
//     } finally {
//       setPosting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-lg">Loading...</div>
//       </div>
//     );
//   }

//   if (!company) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//             <div className="text-center">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h2>
//               <p className="text-gray-600 mb-6">
//                 You need to register a company first before posting jobs.
//               </p>
//               <button
//                 onClick={() => router.push('/companies')}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Register Company
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
//             <p className="text-gray-600">Manage your company's job listings</p>
//             {company.verificationStatus !== 'verified' && (
//               <p className="text-sm text-amber-600 mt-1">
//                 Your company is pending verification. Job posting will be available once verified by superadmin.
//               </p>
//             )}
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             disabled={company.verificationStatus !== 'verified'}
//             className={`px-4 py-2 rounded ${
//               company.verificationStatus === 'verified'
//                 ? 'bg-blue-600 text-white hover:bg-blue-700'
//                 : 'bg-gray-400 text-gray-200 cursor-not-allowed'
//             }`}
//             title={company.verificationStatus !== 'verified' ? 'Company must be verified by superadmin to post jobs' : ''}
//           >
//             Post New Job
//           </button>
//         </div>

//         {jobs.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500">No jobs posted yet. Click "Post New Job" to get started.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {jobs.map(job => (
//               <div key={job._id} className="border rounded-lg p-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
//                     <p className="text-gray-600">{job.location} • {job.jobType} • {job.experienceLevel}</p>
//                     {job.salary && <p className="text-green-600 font-medium">{job.salary}</p>}
//                     <p className="text-sm text-gray-500 mt-2">
//                       Posted on {new Date(job.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="flex flex-col items-end space-y-2">
//                     <span className={`px-2 py-1 rounded text-xs font-medium ${
//                       job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {job.status}
//                     </span>
//                     <button
//                       onClick={() => router.push(`/companyadmin/jobs/${job._id}`)}
//                       className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 mt-2">{job.description.substring(0, 200)}...</p>
//                 {job.skills && job.skills.length > 0 && (
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-600">Skills: {job.skills.join(', ')}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Job Posting Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">Post New Job</h3>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <span className="text-2xl">&times;</span>
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Job Title */}
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                     Job Title *
//                   </label>
//                   <input
//                     id="title"
//                     name="title"
//                     type="text"
//                     required
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="e.g. Senior Software Engineer"
//                     className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//                   />
//                   {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>}
//                 </div>

//                 {/* Job Description */}
//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                     Job Description *
//                   </label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     rows={5}
//                     required
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Describe the role, responsibilities, and requirements..."
//                     className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//                   />
//                   {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>}
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
//                     Location *
//                   </label>
//                   <input
//                     id="location"
//                     name="location"
//                     type="text"
//                     required
//                     value={formData.location}
//                     onChange={handleInputChange}
//                     placeholder="e.g. New York, NY or Remote"
//                     className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//                   />
//                   {errors.location && <p className="mt-2 text-sm text-red-600 font-medium">{errors.location}</p>}
//                 </div>

//                 {/* Salary */}
//                 <div>
//                   <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
//                     Salary Range
//                   </label>
//                   <input
//                     id="salary"
//                     name="salary"
//                     type="text"
//                     value={formData.salary}
//                     onChange={handleInputChange}
//                     placeholder="e.g. $80,000 - $120,000 per year"
//                     className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//                   />
//                 </div>

//                 {/* Job Type */}
//                 <div>
//                   <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
//                     Job Type
//                   </label>
//                   <select
//                     id="jobType"
//                     name="jobType"
//                     value={formData.jobType}
//                     onChange={handleInputChange}
//                     className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//                   >
//                     <option value="full-time">Full-time</option>
//                     <option value="part-time">Part-time</option>
//                     <option value="contract">Contract</option>
//                     <option value="internship">Internship</option>
//                   </select>
//                 </div>

//                 {/* Experience Level */}
//                 <div>
//                   <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
//                     Experience Level
//                   </label>
//                   <select
//                     id="experienceLevel"
//                     name="experienceLevel"
//                     value={formData.experienceLevel}
//                     onChange={handleInputChange}
//                     className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//                   >
//                     <option value="entry">Entry Level</option>
//                     <option value="mid">Mid Level</option>
//                     <option value="senior">Senior Level</option>
//                     <option value="executive">Executive Level</option>
//                   </select>
//                 </div>

//                 {/* Skills */}
//                 <div>
//                   <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
//                     Required Skills
//                   </label>
//                   <input
//                     id="skills"
//                     name="skills"
//                     type="text"
//                     value={formData.skills}
//                     onChange={handleInputChange}
//                     placeholder="e.g. JavaScript, React, Node.js (comma separated)"
//                     className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//                   />
//                 </div>

//                 {/* Application Deadline */}
//                 <div>
//                   <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
//                     Application Deadline
//                   </label>
//                   <input
//                     id="applicationDeadline"
//                     name="applicationDeadline"
//                     type="date"
//                     value={formData.applicationDeadline}
//                     onChange={handleInputChange}
//                     className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-lg font-medium transition-all duration-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={posting}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium transition-all duration-200"
//                   >
//                     {posting ? 'Posting...' : 'Post Job'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jobsAPI } from '../../api/companies';
import { companiesAPI } from '../../api/companies';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  ClockIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
  EyeIcon,
  XMarkIcon,
  PlusIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  TagIcon,
  UserIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  jobType?: string;
  experienceLevel?: string;
  skills?: string[];
  applicationDeadline?: string;
  status: string;
  createdAt: string;
}

interface Company {
  _id: string;
  name: string;
  logoUrl?: string;
  verificationStatus: string;
}

export default function CompanyJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    experienceLevel: 'entry',
    skills: '',
    applicationDeadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<'basic' | 'details' | 'requirements'>('basic');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await companiesAPI.getMyCompany();
        const companyData = companyResponse.company;

        setCompany(companyData);

        if (companyData && companyData._id) {
          const jobsData = await jobsAPI.getJobsByCompany(companyData._id);
          setJobs(jobsData || []);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !company || !company._id || company._id.trim() === '') {
      alert('Unable to post job: Company information is missing. Please refresh the page and try again.');
      return;
    }

    setPosting(true);

    try {
      const jobData = {
        ...formData,
        companyId: company._id.trim(),
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        status: 'active',
      };

      await jobsAPI.createJob(jobData);

      const updatedJobs = await jobsAPI.getJobsByCompany(company._id);
      setJobs(updatedJobs || []);

      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        salary: '',
        jobType: 'full-time',
        experienceLevel: 'entry',
        skills: '',
        applicationDeadline: '',
      });

      alert('Job posted successfully!');
    } catch (error) {
      console.error('Failed to post job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to post job. Please try again.';

      if (errorMessage.includes('Company must be verified')) {
        alert('Your company must be verified before posting jobs.');
      } else {
        alert(errorMessage);
      }
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading job listings...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BuildingOfficeIcon className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Company Registration Required</h2>
          <p className="text-gray-600 mb-6">
            You need to register your company before posting job listings.
          </p>
          <button
            onClick={() => router.push('/companies')}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Register Company
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
              <p className="text-gray-600 mt-2">Manage and track your company's job listings</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowModal(true)}
                disabled={company.verificationStatus !== 'verified'}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  company.verificationStatus === 'verified'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={company.verificationStatus !== 'verified' ? 'Company must be verified by admin to post jobs' : ''}
              >
                <PlusIcon className="w-5 h-5" />
                Post New Job
              </button>
            </div>
          </div>

          {/* Company Verification Status */}
          {company.verificationStatus !== 'verified' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800">Verification Pending</h3>
                  <p className="text-amber-700 text-sm mt-1">
                    Your company is pending verification. Job posting features will be enabled once verified by our admin team.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{jobs.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {jobs.filter(job => job.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Company Status</p>
                  <p className="text-lg font-semibold mt-2 capitalize">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      company.verificationStatus === 'verified' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {company.verificationStatus}
                    </span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Current Job Listings</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BriefcaseIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Posted Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Get started by posting your first job listing. Reach qualified candidates for your open positions.
              </p>
              <button
                onClick={() => setShowModal(true)}
                disabled={company.verificationStatus !== 'verified'}
                className={`px-6 py-3 rounded-lg font-medium ${
                  company.verificationStatus === 'verified'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {jobs.map(job => (
                <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                              {job.jobType}
                            </span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                              {job.experienceLevel}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {job.salary && (
                          <span className="flex items-center gap-1 font-medium text-green-700">
                            <CurrencyDollarIcon className="w-4 h-4" />
                            {job.salary}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          Posted {formatDate(job.createdAt)}
                        </span>
                        {job.applicationDeadline && (
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            Apply by {formatDate(job.applicationDeadline)}
                          </span>
                        )}
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="px-3 py-1 text-sm text-gray-500">
                                +{job.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 lg:flex-col">
                      <button
                        onClick={() => router.push(`/companyadmin/jobs/${job._id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium cursor-pointer"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View Details
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium">
                        <PencilSquareIcon className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Posting Modal - Enhanced Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-5xl transform rounded-2xl bg-white shadow-xl transition-all">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Create New Job Posting</h3>
                      <p className="text-sm text-gray-600">Fill in the job details to attract top talent</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-white transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form Navigation Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex px-6">
                  <button
                    onClick={() => setActiveSection('basic')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                      activeSection === 'basic'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BriefcaseIcon className="w-4 h-4" />
                      Basic Info
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveSection('details')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                      activeSection === 'details'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="w-4 h-4" />
                      Job Details
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveSection('requirements')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-all ${
                      activeSection === 'requirements'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4" />
                      Requirements
                    </div>
                  </button>
                </nav>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Progress Indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Step {activeSection === 'basic' ? 1 : activeSection === 'details' ? 2 : 3} of 3</span>
                    <span className="font-medium">Required fields are marked with *</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: activeSection === 'basic' ? '33%' : activeSection === 'details' ? '66%' : '100%' }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Basic Information Section */}
                  {activeSection === 'basic' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                          Job Basic Information
                        </h4>
                        
                        <div className="space-y-6">
                          {/* Job Title - Prominent */}
                          <div className="space-y-3">
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
                              Job Title *
                              <span className="text-sm font-normal text-gray-600 ml-2">(What position are you hiring for?)</span>
                            </label>
                            <div className="relative">
                              <BriefcaseIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Senior Frontend Developer, Marketing Manager"
                                className={`block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                  errors.title ? 'border-red-300' : 'border-gray-300'
                                }`}
                              />
                            </div>
                            {errors.title && (
                              <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                {errors.title}
                              </p>
                            )}
                          </div>

                          {/* Location */}
                          <div className="space-y-3">
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-900">
                              Work Location *
                              <span className="text-sm font-normal text-gray-600 ml-2">(Where will this role be based?)</span>
                            </label>
                            <div className="relative">
                              <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g. San Francisco, CA or Remote"
                                className={`block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                  errors.location ? 'border-red-300' : 'border-gray-300'
                                }`}
                              />
                            </div>
                            {errors.location && (
                              <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                {errors.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setActiveSection('details')}
                          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                        >
                          Next: Job Details
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Job Details Section */}
                  {activeSection === 'details' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                          Job Details & Compensation
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Salary */}
                          <div className="space-y-3">
                            <label htmlFor="salary" className="block text-sm font-semibold text-gray-900">
                              Salary Range
                              <span className="text-sm font-normal text-gray-600 ml-2">(Annual or hourly rate)</span>
                            </label>
                            <div className="relative">
                              <CurrencyDollarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                id="salary"
                                name="salary"
                                type="text"
                                value={formData.salary}
                                onChange={handleInputChange}
                                placeholder="e.g. $90,000 - $130,000 per year"
                                className="block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>

                          {/* Job Type */}
                          <div className="space-y-3">
                            <label htmlFor="jobType" className="block text-sm font-semibold text-gray-900">
                              Employment Type
                            </label>
                            <div className="relative">
                              <BriefcaseIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <select
                                id="jobType"
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleInputChange}
                                className="block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none"
                              >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                              </select>
                            </div>
                          </div>

                          {/* Experience Level */}
                          <div className="space-y-3">
                            <label htmlFor="experienceLevel" className="block text-sm font-semibold text-gray-900">
                              Experience Level
                            </label>
                            <div className="relative">
                              <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <select
                                id="experienceLevel"
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleInputChange}
                                className="block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none"
                              >
                                <option value="internship">Internship</option>
                                <option value="entry">Entry Level (0-2 years)</option>
                                <option value="mid">Mid Level (2-5 years)</option>
                                <option value="senior">Senior Level (5+ years)</option>
                                <option value="executive">Executive Level</option>
                              </select>
                            </div>
                          </div>

                          {/* Application Deadline */}
                          <div className="space-y-3">
                            <label htmlFor="applicationDeadline" className="block text-sm font-semibold text-gray-900">
                              Application Deadline
                            </label>
                            <div className="relative">
                              <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                id="applicationDeadline"
                                name="applicationDeadline"
                                type="date"
                                value={formData.applicationDeadline}
                                onChange={handleInputChange}
                                className="block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveSection('basic')}
                          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSection('requirements')}
                          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                        >
                          Next: Requirements
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Requirements Section */}
                  {activeSection === 'requirements' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <TagIcon className="w-5 h-5 text-blue-600" />
                          Job Requirements & Description
                        </h4>
                        
                        <div className="space-y-6">
                          {/* Skills */}
                          <div className="space-y-3">
                            <label htmlFor="skills" className="block text-sm font-semibold text-gray-900">
                              Required Skills & Technologies
                              <span className="text-sm font-normal text-gray-600 ml-2">(Separate with commas)</span>
                            </label>
                            <div className="relative">
                              <TagIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                              <input
                                id="skills"
                                name="skills"
                                type="text"
                                value={formData.skills}
                                onChange={handleInputChange}
                                placeholder="e.g. JavaScript, React, Node.js, TypeScript, AWS"
                                className="block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.skills.split(',').filter(skill => skill.trim()).map((skill, index) => (
                                <span 
                                  key={index}
                                  className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Job Description - Prominent */}
                          <div className="space-y-3">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
                              Job Description *
                              <span className="text-sm font-normal text-gray-600 ml-2">(Describe the role, responsibilities, and what makes it exciting)</span>
                            </label>
                            <div className="relative">
                              <DocumentTextIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                              <textarea
                                id="description"
                                name="description"
                                rows={8}
                                required
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder={`# About the Role

We are looking for a passionate developer to join our team. In this role, you will:

• Develop and maintain high-quality web applications
• Collaborate with cross-functional teams
• Participate in code reviews and technical discussions
• Stay updated with emerging technologies

# What We Offer

• Competitive salary and benefits
• Flexible working hours
• Professional development opportunities
• Collaborative and innovative environment`}
                                className={`block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                  errors.description ? 'border-red-300' : 'border-gray-300'
                                }`}
                              />
                            </div>
                            {errors.description && (
                              <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                {errors.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>Markdown is supported</span>
                              <span>{formData.description.length}/5000 characters</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveSection('details')}
                          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Previous
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Footer */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p className="font-medium">Preview your job posting before publishing</p>
                      <p className="mt-1">All fields marked with * are required</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={posting}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        {posting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Publishing Job...
                          </>
                        ) : (
                          <>
                            <CheckBadgeIcon className="w-5 h-5" />
                            Publish Job Posting
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}