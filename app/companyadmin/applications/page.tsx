'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Download, CheckCircle, XCircle, Clock, User, Mail, Phone, FileText, Grid3X3, List, FileQuestion, Edit, Save, X, Briefcase, ChevronDown } from 'lucide-react';
import { applicationsAPI, Application } from '../../api/applications';
import { roundsAPI, MCQResponse, RoundEvaluation, EvaluationStatus, Round } from '../../api/rounds';
import { API_BASE_URL } from '../../api/config';
import KanbanBoard from '../../components/KanbanBoard';
import Loader from '../../components/Loader';

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [activeTab, setActiveTab] = useState<'applications' | 'google-responses'>('applications');
  const [mcqResponses, setMcqResponses] = useState<MCQResponse[]>([]);
  const [mcqLoading, setMcqLoading] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<string | null>(null);
  const [evaluationNotes, setEvaluationNotes] = useState<string>('');
  const [evaluationStatus, setEvaluationStatus] = useState<EvaluationStatus>('pending');
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>('');
  const [googleSheetData, setGoogleSheetData] = useState<any[]>([]);
  const [googleSheetLoading, setGoogleSheetLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [evaluations, setEvaluations] = useState<RoundEvaluation[]>([]);
  const [isJobFilterOpen, setIsJobFilterOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchMcqResponses();
  }, []);

  useEffect(() => {
    if (selectedJobId !== 'all') {
      fetchRounds(selectedJobId);
    } else {
      setRounds([]);
    }
  }, [selectedJobId]);

  useEffect(() => {
    if (activeTab === 'google-responses') {
      fetchMcqResponses();
    }
  }, [activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get company information for the logged-in company admin
      const { companiesAPI } = await import('../../api/companies');
      const response = await companiesAPI.getMyCompany();

      if (!response.company) {
        setError('No company found for this user. Please contact support to set up your company profile.');
        setLoading(false);
        return;
      }

      const data = await applicationsAPI.getApplicationsByCompany(response.company._id);
      setApplications(data);

      // Fetch evaluations for these applications
      if (data.length > 0) {
        const appIds = data.map(app => app._id);
        const evals = await roundsAPI.getEvaluationsByApplications(appIds);
        setEvaluations(evals);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRounds = async (jobId: string) => {
    try {
      const data = await roundsAPI.getRoundsByJob(jobId);
      setRounds(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Failed to fetch rounds:', err);
      // Don't show error to user as it might just mean no rounds
      setRounds([]);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, status, notes);
      await fetchApplications(); // Refresh the list
    } catch (err) {
      console.error('Failed to update application status:', err);
      setError('Failed to update application status. Please try again.');
    }
  };

  const fetchMcqResponses = async () => {
    setMcqLoading(true);
    try {
      // Use the new endpoint to get all MCQ responses
      const allResponses = await roundsAPI.getAllMcqResponses();
      console.log('All MCQ responses:', allResponses);
      setMcqResponses(allResponses);
    } catch (err) {
      console.error('Failed to fetch MCQ responses:', err);
      setError('Failed to load MCQ responses. Please try again.');
    } finally {
      setMcqLoading(false);
    }
  };

  const fetchGoogleSheetData = async () => {
    if (!googleSheetUrl.trim()) {
      setError('Please enter a Google Sheets URL');
      return;
    }
    setGoogleSheetLoading(true);
    setError(null);
    try {
      const data = await roundsAPI.fetchGoogleSheetData(googleSheetUrl.trim());
      setGoogleSheetData(data);
    } catch (err) {
      console.error('Failed to fetch Google Sheets data:', err);
      setError('Failed to fetch Google Sheets data. Please check the URL and try again.');
    } finally {
      setGoogleSheetLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'SHORTLISTED': return 'bg-purple-100 text-purple-800';
      case 'HIRED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPLIED': return <Clock className="h-4 w-4" />;
      case 'UNDER_REVIEW': return <Eye className="h-4 w-4" />;
      case 'SHORTLISTED': return <CheckCircle className="h-4 w-4" />;
      case 'HIRED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getNextStatuses = (currentStatus: string) => {
    switch (currentStatus) {
      case 'APPLIED':
        return ['UNDER_REVIEW'];
      case 'UNDER_REVIEW':
        return ['SHORTLISTED', 'REJECTED'];
      case 'SHORTLISTED':
        return ['HIRED', 'REJECTED'];
      case 'HIRED':
      case 'REJECTED':
        return []; // Final states
      default:
        return [];
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'Applied';
      case 'UNDER_REVIEW': return 'Under Review';
      case 'SHORTLISTED': return 'Shortlisted';
      case 'HIRED': return 'Hired';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  // Extract unique jobs from applications
  const uniqueJobs = useMemo(() => {
    const jobsMap = new Map();
    applications.forEach(app => {
      if (app.jobId && !jobsMap.has(app.jobId._id)) {
        jobsMap.set(app.jobId._id, {
          id: app.jobId._id,
          title: app.jobId.title,
          count: 0
        });
      }
      if (app.jobId && jobsMap.has(app.jobId._id)) {
        const job = jobsMap.get(app.jobId._id);
        job.count++;
      }
    });
    return Array.from(jobsMap.values());
  }, [applications]);

  // Filter applications based on selected job
  const filteredApplications = useMemo(() => {
    if (selectedJobId === 'all') {
      return applications;
    }
    return applications.filter(app => app.jobId._id === selectedJobId);
  }, [applications, selectedJobId]);

  if (loading) {
    return <Loader variant="container" text="Job Applications" subText="Organizing candidate profiles..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-600 text-2xl">!</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'applications'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Applications
          </button>
          {/* <button
            onClick={() => setActiveTab('google-responses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'google-responses'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Google Responses
          </button> */}
        </nav>
      </div>

      {activeTab === 'applications' && (
        <>
          <div className="flex flex-col space-y-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
              <div className="flex items-center space-x-4">
                {/* Job Filter Dropdown */}
                {uniqueJobs.length > 0 && (
                  <div className="relative inline-block text-left w-56">
                    <button
                      type="button"
                      onClick={() => setIsJobFilterOpen(!isJobFilterOpen)}
                      className="inline-flex justify-between items-center w-full rounded-lg border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                      id="menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
                    >
                      <div className="flex items-center truncate">
                        <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="truncate">
                          {selectedJobId === 'all'
                            ? 'All Jobs'
                            : uniqueJobs.find(j => j.id === selectedJobId)?.title || 'Select Job'}
                        </span>
                      </div>
                      <ChevronDown className={`ml-2 -mr-1 h-4 w-4 text-gray-400 transition-transform duration-200 ${isJobFilterOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {isJobFilterOpen && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 max-h-80 overflow-y-auto"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex={-1}
                      >
                        <div className="py-1" role="none">
                          <button
                            onClick={() => {
                              setSelectedJobId('all');
                              setIsJobFilterOpen(false);
                            }}
                            className={`flex items-center justify-between w-full text-left px-4 py-3 text-sm transition-colors ${selectedJobId === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            role="menuitem"
                            tabIndex={-1}
                          >
                            <span className="font-medium">All Jobs</span>
                            <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${selectedJobId === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                              {applications.length}
                            </span>
                          </button>

                          {uniqueJobs.map((job) => (
                            <button
                              key={job.id}
                              onClick={() => {
                                setSelectedJobId(job.id);
                                setIsJobFilterOpen(false);
                              }}
                              className={`flex items-center justify-between w-full text-left px-4 py-3 text-sm transition-colors ${selectedJobId === job.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                              role="menuitem"
                              tabIndex={-1}
                            >
                              <span className="truncate pr-2">{job.title}</span>
                              <span className={`ml-auto py-0.5 px-2.5 rounded-full text-xs font-medium ${selectedJobId === job.id ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                                {job.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Backdrop to close on click outside */}
                    {isJobFilterOpen && (
                      <div className="fixed inset-0 z-10" onClick={() => setIsJobFilterOpen(false)} />
                    )}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                      }`}
                    title="Table View"
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                      }`}
                    title="Kanban View"
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>


          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 flex-grow flex flex-col justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Found</h2>
              <p className="text-gray-600">
                {selectedJobId === 'all'
                  ? 'Applications for your jobs will appear here.'
                  : 'No applications found for the selected job.'}
              </p>
              {selectedJobId !== 'all' && (
                <button
                  onClick={() => setSelectedJobId('all')}
                  className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all applications
                </button>
              )}
            </div>
          ) : viewMode === 'kanban' ? (
            <div className="flex-grow overflow-hidden">
              <KanbanBoard
                applications={filteredApplications}
                rounds={rounds}
                mcqResponses={mcqResponses}
                evaluations={evaluations}
                onApplicationUpdate={fetchApplications}
                onViewDetails={(application) => {
                  setSelectedApplication(application);
                  setShowModal(true);
                }}
              />
            </div>

          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden flex-grow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.candidateId.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.candidateId.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{application.jobId.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1">{application.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/companyadmin/candidates/${application.candidateId._id}`)}
                              className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {application.resumeUrl && (
                              <a
                                href={`${API_BASE_URL}${application.resumeUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'google-responses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Google Responses</h1>
            <div className="text-sm text-gray-600">
              {mcqResponses.length} response{mcqResponses.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Google Sheets URL Input */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fetch Google Sheets Data</h2>
            <div className="flex gap-4">
              <input
                type="url"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                placeholder="Enter Google Sheets URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={fetchGoogleSheetData}
                disabled={googleSheetLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleSheetLoading ? 'Fetching...' : 'Fetch Data'}
              </button>
            </div>
          </div>

          {/* Google Sheets Data Table */}
          {googleSheetData.length > 0 && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Google Sheets Data</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {googleSheetData[0]?.map((header: any, index: number) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Column {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {googleSheetData.map((row: any[], rowIndex: number) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {row.map((cell: any, cellIndex: number) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cell || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MCQ Responses Section */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">MCQ Responses</h3>
            </div>
            {mcqLoading ? (
              <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : mcqResponses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileQuestion className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No MCQ Responses Yet</h2>
                <p className="text-gray-600">MCQ responses will appear here once candidates submit their answers.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Round
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Answers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evaluation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mcqResponses.map((response) => (
                      <tr key={response._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {response.applicationId.candidateId.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {response.applicationId.candidateId.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{response.roundId.name}</div>
                          <div className="text-sm text-gray-500">{response.applicationId.jobId.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {response.answers.length} answers
                          </div>
                          <div className="text-sm text-gray-500">
                            Correct: {response.isCorrect?.filter(Boolean).length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{response.score?.toFixed(1)}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">Pending</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedApplication(response.applicationId as any);
                              setShowModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Candidate Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Candidate Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedApplication.candidateId.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedApplication.candidateId.email}</p>
                    </div>
                    {selectedApplication.candidateId.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{selectedApplication.candidateId.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <p className="text-sm text-gray-900">{selectedApplication.jobId.title}</p>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{selectedApplication.coverLetter}</p>
                  </div>
                )}

                {/* Resume */}
                {selectedApplication.resumeUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
                    <a
                      href={`${API_BASE_URL}${selectedApplication.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </a>
                  </div>
                )}

                {/* Status Update */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Status</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                          {getStatusIcon(selectedApplication.status)}
                          <span className="ml-1">{getStatusDisplayName(selectedApplication.status)}</span>
                        </span>
                      </label>
                      {getNextStatuses(selectedApplication.status).length > 0 ? (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              updateApplicationStatus(selectedApplication._id, e.target.value);
                              e.target.value = ''; // Reset select
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue=""
                        >
                          <option value="" disabled>Choose next status...</option>
                          {getNextStatuses(selectedApplication.status).map((status) => (
                            <option key={status} value={status}>
                              {getStatusDisplayName(status)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-gray-600 italic">
                          This application has reached a final status and cannot be changed.
                        </p>
                      )}
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
