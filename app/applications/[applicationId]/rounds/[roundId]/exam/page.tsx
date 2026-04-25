'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { roundsAPI, ExamSessionPayload } from '../../../../../api/rounds';

export default function CandidateExamPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.applicationId as string;
  const roundId = params.roundId as string;

  const [session, setSession] = useState<ExamSessionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flaggedIndexes, setFlaggedIndexes] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('');
  const [now, setNow] = useState(Date.now());
  const persistedStatusKey = `examSubmitted:${roundId}:${applicationId}`;

  const fetchSession = async () => {
    setLoading(true);
    try {
      const started = await roundsAPI.startExam(roundId, applicationId);
      setSession(started);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Unable to start exam');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [roundId, applicationId]);

  const remainingMs = useMemo(() => {
    if (!session) return 0;
    return Math.max(0, new Date(session.endTime).getTime() - now);
  }, [session, now]);

  useEffect(() => {
    if (!session || !session.autoSubmit) return;
    if (remainingMs <= 0 && !submitting) {
      void handleSubmit(true);
    }
  }, [remainingMs, session, submitting]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateAnswer = async (answer: number) => {
    if (!session) return;
    const nextAnswers = [...session.answers];
    nextAnswers[activeIndex] = answer;
    setSession({ ...session, answers: nextAnswers });
    await roundsAPI.saveExamAnswer(roundId, applicationId, activeIndex, answer).catch(() => undefined);
  };

  const handleSubmit = async (auto = false) => {
    setSubmitting(true);
    try {
      const result = await roundsAPI.submitExam(roundId, applicationId);
      try {
        localStorage.setItem(
          persistedStatusKey,
          JSON.stringify({
            submitted: true,
            score: result.score,
            submittedAt: new Date().toISOString(),
          }),
        );
      } catch {
        // ignore localStorage failures
      }
      const scoreDisplay = result.correctAnswersCount !== undefined && result.totalQuestions !== undefined
        ? `${result.correctAnswersCount} out of ${result.totalQuestions} (${result.score.toFixed(2)}%)`
        : `${result.score.toFixed(2)}%`;
      setMessage(`Submitted. Score: ${scoreDisplay}. Result: ${result.passed ? 'Passed' : 'Failed'}.`);
      if (!auto) {
        setTimeout(() => router.push('/applications'), 1200);
      }
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleFlag = () => {
    setFlaggedIndexes((prev) =>
      prev.includes(activeIndex) ? prev.filter((idx) => idx !== activeIndex) : [...prev, activeIndex],
    );
  };

  if (loading) {
    return <div className="p-8 text-sm text-gray-600">Loading exam...</div>;
  }
  if (!session) {
    return <div className="p-8 text-sm text-red-600">{message || 'Exam unavailable'}</div>;
  }

  const question = session.questions[activeIndex];
  const totalQuestions = session.questions.length;
  const answeredCount = session.answers.filter((ans) => ans !== null && ans !== undefined && ans >= 0).length;
  const isCurrentFlagged = flaggedIndexes.includes(activeIndex);

  return (
    <div className="min-h-screen bg-[#f3f5fa] text-gray-900">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3">
          <h1 className="text-lg font-bold text-gray-900">HireHelp Exam</h1>
          <div className="hidden items-center gap-8 md:flex">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">Time Remaining</p>
              <p className={`text-3xl font-bold ${remainingMs < 5 * 60 * 1000 ? 'text-red-600' : 'text-blue-700'}`}>
                {formatTime(remainingMs)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">Progress</p>
              <p className="text-sm font-semibold text-gray-800">
                Question {activeIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>
          <button
            onClick={() => void handleSubmit(false)}
            disabled={submitting}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-5 px-5 py-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Question {activeIndex + 1}
              </span>
              <span className="text-sm text-gray-600">Single Choice</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold leading-tight text-gray-900">{question.questionText}</h2>

          <div className="mt-6 space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = session.answers[activeIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => void updateAnswer(idx)}
                  className={`flex w-full items-start gap-4 rounded-xl border p-5 text-left transition ${
                    isSelected
                      ? 'border-blue-700 bg-blue-50 ring-1 ring-blue-600'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-block h-5 w-5 rounded-full border-2 ${
                      isSelected ? 'border-blue-700' : 'border-gray-300'
                    }`}
                  />
                  <div>
                    <p className={`font-semibold ${isSelected ? 'text-blue-800' : 'text-gray-900'}`}>
                      {option}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-3">
              <button
                onClick={toggleFlag}
                className={`rounded-md border px-5 py-2 text-sm font-semibold ${
                  isCurrentFlagged
                    ? 'border-orange-300 bg-orange-50 text-orange-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isCurrentFlagged ? 'Unmark Review' : 'Mark for Review'}
              </button>
              <button
                onClick={() => setActiveIndex((i) => Math.min(totalQuestions - 1, i + 1))}
                disabled={activeIndex === totalQuestions - 1}
                className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next Question
              </button>
            </div>
          </div>

          {message && (
            <p className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">
              {message}
            </p>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Question Navigator</h3>
              <span className="text-sm text-gray-500">
                {answeredCount} / {totalQuestions} Answered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {session.questions.map((_, idx) => {
                const isActive = idx === activeIndex;
                const isAnswered = session.answers[idx] !== null && session.answers[idx] !== undefined && session.answers[idx] >= 0;
                const isFlagged = flaggedIndexes.includes(idx);

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative h-12 rounded-md border text-sm font-semibold transition ${
                      isActive
                        ? 'border-blue-700 bg-blue-700 text-white'
                        : isAnswered
                        ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-blue-100" />
                Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full border border-blue-700 bg-white" />
                Current
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-red-600" />
                Flagged
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full border border-gray-300 bg-white" />
                Unanswered
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 shadow-sm">
            <p className="font-semibold">Candidate Tip</p>
            <p className="mt-1 leading-relaxed">
              If you are unsure, mark for review and return later. Your answer progress is saved automatically.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
