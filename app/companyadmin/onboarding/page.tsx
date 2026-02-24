'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Briefcase, Calendar, Eye, ClipboardCheck, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { applicationsAPI, Application } from '../../api/applications';
import { companiesAPI } from '../../api/companies';
import Loader from '../../components/Loader';

function getJoiningDate(app: Application): Date | null {
  if (app.joiningDate) {
    const d = new Date(app.joiningDate);
    return isNaN(d.getTime()) ? null : d;
  }
  if (app.offerDetails?.startDate) {
    const d = new Date(app.offerDetails.startDate);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function isJoiningDateReached(app: Application): boolean {
  const join = getJoiningDate(app);
  if (!join) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const joinDay = new Date(join);
  joinDay.setHours(0, 0, 0, 0);
  return joinDay <= today;
}

export default function OnboardingPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [convertError, setConvertError] = useState<string | null>(null);

  useEffect(() => {
    fetchOnboardingList();
  }, []);

  const fetchOnboardingList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await companiesAPI.getMyCompany();
      const company = (response as any).company ?? response;
      if (!company?._id) {
        setError('No company found. Please set up your company profile.');
        setLoading(false);
        return;
      }
      const all = await applicationsAPI.getApplicationsByCompany(company._id);
      const accepted = all.filter(
        (a) => a.status === 'HIRED' && a.offerAccepted === true
      );
      accepted.sort((a, b) => {
        const dateA = a.offerAcceptedAt ? new Date(a.offerAcceptedAt).getTime() : 0;
        const dateB = b.offerAcceptedAt ? new Date(b.offerAcceptedAt).getTime() : 0;
        return dateB - dateA;
      });
      setApplications(accepted);
    } catch (err) {
      console.error('Failed to fetch onboarding list:', err);
      setError('Failed to load onboarding list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(undefined, { dateStyle: 'medium' });
  };

  const handleConvertToEmployee = async (applicationId: string) => {
    setConvertingId(applicationId);
    setConvertError(null);
    try {
      await applicationsAPI.convertToEmployee(applicationId);
      await fetchOnboardingList();
    } catch (err) {
      setConvertError(err instanceof Error ? err.message : 'Failed to convert to employee');
    } finally {
      setConvertingId(null);
    }
  };

  if (loading) {
    return (
      <Loader
        variant="container"
        text="Onboarding"
        subText="Loading candidates who accepted offers..."
      />
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Onboarding</h1>
        <p className="mt-1 text-sm text-gray-500">
          Candidates who have accepted your offer. Use this list to manage onboarding and next steps.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardCheck className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No one to onboard yet</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            When candidates accept your offer letter, they will appear here. Send offers from the Applications board (Hired column).
          </p>
          <Link
            href="/companyadmin/applications"
            className="inline-flex items-center mt-6 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            Go to Applications
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {convertError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {convertError}
            </div>
          )}
          <div className="text-sm text-gray-600">
            {applications.length} candidate{applications.length !== 1 ? 's' : ''} accepted offer
          </div>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joining Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer Acceptance Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Onboarding Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Background Verification
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => {
                    const joiningDate = getJoiningDate(app);
                    const joiningReached = isJoiningDateReached(app);
                    const converted = app.convertedToEmployee === true;
                    return (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {app.candidateId.name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                {app.candidateId.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            {app.jobId.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {joiningDate ? joiningDate.toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(app.offerAcceptedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {app.onboardingProgress ?? 0}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${app.documentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {app.documentStatus === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {app.backgroundVerificationStatus || 'Pending'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/companyadmin/candidates/${app.candidateId._id}`}
                              className="inline-flex items-center justify-center p-1.5 rounded-lg text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 cursor-pointer"
                              title="View profile"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            {converted ? (
                              <span className="inline-flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Welcome email sent
                              </span>
                            ) : joiningReached ? (
                              <button
                                type="button"
                                onClick={() => handleConvertToEmployee(app._id)}
                                disabled={convertingId === app._id}
                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {convertingId === app._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : null}
                                Convert to Employee
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">After joining date</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
