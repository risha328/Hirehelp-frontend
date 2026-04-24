'use client';

import { useEffect, useMemo, useState } from 'react';
import { roundsAPI, QuestionBankItem, QuestionSet } from '../../api/rounds';

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [setName, setSetName] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    category: 'technical' as 'technical' | 'aptitude',
    tags: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bank, sets] = await Promise.all([
        roundsAPI.listQuestionBank({ search, category, difficulty }),
        roundsAPI.listQuestionSets(),
      ]);
      setQuestions(bank);
      setQuestionSets(sets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => questions, [questions]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]));
  };

  const handleCreateQuestion = async () => {
    setSaving(true);
    try {
      await roundsAPI.createQuestionBankItem({
        questionText: newQuestion.questionText,
        options: newQuestion.options,
        correctAnswer: Number(newQuestion.correctAnswer),
        difficulty: newQuestion.difficulty,
        category: newQuestion.category,
        tags: newQuestion.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setNewQuestion({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'easy',
        category: 'technical',
        tags: '',
      });
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSet = async () => {
    if (!setName.trim() || selectedIds.length === 0) return;
    setSaving(true);
    try {
      await roundsAPI.createQuestionSet({
        name: setName.trim(),
        questionIds: selectedIds,
      });
      setSetName('');
      setSelectedIds([]);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">Question Bank</h1>
          <p className="mt-1 text-sm font-medium text-slate-700">Create and filter technical/aptitude MCQs, then build reusable question sets.</p>
        </div>

        <div className="grid gap-4 rounded-xl border border-slate-300 bg-white p-4 shadow-sm md:grid-cols-4">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-500" placeholder="Search question text" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            <option value="technical">Technical</option>
            <option value="aptitude">Aptitude</option>
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={fetchData}>
            Apply Filters
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Create Question</h2>
            <div className="mt-3 space-y-3">
              <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-500" rows={3} placeholder="Question text" value={newQuestion.questionText} onChange={(e) => setNewQuestion((p) => ({ ...p, questionText: e.target.value }))} />
              {newQuestion.options.map((opt, idx) => (
                <input
                  key={idx}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-500"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => setNewQuestion((p) => {
                    const next = [...p.options];
                    next[idx] = e.target.value;
                    return { ...p, options: next };
                  })}
                />
              ))}
              <div className="grid grid-cols-3 gap-3">
                <select className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900" value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion((p) => ({ ...p, correctAnswer: Number(e.target.value) }))}>
                  <option value={0}>Correct: Option 1</option>
                  <option value={1}>Correct: Option 2</option>
                  <option value={2}>Correct: Option 3</option>
                  <option value={3}>Correct: Option 4</option>
                </select>
                <select className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900" value={newQuestion.difficulty} onChange={(e) => setNewQuestion((p) => ({ ...p, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900" value={newQuestion.category} onChange={(e) => setNewQuestion((p) => ({ ...p, category: e.target.value as 'technical' | 'aptitude' }))}>
                  <option value="technical">Technical</option>
                  <option value="aptitude">Aptitude</option>
                </select>
              </div>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-500" placeholder="Tags (comma separated)" value={newQuestion.tags} onChange={(e) => setNewQuestion((p) => ({ ...p, tags: e.target.value }))} />
              <button disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50" onClick={handleCreateQuestion}>
                Add to Bank
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Create Question Set</h2>
            <div className="mt-3 flex gap-2">
              <input className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-500" placeholder="Set name" value={setName} onChange={(e) => setSetName(e.target.value)} />
              <button disabled={saving || selectedIds.length === 0} className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50" onClick={handleCreateSet}>
                Create Set
              </button>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-700">Bulk selected: {selectedIds.length} questions</p>
            <div className="mt-4 space-y-2">
              {questionSets.map((set) => (
                <div key={set._id} className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
                  {set.name} ({set.questionIds.length} questions)
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Question List</h2>
          {loading ? (
            <p className="mt-3 text-sm font-medium text-slate-600">Loading questions...</p>
          ) : (
            <div className="mt-3 space-y-3">
              {filtered.map((q) => (
                <div key={q._id} className="rounded-lg border border-slate-300 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{q.questionText}</p>
                      <p className="mt-1 text-xs font-medium text-slate-700">{q.category} • {q.difficulty} • {q.tags?.join(', ')}</p>
                    </div>
                    <button className={`rounded-md px-2 py-1 text-xs ${selectedIds.includes(q._id) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`} onClick={() => toggleSelect(q._id)}>
                      {selectedIds.includes(q._id) ? 'Added' : 'Add to Set'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
