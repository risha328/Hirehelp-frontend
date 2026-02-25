'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import {
  applicationsAPI,
  Application,
  OnboardingDocumentItem,
  OnboardingDocumentType,
  BackgroundVerificationStatus,
} from '../../../api/applications';
import { companiesAPI } from '../../../api/companies';
import Loader from '../../../components/Loader';

const DOCUMENT_TYPE_LABELS: Record<OnboardingDocumentType, string> = {
  GOVERNMENT_ID: 'Government ID',
  ADDRESS_PROOF: 'Address Proof',
  ACADEMIC_CERTIFICATES: 'Academic Certificates',
  RESUME: 'Resume',
  PHOTO: 'Photo',
};

function getPhaseLabel(phase: string | undefined): string {
  if (!phase) return 'Pre-Joining';
  const labels: Record<string, string> = {
    PRE_JOINING: 'Pre-Joining',
    READY_TO_JOIN: 'Ready to Join',
    CONVERTED: 'Converted',
  };
  return labels[phase] || phase;
}

function getPhaseBadgeClass(phase: string | undefined): string {
  if (!phase || phase === 'PRE_JOINING') return 'bg-amber-100 text-amber-800';
  if (phase === 'READY_TO_JOIN') return 'bg-green-100 text-green-800';
  return 'bg-blue-100 text-blue-800';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    NOT_UPLOADED: 'Not Uploaded',
    UPLOADED: 'Uploaded',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  };
  return labels[status] || status.replace(/_/g, ' ');
}

function getStatusBadgeClass(status: string): string {
  if (status === 'APPROVED') return 'bg-green-100 text-green-800';
  if (status === 'REJECTED') return 'bg-red-100 text-red-800';
  if (status === 'UPLOADED' || status === 'UNDER_REVIEW') return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-700';
}

export default function OnboardingDetailPage() {
  const params = useParams();
  const applicationId = params?.applicationId as string;
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<OnboardingDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalDoc, setRejectModalDoc] = useState<OnboardingDocumentItem | null>(null);
  const [bgUpdating, setBgUpdating] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!applicationId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await companiesAPI.getMyCompany();
      const company = (res as { company?: { _id: string } }).company ?? res;
      const companyId = (company as { _id?: string })?._id;
      if (!companyId) {
        setError('No company found.');
        return;
      }
      const [app, docs] = await Promise.all([
        applicationsAPI.getApplicationById(applicationId),
        applicationsAPI.getOnboardingDocuments(applicationId).catch(() => []),
      ]);
      const appCompanyId = app.companyId?._id ?? (app.companyId as unknown as string);
      if (appCompanyId !== companyId) {
        setError('You do not have access to this application.');
        return;
      }
      setApplication(app);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [applicationId]);

  const handleApprove = async (doc: OnboardingDocumentItem) => {
    setReviewingId(doc._id);
    try {
      await applicationsAPI.reviewOnboardingDocument(applicationId, doc._id, 'APPROVED');
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setReviewingId(null);
    }
  };

  const openRejectModal = (doc: OnboardingDocumentItem) => {
    setRejectModalDoc(doc);
    setRejectReason('');
  };

  const handleRejectSubmit = async () => {
    if (!rejectModalDoc) return;
    setReviewingId(rejectModalDoc._id);
    try {
      await applicationsAPI.reviewOnboardingDocument(
        applicationId,
        rejectModalDoc._id,
        'REJECTED',
        rejectReason || undefined,
      );
      setRejectModalDoc(null);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setReviewingId(null);
    }
  };

  const handleBgUpdate = async (status: BackgroundVerificationStatus, failedReason?: string) => {
    setBgUpdating(true);
    try {
      await applicationsAPI.updateBackgroundVerification(applicationId, status, undefined, failedReason);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setBgUpdating(false);
    }
  };

  const handleConvertToEmployee = async () => {
    setConvertLoading(true);
    setConvertError(null);
    try {
      await applicationsAPI.convertToEmployee(applicationId);
      await fetchData();
    } catch (err) {
      setConvertError(err instanceof Error ? err.message : 'Failed to convert');
    } finally {
      setConvertLoading(false);
    }
  };

  const bgStatus = application?.backgroundVerificationStatus || 'NOT_INITIATED';
  const phase = application?.onboardingPhase;
  const joiningDate = application?.joiningDate
    ? new Date(application.joiningDate)
    : application?.offerDetails?.startDate
      ? new Date(application.offerDetails.startDate)
      : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const joiningReached = joiningDate && !isNaN(joiningDate.getTime()) && new Date(joiningDate).setHours(0, 0, 0, 0) <= today.getTime();
  const canConvert = phase === 'READY_TO_JOIN' && joiningReached && !application?.convertedToEmployee;
  const canReview = (status: string) => status === 'UPLOADED' || status === 'UNDER_REVIEW';

  if (loading) {
    return (
      <Loader variant="container" text="Onboarding" subText="Loading..." />
    );
  }

  if (error || !application) {
    return (
      <div className="space-y-4">
        <Link
          href="/companyadmin/onboarding"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Onboarding
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error || 'Application not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/companyadmin/onboarding"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Onboarding</h1>
            <p className="text-sm text-gray-500">
              {application.candidateId?.name} · {application.jobId?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPhaseBadgeClass(phase)}`}>
            {getPhaseLabel(phase)}
          </span>
          <div className="flex items-center gap-2 min-w-[120px]">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-24">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${application.onboardingProgress ?? 0}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{application.onboardingProgress ?? 0}%</span>
          </div>
        </div>
      </div>

      {convertError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {convertError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document checklist
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {application.documentStatus === 'completed' ? 'All documents approved' : 'Review and approve or reject uploaded documents'}
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc._id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{DOCUMENT_TYPE_LABELS[doc.documentType]}</p>
                  <p className="text-sm text-gray-500">{getStatusLabel(doc.status)}</p>
                  {doc.rejectedReason && (
                    <p className="text-xs text-red-600 mt-1">Reason: {doc.rejectedReason}</p>
                  )}
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-indigo-600 hover:underline mt-1"
                    >
                      View file <ExternalLink className="h-3 w-3 ml-0.5" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {canReview(doc.status) && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(doc)}
                        disabled={reviewingId === doc._id}
                        className="inline-flex items-center px-2 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
                      >
                        {reviewingId === doc._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => openRejectModal(doc)}
                        disabled={reviewingId === doc._id}
                        className="inline-flex items-center px-2 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                  {!canReview(doc.status) && (
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass(doc.status)}`}>
                      {getStatusLabel(doc.status)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Background verification
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {bgStatus === 'VERIFIED' && 'Verification completed'}
                {bgStatus === 'FAILED' && 'Verification failed'}
                {bgStatus === 'IN_PROGRESS' && 'Verification in progress'}
                {bgStatus === 'NOT_INITIATED' && 'Start when documents are ready'}
              </p>
            </div>
            <div className="px-6 py-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Status: <span className={bgStatus === 'VERIFIED' ? 'text-green-600' : bgStatus === 'FAILED' ? 'text-red-600' : 'text-gray-900'}>{bgStatus.replace(/_/g, ' ')}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {(bgStatus === 'NOT_INITIATED' || bgStatus === 'pending' || !bgStatus) && (
                  <button
                    type="button"
                    onClick={() => handleBgUpdate('IN_PROGRESS')}
                    disabled={bgUpdating}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 disabled:opacity-50"
                  >
                    {bgUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <ShieldCheck className="h-4 w-4 mr-1" />}
                    Start verification
                  </button>
                )}
                {(bgStatus === 'IN_PROGRESS' || bgStatus === 'NOT_INITIATED') && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleBgUpdate('VERIFIED')}
                      disabled={bgUpdating}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
                    >
                      {bgUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                      Mark verified
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBgUpdate('FAILED')}
                      disabled={bgUpdating}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                    >
                      <ShieldAlert className="h-4 w-4 mr-1" />
                      Mark failed
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {canConvert && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Final step</h3>
              <p className="text-sm text-gray-600 mb-4">
                All documents are approved and background verification is complete. Convert to employee to send the welcome email.
              </p>
              <button
                type="button"
                onClick={handleConvertToEmployee}
                disabled={convertLoading}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60"
              >
                {convertLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Convert to employee
              </button>
            </div>
          )}

          {application.convertedToEmployee && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-3">
              <CheckCircle className="h-10 w-10 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Welcome email sent</p>
                <p className="text-sm text-green-700">This candidate has been converted to an employee.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {rejectModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reject document</h3>
            <p className="text-sm text-gray-600 mb-2">{DOCUMENT_TYPE_LABELS[rejectModalDoc.documentType]}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Document is blurry, wrong type"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setRejectModalDoc(null)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
