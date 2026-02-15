'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { jobsAPI } from '../api/companies';

interface JobData {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  jobType?: string;
  experienceLevel?: string;
  skills?: string[];
  applicationDeadline?: string;
  status: string;
  requirements?: string;
  scheduledPublishAt?: string;
}

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobId: string;
}

export default function EditJobModal({ isOpen, onClose, onSuccess, jobId }: EditJobModalProps) {
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobData();
    }
  }, [isOpen, jobId]);

  const fetchJobData = async () => {
    setLoading(true);
    try {
      const jobData = await jobsAPI.getJobById(jobId);
      setJob(jobData);
    } catch (err) {
      setError('Failed to load job data');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobChange = (field: keyof JobData, value: string | string[]) => {
    if (job) {
      setJob({ ...job, [field]: value });
    }
  };

  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    handleJobChange('skills', skills);
  };

  const handleSave = async () => {
    if (!job) return;

    if (job.applicationDeadline) {
      const deadlineDate = new Date(job.applicationDeadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate <= today) {
        setError('Application deadline must be a future date (at least tomorrow)');
        return;
      }
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await jobsAPI.updateJob(jobId, {
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        skills: job.skills,
        applicationDeadline: job.applicationDeadline,
        status: job.status,
        requirements: job.requirements,
      });

      setSuccess('Job updated successfully!');
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to update job');
      console.error('Error updating job:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isPublished = !!(job && job.status === 'active' && new Date(job.scheduledPublishAt || Date.now()) <= new Date());

  return (
    <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-70 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isPublished ? 'View Job Details (Read-only)' : 'Edit Job'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isPublished && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h5 className="text-sm font-bold text-amber-900 uppercase tracking-wide">Read-Only Mode</h5>
                <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                  This job has already been published. To maintain consistency for applicants, published jobs cannot be modified.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading job data...</div>
            </div>
          ) : job ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={job.title || ''}
                    disabled={isPublished}
                    onChange={(e) => handleJobChange('title', e.target.value)}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={job.location || ''}
                    disabled={isPublished}
                    onChange={(e) => handleJobChange('location', e.target.value)}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary
                  </label>
                  <input
                    type="text"
                    value={job.salary || ''}
                    disabled={isPublished}
                    onChange={(e) => handleJobChange('salary', e.target.value)}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                    placeholder="Enter salary (e.g. 50k - 70k, Competitive, Negotiable)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={job.jobType || ''}
                    disabled={isPublished}
                    onChange={(e) => handleJobChange('jobType', e.target.value)}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                  >
                    <option value="">Select job type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={job.experienceLevel || ''}
                    disabled={isPublished}
                    onChange={(e) => handleJobChange('experienceLevel', e.target.value)}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                  >
                    <option value="">Select experience level</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                    value={job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : ''}
                    disabled={isPublished}
                    onChange={(e) => handleJobChange('applicationDeadline', e.target.value)}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={job.status || ''}
                    disabled={isPublished}
                    onChange={(e) => handleJobChange('status', e.target.value)}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={job.skills?.join(', ') || ''}
                    disabled={isPublished}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={job.description || ''}
                    disabled={isPublished}
                    onChange={(e) => handleJobChange('description', e.target.value)}
                    rows={6}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <textarea
                    value={job.requirements || ''}
                    disabled={isPublished}
                    onChange={(e) => handleJobChange('requirements', e.target.value)}
                    rows={4}
                    className={`text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPublished ? 'bg-gray-50 cursor-not-allowed opacity-75' : ''}`}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isPublished ? 'Close' : 'Cancel'}
                </button>
                {!isPublished && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500">Failed to load job data</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
