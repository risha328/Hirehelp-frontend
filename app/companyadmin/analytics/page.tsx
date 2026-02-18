'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  FileText,
  Users,
  UserCheck,
  Award,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Target,
  Zap,
  PieChart,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { applicationsAPI, Application } from '../../api/applications';
import { companiesAPI } from '../../api/companies';
import { roundsAPI, Round, RoundEvaluation } from '../../api/rounds';
import Loader from '../../components/Loader';

// --- Data types for computed analytics ---
interface SummaryCards {
  totalApplications: number;
  candidatesInInterview: number;
  offersReleased: number;
  hiresCompleted: number;
}

interface FunnelStage {
  name: string;
  count: number;
  dropOffRate: number;
  conversionFromPrev: number;
  avgDaysInStage: number;
}

interface PipelineHealth {
  stuckOver7Days: number;
  overdueInterviews: number;
  pendingFeedbackCount: number;
}

interface TopJobInsight {
  mostApplied: { title: string; count: number };
  fastestClosed: { title: string; days: number };
  hardestToFill: { title: string; days: number };
}

export default function CompanyAnalyticsPage() {
  const [company, setCompany] = useState<{ _id: string; name: string } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [allRounds, setAllRounds] = useState<Round[]>([]);
  const [evaluations, setEvaluations] = useState<RoundEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyRes = await companiesAPI.getMyCompany();
        const companyData = (companyRes as any).company ?? companyRes;
        setCompany(companyData);
        const companyId = companyData._id;

        const [apps, jobsList] = await Promise.all([
          applicationsAPI.getApplicationsByCompany(companyId),
          (await import('../../api/companies')).jobsAPI.getJobsByCompany(companyId),
        ]);
        setApplications(apps);
        setJobs(jobsList);

        const roundPromises = jobsList.map((j: any) =>
          roundsAPI.getRoundsByJob(j._id).catch(() => [])
        );
        const roundsPerJob = await Promise.all(roundPromises);
        const flatRounds = roundsPerJob.flat();
        setAllRounds(flatRounds);

        if (apps.length > 0) {
          const appIds = apps.map((a) => a._id);
          const evals = await roundsAPI.getEvaluationsByApplications(appIds);
          setEvaluations(evals);
        }
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const summaryCards = useMemo((): SummaryCards => {
    const inInterview = applications.filter((a) => a.status === 'UNDER_REVIEW').length;
    const offers = applications.filter((a) => a.status === 'SHORTLISTED').length;
    const hires = applications.filter((a) => a.status === 'HIRED').length;
    return {
      totalApplications: applications.length,
      candidatesInInterview: inInterview,
      offersReleased: offers,
      hiresCompleted: hires,
    };
  }, [applications]);

  const funnelStages = useMemo((): FunnelStage[] => {
    const total = applications.length;
    if (total === 0) {
      return [
        { name: 'Applications', count: 0, dropOffRate: 0, conversionFromPrev: 100, avgDaysInStage: 0 },
        { name: 'Coding', count: 0, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
        { name: 'Technical', count: 0, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
        { name: 'HR', count: 0, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
        { name: 'Offer', count: 0, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
        { name: 'Hired', count: 0, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
      ];
    }
    const applied = applications.filter((a) => a.status === 'APPLIED').length;
    const underReview = applications.filter((a) => a.status === 'UNDER_REVIEW');
    const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
    const hired = applications.filter((a) => a.status === 'HIRED').length;

    const roundTypeMap: Record<string, number> = { coding: 0, technical: 0, hr: 0 };
    underReview.forEach((a) => {
      const round = a.currentRound as any;
      if (round && typeof round === 'object' && round.type) {
        const t = (round.type || '').toLowerCase();
        if (t === 'coding') roundTypeMap.coding++;
        else if (t === 'technical') roundTypeMap.technical++;
        else if (t === 'hr') roundTypeMap.hr++;
      }
    });

    const stages: FunnelStage[] = [
      { name: 'Applications', count: total, dropOffRate: 0, conversionFromPrev: 100, avgDaysInStage: 0 },
      { name: 'Coding', count: roundTypeMap.coding || underReview.length, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
      { name: 'Technical', count: roundTypeMap.technical, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
      { name: 'HR', count: roundTypeMap.hr, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
      { name: 'Offer', count: shortlisted, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
      { name: 'Hired', count: hired, dropOffRate: 0, conversionFromPrev: 0, avgDaysInStage: 0 },
    ];

    let prev = total;
    stages.forEach((s, i) => {
      if (i > 0) s.conversionFromPrev = prev > 0 ? Math.round((s.count / prev) * 100) : 0;
      s.dropOffRate = prev > 0 ? Math.round(((prev - s.count) / prev) * 100) : 0;
      prev = s.count;
    });

    const roundIdsByType: Record<string, string[]> = { coding: [], technical: [], hr: [] };
    allRounds.forEach((r) => {
      const t = (r.type || '').toLowerCase();
      if (t in roundIdsByType) roundIdsByType[t].push(r._id);
    });
    const completedEvals = evaluations.filter(
      (e) => e.status === 'completed' || e.status === 'passed' || e.status === 'failed'
    );
    completedEvals.forEach((e) => {
      const rid = typeof e.roundId === 'object' ? (e.roundId as any)._id : e.roundId;
      const scheduled = e.scheduledAt ? new Date(e.scheduledAt).getTime() : 0;
      const completed = e.completedAt ? new Date(e.completedAt).getTime() : 0;
      if (completed && scheduled) {
        const days = (completed - scheduled) / (1000 * 60 * 60 * 24);
        const stage = stages.find((s) => s.name !== 'Applications' && s.name !== 'Offer' && s.name !== 'Hired');
        if (stage) stage.avgDaysInStage = Math.round((stage.avgDaysInStage + days) * 10) / 10;
      }
    });
    const stageWithTime = stages.filter((s) => s.name === 'Coding' || s.name === 'Technical' || s.name === 'HR');
    if (stageWithTime.length && completedEvals.length) {
      const avgAll = completedEvals.reduce((acc, e) => {
        const s = e.scheduledAt ? new Date(e.scheduledAt).getTime() : 0;
        const c = e.completedAt ? new Date(e.completedAt).getTime() : 0;
        return acc + (c && s ? (c - s) / (1000 * 60 * 60 * 24) : 0);
      }, 0) / completedEvals.length;
      stageWithTime.forEach((s) => { s.avgDaysInStage = Math.round(avgAll * 10) / 10; });
    }
    return stages;
  }, [applications, allRounds, evaluations]);

  const applicationTrendsWeekly = useMemo(() => {
    const now = new Date();
    const twelveWeeksAgo = new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000);
    const byWeek: Record<string, number> = {};
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(twelveWeeksAgo);
      weekStart.setDate(weekStart.getDate() + i * 7);
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString().slice(0, 10);
      byWeek[key] = 0;
    }
    applications.forEach((a) => {
      const d = new Date(a.createdAt);
      if (d < twelveWeeksAgo) return;
      const weekStart = new Date(d);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString().slice(0, 10);
      if (byWeek[key] !== undefined) byWeek[key]++;
    });
    return Object.entries(byWeek)
      .map(([week, count]) => ({ week: week.slice(5), count }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }, [applications]);

  const jobWiseApplications = useMemo(() => {
    const map: Record<string, number> = {};
    applications.forEach((a) => {
      const title = a.jobId?.title ?? 'Unknown';
      map[title] = (map[title] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name: name.length > 18 ? name.slice(0, 18) + '…' : name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [applications]);

  const pipelineHealth = useMemo((): PipelineHealth => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const stuck = applications.filter(
      (a) =>
        (a.status === 'UNDER_REVIEW' || a.status === 'APPLIED') &&
        new Date(a.updatedAt) < sevenDaysAgo
    ).length;
    const now = new Date().getTime();
    const overdue = evaluations.filter((e) => {
      if (!e.scheduledAt || e.status === 'completed' || e.status === 'passed' || e.status === 'failed') return false;
      return new Date(e.scheduledAt).getTime() < now;
    }).length;
    const pending = evaluations.filter((e) =>
      e.status === 'pending' || e.status === 'in_progress'
    ).length;
    return { stuckOver7Days: stuck, overdueInterviews: overdue, pendingFeedbackCount: pending };
  }, [applications, evaluations]);

  const topJobInsights = useMemo((): TopJobInsight => {
    const byJob: Record<string, { title: string; applications: number; hired: Application[] }> = {};
    applications.forEach((a) => {
      const id = a.jobId._id;
      const title = a.jobId?.title ?? 'Unknown';
      if (!byJob[id]) byJob[id] = { title, applications: 0, hired: [] };
      byJob[id].applications++;
      if (a.status === 'HIRED') byJob[id].hired.push(a);
    });
    const entries = Object.entries(byJob);
    const mostApplied = entries.sort((a, b) => b[1].applications - a[1].applications)[0];
    const jobCreated: Record<string, number> = {};
    jobs.forEach((j) => { jobCreated[j._id] = new Date(j.createdAt).getTime(); });
    const fastest = entries
      .filter(([, v]) => v.hired.length > 0)
      .map(([id, v]) => {
        const created = jobCreated[id] ?? 0;
        const firstHire = Math.min(...v.hired.map((a) => new Date(a.updatedAt).getTime()));
        return { title: v.title, days: (firstHire - created) / (1000 * 60 * 60 * 24) };
      })
      .sort((a, b) => a.days - b.days)[0];
    const hardest = entries
      .filter(([, v]) => v.applications >= 2)
      .map(([id, v]) => {
        const created = jobCreated[id] ?? 0;
        const lastHire =
          v.hired.length > 0
            ? Math.max(...v.hired.map((a) => new Date(a.updatedAt).getTime()))
            : Date.now();
        return { title: v.title, days: (lastHire - created) / (1000 * 60 * 60 * 24) };
      })
      .sort((a, b) => b.days - a.days)[0];
    return {
      mostApplied: mostApplied
        ? { title: mostApplied[1].title, count: mostApplied[1].applications }
        : { title: '—', count: 0 },
      fastestClosed: fastest ? { title: fastest.title, days: Math.round(fastest.days) } : { title: '—', days: 0 },
      hardestToFill: hardest ? { title: hardest.title, days: Math.round(hardest.days) } : { title: '—', days: 0 },
    };
  }, [applications, jobs]);

  if (loading) {
    return <Loader variant="container" text="Analytics" subText="Loading company metrics..." />;
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Analytics Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">{company.name}</p>
      </div>

      {/* 1. Top Summary Cards — Core Hiring Metrics */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          Core Hiring Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 rounded-lg">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications Received</p>
                <p className="text-2xl font-bold text-gray-900">{summaryCards.totalApplications}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-lg">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Candidates in Interview Stage</p>
                <p className="text-2xl font-bold text-gray-900">{summaryCards.candidatesInInterview}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Offers Released</p>
                <p className="text-2xl font-bold text-gray-900">{summaryCards.offersReleased}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Hires Completed</p>
                <p className="text-2xl font-bold text-gray-900">{summaryCards.hiresCompleted}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Recruitment Funnel */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-600" />
          Recruitment Funnel
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Applications → Coding → Technical → HR → Offer → Hired — drop-off, conversion & avg time per stage
        </p>
        <div className="overflow-x-auto">
          <div className="flex w-full justify-between gap-2 min-w-0">
            {funnelStages.map((stage) => (
              <div
                key={stage.name}
                className="flex-1 min-w-0 rounded-lg border border-gray-200 p-3 bg-gray-50 text-center"
              >
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stage.name}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stage.count}</p>
                <p className="text-xs text-gray-600 mt-1">Drop-off: {stage.dropOffRate}%</p>
                <p className="text-xs text-gray-600">Conversion: {stage.conversionFromPrev}%</p>
                <p className="text-xs text-indigo-600 mt-1">Avg {stage.avgDaysInStage}d in stage</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Trends — Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Applications per Week / Month
          </h2>
          {applicationTrendsWeekly.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationTrendsWeekly} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Applications" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-8 text-center">No application trend data</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-600" />
            Job-wise Application Count
          </h2>
          {jobWiseApplications.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart margin={{ right: 140 }}>
                  <Pie
                    data={jobWiseApplications}
                    dataKey="count"
                    nameKey="name"
                    cx="40%"
                    cy="50%"
                    outerRadius={70}
                    label={false}
                  >
                    {jobWiseApplications.map((_, index) => (
                      <Cell key={index} fill={['#4f46e5', '#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#6366f1'][index % 8]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ paddingLeft: 16 }}
                    iconSize={10}
                    iconType="square"
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-8 text-center">No job-wise data</p>
          )}
        </div>
      </section>

      {/* 6. Pipeline Health — Kanban Insights */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Pipeline Health
        </h2>
        <p className="text-sm text-gray-500 mb-4">Operational signals from your pipeline</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">Candidates stuck &gt; 7 days in one stage</p>
            <p className="text-2xl font-bold text-amber-900">{pipelineHealth.stuckOver7Days}</p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">Overdue Interviews</p>
            <p className="text-2xl font-bold text-red-900">{pipelineHealth.overdueInterviews}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">Pending Feedback Count</p>
            <p className="text-2xl font-bold text-blue-900">{pipelineHealth.pendingFeedbackCount}</p>
          </div>
        </div>
      </section>

      {/* 7. Top Performing Job Role */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-600" />
          Top Performing Job Role
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-600">Most Applied Job</p>
            <p className="text-lg font-bold text-gray-900">{topJobInsights.mostApplied.title}</p>
            <p className="text-sm text-gray-500">{topJobInsights.mostApplied.count} applicants</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-600">Fastest Closed Position</p>
            <p className="text-lg font-bold text-gray-900">{topJobInsights.fastestClosed.title}</p>
            <p className="text-sm text-gray-500">{topJobInsights.fastestClosed.days} days</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-600">Hardest to Fill Role</p>
            <p className="text-lg font-bold text-gray-900">{topJobInsights.hardestToFill.title}</p>
            <p className="text-sm text-gray-500">{topJobInsights.hardestToFill.days} days to fill</p>
          </div>
        </div>
      </section>
    </div>
  );
}
