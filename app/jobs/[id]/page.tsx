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
  Heart
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
  };
  createdAt: string;
  updatedAt: string;
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

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
  }, [jobId]);

  const checkApplicationStatus = async () => {
    try {
      const applications = await applicationsAPI.getApplicationsByCandidate();
      const hasAppliedForJob = applications.some(app => app.jobId._id === jobId);
      setHasApplied(hasAppliedForJob);
    } catch (err) {
      console.error('Failed to check application status:', err);
      // If there's an error (e.g., not logged in), assume not applied
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
    setSaved(!saved);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
          <Link
            href="/jobs"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 lg:pt-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/jobs"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Company Logo */}
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                <img
                  src={job.companyId.logoUrl
                    ? `${process.env.NEXT_PUBLIC_API_URL}${job.companyId.logoUrl}`
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}&backgroundColor=6366f1`
                  }
                  alt={job.companyId.name}
                  className="w-14 h-14"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`;
                  }}
                />
              </div>

              {/* Job Title and Company */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center space-x-2 mb-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <span className="text-xl text-gray-700 font-medium">{job.companyId.name}</span>
                </div>

                {/* Job Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1.5" />
                    {job.salary}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSave}
                className={`p-3 rounded-lg transition-colors ${
                  saved
                    ? 'text-red-600 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={hasApplied}
                className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                  hasApplied
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {hasApplied ? 'Already Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
                  {getJobTypeIcon(job.jobType)}
                  <span className="ml-1.5">{job.jobType.replace('-', ' ')}</span>
                </span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getExperienceColor(job.experienceLevel)}`}>
                  {job.experienceLevel}
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
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm"
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
                    src={job.companyId.logoUrl
                      ? `${process.env.NEXT_PUBLIC_API_URL}${job.companyId.logoUrl}`
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`
                    }
                    alt={job.companyId.name}
                    className="w-10 h-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`;
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{job.companyId.name}</h4>
                  {job.companyId.industry && (
                    <p className="text-sm text-gray-600">{job.companyId.industry}</p>
                  )}
                </div>
              </div>

              {job.companyId.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.companyId.description}</p>
              )}

              <div className="space-y-2">
                {job.companyId.website && (
                  <a
                    href={job.companyId.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                )}
                {job.companyId.size && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    {job.companyId.size} employees
                  </div>
                )}
              </div>
            </div>

            {/* Job Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium text-gray-900">{job.jobType.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900">{job.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-medium text-gray-900">{job.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="bg-indigo-600 rounded-xl p-6 text-center">
              <h3 className="text-white font-semibold mb-2">Ready to Apply?</h3>
              <p className="text-indigo-100 text-sm mb-4">Take the next step in your career</p>
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={hasApplied}
                className={`w-full px-6 py-3 font-medium rounded-lg transition-colors ${
                  hasApplied
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-white text-indigo-600 hover:bg-gray-50'
                }`}
              >
                {hasApplied ? 'Already Applied' : 'Apply for this Job'}
              </button>
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
