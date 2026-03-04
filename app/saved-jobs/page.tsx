'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  MapPin,
  DollarSign,
  ArrowRight,
  BookmarkCheck,
  Trash2,
} from 'lucide-react';
import { publicJobsAPI } from '../api/jobs';
import { getFileUrl } from '../api/config';
import { getSavedJobIds, removeSavedJob, setSavedJobIds } from '../utils/savedJobs';
import Footer from '../components/Footer';

interface JobCard {
  _id: string;
  title: string;
  location: string;
  jobType: string;
  salary: string;
  companyId: {
    _id: string;
    name: string;
    logoUrl?: string;
  };
  createdAt: string;
}

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const ids = getSavedJobIds();
      if (ids.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const results: JobCard[] = [];
      const failedIds: string[] = [];
      for (const id of ids) {
        try {
          const job = await publicJobsAPI.getJobById(id);
          results.push({
            _id: job._id,
            title: job.title,
            location: job.location,
            jobType: job.jobType,
            salary: job.salary,
            companyId: job.companyId,
            createdAt: job.createdAt,
          });
        } catch {
          failedIds.push(id);
        }
      }
      if (failedIds.length > 0) {
        setSavedJobIds(ids.filter((id) => !failedIds.includes(id)));
      }
      setJobs(results);
      setLoading(false);
    }
    load();
  }, []);

  const handleRemove = (jobId: string) => {
    setRemovingId(jobId);
    removeSavedJob(jobId);
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    setRemovingId(null);
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-100 text-blue-800';
      case 'part-time':
        return 'bg-green-100 text-green-800';
      case 'contract':
        return 'bg-purple-100 text-purple-800';
      case 'remote':
        return 'bg-cyan-100 text-cyan-800';
      case 'internship':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-300 to-white flex flex-col">
      <main className="flex-1 pt-24 lg:pt-28 pb-16">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <BookmarkCheck className="h-8 w-8 text-indigo-600" />
              Your saved jobs
            </h1>
            <p className="mt-2 text-gray-600">
              Jobs you’ve saved for later. Click through to view details or apply.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin" />
              <p className="mt-4 text-gray-600">Loading saved jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved jobs yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                When you save jobs from the job listing or job detail page, they’ll appear here.
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Browse jobs
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => {
                const company = job.companyId || (job as any).company;
                const name = company?.name ?? 'Company';
                const logoUrl = company?.logoUrl ?? '';
                const logoResolved = getFileUrl(logoUrl || undefined);
                const initials = name?.charAt(0)?.toUpperCase() || 'C';
                return (
                  <li
                    key={job._id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                        {logoResolved ? (
                          <img
                            src={logoResolved}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-gray-500">
                            {initials}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                          {job.title}
                        </h2>
                        <p className="text-gray-600 font-medium mt-0.5">{name}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              {job.location}
                            </span>
                          )}
                          {job.jobType && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getJobTypeColor(
                                job.jobType
                              )}`}
                            >
                              {job.jobType}
                            </span>
                          )}
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 flex-shrink-0" />
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRemove(job._id)}
                          disabled={removingId === job._id}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Remove from saved"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <Link
                          href={`/jobs/${job._id}`}
                          className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          View
                          <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
