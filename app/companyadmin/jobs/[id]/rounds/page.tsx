'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { roundsAPI, Round } from '../../../../api/rounds';
import { jobsAPI, companiesAPI } from '../../../../api/companies';
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
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  ChevronRightIcon,
  TrashIcon,
  QueueListIcon
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

export default function JobRoundsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [rounds, setRounds] = useState<Round[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [posting, setPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    jobId: jobId,
    order: 0,
    type: 'interview' as 'mcq' | 'interview' | 'technical' | 'hr' | 'coding',
    googleFormLink: '',
    platform: '',
    duration: '',
    instructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobData = await jobsAPI.getJobById(jobId);
      setJob(jobData);

      if (jobData.companyId) {
        const companyId = typeof jobData.companyId === 'string' ? jobData.companyId : jobData.companyId._id;
        const companyData = await companiesAPI.getMyCompany();
        if (companyData && companyData._id === companyId) {
          setCompany(companyData);
        }
      }

      const allRounds = await roundsAPI.getAllRounds();
      const jobRounds = allRounds.filter(round => {
        const roundJobId = typeof round.jobId === 'string' ? round.jobId : round.jobId._id;
        return roundJobId === jobId;
      });

      // Sort by order
      jobRounds.sort((a, b) => a.order - b.order);
      setRounds(jobRounds);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setRounds([]);
    } finally {
      setLoading(false);
    }
  };

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
        await roundsAPI.updateRound(editingRound._id, {
          name: formData.name,
          description: formData.description,
          order: formData.order,
          type: formData.type,
          googleFormLink: formData.googleFormLink || undefined,
          platform: formData.platform || undefined,
          duration: formData.duration || undefined,
          instructions: formData.instructions || undefined,
        });

        setRounds(prev => prev.map(round =>
          round._id === editingRound._id
            ? {
              ...round,
              name: formData.name,
              description: formData.description,
              order: formData.order,
              type: formData.type,
              googleFormLink: formData.googleFormLink || undefined,
              platform: formData.platform || undefined,
              duration: formData.duration || undefined,
              instructions: formData.instructions || undefined,
              updatedAt: new Date().toISOString()
            }
            : round
        ));
      } else {
        const newRound = await roundsAPI.createRound({
          name: formData.name,
          description: formData.description,
          jobId: jobId,
          order: formData.order,
          type: formData.type,
          ...(formData.googleFormLink && { googleFormLink: formData.googleFormLink }),
          ...(formData.platform && { platform: formData.platform }),
          ...(formData.duration && { duration: formData.duration }),
          ...(formData.instructions && { instructions: formData.instructions }),
        });

        setRounds(prev => [...prev, newRound].sort((a, b) => a.order - b.order));
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
      jobId: jobId,
      order: rounds.length > 0 ? Math.max(...rounds.map(r => r.order)) + 1 : 1,
      type: 'interview',
      googleFormLink: '',
      platform: '',
      duration: '',
      instructions: '',
    });
    setEditingRound(null);
    setErrors({});
  };

  const handleEdit = (round: Round) => {
    setEditingRound(round);
    setFormData({
      name: round.name,
      description: round.description || '',
      jobId: jobId,
      order: round.order,
      type: round.type,
      googleFormLink: round.googleFormLink || '',
      platform: round.platform || '',
      duration: round.duration || '',
      instructions: round.instructions || '',
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

  const activeRounds = rounds.filter(round => !round.isArchived);
  const archivedRounds = rounds.filter(round => round.isArchived);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Loading Interview Rounds</p>
            <p className="text-gray-500">Fetching job details and rounds...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BriefcaseIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">
            The requested job position could not be found or you don't have permission to access it.
          </p>
          <button
            onClick={() => router.push('/companyadmin/jobs')}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Return to Jobs Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Page Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button - Moved above header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/companyadmin/jobs')}
            className="inline-flex items-center text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Interview Process</h1>
              <p className="text-gray-600 mt-1">Manage interview rounds for <span className="font-semibold text-gray-900">{job.title}</span></p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Round
            </button>
          </div>
        </div>

        {/* Job Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="inline-flex items-center text-sm text-gray-600">
                    <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                    {company?.name || 'Company'}
                  </span>
                  {job.location && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{job.location}</span>
                    </>
                  )}
                  {job.jobType && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{job.jobType}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Job Status</div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-800' :
                  job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                <QueueListIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rounds</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{rounds.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                <CheckIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rounds</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeRounds.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
                <ArchiveBoxIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{archivedRounds.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {rounds.length > 0
                    ? new Date(rounds[0].updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'active'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Active Rounds ({activeRounds.length})
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === 'archived'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Archived ({archivedRounds.length})
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'active' ? (
              activeRounds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <QueueListIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No Interview Rounds Yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start building your structured interview process by adding rounds to assess candidates at different stages.
                  </p>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create First Round
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRounds.map((round, index) => (
                    <div key={round._id} className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl p-5 transition-all duration-200">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                              <span className="text-base font-bold text-blue-600">{index + 1}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{round.name}</h3>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  Round {round.order}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Created {new Date(round.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {round.description && (
                            <p className="text-gray-700 mb-4 pl-12">{round.description}</p>
                          )}

                          <div className="flex items-center space-x-4 text-sm text-gray-500 pl-12">
                            <span className="flex items-center">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              Created {new Date(round.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center">
                              <ClockIcon className="w-3 h-3 mr-1" />
                              Updated {new Date(round.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-4">
                          {(round.type === 'mcq' || round.type === 'coding') && (
                            <button
                              onClick={() => router.push(`/companyadmin/jobs/${jobId}/rounds/${round._id}`)}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors duration-200 cursor-pointer"
                            >
                              <EyeIcon className="w-4 h-4 mr-2" />
                              View
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(round)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors duration-200 cursor-pointer"
                          >
                            <PencilSquareIcon className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleArchive(round._id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors duration-200 cursor-pointer"
                          >
                            <ArchiveBoxIcon className="w-4 h-4 mr-2" />
                            Archive
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              archivedRounds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ArchiveBoxIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No Archived Rounds</h3>
                  <p className="text-gray-600">Archived interview rounds will appear here for reference</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {archivedRounds.map((round) => (
                    <div key={round._id} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ArchiveBoxIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-700">{round.name}</h3>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="px-2.5 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full">
                                  Archived • Round {round.order}
                                </span>
                                {round.archivedAt && (
                                  <span className="text-sm text-gray-500">
                                    Archived {new Date(round.archivedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {round.description && (
                            <p className="text-gray-600 mb-4 pl-12">{round.description}</p>
                          )}
                        </div>

                        <button
                          onClick={() => handleActivate(round._id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200 rounded-lg transition-colors duration-200 mt-4 lg:mt-0 lg:ml-4"
                        >
                          <CheckIcon className="w-4 h-4 mr-2" />
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Getting Started Section */}
        {rounds.length === 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Getting Started with Interview Rounds</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ChevronRightIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Create structured interview rounds to organize your hiring process</span>
              </li>
              <li className="flex items-start">
                <ChevronRightIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Set the order to define the logical sequence of assessment stages</span>
              </li>
              <li className="flex items-start">
                <ChevronRightIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Add detailed descriptions to guide interviewers and ensure consistency</span>
              </li>
              <li className="flex items-start">
                <ChevronRightIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Archive rounds that are no longer in use while keeping them for reference</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-md transition-opacity" onClick={() => setShowModal(false)} />

            <div className="relative w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-3">
                      {editingRound ? (
                        <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                      ) : (
                        <PlusIcon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {editingRound ? 'Edit Interview Round' : 'Create Interview Round'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {editingRound ? 'Update round details and order' : 'Add a new stage to your interview process'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="px-6 py-5">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Round Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Technical Screening, Final Interview, HR Discussion"
                      className={`w-full px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 placeholder-gray-500 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="order" className="block text-sm font-semibold text-gray-900 mb-2">
                      Round Order
                    </label>
                    <div className="relative">
                      <input
                        id="order"
                        name="order"
                        type="number"
                        min="1"
                        value={formData.order}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Position in the interview sequence (1 = first round)</p>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-gray-900 mb-2">
                      Round Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="interview">Interview</option>
                      <option value="technical">Technical</option>
                      <option value="hr">HR</option>
                      <option value="mcq">MCQ Assessment</option>
                      <option value="coding">Coding Test</option>
                    </select>
                  </div>

                  {formData.type === 'coding' && (
                    <div className="space-y-5 bg-blue-50 border border-blue-200 rounded-xl p-5">
                      <h4 className="font-semibold text-blue-900 border-b border-blue-200 pb-2 mb-4">Coding Test Configuration</h4>

                      <div>
                        <label htmlFor="platform" className="block text-sm font-semibold text-gray-900 mb-2">
                          Platform Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="platform"
                          name="platform"
                          type="text"
                          required={formData.type === 'coding'}
                          value={formData.platform}
                          onChange={handleInputChange}
                          placeholder="e.g., HackerRank, LeetCode, CoderByte"
                          className="w-full px-4 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label htmlFor="duration" className="block text-sm font-semibold text-gray-900 mb-2">
                          Duration <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="duration"
                          name="duration"
                          type="text"
                          required={formData.type === 'coding'}
                          value={formData.duration}
                          onChange={handleInputChange}
                          placeholder="e.g., 60 Mins, 2 Hours"
                          className="w-full px-4 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label htmlFor="instructions" className="block text-sm font-semibold text-gray-900 mb-2">
                          Instructions <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="instructions"
                          name="instructions"
                          required={formData.type === 'coding'}
                          value={formData.instructions}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Enter specific instructions for the candidate..."
                          className="w-full px-4 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              You can configure the coding platform name, test duration, and instructions for this round.
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p className="mb-2 font-medium">Once this round is created:</p>
                              <ul className="list-disc pl-5 space-y-1 mb-3">
                                <li>Candidates’ application status will be updated from MCQ Round to Coding Test Round</li>
                                <li>A shortlisting notification email will be automatically sent to the shortlisted candidates on their registered email address</li>
                              </ul>
                              <p className="text-xs font-semibold text-yellow-800">
                                📌 You can later share the exact test date, time, and test link manually from the Company Admin panel.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.type === 'mcq' && (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <h4 className="flex items-center text-red-800 font-bold mb-2">
                          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                          Important Instructions for MCQ Assessment
                        </h4>
                        <p className="text-sm text-red-700 mb-3">
                          Please follow the rules below carefully. Incorrect Google Form settings may cause responses or scores to not appear correctly.
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-start">
                            <span className="mr-2 text-lg">🔴</span>
                            <div>
                              <span className="text-sm font-bold text-red-800">Google Form must be created as a Quiz</span>
                              <p className="text-xs text-red-700 mt-0.5">Enable “Make this a quiz” in Google Form settings.</p>
                              <p className="text-xs text-red-700">Assign correct answers and marks for each MCQ.</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <span className="mr-2 text-lg">🔴</span>
                            <div>
                              <span className="text-sm font-bold text-red-800">Candidate Email is Mandatory</span>
                              <p className="text-xs text-red-700 mt-0.5">Enable “Collect email addresses”.</p>
                              <p className="text-xs text-red-700">This email will be used to identify candidates and send further communication.</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <span className="mr-2 text-lg">🔴</span>
                            <div>
                              <span className="text-sm font-bold text-red-800">Use the Original Form (Edit) Link</span>
                              <p className="text-xs text-red-700 mt-0.5">Do NOT use the public “viewform” link.</p>
                              <p className="text-xs text-red-700">Only the original Google Form should be linked to this round.</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <span className="mr-2 text-lg">🔴</span>
                            <div>
                              <span className="text-sm font-bold text-red-800">Responses are Stored in Google Sheets</span>
                              <p className="text-xs text-red-700 mt-0.5">All candidate responses and scores are automatically stored in the linked Google Sheet.</p>
                              <p className="text-xs text-red-700">PASS / FAIL status is calculated automatically based on the cutoff score.</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <span className="mr-2 text-lg">🔴</span>
                            <div>
                              <span className="text-sm font-bold text-red-800">MCQ Result Evaluation</span>
                              <p className="text-xs text-red-700 mt-0.5">Candidates scoring equal to or above the cutoff are marked as PASS.</p>
                              <p className="text-xs text-red-700">Candidates below the cutoff are marked as FAIL.</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <span className="mr-2 text-lg">🔴</span>
                            <div>
                              <span className="text-sm font-bold text-red-800">Next Round Shortlisting</span>
                              <p className="text-xs text-red-700 mt-0.5">Only PASS candidates will be considered for the next round.</p>
                              <p className="text-xs text-red-700">Shortlisted candidates may receive automated or manual email notifications</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="googleFormLink" className="block text-sm font-semibold text-gray-900 mb-2">
                          Google Form Link <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="googleFormLink"
                          name="googleFormLink"
                          type="url"
                          required={formData.type === 'mcq'}
                          value={formData.googleFormLink}
                          onChange={handleInputChange}
                          placeholder="https://docs.google.com/forms/d/..."
                          className={`w-full px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 placeholder-gray-500 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.googleFormLink ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {errors.googleFormLink && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            {errors.googleFormLink}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                      Description <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what this round entails, expectations, assessment criteria, and any specific instructions for interviewers..."
                      className="w-full px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="mt-8 pt-5 border-t border-gray-200">
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-xl transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={posting}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                      {posting ? (
                        <div className="flex items-center">
                          <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                          {editingRound ? 'Updating...' : 'Creating...'}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckIcon className="w-4 h-4 mr-2" />
                          {editingRound ? 'Update Round' : 'Create Round'}
                        </div>
                      )}
                    </button>
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