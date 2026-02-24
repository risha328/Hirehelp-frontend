'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Send, Loader2, AlertCircle } from 'lucide-react';
import { applicationsAPI } from '../api/applications';

interface OfferLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName?: string;
  jobTitle?: string;
  companyName?: string;
  onSuccess: () => void;
}

interface OfferPreviewData {
  position: string;
  salary: string;
  startDate: string;
  expiryDate?: string;
  terms?: string;
  companyName: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
}

export default function OfferLetterModal({
  isOpen,
  onClose,
  applicationId,
  candidateName: propCandidateName,
  jobTitle: propJobTitle,
  companyName: propCompanyName,
  onSuccess,
}: OfferLetterModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<OfferPreviewData | null>(null);
  const [formData, setFormData] = useState({
    position: '',
    salary: '',
    startDate: '',
    expiryDate: '',
    terms: '',
  });

  useEffect(() => {
    if (isOpen && applicationId) {
      setError(null);
      setPreview(null);
      fetchPreview();
    }
  }, [isOpen, applicationId]);

  const fetchPreview = async () => {
    setLoading(true);
    try {
      const data = await applicationsAPI.getOfferPreview(applicationId);
      setPreview(data);
      setFormData({
        position: data.position || '',
        salary: data.salary || '',
        startDate: data.startDate || '',
        expiryDate: data.expiryDate || '',
        terms: data.terms || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load offer preview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await applicationsAPI.sendOffer(applicationId, {
        position: formData.position,
        salary: formData.salary,
        startDate: formData.startDate,
        expiryDate: formData.expiryDate || undefined,
        terms: formData.terms || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send offer');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <FileText className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send Offer Letter</h2>
              <p className="text-sm text-gray-500">
                {propCandidateName || preview?.candidateName} – {propJobTitle || preview?.jobTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form id="offer-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData((p) => ({ ...p, position: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-900 placeholder:text-gray-500"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary / Compensation</label>
                  <input
                    type="text"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData((p) => ({ ...p, salary: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-900 placeholder:text-gray-500"
                    placeholder="e.g. INR 12,00,000 - 15,00,000 per annum"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                  <input
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-900 placeholder:text-gray-500"
                    placeholder="e.g. 2025-03-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Valid Until (optional)</label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData((p) => ({ ...p, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-900 placeholder:text-gray-500"
                    placeholder="e.g. 2025-02-15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions (optional)</label>
                <textarea
                  rows={4}
                  value={formData.terms}
                  onChange={(e) => setFormData((p) => ({ ...p, terms: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-900 placeholder:text-gray-500"
                  placeholder="e.g. Standard company policies apply. Probation period: 6 months."
                />
              </div>

              {/* Preview block */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Position:</strong> {formData.position || '—'}</p>
                  <p><strong>Compensation:</strong> {formData.salary || '—'}</p>
                  <p><strong>Start date:</strong> {formData.startDate || '—'}</p>
                  {formData.expiryDate && <p><strong>Valid until:</strong> {formData.expiryDate}</p>}
                  {formData.terms && <p><strong>Terms:</strong> {formData.terms.slice(0, 100)}{formData.terms.length > 100 ? '…' : ''}</p>}
                </div>
              </div>
            </>
          )}
        </form>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="offer-form"
            disabled={loading || submitting}
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Send Offer
          </button>
        </div>
      </div>
    </div>
  );
}
