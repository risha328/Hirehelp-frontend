'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jobsAPI } from '../../api/companies';
import { companiesAPI } from '../../api/companies';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyData, jobsData] = await Promise.all([
          companiesAPI.getMyCompany(),
          companiesAPI.getMyCompany().then(company => {
            if (company) {
              return jobsAPI.getJobsByCompany(company._id);
            }
            return [];
          })
        ]);

        setCompany(companyData);
        setJobs(jobsData || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
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

    if (!validateForm() || !company) return;

    setPosting(true);

    try {
      const jobData = {
        ...formData,
        companyId: company._id,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        status: 'active',
      };

      await jobsAPI.createJob(jobData);

      // Refresh jobs list
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
      alert('Failed to post job. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h2>
              <p className="text-gray-600 mb-6">
                You need to register a company first before posting jobs.
              </p>
              <button
                onClick={() => router.push('/companies')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register Company
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
            <p className="text-gray-600">Manage your company's job listings</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post New Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs posted yet. Click "Post New Job" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.location} • {job.jobType} • {job.experienceLevel}</p>
                    {job.salary && <p className="text-green-600 font-medium">{job.salary}</p>}
                    <p className="text-sm text-gray-500 mt-2">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{job.description.substring(0, 200)}...</p>
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Skills: {job.skills.join(', ')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Posting Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Post New Job</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Software Engineer"
                    className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                  {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>}
                </div>

                {/* Job Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                  {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. New York, NY or Remote"
                    className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                  {errors.location && <p className="mt-2 text-sm text-red-600 font-medium">{errors.location}</p>}
                </div>

                {/* Salary */}
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. $80,000 - $120,000 per year"
                    className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive Level</option>
                  </select>
                </div>

                {/* Skills */}
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. JavaScript, React, Node.js (comma separated)"
                    className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                </div>

                {/* Application Deadline */}
                <div>
                  <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    id="applicationDeadline"
                    name="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-lg font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={posting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium transition-all duration-200"
                  >
                    {posting ? 'Posting...' : 'Post Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
