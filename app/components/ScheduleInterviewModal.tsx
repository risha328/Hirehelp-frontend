import { useState, useEffect } from 'react';
import { X, Clock, Video, MapPin, User, Calendar, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { companiesAPI } from '../api/companies';
import { roundsAPI } from '../api/rounds';

interface ScheduleInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    applicationId: string;
    roundId: string;
    candidateName: string;
    roundName: string;
    roundType: string; // 'technical' | 'hr' | 'interview'
}

interface Interviewer {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function ScheduleInterviewModal({
    isOpen,
    onClose,
    onSuccess,
    applicationId,
    roundId,
    candidateName,
    roundName,
    roundType
}: ScheduleInterviewModalProps) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        interviewMode: 'virtual', // 'virtual' or 'in-person'
        interviewType: roundType === 'hr' ? 'HR Interview' : 'Technical Interview',
        scheduledDate: '',
        scheduledTime: '',
        reportingTime: '', // For offline interviews
        duration: '60', // minutes
        interviewerId: '',
        platform: 'Google Meet',
        meetingLink: '',
        venueName: '',
        address: '',
        city: '',
        landmark: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchInterviewers();
            // Reset form on open
            setFormData(prev => ({
                ...prev,
                interviewType: roundType === 'hr' ? 'HR Interview' : 'Technical Interview'
            }));
        }
    }, [isOpen, roundType]);

    const fetchInterviewers = async () => {
        setLoading(true);
        try {
            const { company } = await companiesAPI.getMyCompany();
            if (company) {
                // Fetch all team members (admins and interviewers)
                const members = await companiesAPI.getCompanyAdmins(company._id);
                setInterviewers(members);
            }
        } catch (err) {
            console.error('Failed to fetch interviewers:', err);
            setError('Failed to load interviewers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            // 1. Get current evaluation or create one if needed
            // Logic: backend assignInterviewer expects evaluationId.
            // If we don't have evaluationId, we might need to find it using getEvaluationsByApplications
            // Or we can rely on the fact that if it's in the column, an evaluation likely exists.

            const evals = await roundsAPI.getEvaluationsByApplications([applicationId]);
            const evaluation = evals.find(e =>
                (typeof e.roundId === 'object' ? (e.roundId as any)._id === roundId : e.roundId === roundId)
            );

            if (!evaluation) {
                throw new Error('No evaluation record found. Please move the candidate to this stage first.');
            }

            const selectedInterviewer = interviewers.find(i => i._id === formData.interviewerId);
            if (!selectedInterviewer) throw new Error('Selected interviewer not found');

            // Construct scheduledAt URL
            const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();

            await roundsAPI.assignInterviewer(evaluation._id, {
                interviewerId: selectedInterviewer._id,
                interviewerName: selectedInterviewer.name,
                interviewerEmail: selectedInterviewer.email,
                scheduledAt,
                interviewMode: formData.interviewMode,
                interviewType: formData.interviewType,
                platform: formData.interviewMode === 'virtual' ? formData.platform : undefined,
                meetingLink: formData.interviewMode === 'virtual' ? formData.meetingLink : undefined,
                duration: formData.duration,
                reportingTime: formData.interviewMode === 'in-person' ? formData.reportingTime : undefined,
                locationDetails: formData.interviewMode === 'in-person' ? {
                    venueName: formData.venueName,
                    address: formData.address,
                    city: formData.city,
                    landmark: formData.landmark
                } : undefined
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Failed to schedule interview:', err);
            setError(err.message || 'Failed to schedule interview');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Schedule Interview</h2>
                        <p className="text-sm text-gray-500">
                            For {candidateName} - {roundName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center text-sm">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Interview Mode */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Interview Mode</label>
                            <div className="flex space-x-4">
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors flex-1 ${formData.interviewMode === 'virtual' ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="interviewMode"
                                        value="virtual"
                                        checked={formData.interviewMode === 'virtual'}
                                        onChange={(e) => setFormData({ ...formData, interviewMode: e.target.value })}
                                        className="sr-only"
                                    />
                                    <Video className={`w-5 h-5 mr-3 ${formData.interviewMode === 'virtual' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <div>
                                        <span className={`block text-sm font-medium ${formData.interviewMode === 'virtual' ? 'text-indigo-900' : 'text-gray-900'}`}>Virtual Meeting</span>
                                        <span className="block text-xs text-gray-500">Google Meet, Zoom, etc.</span>
                                    </div>
                                </label>

                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors flex-1 ${formData.interviewMode === 'in-person' ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="interviewMode"
                                        value="in-person"
                                        checked={formData.interviewMode === 'in-person'}
                                        onChange={(e) => setFormData({ ...formData, interviewMode: e.target.value })}
                                        className="sr-only"
                                    />
                                    <MapPin className={`w-5 h-5 mr-3 ${formData.interviewMode === 'in-person' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <div>
                                        <span className={`block text-sm font-medium ${formData.interviewMode === 'in-person' ? 'text-indigo-900' : 'text-gray-900'}`}>In-Person</span>
                                        <span className="block text-xs text-gray-500">At office location</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    required
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                    value={formData.scheduledDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="time"
                                    required
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                    value={formData.scheduledTime}
                                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="90">1.5 hours</option>
                                <option value="120">2 hours</option>
                            </select>
                        </div>

                        {/* Interviewer */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <select
                                    required
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                    value={formData.interviewerId}
                                    onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
                                >
                                    <option value="">Select Interviewer</option>
                                    {interviewers.map((interviewer) => (
                                        <option key={interviewer._id} value={interviewer._id}>
                                            {interviewer.name} ({interviewer.role === 'COMPANY_ADMIN' ? 'Admin' : 'Interviewer'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {loading && <p className="text-xs text-gray-500 mt-1">Loading interviewers...</p>}
                        </div>

                        {/* Virtual Meeting Fields */}
                        {formData.interviewMode === 'virtual' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    >
                                        <option value="Google Meet">Google Meet</option>
                                        <option value="Zoom">Zoom</option>
                                        <option value="Microsoft Teams">Microsoft Teams</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link *</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://meet.google.com/..."
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                            value={formData.meetingLink}
                                            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* In-Person Fields */}
                        {formData.interviewMode === 'in-person' && (
                            <div className="md:col-span-2 space-y-4 border-t border-gray-100 pt-4 mt-2">
                                <h3 className="text-sm font-medium text-gray-900">Location Details</h3>

                                {/* Reporting Time */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Reporting Time *</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="time"
                                            required
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                            value={formData.reportingTime}
                                            onChange={(e) => setFormData({ ...formData, reportingTime: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Time when candidate should arrive at the venue</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Venue Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                                            value={formData.venueName}
                                            onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Address *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">City *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Landmark</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                                            value={formData.landmark}
                                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Scheduling...
                                </>
                            ) : (
                                'Schedule Interview'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
