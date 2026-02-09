'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Briefcase,
  Building,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Award,
  Globe,
  ArrowLeft,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';
import { jobsAPI, companiesAPI } from '../../../api/companies';
import { API_BASE_URL } from '../../../api/config';
import EditJobModal from '../../../components/EditJobModal';

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
  companyId: string | {
    _id: string;
    name: string;
    logoUrl?: string;
  };
  company?: {
    _id: string;
    name: string;
    logoUrl?: string;
  };
  requirements?: string;
}

interface Company {
  _id: string;
  name: string;
  logoUrl?: string;
  verificationStatus: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const jobData = await jobsAPI.getJobById(jobId);
      setJob(jobData);

      // Fetch company details if not included in job data
      if (jobData.companyId) {
        const companyId = typeof jobData.companyId === 'string' ? jobData.companyId : jobData.companyId._id;
        const companyData = await companiesAPI.getMyCompany();
        if (companyData && companyData._id === companyId) {
          setCompany(companyData);
        }
      }
    } catch (err) {
      console.error('Failed to fetch job details:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'full-time': return <Clock className="h-4 w-4" />;
      case 'part-time': return <Users className="h-4 w-4" />;
      case 'contract': return <Briefcase className="h-4 w-4" />;
      case 'remote': return <Globe className="h-4 w-4" />;
      case 'internship': return <Award className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
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

  const getCompanyName = (job: Job) => {
    if (typeof job.companyId === 'object' && job.companyId !== null) {
      return job.companyId.name;
    }
    if (company) {
      return company.name;
    }
    return 'Unknown Company';
  };

  const getCompanyInfo = (job: Job) => {
    if (typeof job.companyId === 'object' && job.companyId !== null) {
      return job.companyId;
    }
    return company;
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await jobsAPI.deleteJob(jobId);
      router.push('/companyadmin/jobs');
    } catch (err: any) {
      console.error('Failed to delete job:', err);
      setError(err.message || 'Failed to delete job');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
              <p className="text-gray-600 mb-6">{error || 'Job not found'}</p>
              <button
                onClick={() => router.push('/companyadmin/jobs')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>

        <EditJobModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchJobDetails}
          jobId={jobId}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <button
          onClick={() => router.push('/companyadmin/jobs')}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-gray-700 font-medium bg-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
          <p className="text-gray-600">View and manage your job posting</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/companyadmin/jobs/${jobId}/rounds`)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
          >
            <FileText className="h-4 w-4 mr-2" />
            Manage Rounds
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-gray-700 font-medium"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Job Header */}
          <div className="mb-6">
            <div className="flex items-start space-x-4">
              {/* Company Logo */}
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                <img
                  src={getCompanyInfo(job)?.logoUrl
                    ? `${API_BASE_URL}${getCompanyInfo(job)?.logoUrl}`
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getCompanyName(job))}&backgroundColor=6366f1`
                  }
                  alt={getCompanyName(job)}
                  className="w-14 h-14 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getCompanyName(job))}`;
                  }}
                />
              </div>

              {/* Job Title and Company */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center space-x-2 mb-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <span className="text-xl text-gray-700 font-medium">{getCompanyName(job)}</span>
                </div>

                {/* Job Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1.5" />
                    {job.salary || 'Salary not specified'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Tags */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType || '')}`}>
                    {getJobTypeIcon(job.jobType || '')}
                    <span className="ml-1.5">{job.jobType?.replace('-', ' ') || 'Not specified'}</span>
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getExperienceColor(job.experienceLevel || '')}`}>
                    {job.experienceLevel || 'Not specified'}
                  </span>
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-white text-gray-700 rounded-md text-sm border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={getCompanyInfo(job)?.logoUrl
                        ? `${API_BASE_URL}${getCompanyInfo(job)?.logoUrl}`
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getCompanyName(job))}`
                      }
                      alt={getCompanyName(job)}
                      className="w-10 h-10 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getCompanyName(job))}`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{getCompanyName(job)}</h4>
                  </div>
                </div>
              </div>

              {/* Job Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium text-gray-900">{job.jobType?.replace('-', ' ') || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium text-gray-900">{job.experienceLevel || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium text-gray-900">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary</span>
                    <span className="font-medium text-gray-900">{job.salary || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${job.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  {job.applicationDeadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-medium text-gray-900">{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditJobModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchJobDetails}
        jobId={jobId}
      />
    </div>
  );
}
