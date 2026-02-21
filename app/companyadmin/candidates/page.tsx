'use client';

import { useState, useEffect } from 'react';
import { Eye, Download, User, Mail, FileText, Briefcase } from 'lucide-react';
import { applicationsAPI, Application } from '../../api/applications';
import { API_BASE_URL, getFileUrl } from '../../api/config';
import Loader from '../../components/Loader';

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

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateWithApplications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWithApplications | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
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

      const applications = await applicationsAPI.getApplicationsByCompany(response.company._id);

      // Group applications by candidate
      const candidateMap = new Map<string, CandidateWithApplications>();

      applications.forEach((application) => {
        const candidateId = application.candidateId._id;
        if (!candidateMap.has(candidateId)) {
          candidateMap.set(candidateId, {
            candidateId: application.candidateId,
            applications: [],
            positions: [],
            resumeUrls: [],
          });
        }
        const candidate = candidateMap.get(candidateId)!;
        candidate.applications.push(application);
        if (!candidate.positions.includes(application.jobId.title)) {
          candidate.positions.push(application.jobId.title);
        }
        if (application.resumeUrl && !candidate.resumeUrls.includes(application.resumeUrl)) {
          candidate.resumeUrls.push(application.resumeUrl);
        }
      });

      setCandidates(Array.from(candidateMap.values()));
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader variant="container" text="Candidates" subText="Fetching applicant profiles..." />;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
        <div className="text-sm text-gray-600">
          {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Candidates Yet</h2>
          <p className="text-gray-600">Candidates who apply to your jobs will appear here.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Positions Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <tr key={candidate.candidateId._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.candidateId.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.candidateId.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {candidate.positions.slice(0, 2).map((position, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            {position}
                          </span>
                        ))}
                        {candidate.positions.length > 2 && (
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 cursor-help"
                            title={candidate.positions.slice(2).join(', ')}
                          >
                            +{candidate.positions.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidate.resumeUrls.length > 0 ? (
                        candidate.resumeUrls.length === 1 ? (
                          <a
                            href={getFileUrl(candidate.resumeUrls[0])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                          >
                            <FileText className="h-4 w-4 mr-1.5" />
                            View Resume
                          </a>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-indigo-100">
                              {candidate.resumeUrls.length} Resumes
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCandidate(candidate);
                                setShowModal(true);
                              }}
                              className="text-xs text-gray-500 hover:text-indigo-600 underline cursor-pointer"
                            >
                              View all
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-sm text-gray-400 italic">No resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedCandidate(candidate);
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
        </div>
      )}

      {/* Candidate Details Modal */}
      {showModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Candidate Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Candidate Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Candidate Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedCandidate.candidateId.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedCandidate.candidateId.email}</p>
                    </div>
                    {selectedCandidate.candidateId.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{selectedCandidate.candidateId.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Applications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                    Applications History
                  </h3>
                  <div className="space-y-4">
                    {selectedCandidate.applications.map((application) => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'APPLIED': return 'bg-blue-100 text-blue-800 border-blue-200';
                          case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                          case 'SHORTLISTED': return 'bg-purple-100 text-purple-800 border-purple-200';
                          case 'HIRED': return 'bg-green-100 text-green-800 border-green-200';
                          case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
                          case 'HOLD': return 'bg-orange-100 text-orange-800 border-orange-200';
                          default: return 'bg-gray-100 text-gray-800 border-gray-200';
                        }
                      };

                      return (
                        <div key={application._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{application.jobId?.title || 'Unknown Position'}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Applied on {application.createdAt ? new Date(application.createdAt).toLocaleDateString(undefined, {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                }) : 'N/A'}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                              {(application.status || 'UNKNOWN').replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="p-6 grid gap-6">
                            {/* Stats/Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Application Details</h5>
                                <div className="space-y-3">
                                  <div className="flex items-start gap-2">
                                    <div className="mt-0.5">
                                      {application.resumeUrl ? (
                                        <a
                                          href={getFileUrl(application.resumeUrl)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                          <FileText className="h-4 w-4 mr-2" />
                                          View Provided Resume
                                        </a>
                                      ) : (
                                        <span className="text-sm text-gray-400 italic">No resume specific to this application</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {application.currentRound && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Stage</h5>
                                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 inline-block">
                                    <span className="text-sm font-medium text-indigo-900">
                                      {application.currentRound.name || 'Unknown Round'}
                                    </span>
                                    <p className="text-xs text-indigo-700 mt-1">
                                      {(application.currentRound.type || '').replace(/_/g, ' ')}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Cover Letter */}
                            {application.coverLetter && (
                              <div className="border-t border-gray-100 pt-4">
                                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cover Letter</h5>
                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed border border-gray-100">
                                  {application.coverLetter}
                                </div>
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
        </div>
      )}
    </div>
  );
}
