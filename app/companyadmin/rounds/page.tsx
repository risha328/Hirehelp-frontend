'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { roundsAPI } from '../../api/rounds';
import { jobsAPI, companiesAPI } from '../../api/companies';
import {
  PlusIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  TagIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface Round {
  _id: string;
  name: string;
  description?: string;
  jobId: string | {
    _id: string;
    title: string;
    companyId: string;
  };
  order: number;
  isArchived: boolean;
  isActive: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

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

export default function CompanyRoundsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [posting, setPosting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [filterJobId, setFilterJobId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    jobId: '',
    order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching company data...');
        const companyResponse = await companiesAPI.getMyCompany();
        console.log('Company response:', companyResponse);
        const companyData = companyResponse.company;
        console.log('Company data:', companyData);

        setCompany(companyData);

        if (companyData && companyData._id) {
          console.log('Fetching jobs for company:', companyData._id);
          const jobsData = await jobsAPI.getJobsByCompany(companyData._id);
          setJobs(jobsData || []);
          console.log('Jobs data:', jobsData);

          // Fetch all rounds and filter by company's jobs
          const allRounds = await roundsAPI.getAllRounds();
          const companyRounds = allRounds.filter(round => {
            const jobId = typeof round.jobId === 'string' ? round.jobId : round.jobId._id;
            return jobsData.some((job: Job) => job._id === jobId);
          });
          setRounds(companyRounds);
        } else {
          console.log('No company data or company ID found');
          setJobs([]);
          setRounds([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setJobs([]);
        setRounds([]);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Round name is required';
    }

    if (!formData.jobId) {
      newErrors.jobId = 'Please select a job';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setPosting(true);

    try {
      if (editingRound) {
        // Update existing round
        await roundsAPI.updateRound(editingRound._id, {
          name: formData.name,
          description: formData.description,
          order: formData.order,
        });

        // Update local state
        setRounds(prev => prev.map(round =>
          round._id === editingRound._id
            ? { ...round, name: formData.name, description: formData.description, order: formData.order, updatedAt: new Date().toISOString() }
            : round
        ));
      } else {
        // Create new round
        const newRound = await roundsAPI.createRound({
          name: formData.name,
          description: formData.description,
          jobId: formData.jobId,
          order: formData.order,
        });

        // Add to local state
        setRounds(prev => [...prev, newRound]);
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save round:', error);
      alert('Failed to save round. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      jobId: selectedJobId || '',
      order: 0,
    });
    setEditingRound(null);
    setErrors({});
  };

  const handleEdit = (round: Round) => {
    setEditingRound(round);
    setFormData({
      name: round.name,
      description: round.description || '',
      jobId: typeof round.jobId === 'string' ? round.jobId : round.jobId._id,
      order: round.order,
    });
    setShowModal(true);
  };

  const handleArchive = async (roundId: string) => {
    if (!confirm('Are you sure you want to archive this round?')) {
      return;
    }

    try {
      await roundsAPI.archiveRound(roundId);
      setRounds(prev => prev.map(round =>
        round._id === roundId
          ? { ...round, isArchived: true, archivedAt: new Date().toISOString() }
          : round
      ));
    } catch (error) {
      console.error('Failed to archive round:', error);
      alert('Failed to archive round. Please try again.');
    }
  };

  const handleActivate = async (roundId: string) => {
    if (!confirm('Are you sure you want to activate this round?')) {
      return;
    }

    try {
      await roundsAPI.activateRound(roundId);
      setRounds(prev => prev.map(round =>
        round._id === roundId
          ? { ...round, isArchived: false, archivedAt: undefined }
          : round
      ));
    } catch (error) {
      console.error('Failed to activate round:', error);
      alert('Failed to activate round. Please try again.');
    }
  };

  const getJobTitle = (jobId: string | { _id: string; title: string }) => {
    if (typeof jobId === 'string') {
      const job = jobs.find(j => j._id === jobId);
      return job ? job.title : 'Unknown Job';
    }
    return jobId.title;
  };

  const filteredRounds = filterJobId
    ? rounds.filter(round => {
        const roundJobId = typeof round.jobId === 'string' ? round.jobId : round.jobId._id;
        return roundJobId === filterJobId;
      })
    : rounds;

  const activeRounds = filteredRounds.filter(round => !round.isArchived);
  const archivedRounds = filteredRounds.filter(round => round.isArchived);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading rounds...</p>
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
            You need to register your company before managing interview rounds.
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Rounds</h1>
              <p className="text-gray-600 mt-2">Manage interview rounds for your job postings</p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg cursor-pointer"
              >
                <PlusIcon className="w-5 h-5" />
                Create Round
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterJobId}
                  onChange={(e) => setFilterJobId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Jobs</option>
                  {jobs.map(job => (
                    <option key={job._id} value={job._id}>{job.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rounds</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{activeRounds.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Rounds</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {activeRounds.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Archived Rounds</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {archivedRounds.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ArchiveBoxIcon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Rounds Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Rounds</h2>
          </div>

          {activeRounds.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentTextIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Rounds</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Create your first interview round to start managing your hiring process.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Create First Round
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activeRounds.map(round => (
                <div key={round._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{round.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <BriefcaseIcon className="w-4 h-4" />
                            <span>{getJobTitle(round.jobId)}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Order: {round.order} • Created {new Date(round.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active
                        </span>
                      </div>

                      {round.description && (
                        <p className="text-gray-700 mb-4 line-clamp-2">{round.description}</p>
                      )}
                    </div>

                    <div className="flex gap-3 lg:flex-col">
                      <button
                        onClick={() => handleEdit(round)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium cursor-pointer"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchive(round._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
                      >
                        <ArchiveBoxIcon className="w-4 h-4" />
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Archived Rounds Section */}
        {archivedRounds.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Archived Rounds</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {archivedRounds.map(round => (
                <div key={round._id} className="p-6 bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-1">{round.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <BriefcaseIcon className="w-4 h-4" />
                            <span>{getJobTitle(round.jobId)}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Order: {round.order} • Archived {round.archivedAt ? new Date(round.archivedAt).toLocaleDateString() : 'Unknown'}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          Archived
                        </span>
                      </div>

                      {round.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{round.description}</p>
                      )}
                    </div>

                    <div className="flex gap-3 lg:flex-col">
                      <button
                        onClick={() => handleActivate(round._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200 text-sm font-medium cursor-pointer"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Activate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create/Edit Round Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
                onClick={() => setShowModal(false)}
              ></div>

              {/* Modal */}
              <div className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-xl transition-all">
                <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {editingRound ? 'Edit Round' : 'Create New Round'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {editingRound ? 'Update the round details' : 'Add a new interview round to your hiring process'}
                        </p>
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

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="space-y-6">
                    {/* Round Name */}
                    <div className="space-y-3">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                        Round Name *
                        <span className="text-sm font-normal text-gray-600 ml-2">(e.g., Technical Interview, HR Round)</span>
                      </label>
                      <div className="relative">
                        <DocumentTextIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter round name"
                          className={`block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Job Selection */}
                    <div className="space-y-3">
                      <label htmlFor="jobId" className="block text-sm font-semibold text-gray-900">
                        Associated Job *
                      </label>
                      <div className="relative">
                        <BriefcaseIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          id="jobId"
                          name="jobId"
                          required
                          value={formData.jobId}
                          onChange={handleInputChange}
                          className={`block w-full pl-12 pr-12 py-3.5 text-base text-gray-900 border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none ${
                            errors.jobId ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select a job</option>
                          {jobs.map(job => (
                            <option key={job._id} value={job._id}>{job.title}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.jobId && (
                        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          {errors.jobId}
                        </p>
                      )}
                    </div>

                    {/* Order */}
                    <div className="space-y-3">
                      <label htmlFor="order" className="block text-sm font-semibold text-gray-900">
                        Round Order
                        <span className="text-sm font-normal text-gray-600 ml-2">(Position in the interview process)</span>
                      </label>
                      <div className="relative">
                        <TagIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="order"
                          name="order"
                          type="number"
                          min="0"
                          value={formData.order}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
                        Description
                        <span className="text-sm font-normal text-gray-600 ml-2">(Optional details about this round)</span>
                      </label>
                      <div className="relative">
                        <DocumentTextIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe what this round entails..."
                          className="block w-full pl-12 pr-4 py-3.5 text-base text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <p className="font-medium">Required fields are marked with *</p>
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
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                        >
                          {posting ? (
                            <>
                              <ArrowPathIcon className="w-5 h-5 animate-spin" />
                              {editingRound ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              <CheckIcon className="w-5 h-5" />
                              {editingRound ? 'Update Round' : 'Create Round'}
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
    </div>
  );
}
