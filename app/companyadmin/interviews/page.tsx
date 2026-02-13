'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    XCircleIcon,
    PencilSquareIcon,
    EyeIcon,
    ChatBubbleLeftRightIcon,
    UserGroupIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    CalendarDaysIcon,
    ArrowPathIcon,
    DocumentCheckIcon,
    VideoCameraIcon,
    MapPinIcon,
    BellAlertIcon,
    ChartBarIcon,
    UsersIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline';
import {
    CheckCircleIcon as CheckCircleSolid,
    ExclamationTriangleIcon
} from '@heroicons/react/24/solid';
import { applicationsAPI, Application } from '../../api/applications';
import { companiesAPI } from '../../api/companies';
import { roundsAPI, Round } from '../../api/rounds';

interface Interview {
    id: string;
    candidateName: string;
    candidateEmail: string;
    candidateAvatar?: string;
    jobRole: string;
    jobId: string;
    companyId: string;
    interviewRound: string;
    mode: 'Online' | 'Offline';
    date: string;
    time: string;
    duration: number; // in minutes
    interviewerName: string;
    interviewerEmail: string;
    status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Missed' | 'Rescheduled' | 'Rescheduling';
    feedbackStatus: 'Not Generated' | 'Pending' | 'Submitted' | 'Reviewed';
    feedbackSubmittedAt?: string;
    meetingLink?: string;
    location?: string;
    notes?: string;
    evaluationId?: string;
}

export default function InterviewManagementPage() {
    const router = useRouter();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);

    const [rescheduleLoading, setRescheduleLoading] = useState(false);
    const [showCompleteConfirmation, setShowCompleteConfirmation] = useState(false);

    // Assignment
    const [availableInterviewers, setAvailableInterviewers] = useState<any[]>([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [selectedInterviewerId, setSelectedInterviewerId] = useState<string>('');
    const [assignSearchTerm, setAssignSearchTerm] = useState('');
    const [showAssignDropdown, setShowAssignDropdown] = useState(false);

    // Filters
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'this-week' | 'next-week'>('all');
    const [roundFilter, setRoundFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [feedbackFilter, setFeedbackFilter] = useState<string>('all');
    const [interviewerFilter, setInterviewerFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Helper function to format round type for display
    const formatRoundType = (type: string): string => {
        const typeMap: { [key: string]: string } = {
            'interview': 'Interview',
            'mcq': 'MCQ',
            'coding': 'Coding',
            'case_study': 'Case Study',
            'group_discussion': 'Group Discussion',
            'technical': 'Technical',
            'hr': 'HR'
        };

        return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            // 1. Get Company Info
            const companyData = await companiesAPI.getMyCompany();
            if (!companyData || !companyData.company) {
                console.error("No company found");
                setLoading(false);
                return;
            }
            const companyId = companyData.company._id;

            // 2. Fetch Applications, Rounds, and Admins in parallel
            const [applications, rounds, admins] = await Promise.all([
                applicationsAPI.getApplicationsByCompany(companyId),
                roundsAPI.getAllRounds(),
                companiesAPI.getCompanyAdmins(companyId).catch(err => {
                    console.error("Failed to fetch interviewers", err);
                    return [];
                })
            ]);

            if (Array.isArray(admins)) {
                setAvailableInterviewers(admins);
            }


            // 3. Filter applications in 'UNDER_REVIEW' status (Interview Status)
            const interviewApps = applications.filter(app => app.status === 'UNDER_REVIEW');

            // 4. Fetch evaluations for these applications to get accurate status
            const applicationIds = interviewApps.map(app => app._id);
            let evaluations: any[] = [];
            if (applicationIds.length > 0) {
                try {
                    evaluations = await roundsAPI.getEvaluationsByApplications(applicationIds);
                } catch (err) {
                    console.error("Failed to fetch evaluations", err);
                }
            }

            // 5. Map to Interview interface
            const mappedInterviews: Interview[] = interviewApps.map(app => {
                // Find the full round details
                const currentRoundId = app.currentRound && (typeof app.currentRound === 'object' ? app.currentRound._id : app.currentRound);
                const round = rounds.find(r => r._id === currentRoundId);

                // Debug logging
                console.log('Round data for', app.candidateId.name, ':', {
                    roundId: currentRoundId,
                    roundType: round?.type,
                    roundName: round?.name,
                    fullRound: round
                });

                // Find specific evaluation for this application and round
                const evaluation = evaluations.find(e => {
                    const eAppId = e.applicationId && typeof e.applicationId === 'object' ? (e.applicationId as any)._id : e.applicationId;
                    const eRoundId = e.roundId && typeof e.roundId === 'object' ? (e.roundId as any)._id : e.roundId;
                    return eAppId === app._id && eRoundId === currentRoundId;
                });

                // Determine Interview Details from Round or defaults
                let roundType = 'Interview'; // Default fallback

                if (round?.type && round.type !== 'interview') {
                    // If type is specific (technical, hr, mcq, coding), use it
                    roundType = formatRoundType(round.type);
                } else if (round?.name) {
                    // Extract type from name (e.g., "Technical Interview" -> "Technical")
                    const nameLower = round.name.toLowerCase();
                    if (nameLower.includes('technical')) {
                        roundType = 'Technical';
                    } else if (nameLower.includes('hr')) {
                        roundType = 'HR';
                    } else if (nameLower.includes('mcq')) {
                        roundType = 'MCQ';
                    } else if (nameLower.includes('coding')) {
                        roundType = 'Coding';
                    } else if (nameLower.includes('case study')) {
                        roundType = 'Case Study';
                    } else if (nameLower.includes('group discussion')) {
                        roundType = 'Group Discussion';
                    } else {
                        // Use the full name if no specific type found
                        roundType = round.name;
                    }
                }

                console.log(`Final roundType for ${app.candidateId.name}:`, roundType, '(from round.name:', round?.name, ', round.type:', round?.type, ')');
                const mode = round?.interviewMode === 'offline' ? 'Offline' : 'Online'; // Default to Online


                // Date and Time parsing
                // Prefer evaluation scheduling, then round scheduling
                let date = new Date().toISOString(); // Default to now if missing
                let time = '09:00'; // Default time
                let duration = 60; // Default duration in mins

                if (evaluation?.scheduledAt) {
                    date = evaluation.scheduledAt;
                    // Extract time from scheduledAt
                    const dateObj = new Date(evaluation.scheduledAt);
                    if (!isNaN(dateObj.getTime())) {
                        const hours = dateObj.getHours().toString().padStart(2, '0');
                        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                        time = `${hours}:${minutes}`;
                    }
                } else if (round?.scheduledAt) {
                    date = round.scheduledAt as any; // Type assertion if needed based on API response
                    // Extract time from scheduledAt
                    const dateObj = new Date(round.scheduledAt);
                    if (!isNaN(dateObj.getTime())) {
                        const hours = dateObj.getHours().toString().padStart(2, '0');
                        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                        time = `${hours}:${minutes}`;
                    }
                } else if (round?.scheduling?.interviewDate) {
                    date = round.scheduling.interviewDate;
                    if (round.scheduling.interviewTime) {
                        time = round.scheduling.interviewTime;
                    }
                }

                if (round?.duration) {
                    // specific logic if duration is a string like "60 mins" or number
                    const parsedDuration = parseInt(round.duration);
                    if (!isNaN(parsedDuration)) duration = parsedDuration;
                }

                // Interviewer Info
                let interviewerName = 'Unassigned';
                let interviewerEmail = '';

                // Check specific assignment in evaluation first
                if (evaluation && evaluation.assignedInterviewers && evaluation.assignedInterviewers.length > 0) {
                    interviewerName = evaluation.assignedInterviewers[0].name;
                    interviewerEmail = evaluation.assignedInterviewers[0].email;
                } else if (round?.interviewers && round.interviewers.length > 0) {
                    // Fallback to default round interviewers
                    interviewerName = round.interviewers[0].name;
                    interviewerEmail = round.interviewers[0].email;
                }

                // Derive Status
                // Use evaluation status if available, otherwise default logic
                let status: Interview['status'] = 'Pending';

                if (evaluation) {
                    if (evaluation.status === 'missed') status = 'Missed';
                    else if (evaluation.status === 'rescheduling') status = 'Rescheduling';
                    else if (evaluation.status === 'rescheduled') status = 'Rescheduled';
                    else if (evaluation.status === 'completed' || evaluation.status === 'passed' || evaluation.status === 'failed') status = 'Completed';
                    else if (evaluation.status === 'in_progress') status = 'In Progress';
                    else if (evaluation.status === 'scheduled') status = 'Scheduled';
                    else if (evaluation.status === 'pending') status = 'Pending';
                }

                // Check if interview is missed (deadline passed and still scheduled)
                const isScheduled = Boolean(evaluation?.scheduledAt || round?.scheduling?.interviewDate || round?.scheduledAt);

                if (status === 'Scheduled' && isScheduled) {
                    let interviewStart: Date;

                    // Determine accurate start time
                    if (date.includes('T') && !round?.scheduling?.interviewDate) {
                        // It's likely a full ISO timestamp from scheduledAt
                        interviewStart = new Date(date);
                    } else {
                        // It's a date string (YYYY-MM-DD or similar), need to combine with time
                        const dateObj = new Date(date);
                        const [hours, minutes] = time.split(':').map(Number);

                        if (!isNaN(dateObj.getTime()) && !isNaN(hours) && !isNaN(minutes)) {
                            // Construct local date with specific time
                            interviewStart = new Date(
                                dateObj.getFullYear(),
                                dateObj.getMonth(),
                                dateObj.getDate(),
                                hours,
                                minutes,
                                0
                            );
                        } else {
                            // Fallback
                            interviewStart = new Date(date);
                        }
                    }

                    // Console log for debugging (will appear in browser console)
                    const durationMs = (duration || 60) * 60 * 1000;
                    const bufferMs = 15 * 60 * 1000; // 15 mins buffer

                    if (!isNaN(interviewStart.getTime())) {
                        const endTime = new Date(interviewStart.getTime() + durationMs + bufferMs);
                        const now = new Date();

                        // console.log(`Checking Missed: ${app.candidateId.name}`, { start: interviewStart, end: endTime, now, isMissed: now > endTime });

                        if (now > endTime) {
                            status = 'Missed';
                        }
                    }
                }


                // Determine Feedback Status based on status and evaluation
                let feedbackStatus: Interview['feedbackStatus'] = 'Not Generated';

                if (evaluation) {
                    if (evaluation.status === 'completed' || evaluation.status === 'passed' || evaluation.status === 'failed') {
                        feedbackStatus = 'Submitted';
                    } else if (evaluation.status === 'reviewed') {
                        feedbackStatus = 'Reviewed';
                    } else if (status === 'Completed' || status === 'In Progress') {
                        // If interview is done/active but evaluation is not final, feedback is pending
                        feedbackStatus = 'Pending';
                    } else {
                        // Scheduled or Missed -> Not Generated (feedback not yet applicable)
                        feedbackStatus = 'Not Generated';
                    }
                } else {
                    // No evaluation record
                    feedbackStatus = 'Not Generated';
                }

                return {
                    id: app._id,
                    candidateName: app.candidateId.name,
                    candidateEmail: app.candidateId.email,
                    candidateAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(app.candidateId.name)}`, // Generate avatar
                    jobRole: app.jobId.title,
                    jobId: app.jobId._id,
                    companyId: companyId,
                    interviewRound: roundType,
                    mode: mode,
                    date: date,
                    time: time,
                    duration: duration,
                    interviewerName: interviewerName,
                    interviewerEmail: interviewerEmail,
                    status: status,
                    feedbackStatus: feedbackStatus,
                    meetingLink: round?.meetingLink,
                    location: round?.locationDetails ? `${round.locationDetails.venueName}, ${round.locationDetails.city}` : undefined,
                    notes: app.notes,
                    evaluationId: evaluation?._id
                };
            });

            setInterviews(mappedInterviews);

        } catch (error) {
            console.error("Failed to fetch interviews", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter interviews
    const filteredInterviews = interviews.filter(interview => {
        const today = new Date();
        const interviewDate = new Date(interview.date);

        // Date filter
        if (dateFilter !== 'all') {
            const isToday = interviewDate.toDateString() === today.toDateString();
            const isTomorrow = new Date(today.setDate(today.getDate() + 1)).toDateString() === interviewDate.toDateString();
            const thisWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            const thisWeekEnd = new Date(today.setDate(thisWeekStart.getDate() + 6));

            if (dateFilter === 'today' && !isToday) return false;
            if (dateFilter === 'tomorrow' && !isTomorrow) return false;
            if (dateFilter === 'this-week' && (interviewDate < thisWeekStart || interviewDate > thisWeekEnd)) return false;
        }

        // Round filter
        if (roundFilter !== 'all' && interview.interviewRound !== roundFilter) return false;

        // Status filter
        if (statusFilter !== 'all' && interview.status !== statusFilter) return false;

        // Feedback filter
        if (feedbackFilter !== 'all' && interview.feedbackStatus !== feedbackFilter) return false;

        // Interviewer filter
        if (interviewerFilter !== 'all' && interview.interviewerName !== interviewerFilter) return false;

        // Search term
        if (searchTerm && !interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !interview.jobRole.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        return true;
    });

    // Get unique interviewers
    const interviewers = Array.from(new Set(interviews.map(i => i.interviewerName)));

    // Get status badge
    const getStatusBadge = (status: Interview['status']) => {
        switch (status) {
            case 'Pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            case 'Scheduled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Scheduled
                    </span>
                );
            case 'In Progress':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" />
                        In Progress
                    </span>
                );
            case 'Completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Completed
                    </span>
                );
            case 'Missed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircleIcon className="w-3 h-3 mr-1" />
                        Missed
                    </span>
                );
            case 'Rescheduled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        Rescheduled
                    </span>
                );
            case 'Rescheduling':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" />
                        Rescheduling
                    </span>
                );
        }
    };

    // Get feedback badge
    const getFeedbackBadge = (status: Interview['feedbackStatus']) => {
        switch (status) {
            case 'Not Generated':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        Not Generated
                    </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Feedback Pending
                    </span>
                );
            case 'Submitted':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <DocumentCheckIcon className="w-3 h-3 mr-1" />
                        Submitted
                    </span>
                );
            case 'Reviewed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                        <CheckCircleSolid className="w-3 h-3 mr-1" />
                        Reviewed
                    </span>
                );
        }
    };

    // Get round badge
    const getRoundBadge = (round: string) => {
        // Simple mapping or hash to pick color if dynamic
        // Logic to pick color based on round name content or default
        let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
        const lowerRound = round.toLowerCase();

        if (lowerRound.includes('mcq')) colorClass = 'bg-purple-100 text-purple-800 border-purple-200';
        else if (lowerRound.includes('coding')) colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
        else if (lowerRound.includes('technical')) colorClass = 'bg-amber-100 text-amber-800 border-amber-200';
        else if (lowerRound.includes('hr')) colorClass = 'bg-green-100 text-green-800 border-green-200';
        else if (lowerRound.includes('manager')) colorClass = 'bg-red-100 text-red-800 border-red-200';
        else if (lowerRound.includes('final')) colorClass = 'bg-indigo-100 text-indigo-800 border-indigo-200';

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                {round}
            </span>
        );
    };

    // Get mode icon
    const getModeIcon = (mode: Interview['mode']) => {
        if (mode === 'Online') {
            return <VideoCameraIcon className="w-4 h-4 text-blue-500" />;
        }
        return <MapPinIcon className="w-4 h-4 text-green-500" />;
    };

    // Handle mark as completed
    // Handle mark as completed - Step 1: Show Confirmation
    const handleMarkAsCompleted = (interviewId: string) => {
        const interview = interviews.find(i => i.id === interviewId);
        if (interview) {
            setSelectedInterview(interview);
            setShowCompleteConfirmation(true);
        }
    };

    // Handle mark as completed - Step 2: Confirmation Action
    const confirmMarkAsCompleted = async () => {
        if (!selectedInterview) return;

        if (!selectedInterview.evaluationId) {
            alert('Cannot mark as completed: No evaluation record found for this interview.');
            setShowCompleteConfirmation(false);
            return;
        }

        try {
            // Update the backend
            await roundsAPI.updateEvaluationStatus(
                selectedInterview.evaluationId,
                'completed'
            );

            // Update local state
            setInterviews(prev => prev.map(interview =>
                interview.id === selectedInterview.id
                    ? { ...interview, status: 'Completed', feedbackStatus: 'Pending' }
                    : interview
            ));

            setShowCompleteConfirmation(false);

            // Optional: Refresh data to ensure sync
            fetchInterviews();
        } catch (error) {
            console.error('Failed to mark interview as completed:', error);
            alert('Failed to mark interview as completed. Please try again.');
        }
    };

    // Handle submit feedback
    const handleSubmitFeedback = () => {
        if (selectedInterview) {
            setInterviews(prev => prev.map(interview =>
                interview.id === selectedInterview.id
                    ? { ...interview, feedbackStatus: 'Submitted', feedbackSubmittedAt: new Date().toISOString() }
                    : interview
            ));
            setShowFeedbackModal(false);
        }
    };

    // Handle rescheduling
    const handleReschedule = async () => {
        if (!selectedInterview || !selectedInterview.evaluationId) return;

        setRescheduleLoading(true);
        try {
            await roundsAPI.rescheduleRound(selectedInterview.evaluationId);

            // Update local state
            setInterviews(prev => prev.map(interview =>
                interview.id === selectedInterview.id
                    ? { ...interview, status: 'Rescheduled' } // Or 'Rescheduling'
                    : interview
            ));

            // Refresh to ensure we are in sync
            fetchInterviews();

            setShowRescheduleModal(false);
        } catch (error) {
            console.error("Failed to reschedule", error);
            alert("Failed to reschedule. Please try again.");
        } finally {
            setRescheduleLoading(false);
        }
    };

    // Handle Assign Interviewer
    const handleAssignInterviewer = async () => {
        console.log('Assigning interviewer...');
        if (!selectedInterview) {
            console.error('No selected interview');
            return;
        }
        if (!selectedInterview.evaluationId) {
            console.error('No evaluation ID for this interview');
            alert('Cannot assign interviewer: No evaluation record found for this interview. Please ensure the candidate is in the correct stage.');
            return;
        }
        if (!selectedInterviewerId) {
            console.error('No interviewer selected');
            alert('Please select an interviewer first.');
            return;
        }

        const interviewer = availableInterviewers.find(i => i._id === selectedInterviewerId);
        if (!interviewer) {
            console.error('Selected interviewer not found in list');
            return;
        }

        console.log('Sending assignment request...', { evaluationId: selectedInterview.evaluationId, interviewer });

        setAssignLoading(true);
        try {
            await roundsAPI.assignInterviewer(selectedInterview.evaluationId, {
                interviewerId: interviewer._id,
                interviewerName: interviewer.name,
                interviewerEmail: interviewer.email,
                scheduledAt: selectedInterview.date, // Assuming date is ISO string or valid date
                interviewMode: selectedInterview.mode === 'Online' ? 'virtual' : 'in-person',
                interviewType: selectedInterview.interviewRound
            });

            // Update local state
            setInterviews(prev => prev.map(interview =>
                interview.id === selectedInterview.id
                    ? {
                        ...interview,
                        interviewerName: interviewer.name,
                        interviewerEmail: interviewer.email
                    }
                    : interview
            ));

            setShowAssignModal(false);
            setSelectedInterviewerId('');
            // Optional: Show success toast
        } catch (error) {
            console.error("Failed to assign interviewer", error);
            alert("Failed to assign interviewer. Please try again.");
        } finally {
            setAssignLoading(false);
        }
    };

    // Stats
    const stats = {
        total: interviews.length,
        today: interviews.filter(i => {
            const today = new Date().toDateString();
            const interviewDate = new Date(i.date).toDateString();
            return interviewDate === today;
        }).length,
        pendingFeedback: interviews.filter(i => i.feedbackStatus === 'Pending').length,
        completed: interviews.filter(i => i.status === 'Completed').length,
        missed: interviews.filter(i => i.status === 'Missed').length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading interview dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full overflow-x-hidden">
            {/* Top Navigation */}
            {/* Top Navigation */}
            <div className="w-full px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
                        <p className="text-sm text-gray-500">Mission control for interviews</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => alert('Schedule new interview feature coming soon')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer shadow-sm"
                        >
                            <CalendarIcon className="w-4 h-4" />
                            Schedule Now
                        </button>
                        <button
                            onClick={() => router.push('/companyadmin/calendar')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer shadow-sm"
                        >
                            <CalendarDaysIcon className="w-4 h-4" />
                            View Calendar
                        </button>
                        <button
                            onClick={() => alert('Export feature coming soon')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer shadow-sm"
                        >
                            <ChartBarIcon className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Stats */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Interviews */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-500">{stats.today} scheduled today</span>
                            </div>
                        </div>

                        {/* Completed */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-500">Interviews finished</span>
                            </div>
                        </div>

                        {/* Feedback Pending */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Feedback</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingFeedback}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                                    <BellAlertIcon className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-500">Requires attention</span>
                            </div>
                        </div>

                        {/* Missed */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Missed</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.missed}</p>
                                </div>
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                                    <XCircleIcon className="w-6 h-6 text-gray-600" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-500">Follow up needed</span>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header with Filters */}
                    <div className="px-6 py-5 border-b border-gray-200 bg-white">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-blue-900">Interview Schedule</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage and track all interviews</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {/* Search */}
                                <div className="relative flex-1 min-w-[200px]">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                                    <input
                                        type="text"
                                        placeholder="Search candidates or roles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium placeholder-gray-500"
                                    />
                                </div>


                            </div>
                        </div>

                        {/* Filter Chips */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {/* Date Filter */}
                            <div className="relative">
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value as any)}
                                    className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    <option value="today">Today</option>
                                    <option value="tomorrow">Tomorrow</option>
                                    <option value="this-week">This Week</option>
                                    <option value="next-week">Next Week</option>
                                    <option value="all">All Dates</option>
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                            </div>

                            {/* Round Filter */}
                            <div className="relative">
                                <select
                                    value={roundFilter}
                                    onChange={(e) => setRoundFilter(e.target.value)}
                                    className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    <option value="all">All Rounds</option>
                                    <option value="MCQ">MCQ</option>
                                    <option value="Coding">Coding</option>
                                    <option value="Technical">Technical</option>
                                    <option value="HR">HR</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Final">Final</option>
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Missed">Missed</option>
                                    <option value="Rescheduled">Rescheduled</option>
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                            </div>

                            {/* Feedback Filter */}
                            <div className="relative">
                                <select
                                    value={feedbackFilter}
                                    onChange={(e) => setFeedbackFilter(e.target.value)}
                                    className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    <option value="all">All Feedback</option>
                                    <option value="Pending">Pending Feedback</option>
                                    <option value="Submitted">Submitted</option>
                                    <option value="Reviewed">Reviewed</option>
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                            </div>

                            {/* Interviewer Filter */}
                            <div className="relative">
                                <select
                                    value={interviewerFilter}
                                    onChange={(e) => setInterviewerFilter(e.target.value)}
                                    className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    <option value="all">All Interviewers</option>
                                    {interviewers.map(interviewer => (
                                        <option key={interviewer} value={interviewer}>{interviewer}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                            </div>

                            {/* Clear Filters */}
                            {(dateFilter !== 'all' || roundFilter !== 'all' || statusFilter !== 'all' || feedbackFilter !== 'all' || interviewerFilter !== 'all' || searchTerm) && (
                                <button
                                    onClick={() => {
                                        setDateFilter('all');
                                        setRoundFilter('all');
                                        setStatusFilter('all');
                                        setFeedbackFilter('all');
                                        setInterviewerFilter('all');
                                        setSearchTerm('');
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    <XCircleIcon className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    {filteredInterviews.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <CalendarIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">No Interviews Found</h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-8">
                                {searchTerm || dateFilter !== 'all' || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'No interview applications found.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Candidate
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Job Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Round & Mode
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Interviewer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Feedback
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredInterviews.map(interview => (
                                        <tr key={interview.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {interview.candidateAvatar ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full"
                                                                src={interview.candidateAvatar}
                                                                alt={interview.candidateName}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                                <UserIcon className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                                            onClick={() => {
                                                                setSelectedInterview(interview);
                                                                setShowDetailsModal(true);
                                                            }}>
                                                            {interview.candidateName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{interview.candidateEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{interview.jobRole}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-2">
                                                    {getRoundBadge(interview.interviewRound)}
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                        {getModeIcon(interview.mode)}
                                                        <span>{interview.mode}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {new Date(interview.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                                    <ClockIcon className="w-3.5 h-3.5" />
                                                    {interview.time} ({interview.duration} min)
                                                </div>
                                                {interview.location && (
                                                    <div className="text-xs text-gray-500 mt-1">{interview.location}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <UserGroupIcon className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {interview.interviewerName === 'Unassigned' ? (
                                                                <span className="text-gray-400 italic">Unassigned</span>
                                                            ) : (
                                                                interview.interviewerName
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{interview.interviewerEmail}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedInterview(interview);
                                                            setSelectedInterviewerId('');
                                                            setShowAssignModal(true);
                                                        }}
                                                        className="ml-auto text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                                    >
                                                        {interview.interviewerName === 'Unassigned' ? 'Assign' : 'Change'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(interview.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getFeedbackBadge(interview.feedbackStatus)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedInterview(interview);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                        title="View Details"
                                                    >
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedInterview(interview);
                                                            setShowFeedbackModal(true);
                                                        }}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                        title="Add/View Feedback"
                                                    >
                                                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                                    </button>
                                                    {interview.status !== 'Completed' && (
                                                        <button
                                                            onClick={() => handleMarkAsCompleted(interview.id)}
                                                            className="text-gray-400 hover:text-green-600 transition-colors p-1"
                                                            title="Mark as Completed"
                                                        >
                                                            <CheckCircleIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {interview.status === 'Missed' && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedInterview(interview);
                                                                setShowRescheduleModal(true);
                                                            }}
                                                            className="text-gray-400 hover:text-orange-600 transition-colors p-1"
                                                            title="Reschedule Interview"
                                                        >
                                                            <CalendarIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Reschedule Confirmation Modal */}
            {showRescheduleModal && selectedInterview && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4 text-orange-600">
                            <ExclamationCircleIcon className="w-8 h-8" />
                            <h3 className="text-lg font-bold">Reschedule Interview?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to reschedule the interview for <strong>{selectedInterview.candidateName}</strong>?
                            This will change the status to 'Rescheduling' and notify the candidate.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRescheduleModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                                disabled={rescheduleLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReschedule}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium cursor-pointer flex items-center gap-2"
                                disabled={rescheduleLoading}
                            >
                                {rescheduleLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                Confirm Reschedule
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedInterview && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Interview Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Header Info */}
                            <div className="flex items-center gap-4">
                                {selectedInterview.candidateAvatar ? (
                                    <img
                                        src={selectedInterview.candidateAvatar}
                                        alt={selectedInterview.candidateName}
                                        className="w-16 h-16 rounded-full"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                                        <UserIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedInterview.candidateName}</h3>
                                    <p className="text-gray-600">{selectedInterview.jobRole}</p>
                                    <p className="text-sm text-gray-500 mt-1">{selectedInterview.candidateEmail}</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                        Round & Type
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {getRoundBadge(selectedInterview.interviewRound)}
                                        <span className="text-sm font-medium text-gray-700">- {selectedInterview.mode}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                        Date & Time
                                    </label>
                                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                                        {new Date(selectedInterview.date).toLocaleDateString()}
                                        <span className="text-gray-400">|</span>
                                        <ClockIcon className="w-4 h-4 text-gray-500" />
                                        {selectedInterview.time} ({selectedInterview.duration} min)
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                        Interviewer
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-xs font-medium text-gray-600">
                                                {selectedInterview.interviewerName.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{selectedInterview.interviewerName}</p>
                                            <p className="text-xs text-gray-500">{selectedInterview.interviewerEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                        Meeting Link/Location
                                    </label>
                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                        {selectedInterview.mode === 'Online' ? (
                                            <a href={selectedInterview.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                                                <VideoCameraIcon className="w-4 h-4" />
                                                Join Meeting
                                            </a>
                                        ) : (
                                            <div className="flex items-center gap-1 text-gray-700">
                                                <MapPinIcon className="w-4 h-4" />
                                                {selectedInterview.location || 'No location specified'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-sm font-medium text-gray-900 mb-2 block">Interview Guidelines & Notes</label>
                                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-yellow-800">
                                    <p>{selectedInterview.notes || 'No specific notes for this interview.'}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {showFeedbackModal && selectedInterview && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Add Interview Feedback</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                For {selectedInterview.candidateName} - {selectedInterview.interviewRound} Round
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Overall Rating
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className="w-10 h-10 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Feedback Comments
                                </label>
                                <textarea
                                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    placeholder="Enter detailed feedback about the candidate's performance..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recommendation
                                </label>
                                <div className="flex gap-3">
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="recommendation" className="peer sr-only" />
                                        <div className="border border-gray-200 peer-checked:border-green-500 peer-checked:bg-green-50 rounded-lg p-3 text-center transition-all">
                                            <span className="block text-sm font-medium text-gray-900">Hire</span>
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="recommendation" className="peer sr-only" />
                                        <div className="border border-gray-200 peer-checked:border-yellow-500 peer-checked:bg-yellow-50 rounded-lg p-3 text-center transition-all">
                                            <span className="block text-sm font-medium text-gray-900">Hold</span>
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="recommendation" className="peer sr-only" />
                                        <div className="border border-gray-200 peer-checked:border-red-500 peer-checked:bg-red-50 rounded-lg p-3 text-center transition-all">
                                            <span className="block text-sm font-medium text-gray-900">Reject</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowFeedbackModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitFeedback}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Interviewer Modal */}
            {showAssignModal && selectedInterview && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4 text-blue-600">
                            <UserPlusIcon className="w-8 h-8" />
                            <h3 className="text-lg font-bold">Assign Interviewer</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Assign an interviewer for <strong>{selectedInterview.candidateName}</strong> ({selectedInterview.interviewRound}).
                            They will receive an email notification with all interview details.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Interviewer</label>
                            <div className="relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        placeholder="Search interviewer..."
                                        value={assignSearchTerm}
                                        onChange={(e) => {
                                            setAssignSearchTerm(e.target.value);
                                            setShowAssignDropdown(true);
                                            if (e.target.value === '') setSelectedInterviewerId('');
                                        }}
                                        onFocus={() => setShowAssignDropdown(true)}
                                        onClick={() => setShowAssignDropdown(true)}
                                        autoComplete="off"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                        {selectedInterviewerId && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedInterviewerId('');
                                                    setAssignSearchTerm('');
                                                    setShowAssignDropdown(true);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <XCircleIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                        <ChevronDownIcon className="w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {showAssignDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                        {availableInterviewers.length === 0 ? (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                No interviewers found in company
                                            </div>
                                        ) : availableInterviewers.filter(i =>
                                            i.name.toLowerCase().includes(assignSearchTerm.toLowerCase()) ||
                                            i.email.toLowerCase().includes(assignSearchTerm.toLowerCase())
                                        ).length > 0 ? (
                                            availableInterviewers
                                                .filter(i =>
                                                    i.name.toLowerCase().includes(assignSearchTerm.toLowerCase()) ||
                                                    i.email.toLowerCase().includes(assignSearchTerm.toLowerCase())
                                                )
                                                .map(interviewer => (
                                                    <div
                                                        key={interviewer._id}
                                                        className={`px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 ${selectedInterviewerId === interviewer._id ? 'bg-blue-50' : ''}`}
                                                        onClick={() => {
                                                            setSelectedInterviewerId(interviewer._id);
                                                            setAssignSearchTerm(interviewer.name);
                                                            setShowAssignDropdown(false);
                                                        }}
                                                    >
                                                        <div className="font-medium text-gray-900">{interviewer.name}</div>
                                                        <div className="text-xs text-gray-500">{interviewer.email}</div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                No match found for "{assignSearchTerm}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                                disabled={assignLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignInterviewer}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer flex items-center gap-2"
                                disabled={assignLoading || !selectedInterviewerId}
                            >
                                {assignLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Mark as Completed Confirmation Modal */}
            {showCompleteConfirmation && selectedInterview && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4 text-green-600">
                            <CheckCircleIcon className="w-8 h-8" />
                            <h3 className="text-lg font-bold">Mark as Completed?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to mark the interview for <strong>{selectedInterview.candidateName}</strong> as completed?
                            This will update the status and enable feedback submission.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCompleteConfirmation(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmMarkAsCompleted}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium cursor-pointer"
                            >
                                Yes, Mark Completed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}