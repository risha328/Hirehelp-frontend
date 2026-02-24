'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Briefcase,
  Star,
  TrendingUp,
  XCircle,
  Eye,
  MessageSquare,
  FileText,
  ExternalLink,
  Loader2,
  Upload,
  ClipboardCheck
} from 'lucide-react';
import Link from 'next/link';
import { applicationsAPI, Application } from '../api/applications';
import { getFileUrl } from '../api/config';

const statusConfig = {
  APPLIED: {
    label: 'Applied',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle,
    description: 'Your application has been submitted successfully'
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Clock,
    description: 'Your application is being reviewed by the hiring team'
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Star,
    description: 'Congratulations! You have been shortlisted for this position'
  },
  HIRED: {
    label: 'Hired',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: Briefcase,
    description: 'Congratulations! You have been selected for this position'
  },
  REJECTED: {
    label: 'Not Selected',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    description: 'Unfortunately, you were not selected for this position'
  },
  HOLD: {
    label: 'On Hold',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Clock,
    description: 'Your application has been put on hold'
  }
};

const statusOrder = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'HOLD', 'HIRED', 'REJECTED'];

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [offerActionLoading, setOfferActionLoading] = useState<string | null>(null);
  const [offerLinkLoading, setOfferLinkLoading] = useState<string | null>(null);
  const [offerMessage, setOfferMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const apps = await applicationsAPI.getApplicationsByCandidate();
      setApplications(apps);
      if (selectedApplication) {
        const updated = apps.find((a: Application) => a._id === selectedApplication._id);
        if (updated) setSelectedApplication(updated);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (currentStatus: string) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder.map((status, index) => ({
      ...statusConfig[status as keyof typeof statusConfig],
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
      isRejected: currentStatus === 'REJECTED' && status === 'REJECTED'
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-100 to-white pt-16 lg:pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-100 to-white pt-16 lg:pt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Applications</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchApplications}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-100 to-white pt-16 lg:pt-20">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading - aligned with header */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-start sm:items-center gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600 mt-2">Track your job application progress</p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 flex-shrink-0 border border-gray-300 rounded-lg px-4 py-2.5 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Profile
            </Link>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't applied to any jobs yet. Start exploring opportunities and submit your first application!
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Applications List */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Your Applications ({applications.length})</h2>
                  <p className="text-gray-600 mt-1">Click on any application to view detailed status</p>
                </div>

                <div className="divide-y divide-gray-100">
                  {applications.map((application) => {
                    const statusInfo = statusConfig[application.status as keyof typeof statusConfig];
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div
                        key={application._id}
                        onClick={() => setSelectedApplication(application)}
                        className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${selectedApplication?._id === application._id ? 'bg-indigo-50 border-r-4 border-indigo-500' : ''
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                <img
                                  src={getFileUrl(application.jobId.companyId.logoUrl) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(application.jobId.companyId.name)}&backgroundColor=6366f1`}
                                  alt={application.jobId.companyId.name}
                                  className="w-10 h-10"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(application.jobId.companyId.name)}`;
                                  }}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {application.jobId.title}
                                </h3>
                                <div className="flex items-center text-gray-600 mt-1">
                                  <Building className="h-4 w-4 mr-1" />
                                  <span className="font-medium">{application.jobId.companyId.name}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {application.jobId.location}
                                  </span>
                                  <span className="flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {application.jobId.salary}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                                <StatusIcon className="h-4 w-4 mr-1.5" />
                                {statusInfo.label}
                              </div>
                              <div className="text-sm text-gray-500">
                                Applied {formatDate(application.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Application Status Details */}
            <div className="space-y-6">
              {selectedApplication ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Application Status</h2>
                    <p className="text-gray-600 mt-1">Detailed progress for your application</p>
                  </div>

                  <div className="p-6">
                    {/* Job Info */}
                    <div className="mb-8">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                          <img
                            src={getFileUrl(selectedApplication.jobId.companyId.logoUrl) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedApplication.jobId.companyId.name)}&backgroundColor=6366f1`}
                            alt={selectedApplication.jobId.companyId.name}
                            className="w-14 h-14"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedApplication.jobId.companyId.name)}`;
                            }}
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900">{selectedApplication.jobId.title}</h3>
                          <div className="flex items-center text-gray-600 mt-2">
                            <Building className="h-5 w-5 mr-2" />
                            <span className="text-lg font-medium">{selectedApplication.jobId.companyId.name}</span>
                          </div>
                          <div className="flex items-center text-gray-500 mt-2 space-x-4">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {selectedApplication.jobId.location}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {selectedApplication.jobId.salary}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Applied {formatDate(selectedApplication.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Progress */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-6">Application Progress</h4>

                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200"></div>
                        {selectedApplication.status !== 'REJECTED' && (
                          <div
                            className="absolute top-6 left-6 h-0.5 bg-indigo-500 transition-all duration-500"
                            style={{
                              width: `calc(${(statusOrder.indexOf(selectedApplication.status) / (statusOrder.length - 2)) * 100}% - 1.5rem)`
                            }}
                          ></div>
                        )}

                        {/* Status Steps */}
                        <div className="relative flex justify-between">
                          {getStatusProgress(selectedApplication.status).map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                              <div key={index} className="flex flex-col items-center">
                                <div className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${step.isCurrent
                                  ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg scale-110'
                                  : step.isCompleted && !step.isRejected
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : step.isRejected
                                      ? 'bg-red-500 border-red-500 text-white'
                                      : 'bg-white border-gray-300 text-gray-400'
                                  }`}>
                                  <StepIcon className="h-5 w-5" />
                                </div>

                                <div className="mt-3 text-center max-w-20">
                                  <div className={`text-sm font-medium ${step.isCurrent ? 'text-indigo-600' : step.isCompleted ? 'text-gray-900' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 leading-tight">
                                    {step.description}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Status Message */}
                    <div className={`p-4 rounded-lg border ${selectedApplication.status === 'HIRED'
                      ? 'bg-emerald-50 border-emerald-200'
                      : selectedApplication.status === 'REJECTED'
                        ? 'bg-red-50 border-red-200'
                        : selectedApplication.status === 'SHORTLISTED'
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                      <div className="flex items-start">
                        <div className={`p-1 rounded-full mr-3 ${selectedApplication.status === 'HIRED'
                          ? 'bg-emerald-100'
                          : selectedApplication.status === 'REJECTED'
                            ? 'bg-red-100'
                            : selectedApplication.status === 'SHORTLISTED'
                              ? 'bg-purple-100'
                              : 'bg-blue-100'
                          }`}>
                          {React.createElement(statusConfig[selectedApplication.status as keyof typeof statusConfig].icon, {
                            className: `h-4 w-4 ${selectedApplication.status === 'HIRED'
                              ? 'text-emerald-600'
                              : selectedApplication.status === 'REJECTED'
                                ? 'text-red-600'
                                : selectedApplication.status === 'SHORTLISTED'
                                  ? 'text-purple-600'
                                  : 'text-blue-600'
                              }`
                          })}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${selectedApplication.status === 'HIRED'
                            ? 'text-emerald-800'
                            : selectedApplication.status === 'REJECTED'
                              ? 'text-red-800'
                              : selectedApplication.status === 'SHORTLISTED'
                                ? 'text-purple-800'
                                : 'text-blue-800'
                            }`}>
                            {statusConfig[selectedApplication.status as keyof typeof statusConfig].label}
                          </h4>
                          <p className={`text-sm mt-1 ${selectedApplication.status === 'HIRED'
                            ? 'text-emerald-700'
                            : selectedApplication.status === 'REJECTED'
                              ? 'text-red-700'
                              : selectedApplication.status === 'SHORTLISTED'
                                ? 'text-purple-700'
                                : 'text-blue-700'
                            }`}>
                            {statusConfig[selectedApplication.status as keyof typeof statusConfig].description}
                          </p>
                          {selectedApplication.updatedAt !== selectedApplication.createdAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Last updated: {formatDate(selectedApplication.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Offer Letter card - for HIRED with offer sent */}
                    {selectedApplication.status === 'HIRED' && selectedApplication.offerLetterUrl && (
                      <div className="mt-6 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                        <h4 className="text-lg font-semibold text-emerald-900 mb-2 flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Offer Letter
                        </h4>
                        {selectedApplication.offerSentAt && (
                          <p className="text-sm text-emerald-700 mb-3">
                            Offer letter sent on {formatDate(selectedApplication.offerSentAt)}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            if (!selectedApplication?.offerLetterUrl) return;
                            setOfferLinkLoading(selectedApplication._id);
                            setOfferMessage(null);
                            try {
                              const { downloadUrl } = await applicationsAPI.getOfferDownloadLink(selectedApplication._id);
                              window.open(downloadUrl, '_blank', 'noopener,noreferrer');
                            } catch (e: any) {
                              setOfferMessage({ type: 'error', text: e.message || 'Could not open offer letter.' });
                            } finally {
                              setOfferLinkLoading(null);
                            }
                          }}
                          disabled={offerLinkLoading === selectedApplication._id}
                          className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium text-sm mb-4 disabled:opacity-50"
                        >
                          {offerLinkLoading === selectedApplication._id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <ExternalLink className="h-4 w-4 mr-1" />
                          )}
                          View offer letter (PDF)
                        </button>
                        {offerMessage && (
                          <div className={`mb-3 text-sm ${offerMessage.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                            {offerMessage.text}
                          </div>
                        )}
                        {selectedApplication.offerAccepted === null || selectedApplication.offerAccepted === undefined ? (
                          <div className="flex gap-3">
                            <button
                              onClick={async () => {
                                setOfferActionLoading(selectedApplication._id);
                                setOfferMessage(null);
                                try {
                                  await applicationsAPI.acceptOffer(selectedApplication._id);
                                  setOfferMessage({ type: 'success', text: 'You have accepted the offer.' });
                                  fetchApplications();
                                  setSelectedApplication((prev) => prev ? { ...prev, offerAccepted: true, offerAcceptedAt: new Date().toISOString() } : null);
                                } catch (e: any) {
                                  setOfferMessage({ type: 'error', text: e.message || 'Failed to accept offer.' });
                                } finally {
                                  setOfferActionLoading(null);
                                }
                              }}
                              disabled={offerActionLoading === selectedApplication._id}
                              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {offerActionLoading === selectedApplication._id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                              Accept Offer
                            </button>
                            <button
                              onClick={async () => {
                                setOfferActionLoading(selectedApplication._id);
                                setOfferMessage(null);
                                try {
                                  await applicationsAPI.declineOffer(selectedApplication._id);
                                  setOfferMessage({ type: 'success', text: 'You have declined the offer.' });
                                  fetchApplications();
                                  setSelectedApplication((prev) => prev ? { ...prev, offerAccepted: false, offerAcceptedAt: new Date().toISOString() } : null);
                                } catch (e: any) {
                                  setOfferMessage({ type: 'error', text: e.message || 'Failed to decline offer.' });
                                } finally {
                                  setOfferActionLoading(null);
                                }
                              }}
                              disabled={offerActionLoading === selectedApplication._id}
                              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                              {offerActionLoading === selectedApplication._id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                              Decline
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-emerald-800">
                            {selectedApplication.offerAccepted ? 'You have accepted this offer.' : 'You have declined this offer.'}
                            {selectedApplication.offerAcceptedAt && (
                              <span className="text-emerald-700 font-normal"> ({formatDate(selectedApplication.offerAcceptedAt)})</span>
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Onboarding – Document upload (shown when converted to employee) */}
                    {selectedApplication.status === 'HIRED' &&
                      selectedApplication.offerAccepted === true &&
                      selectedApplication.convertedToEmployee === true && (
                      <div className="mt-6 p-6 bg-sky-50 rounded-xl border border-sky-200">
                        <h4 className="text-lg font-semibold text-sky-900 mb-2 flex items-center">
                          <ClipboardCheck className="h-5 w-5 mr-2" />
                          Onboarding – Document upload
                        </h4>
                        <p className="text-sm text-sky-800 mb-4">
                          Welcome! Your employer has started your onboarding. You can complete required documentation, upload identity and employment documents, and review company policies here.
                        </p>
                        <div className="rounded-lg border border-sky-200 bg-white p-4">
                          <p className="text-sm text-gray-600 mb-3">
                            Upload required documents (e.g. ID proof, previous employment letters). Document storage will be available once configured.
                          </p>
                          <label className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-800 rounded-lg cursor-pointer hover:bg-sky-200 text-sm font-medium">
                            <Upload className="h-4 w-4" />
                            Choose files
                            <input type="file" multiple className="sr-only" disabled title="Document upload will be available when storage is configured" />
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            Document upload will be available here once storage is configured. Contact your HR team if you need to submit documents urgently.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedApplication.notes && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start">
                          <MessageSquare className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">Additional Notes</h5>
                            <p className="text-gray-700 text-sm">{selectedApplication.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Application</h3>
                  <p className="text-gray-600">Click on any application from the list to view detailed status and progress.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
