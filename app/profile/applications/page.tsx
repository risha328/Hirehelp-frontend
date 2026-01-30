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
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { applicationsAPI, Application } from '../../api/applications';

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
  }
};

const statusOrder = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'HIRED', 'REJECTED'];

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const apps = await applicationsAPI.getApplicationsByCandidate();
      setApplications(apps);
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Profile
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600 mt-1">Track your job application progress</p>
            </div>
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
                        className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedApplication?._id === application._id ? 'bg-indigo-50 border-r-4 border-indigo-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                <img
                                  src={application.jobId.companyId.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(application.jobId.companyId.name)}&backgroundColor=6366f1`}
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
                            src={selectedApplication.jobId.companyId.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedApplication.jobId.companyId.name)}&backgroundColor=6366f1`}
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
                                <div className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                                  step.isCurrent
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
                                  <div className={`text-sm font-medium ${
                                    step.isCurrent ? 'text-indigo-600' : step.isCompleted ? 'text-gray-900' : 'text-gray-500'
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
                    <div className={`p-4 rounded-lg border ${
                      selectedApplication.status === 'HIRED'
                        ? 'bg-emerald-50 border-emerald-200'
                        : selectedApplication.status === 'REJECTED'
                        ? 'bg-red-50 border-red-200'
                        : selectedApplication.status === 'SHORTLISTED'
                        ? 'bg-purple-50 border-purple-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start">
                        <div className={`p-1 rounded-full mr-3 ${
                          selectedApplication.status === 'HIRED'
                            ? 'bg-emerald-100'
                            : selectedApplication.status === 'REJECTED'
                            ? 'bg-red-100'
                            : selectedApplication.status === 'SHORTLISTED'
                            ? 'bg-purple-100'
                            : 'bg-blue-100'
                        }`}>
                          {React.createElement(statusConfig[selectedApplication.status as keyof typeof statusConfig].icon, {
                            className: `h-4 w-4 ${
                              selectedApplication.status === 'HIRED'
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
                          <h4 className={`font-semibold ${
                            selectedApplication.status === 'HIRED'
                              ? 'text-emerald-800'
                              : selectedApplication.status === 'REJECTED'
                              ? 'text-red-800'
                              : selectedApplication.status === 'SHORTLISTED'
                              ? 'text-purple-800'
                              : 'text-blue-800'
                          }`}>
                            {statusConfig[selectedApplication.status as keyof typeof statusConfig].label}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            selectedApplication.status === 'HIRED'
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
