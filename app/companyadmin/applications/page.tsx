'use client';

import { useState, useEffect } from 'react';
import { Eye, Download, CheckCircle, XCircle, Clock, User, Mail, Phone, FileText } from 'lucide-react';
import { applicationsAPI, Application } from '../../api/applications';
import { API_BASE_URL } from '../../api/config';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get company information for the logged-in company admin
      const { companiesAPI } = await import('../../api/companies');
      const company = await companiesAPI.getMyCompany();

      const data = await applicationsAPI.getApplicationsByCompany(company._id);
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <div className="text-sm text-gray-600">
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Yet</h2>
          <p className="text-gray-600">Applications for your jobs will appear here.</p>
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
                {applications.map((application) => (
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
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
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
