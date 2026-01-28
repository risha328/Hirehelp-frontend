'use client';

import { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { applicationsAPI, CreateApplicationDto } from '../api/applications';
import { API_BASE_URL } from '../api/config';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  companyId: string;
  jobTitle: string;
  onSuccess: () => void;
}

export default function ApplyModal({ isOpen, onClose, jobId, companyId, jobTitle, onSuccess }: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
        setError('Please upload a PDF or Word document');
        return;
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setResume(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Please log in to apply for jobs');
      setIsSubmitting(false);
      return;
    }

    try {
      let resumeUrl = '';

      // Upload resume if provided
      if (resume) {
        const formData = new FormData();
        formData.append('resume', resume);

        const uploadResponse = await fetch(`${API_BASE_URL}/users/upload-resume`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload resume');
        }

        const uploadData = await uploadResponse.json();
        resumeUrl = uploadData.resumeUrl;
      }

      const applicationData: CreateApplicationDto = {
        jobId,
        companyId,
        coverLetter: coverLetter || undefined,
        resumeUrl: resumeUrl || undefined,
      };

      await applicationsAPI.createApplication(applicationData);
      onSuccess();
      onClose();
      // Reset form
      setCoverLetter('');
      setResume(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Apply for {jobTitle}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                id="coverLetter"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Upload a file
                      </span>
                      <input
                        id="resume-upload"
                        name="resume-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                  </div>
                </div>
                {resume && (
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{resume.name}</span>
                    <button
                      type="button"
                      onClick={() => setResume(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
