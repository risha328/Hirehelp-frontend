'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  Filter,
  Eye,
  Building,
  Calendar,
  MapPin,
  DollarSign,
  X,
  Clock,
  Users,
  Award,
  Globe,
  ExternalLink,
  Heart
} from 'lucide-react';
import { jobsAPI, companiesAPI } from '../../api/companies';

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
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsData, companiesData] = await Promise.all([
        jobsAPI.getAllJobs(),
        companiesAPI.getAllCompanies(),
      ]);
      setJobs(jobsData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = selectedCompany
    ? jobs.filter(job => job.companyId === selectedCompany)
    : jobs;

  const getCompanyName = (job: Job) => {
    if (typeof job.companyId === 'object' && job.companyId !== null) {
      return job.companyId.name;
    }
    const company = companies.find(c => c._id === job.companyId);
    return company ? company.name : 'Unknown Company';
  };

  const getCompanyInfo = (job: Job) => {
    if (typeof job.companyId === 'object' && job.companyId !== null) {
      return job.companyId;
    }
    return companies.find(c => c._id === job.companyId);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
        <div className="flex space-x-3">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Loading jobs...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    {selectedCompany ? 'No jobs found for selected company' : 'No jobs found'}
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.experienceLevel}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{getCompanyName(job)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-500">{job.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {job.jobType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <div className="text-sm text-gray-500">{job.salary || 'Not specified'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' :
                        job.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewJob(job)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Details Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Job Header */}
              <div className="mb-6">
                <div className="flex items-start space-x-4">
                  {/* Company Logo */}
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <img
                      src={getCompanyInfo(selectedJob)?.logoUrl
                        ? `${process.env.NEXT_PUBLIC_API_URL}${getCompanyInfo(selectedJob)?.logoUrl}`
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getCompanyName(selectedJob))}&backgroundColor=6366f1`
                      }
                      alt={getCompanyName(selectedJob)}
                      className="w-14 h-14"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getCompanyName(selectedJob))}`;
                      }}
                    />
                  </div>

                  {/* Job Title and Company */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h1>
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <span className="text-xl text-gray-700 font-medium">{getCompanyName(selectedJob)}</span>
                    </div>

                    {/* Job Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        {selectedJob.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1.5" />
                        {selectedJob.salary || 'Salary not specified'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        Posted {new Date(selectedJob.createdAt).toLocaleDateString()}
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
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getJobTypeColor(selectedJob.jobType || '')}`}>
                        {getJobTypeIcon(selectedJob.jobType || '')}
                        <span className="ml-1.5">{selectedJob.jobType?.replace('-', ' ') || 'Not specified'}</span>
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getExperienceColor(selectedJob.experienceLevel || '')}`}>
                        {selectedJob.experienceLevel || 'Not specified'}
                      </span>
                    </div>

                    {/* Skills */}
                    {selectedJob.skills && selectedJob.skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((skill, index) => (
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
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
                    </div>
                  </div>

                  {/* Requirements */}
                  {selectedJob.requirements && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedJob.requirements}</p>
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
                          src={getCompanyInfo(selectedJob)?.logoUrl
                            ? `${process.env.NEXT_PUBLIC_API_URL}${getCompanyInfo(selectedJob)?.logoUrl}`
                            : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getCompanyName(selectedJob))}`
                          }
                          alt={getCompanyName(selectedJob)}
                          className="w-10 h-10"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getCompanyName(selectedJob))}`;
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{getCompanyName(selectedJob)}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Job Summary */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Job Type</span>
                        <span className="font-medium text-gray-900">{selectedJob.jobType?.replace('-', ' ') || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-medium text-gray-900">{selectedJob.experienceLevel || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium text-gray-900">{selectedJob.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Salary</span>
                        <span className="font-medium text-gray-900">{selectedJob.salary || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={`font-medium ${selectedJob.status === 'active' ? 'text-green-600' : selectedJob.status === 'inactive' ? 'text-gray-600' : 'text-yellow-600'}`}>
                          {selectedJob.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posted</span>
                        <span className="font-medium text-gray-900">{new Date(selectedJob.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
