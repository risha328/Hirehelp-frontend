'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ClipboardCheck, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { applicationsAPI, Application } from '../../api/applications';
import { roundsAPI, Round, McqSubmissionStatus } from '../../api/rounds';

type ExamCard = {
  applicationId: string;
  roundId: string;
  jobTitle: string;
  companyName: string;
  applicationStatus: Application['status'];
  roundName: string;
  mode: 'INTERNAL' | 'EXTERNAL';
  externalLink?: string;
  durationMinutes?: number;
};

type ExamStatusByExam = Record<string, McqSubmissionStatus>;
type ExamStatusLoadingByExam = Record<string, boolean>;
type ExamSessionLike = { status?: string; score?: number } | null;
type PersistedExamStatus = { submitted: boolean; score?: number; submittedAt?: string };

export default function CandidateExamsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [roundDetailsById, setRoundDetailsById] = useState<Record<string, Round>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [examStatusByExam, setExamStatusByExam] = useState<ExamStatusByExam>({});
  const [examStatusLoadingByExam, setExamStatusLoadingByExam] = useState<ExamStatusLoadingByExam>({});

  const getExamStatusKey = (roundId: string, applicationId: string) => `${roundId}:${applicationId}`;
  const getPersistedStatusKey = (roundId: string, applicationId: string) => `examSubmitted:${roundId}:${applicationId}`;

  const isSubmittedSessionStatus = (session: ExamSessionLike) => {
    const status = String(session?.status || '').toLowerCase();
    return status === 'submitted' || status === 'timeout_submitted';
  };

  const getPersistedExamStatus = (roundId: string, applicationId: string): PersistedExamStatus | null => {
    try {
      const raw = localStorage.getItem(getPersistedStatusKey(roundId, applicationId));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedExamStatus;
      return parsed && parsed.submitted ? parsed : null;
    } catch {
      return null;
    }
  };

  const fetchApplications = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await applicationsAPI.getApplicationsByCandidate();
      setApplications(data);
      setLastUpdatedAt(new Date());
    } catch (err) {
      console.error('Failed to load candidate exams:', err);
      setError('Unable to load your exam list. Please try again.');
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void fetchApplications(false);

    const interval = setInterval(() => {
      void fetchApplications(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const roundIds = Array.from(
      new Set(
        applications
          .map((app) => (typeof app.currentRound === 'string' ? app.currentRound : null))
          .filter((id): id is string => Boolean(id)),
      ),
    );

    if (roundIds.length === 0) return;

    const missingRoundIds = roundIds.filter((id) => !roundDetailsById[id]);
    if (missingRoundIds.length === 0) return;

    const fetchRoundDetails = async () => {
      const results = await Promise.all(
        missingRoundIds.map(async (id) => {
          try {
            const round = await roundsAPI.getRoundById(id);
            return { id, round };
          } catch {
            return null;
          }
        }),
      );

      const next: Record<string, Round> = {};
      results.forEach((item) => {
        if (item?.round) next[item.id] = item.round;
      });

      if (Object.keys(next).length > 0) {
        setRoundDetailsById((prev) => ({ ...prev, ...next }));
      }
    };

    void fetchRoundDetails();
  }, [applications, roundDetailsById]);

  const exams = useMemo<ExamCard[]>(() => {
    return applications.reduce<ExamCard[]>((acc, app) => {
        const round =
          app.currentRound && typeof app.currentRound === 'object'
            ? app.currentRound
            : typeof app.currentRound === 'string'
            ? roundDetailsById[app.currentRound]
            : null;

        if (!round || String(round.type || '').toLowerCase() !== 'mcq' || !round._id) return acc;
        acc.push({
          applicationId: app._id,
          roundId: round._id,
          jobTitle: app.jobId?.title || 'Untitled Role',
          companyName: app.jobId?.companyId?.name || app.companyId?.name || 'Unknown Company',
          applicationStatus: app.status,
          roundName: round.name || 'MCQ Round',
          mode: round.mode === 'EXTERNAL' ? 'EXTERNAL' : 'INTERNAL',
          externalLink: round.externalLink || undefined,
          durationMinutes: round.durationMinutes,
        });
        return acc;
      }, []);
  }, [applications, roundDetailsById]);

  useEffect(() => {
    if (exams.length === 0) return;

    const loadStatuses = async () => {
      const pending: ExamStatusLoadingByExam = {};
      exams.forEach((exam) => {
        pending[getExamStatusKey(exam.roundId, exam.applicationId)] = true;
      });
      setExamStatusLoadingByExam((prev) => ({ ...prev, ...pending }));

      const statuses = await Promise.all(
        exams.map(async (exam) => {
          try {
            const persistedStatus = getPersistedExamStatus(exam.roundId, exam.applicationId);
            if (persistedStatus?.submitted) {
              return [
                getExamStatusKey(exam.roundId, exam.applicationId),
                { submitted: true, score: persistedStatus.score },
              ] as const;
            }

            if (exam.mode === 'INTERNAL') {
              let session: ExamSessionLike = null;
              try {
                session = (await roundsAPI.getExamSession(exam.roundId, exam.applicationId)) as ExamSessionLike;
              } catch {
                session = null;
              }

              let mcqStatus: McqSubmissionStatus = { submitted: false };
              try {
                mcqStatus = await roundsAPI.getMcqStatus(exam.roundId, exam.applicationId);
              } catch {
                mcqStatus = { submitted: false };
              }

              const submittedFromSession = isSubmittedSessionStatus(session);
              const submitted = submittedFromSession || Boolean(mcqStatus.submitted);

              return [
                getExamStatusKey(exam.roundId, exam.applicationId),
                {
                  submitted,
                  score:
                    typeof session?.score === 'number'
                      ? session.score
                      : typeof mcqStatus.score === 'number'
                      ? mcqStatus.score
                      : undefined,
                },
              ] as const;
            }

            const status = await roundsAPI.getMcqStatus(exam.roundId, exam.applicationId);
            return [getExamStatusKey(exam.roundId, exam.applicationId), status] as const;
          } catch {
            return [getExamStatusKey(exam.roundId, exam.applicationId), { submitted: false }] as const;
          }
        }),
      );

      setExamStatusByExam((prev) => {
        const next = { ...prev };
        statuses.forEach(([examKey, status]) => {
          next[examKey] = status;
        });
        return next;
      });

      setExamStatusLoadingByExam((prev) => {
        const next = { ...prev };
        exams.forEach((exam) => {
          next[getExamStatusKey(exam.roundId, exam.applicationId)] = false;
        });
        return next;
      });
    };

    void loadStatuses();
  }, [exams]);

  const completedCount = useMemo(
    () =>
      exams.filter((exam) => examStatusByExam[getExamStatusKey(exam.roundId, exam.applicationId)]?.submitted).length,
    [exams, examStatusByExam],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-100 to-white pt-16 lg:pt-20">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-3 text-sm text-gray-600">Loading your exams...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-100 to-white pt-16 lg:pt-20">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-100 to-white pt-16 lg:pt-20">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
            <p className="mt-2 text-gray-600">All your available MCQ rounds in one place.</p>
            {lastUpdatedAt && (
              <p className="mt-1 text-xs text-gray-500">
                Last updated: {lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void fetchApplications(true)}
              disabled={refreshing}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </button>
          </div>
        </div>

        {completedCount > 0 && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              Congratulations! You have completed {completedCount} exam{completedCount > 1 ? 's' : ''}. Completed tests are locked.
            </p>
          </div>
        )}

        {exams.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <ClipboardCheck className="mx-auto h-10 w-10 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No active MCQ exams found</h2>
            <p className="mt-2 text-sm text-gray-600">
              Once your application reaches an MCQ round, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {exams.map((exam) => {
              const examKey = getExamStatusKey(exam.roundId, exam.applicationId);
              const examStatus = examStatusByExam[examKey];
              const isSubmitted = Boolean(examStatus?.submitted);
              const isCheckingStatus = Boolean(examStatusLoadingByExam[examKey]);

              return (
              <div key={`${exam.applicationId}-${exam.roundId}`} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">MCQ</span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                    {exam.applicationStatus.replaceAll('_', ' ')}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">{exam.jobTitle}</h3>
                <p className="mt-1 text-sm text-gray-600">{exam.companyName}</p>
                <p className="mt-2 text-sm text-gray-700">Round: {exam.roundName}</p>
                {typeof exam.durationMinutes === 'number' && (
                  <p className="mt-1 text-sm text-gray-600">Duration: {exam.durationMinutes} mins</p>
                )}

                {isSubmitted && (
                  <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <p className="text-sm font-semibold text-green-800">Congratulations! Exam already completed.</p>
                    <p className="mt-1 text-xs text-green-700">
                      {typeof examStatus?.score === 'number'
                        ? `Auto-evaluated score: ${examStatus.score.toFixed(2)}%`
                        : 'Your submission is stored successfully.'}
                    </p>
                  </div>
                )}

                <div className="mt-5">
                  {exam.mode === 'EXTERNAL' ? (
                    (isSubmitted || isCheckingStatus) ? (
                      <button
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500"
                      >
                        {isSubmitted ? 'Test Completed' : 'Checking Status...'}
                      </button>
                    ) : (
                    <a
                      href={exam.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open External Test
                    </a>
                    )
                  ) : (
                    <button
                      disabled={isSubmitted || isCheckingStatus}
                      onClick={() => router.push(`/applications/${exam.applicationId}/rounds/${exam.roundId}/exam`)}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      {isSubmitted ? 'Test Completed' : isCheckingStatus ? 'Checking Status...' : 'Start Test'}
                    </button>
                  )}
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
