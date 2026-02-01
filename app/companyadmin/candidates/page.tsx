'use client';

import { useState, useEffect } from 'react';
import { Eye, Download, User, Mail, FileText, Briefcase } from 'lucide-react';
import { applicationsAPI, Application } from '../../api/applications';
import { API_BASE_URL } from '../../api/config';

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
        setError('No company found for this user.');
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
        candidate.positions.push(application.jobId.title);
        if (application.resumeUrl) {
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
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
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
                      <div className="text-sm text-gray-900">
                        {candidate.positions.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidate.resumeUrls.length > 0 ? (
                        <div className="flex space-x-2">
                          {candidate.resumeUrls.map((url, index) => (
                            <a
                              key={index}
                              href={`${API_BASE_URL}${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900"
                              title={`Download Resume ${index + 1}`}
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">No resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Applications</h3>
                  <div className="space-y-4">
                    {selectedCandidate.applications.map((application) => (
                      <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-md font-medium text-gray-900">{application.jobId.title}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'SHORTLISTED' ? 'bg-purple-100 text-purple-800' :
                            application.status === 'HIRED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Applied on: {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                        {application.coverLetter && (
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
                          </div>
                        )}
                        {application.resumeUrl && (
                          <a
                            href={`${API_BASE_URL}${application.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Resume
                          </a>
                        )}
                      </div>
                    ))}
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
