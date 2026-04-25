'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlignLeft,
  ClipboardList,
  Clock,
  Layers,
  ListChecks,
  Plus,
  Search,
  Video,
  X,
  Pencil,
  Eye,
} from 'lucide-react';
import { roundsAPI, QuestionBankItem, QuestionBankType, QuestionSet } from '../../api/rounds';

const PAGE_SIZE = 10;

function getVisiblePages(current: number, total: number): (number | '…')[] {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((n, idx) => {
    if (idx > 0 && n - (sorted[idx - 1] as number) > 1) out.push('…');
    out.push(n);
  });
  return out;
}

function formatRelativeTime(iso?: string): string {
  if (!iso) return 'Recently';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 'Recently';
  const diff = Date.now() - t;
  const days = Math.floor(diff / (86400 * 1000));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function typeLabel(t?: QuestionBankType): string {
  if (t === 'video') return 'Video';
  if (t === 'free_text') return 'Free Text';
  return 'MCQ';
}

function QuestionTypeIcon({ type }: { type?: QuestionBankType }) {
  if (type === 'video') return <Video className="h-4 w-4 text-slate-500" />;
  if (type === 'free_text') return <AlignLeft className="h-4 w-4 text-slate-500" />;
  return <ListChecks className="h-4 w-4 text-slate-500" />;
}

type QuestionDraft = {
  questionType: QuestionBankType;
  questionText: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'technical' | 'aptitude' | 'hr';
  durationMinutes: number;
  autoSubmit: boolean;
  randomize: boolean;
  tags: string;
};

const defaultQuestionDraft = (): QuestionDraft => ({
  questionType: 'mcq',
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  difficulty: 'medium',
  category: 'technical',
  durationMinutes: 2,
  autoSubmit: true,
  randomize: false,
  tags: '',
});

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [setName, setSetName] = useState('');
  const [createQuestionOpen, setCreateQuestionOpen] = useState(false);
  const [createSetOpen, setCreateSetOpen] = useState(false);
  const [newSetDifficulty, setNewSetDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [draft, setDraft] = useState<QuestionDraft>(() => defaultQuestionDraft());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bank, sets] = await Promise.all([
        roundsAPI.listQuestionBank({
          search: search.trim() || undefined,
          category: category || undefined,
          difficulty: difficulty || undefined,
          questionType: questionType || undefined,
        }),
        roundsAPI.listQuestionSets(),
      ]);
      setQuestions(bank);
      setQuestionSets(sets);
    } finally {
      setLoading(false);
    }
  }, [search, category, difficulty, questionType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categoryCount = useMemo(() => new Set(questions.map((q) => q.category)).size, [questions]);

  const totalPages = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (pageClamped - 1) * PAGE_SIZE;
    return questions.slice(start, start + PAGE_SIZE);
  }, [questions, pageClamped]);

  useEffect(() => {
    setPage(1);
  }, [search, category, difficulty, questionType]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]));
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setQuestionType('');
    setPage(1);
  };

  const addOption = () => {
    setDraft((p) => ({ ...p, options: [...p.options, ''] }));
  };

  const setOptionAt = (idx: number, value: string) => {
    setDraft((p) => {
      const next = [...p.options];
      next[idx] = value;
      return { ...p, options: next };
    });
  };

  const openEditQuestion = (q: QuestionBankItem) => {
    setEditingId(q._id);
    setDraft({
      questionType: q.questionType || 'mcq',
      questionText: q.questionText,
      options: q.options || ['', '', '', ''],
      correctAnswer: q.correctAnswer || 0,
      difficulty: q.difficulty,
      category: q.category,
      durationMinutes: q.durationMinutes || 2,
      autoSubmit: q.autoSubmit !== false,
      randomize: q.randomizeOptions || false,
      tags: q.tags?.join(', ') || '',
    });
    setCreateQuestionOpen(true);
  };

  const openEditSet = (set: QuestionSet) => {
    setEditingSetId(set._id);
    setSetName(set.name);
    setSelectedIds(set.questionIds || []);
    setNewSetDifficulty(set.difficulty || 'medium');
    setCreateSetOpen(true);
  };

  const handleCreateQuestion = async () => {
    const isMcq = draft.questionType === 'mcq';
    if (!draft.questionText.trim()) return;
    if (isMcq) {
      const filled = draft.options.map((o) => o.trim()).filter(Boolean);
      if (filled.length < 2) return;
    }
    setSaving(true);
    try {
      let opts: string[] = [];
      let correct = 0;
      if (draft.questionType === 'mcq') {
        const pairs = draft.options.map((o, i) => ({ text: o.trim(), slot: i })).filter((p) => p.text);
        opts = pairs.map((p) => p.text);
        const mapped = pairs.findIndex((p) => p.slot === draft.correctAnswer);
        correct = mapped >= 0 ? mapped : 0;
        if (opts.length === 0) correct = 0;
      }
      
      const payload = {
        questionText: draft.questionText.trim(),
        questionType: draft.questionType,
        options: opts,
        correctAnswer: correct,
        difficulty: draft.difficulty,
        category: draft.category,
        tags: draft.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        durationMinutes: draft.durationMinutes,
        autoSubmit: draft.autoSubmit,
        randomizeOptions: draft.randomize,
      };

      if (editingId) {
        await roundsAPI.updateQuestionBankItem(editingId, payload);
      } else {
        await roundsAPI.createQuestionBankItem(payload);
      }

      setDraft(defaultQuestionDraft());
      setEditingId(null);
      setCreateQuestionOpen(false);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSet = async () => {
    if (!setName.trim() || selectedIds.length === 0) return;
    setSaving(true);
    try {
      const dist = { easy: 0, medium: 0, hard: 0 };
      selectedIds.forEach((id) => {
        const q = questions.find((q) => q._id === id);
        if (q && q.difficulty) {
          dist[q.difficulty]++;
        }
      });
      const payload = {
        name: setName.trim(),
        questionIds: selectedIds,
        difficultyDistribution: dist,
        difficulty: newSetDifficulty,
      };
      
      if (editingSetId) {
        await roundsAPI.updateQuestionSet(editingSetId, payload);
      } else {
        await roundsAPI.createQuestionSet(payload);
      }
      
      setSetName('');
      setSelectedIds([]);
      setNewSetDifficulty('medium');
      setEditingSetId(null);
      setCreateSetOpen(false);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const pillCategory = (c: string) => {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide';
    if (c === 'technical') return `${base} bg-blue-100 text-blue-800`;
    if (c === 'hr') return `${base} bg-emerald-100 text-emerald-800`;
    return `${base} bg-amber-100 text-amber-900`;
  };

  const pillDifficulty = (d: string) => {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide';
    if (d === 'hard') return `${base} bg-red-100 text-red-800`;
    if (d === 'medium') return `${base} bg-yellow-100 text-yellow-900`;
    return `${base} bg-green-100 text-green-800`;
  };

  const primaryBtn =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6 pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Question Bank</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Manage and organize your recruitment assessment modules.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap gap-3">
            <button type="button" className={primaryBtn} onClick={() => {
              setEditingId(null);
              setDraft(defaultQuestionDraft());
              setCreateQuestionOpen(true);
            }}>
              <Plus className="h-4 w-4" />
              Create New Question
            </button>
            <button type="button" className={primaryBtn} onClick={() => setCreateSetOpen(true)}>
              <Plus className="h-4 w-4" />
              Create New Question Set
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Questions', value: questions.length, icon: ListChecks },
            { label: 'Categories', value: categoryCount || '—', icon: Layers },
            { label: 'Question Sets', value: questionSets.length, icon: ClipboardList },
          ].map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Filter by keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="technical">Technical</option>
                <option value="hr">HR</option>
                <option value="aptitude">Aptitude</option>
              </select>
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">All Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="mcq">MCQ</option>
                <option value="video">Video Response</option>
                <option value="free_text">Free Text</option>
              </select>
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={fetchData}
              >
                Apply
              </button>
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-800" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Press Apply to run search and filters against the server. Reset clears all filters.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Question Details</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3 text-center">For set</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      Loading questions…
                    </td>
                  </tr>
                ) : pageSlice.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      No questions match your filters.
                    </td>
                  </tr>
                ) : (
                  pageSlice.map((q) => (
                    <tr key={q._id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                            <QuestionTypeIcon type={q.questionType} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 line-clamp-2">{q.questionText}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {typeLabel(q.questionType)} • Updated {formatRelativeTime(q.updatedAt || q.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className={pillCategory(q.category)}>{q.category}</span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className={pillDifficulty(q.difficulty)}>{q.difficulty}</span>
                      </td>
                      <td className="px-4 py-4 align-top text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {q.durationMinutes != null ? `${q.durationMinutes} min` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center align-top">
                        <button
                          type="button"
                          onClick={() => toggleSelect(q._id)}
                          className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                            selectedIds.includes(q._id)
                              ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {selectedIds.includes(q._id) ? 'Selected' : 'Select'}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center align-top">
                        <button
                          type="button"
                          onClick={() => openEditQuestion(q)}
                          className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                          title="Edit Question"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && questions.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600 sm:flex-row">
              <p>
                Showing {(pageClamped - 1) * PAGE_SIZE + 1} to {Math.min(pageClamped * PAGE_SIZE, questions.length)} of{' '}
                {questions.length} questions
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={pageClamped <= 1}
                  className="rounded-md border border-slate-200 px-3 py-1 font-medium hover:bg-slate-50 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                {getVisiblePages(pageClamped, totalPages).map((item, idx) =>
                  item === '…' ? (
                    <span key={`e-${idx}`} className="px-1 text-slate-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      className={`min-w-[2.25rem] rounded-md px-3 py-1 font-medium ${
                        pageClamped === item ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  disabled={pageClamped >= totalPages}
                  className="rounded-md border border-slate-200 px-3 py-1 font-medium hover:bg-slate-50 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-950 p-6 text-white shadow-md">
            <h3 className="text-lg font-semibold">Automate Question Selection</h3>
            <p className="mt-2 text-sm text-blue-100/90">
              Use structured sets and filters to assemble assessments faster. More AI-assisted tooling can plug in here.
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50"
            >
              Try AI Assistant
            </button>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Bulk Import Questions</h3>
            <p className="mt-2 text-sm text-slate-600">
              Prepare questions in Excel or JSON and import in one pass. Download a starter template to match our schema.
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-50"
            >
              Download Template
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-visible">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Created Question Sets</h2>
              <p className="mt-1 text-xs text-slate-500">
                Collections of questions that can be directly assigned to exam rounds.
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="w-full rounded-b-xl pb-12">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Set Name</th>
                  <th className="px-6 py-4">Questions Count</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4 text-center">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questionSets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                      No question sets created yet.
                    </td>
                  </tr>
                ) : (
                  questionSets.map((set) => (
                    <tr key={set._id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {set.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                          {set.questionIds?.length || 0} questions
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        {set.difficulty ? (
                          <span className={pillDifficulty(set.difficulty)}>{set.difficulty}</span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center align-top">
                        <div className="group relative inline-block text-left mr-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <div className="invisible absolute top-full right-0 mt-2 w-72 rounded-lg bg-slate-800 p-3 text-xs text-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 z-50 text-left">
                            <p className="mb-2 font-semibold text-slate-200 border-b border-slate-700 pb-1">Allocated Questions:</p>
                            {set.questionIds && set.questionIds.length > 0 ? (
                              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                {set.questionIds.slice(0, 5).map((qId) => {
                                  const q = questions.find((qt) => qt._id === qId);
                                  return <li key={qId} className="truncate">{q ? q.questionText : 'Unknown question'}</li>;
                                })}
                                {set.questionIds.length > 5 && (
                                  <li className="text-slate-400 italic mt-1 pt-1 border-t border-slate-700 list-none -ml-4 pl-4">
                                    + {set.questionIds.length - 5} more questions...
                                  </li>
                                )}
                              </ul>
                            ) : (
                              <p className="text-slate-400 italic">No questions in this set.</p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => openEditSet(set)}
                          className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                          title="Edit Question Set"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {createQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            aria-label="Close modal"
            onClick={() => setCreateQuestionOpen(false)}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Plus className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Question' : 'Create New Question'}</h2>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setCreateQuestionOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
              <div className="flex-1 space-y-6 overflow-y-auto p-6">
                <section>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question type</p>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {(
                      [
                        { id: 'mcq' as const, label: 'MCQ', icon: ListChecks },
                        { id: 'video' as const, label: 'Video Response', icon: Video },
                        { id: 'free_text' as const, label: 'Free Text', icon: AlignLeft },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDraft((p) => ({ ...p, questionType: opt.id }))}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-left text-sm font-medium transition ${
                          draft.questionType === opt.id
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <opt.icon className="h-4 w-4 shrink-0" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question content</p>
                  <textarea
                    className="mt-2 min-h-[140px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter your question text here... use Markdown for formatting if needed."
                    value={draft.questionText}
                    onChange={(e) => setDraft((p) => ({ ...p, questionText: e.target.value }))}
                  />
                </section>
                {draft.questionType === 'mcq' && (
                  <section>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Options</p>
                      <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-800" onClick={addOption}>
                        + Add Option
                      </button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {draft.options.map((opt, idx) => (
                        <label
                          key={idx}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50/50"
                        >
                          <input
                            type="radio"
                            name="correct-mcq"
                            checked={draft.correctAnswer === idx}
                            onChange={() => setDraft((p) => ({ ...p, correctAnswer: idx }))}
                            className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => setOptionAt(idx, e.target.value)}
                          />
                        </label>
                      ))}
                    </div>
                  </section>
                )}
                {(draft.questionType === 'video' || draft.questionType === 'free_text') && (
                  <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    Video and free-text items are stored in the bank for interviews and future assessments. Internal MCQ exam
                    rounds only load <strong>MCQ</strong> items from a set.
                  </p>
                )}
              </div>
              <aside className="w-full border-t border-slate-100 bg-slate-50/80 p-6 lg:w-72 lg:border-l lg:border-t-0">
                <p className="text-sm font-semibold text-slate-800">Question Config</p>
                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</p>
                    <select
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={draft.category}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          category: e.target.value as 'technical' | 'aptitude' | 'hr',
                        }))
                      }
                    >
                      <option value="technical">Technical</option>
                      <option value="hr">HR</option>
                      <option value="aptitude">Aptitude</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty level</p>
                    <div className="mt-2 flex rounded-lg border border-slate-200 bg-white p-0.5">
                      {(['easy', 'medium', 'hard'] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDraft((p) => ({ ...p, difficulty: d }))}
                          className={`flex-1 rounded-md px-2 py-2 text-xs font-semibold capitalize ${
                            draft.difficulty === d ? 'bg-white text-blue-700 shadow ring-1 ring-blue-200' : 'text-slate-600'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration (min)</p>
                    <div className="relative mt-2">
                      <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        max={480}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={draft.durationMinutes}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, durationMinutes: Math.max(1, Number(e.target.value) || 1) }))
                        }
                      />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Auto-submit</p>
                      <p className="text-xs text-slate-500">Submit when time ends.</p>
                    </div>
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={draft.autoSubmit}
                      onChange={(e) => setDraft((p) => ({ ...p, autoSubmit: e.target.checked }))}
                    />
                  </label>
                  <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Randomize</p>
                      <p className="text-xs text-slate-500">Shuffle MCQ options.</p>
                    </div>
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={draft.randomize}
                      onChange={(e) => setDraft((p) => ({ ...p, randomize: e.target.checked }))}
                    />
                  </label>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tags (optional)</p>
                    <input
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="comma, separated"
                      value={draft.tags}
                      onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))}
                    />
                  </div>
                </div>
              </aside>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                onClick={() => setCreateQuestionOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  saving ||
                  !draft.questionText.trim() ||
                  (draft.questionType === 'mcq' && draft.options.filter((o) => o.trim()).length < 2)
                }
                className={primaryBtn}
                onClick={handleCreateQuestion}
              >
                {editingId ? 'Save Changes' : 'Save Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {createSetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            aria-label="Close modal"
            onClick={() => setCreateSetOpen(false)}
          />
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  {editingSetId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingSetId ? 'Edit Question Set' : 'Create New Question Set'}
                </h2>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setCreateSetOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Set name</p>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Backend screening — Set A"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty level</p>
                <div className="mt-2 flex rounded-lg border border-slate-200 bg-white p-0.5">
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setNewSetDifficulty(d)}
                      className={`flex-1 rounded-md px-2 py-2 text-xs font-semibold capitalize transition-all ${
                        newSetDifficulty === d ? 'bg-white text-blue-700 shadow ring-1 ring-blue-200' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Selected <strong>{selectedIds.length}</strong> question{selectedIds.length === 1 ? '' : 's'}. Choose rows in
                the table, then save.
              </p>
              {questionSets.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Existing sets</p>
                  <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-sm text-slate-700">
                    {questionSets.map((s) => (
                      <li key={s._id} className="rounded-md bg-slate-50 px-3 py-2">
                        {s.name}{' '}
                        <span className="text-slate-500">({s.questionIds?.length ?? 0} questions)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                onClick={() => setCreateSetOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || !setName.trim() || selectedIds.length === 0}
                className={primaryBtn}
                onClick={handleCreateSet}
              >
                {editingSetId ? 'Save Changes' : 'Save Question Set'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
