'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    UserIcon,
    VideoCameraIcon,
    MapPinIcon,
    BriefcaseIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EllipsisVerticalIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ChatBubbleLeftRightIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    ArrowRightIcon,
    BellAlertIcon,
    ChartBarIcon,
    BuildingOfficeIcon,
    PlusIcon,
    ArrowTopRightOnSquareIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import {
    CheckCircleIcon as CheckCircleSolid,
    StarIcon
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
    interviewRound: string;
    mode: 'Online' | 'Offline';
    date: Date;
    time: string;
    duration: number;
    interviewerName: string;
    interviewerEmail: string;
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Missed' | 'Rescheduled';
    feedbackStatus: 'Not Generated' | 'Pending' | 'Submitted' | 'Reviewed';
    meetingLink?: string;
    location?: string;
    priority?: 'High' | 'Medium' | 'Low';
}

export default function CalendarPage() {
    const router = useRouter();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRound, setFilterRound] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        thisWeek: 0,
        pendingFeedback: 0
    });

    useEffect(() => {
        fetchInterviews();
    }, []);

    useEffect(() => {
        if (interviews.length > 0) {
            const today = new Date();
            const todayStr = today.toDateString();

            const thisWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            const thisWeekEnd = new Date(today.setDate(thisWeekStart.getDate() + 6));

            const newStats = {
                total: interviews.length,
                today: interviews.filter(i => i.date.toDateString() === todayStr).length,
                thisWeek: interviews.filter(i => i.date >= thisWeekStart && i.date <= thisWeekEnd).length,
                pendingFeedback: interviews.filter(i => i.feedbackStatus === 'Pending').length
            };
            setStats(newStats);
        }
    }, [interviews]);

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            const companyData = await companiesAPI.getMyCompany();
            if (!companyData || !companyData.company) {
                console.error("No company found");
                setLoading(false);
                return;
            }
            const companyId = companyData.company._id;

            const [applications, rounds] = await Promise.all([
                applicationsAPI.getApplicationsByCompany(companyId),
                roundsAPI.getAllRounds()
            ]);

            const interviewApps = applications.filter(app => app.status === 'UNDER_REVIEW');

            const mappedInterviews: Interview[] = interviewApps.map(app => {
                const currentRoundId = app.currentRound && (typeof app.currentRound === 'object' ? app.currentRound._id : app.currentRound);
                const round = rounds.find(r => r._id === currentRoundId);

                const roundType = round?.type || round?.name || 'Interview';
                const mode = round?.interviewMode === 'offline' ? 'Offline' : 'Online';

                let dateStr = new Date().toISOString();
                let time = '09:00';
                let duration = 60;

                if (round?.scheduling?.interviewDate) {
                    dateStr = round.scheduling.interviewDate;
                } else if (round?.scheduledAt) {
                    dateStr = round.scheduledAt;
                }

                if (round?.scheduling?.interviewTime) {
                    time = round.scheduling.interviewTime;
                }

                if (round?.duration) {
                    const parsedDuration = parseInt(round.duration);
                    if (!isNaN(parsedDuration)) duration = parsedDuration;
                }

                const interviewerName = round?.interviewers?.length
                    ? round.interviewers.map(i => i.name).join(', ')
                    : 'Unassigned';

                const interviewerEmail = round?.interviewers?.length
                    ? round.interviewers.map(i => i.email || '').join(', ')
                    : '';

                // Generate avatar URL
                const candidateAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.candidateId.name}`;

                // Determine priority based on round and date
                const interviewDate = new Date(dateStr);
                const today = new Date();
                const daysDiff = Math.ceil((interviewDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                let priority: 'High' | 'Medium' | 'Low' = 'Medium';

                if (daysDiff <= 1) priority = 'High';
                else if (daysDiff <= 3) priority = 'Medium';
                else priority = 'Low';

                return {
                    id: app._id,
                    candidateName: app.candidateId.name,
                    candidateEmail: app.candidateId.email || '',
                    candidateAvatar: candidateAvatar,
                    jobRole: app.jobId.title,
                    jobId: app.jobId._id,
                    interviewRound: roundType,
                    mode: mode,
                    date: new Date(dateStr),
                    time: time,
                    duration: duration,
                    interviewerName: interviewerName,
                    interviewerEmail: interviewerEmail,
                    status: 'Scheduled', // Default status
                    feedbackStatus: 'Not Generated',
                    meetingLink: round?.meetingLink,
                    location: round?.locationDetails ? `${round.locationDetails.venueName}, ${round.locationDetails.city}` : undefined,
                    priority: priority
                };
            });

            // Sort by date
            mappedInterviews.sort((a, b) => a.date.getTime() - b.date.getTime());
            setInterviews(mappedInterviews);
        } catch (error) {
            console.error("Failed to fetch interviews for calendar", error);
        } finally {
            setLoading(false);
        }
    };

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getStatusBadge = (status: Interview['status']) => {
        switch (status) {
            case 'Scheduled':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        Scheduled
                    </span>
                );
            case 'In Progress':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <ClockIcon className="w-3 h-3 mr-1 animate-spin" />
                        In Progress
                    </span>
                );
            case 'Completed':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Completed
                    </span>
                );
            case 'Missed':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                        Missed
                    </span>
                );
            case 'Rescheduled':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <CalendarDaysIcon className="w-3 h-3 mr-1" />
                        Rescheduled
                    </span>
                );
        }
    };

    const getPriorityBadge = (priority: Interview['priority']) => {
        switch (priority) {
            case 'High':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High Priority
                    </span>
                );
            case 'Medium':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Medium Priority
                    </span>
                );
            case 'Low':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Low Priority
                    </span>
                );
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Filter interviews based on search and filters
    const filteredInterviews = interviews.filter(interview => {
        const matchesSearch = !searchTerm ||
            interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.jobRole.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRound = filterRound === 'all' || interview.interviewRound === filterRound;
        const matchesStatus = filterStatus === 'all' || interview.status === filterStatus;

        return matchesSearch && matchesRound && matchesStatus;
    });

    // Get interviews for selected date
    const getInterviewsForDate = (date: Date) => {
        return filteredInterviews.filter(i => i.date.toDateString() === date.toDateString());
    };

    // Generate calendar grid
    const generateCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const grid = [];

        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            grid.push(
                <div key={`empty-${i}`} className="h-32 bg-gray-50/50 border border-gray-100 p-2">
                    <div className="text-gray-300 text-sm font-medium">
                        {new Date(year, month, i - firstDay + 1).getDate()}
                    </div>
                </div>
            );
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayDate = new Date(year, month, day);
            const isToday = new Date().toDateString() === currentDayDate.toDateString();
            const isSelected = selectedDate?.toDateString() === currentDayDate.toDateString();
            const dayInterviews = getInterviewsForDate(currentDayDate);

            grid.push(
                <div
                    key={`day-${day}`}
                    className={`h-32 border border-gray-100 p-2 overflow-hidden hover:bg-gray-50/50 transition-all duration-200 cursor-pointer group ${isToday ? 'bg-blue-50/50' : 'bg-white'
                        } ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                    onClick={() => setSelectedDate(currentDayDate)}
                >
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isToday
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 group-hover:bg-gray-100'
                                }`}>
                                {day}
                            </span>
                            {isToday && (
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                    Today
                                </span>
                            )}
                        </div>

                        {dayInterviews.length > 0 && (
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-gray-200 transition-colors">
                                {dayInterviews.length} interview{dayInterviews.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    <div className="space-y-1 mt-1 max-h-20 overflow-y-auto">
                        {dayInterviews.slice(0, 3).map((interview) => (
                            <div
                                key={interview.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInterview(interview);
                                }}
                                className={`text-xs p-1.5 rounded cursor-pointer transition-all border-l-2 shadow-sm hover:shadow-md group/interview ${interview.priority === 'High'
                                    ? 'bg-red-50 border-red-500 text-red-700 hover:bg-red-100'
                                    : interview.priority === 'Medium'
                                        ? 'bg-amber-50 border-amber-500 text-amber-700 hover:bg-amber-100'
                                        : 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold truncate flex items-center gap-1">
                                            <ClockIcon className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">{interview.time}</span>
                                        </div>
                                        <div className="truncate font-medium mt-0.5">{interview.candidateName}</div>
                                        <div className="truncate text-opacity-75 mt-0.5">{interview.jobRole}</div>
                                    </div>
                                    <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover/interview:opacity-100 transition-opacity flex-shrink-0" />
                                </div>
                            </div>
                        ))}

                        {dayInterviews.length > 3 && (
                            <div className="text-xs text-gray-500 text-center p-1">
                                + {dayInterviews.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Fill remaining cells for next month
        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - (firstDay + daysInMonth);

        for (let i = 0; i < remainingCells; i++) {
            grid.push(
                <div key={`next-${i}`} className="h-32 bg-gray-50/50 border border-gray-100 p-2">
                    <div className="text-gray-300 text-sm font-medium">
                        {i + 1}
                    </div>
                </div>
            );
        }

        return grid;
    };

    // Get upcoming interviews (next 7 days)
    const getUpcomingInterviews = () => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return filteredInterviews
            .filter(i => i.date >= today && i.date <= nextWeek)
            .slice(0, 5);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading calendar data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Navigation */}
            <div className="border-b border-gray-200">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/companyadmin/interviews')}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Interview Calendar</h1>
                                <p className="text-sm text-gray-500">Visual schedule and timeline</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">{stats.today} today</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">This Week</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.thisWeek}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <CalendarIcon className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Scheduled interviews</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Feedback</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingFeedback}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                <BellAlertIcon className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Requires attention</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{getUpcomingInterviews().length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <ArrowRightIcon className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Next 7 days</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Calendar Section */}
                    <div className="lg:flex-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Calendar Header */}
                            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-lg font-semibold text-gray-900">Interview Schedule</h2>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handlePrevMonth}
                                                className="p-2 rounded-lg hover:bg-white text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                                            >
                                                <ChevronLeftIcon className="w-5 h-5" />
                                            </button>
                                            <h3 className="text-xl font-bold text-gray-900 w-48 text-center">
                                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                            </h3>
                                            <button
                                                onClick={handleNextMonth}
                                                className="p-2 rounded-lg hover:bg-white text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                                            >
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* View Mode Toggle */}
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                            {(['month', 'week', 'day'] as const).map((mode) => (
                                                <button
                                                    key={mode}
                                                    onClick={() => setViewMode(mode)}
                                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === mode
                                                        ? 'bg-white text-gray-900 shadow-sm'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                        }`}
                                                >
                                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCurrentDate(new Date())}
                                            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                                        >
                                            Today
                                        </button>

                                        {/* Filters */}
                                        <div className="relative">
                                            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium cursor-pointer">
                                                <FunnelIcon className="w-4 h-4" />
                                                Filter
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Chips */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search interviews..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                                        />
                                    </div>

                                    <select
                                        value={filterRound}
                                        onChange={(e) => setFilterRound(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Rounds</option>
                                        <option value="HR">HR Round</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Final">Final</option>
                                    </select>

                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>

                                    {(searchTerm || filterRound !== 'all' || filterStatus !== 'all') && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilterRound('all');
                                                setFilterStatus('all');
                                            }}
                                            className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Days Header */}
                            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="py-3 text-center text-sm font-semibold text-gray-700 bg-white/50">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 auto-rows-fr min-h-[600px]">
                                {generateCalendarGrid()}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Upcoming & Selected Date */}
                    <div className="lg:w-96">
                        <div className="space-y-6">
                            {/* Selected Date Info */}
                            {selectedDate && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {dayNames[selectedDate.getDay()]}, {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
                                        </h3>
                                        <button
                                            onClick={() => setSelectedDate(null)}
                                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {getInterviewsForDate(selectedDate).length === 0 ? (
                                            <div className="text-center py-8">
                                                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">No interviews scheduled</p>
                                                <button
                                                    onClick={() => alert('Schedule interview feature coming soon')}
                                                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <PlusIcon className="w-4 h-4" />
                                                    Schedule Interview
                                                </button>
                                            </div>
                                        ) : (
                                            getInterviewsForDate(selectedDate).map(interview => (
                                                <div
                                                    key={interview.id}
                                                    onClick={() => setSelectedInterview(interview)}
                                                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer bg-gradient-to-r from-gray-50 to-white"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                {getStatusBadge(interview.status)}
                                                                {getPriorityBadge(interview.priority)}
                                                            </div>
                                                            <h4 className="font-semibold text-gray-900 truncate">{interview.candidateName}</h4>
                                                            <p className="text-sm text-gray-600 truncate">{interview.jobRole}</p>
                                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <ClockIcon className="w-3 h-3" />
                                                                    {interview.time}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <UserGroupIcon className="w-3 h-3" />
                                                                    {interview.interviewRound}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Interviews */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming This Week</h3>

                                <div className="space-y-4">
                                    {getUpcomingInterviews().length === 0 ? (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500">No upcoming interviews</p>
                                        </div>
                                    ) : (
                                        getUpcomingInterviews().map(interview => (
                                            <div
                                                key={interview.id}
                                                onClick={() => setSelectedInterview(interview)}
                                                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    {interview.candidateAvatar ? (
                                                        <img
                                                            src={interview.candidateAvatar}
                                                            alt={interview.candidateName}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                            <UserIcon className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                                                            {interview.candidateName}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 truncate">{interview.jobRole}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                                                {new Date(interview.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                            </span>
                                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                <ClockIcon className="w-3 h-3" />
                                                                {interview.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronRightIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {getUpcomingInterviews().length > 0 && (
                                    <button
                                        onClick={() => router.push('/companyadmin/interviews')}
                                        className="w-full mt-4 py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 cursor-pointer"
                                    >
                                        View All Upcoming
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interview Details Modal */}
            {selectedInterview && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4">
                        <div
                            className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity"
                            onClick={() => setSelectedInterview(null)}
                        />

                        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Modal Header */}
                            <div className="px-8 py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">Interview Details</h3>
                                        <p className="text-gray-300 text-sm mt-1">Complete interview information</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedInterview(null)}
                                        className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8">
                                <div className="space-y-6">
                                    {/* Candidate Section */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                        <div className="flex items-center gap-4">
                                            {selectedInterview.candidateAvatar ? (
                                                <img
                                                    src={selectedInterview.candidateAvatar}
                                                    alt={selectedInterview.candidateName}
                                                    className="w-16 h-16 rounded-full border-4 border-white shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white shadow-sm flex items-center justify-center">
                                                    <UserIcon className="w-8 h-8 text-blue-600" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-gray-900">{selectedInterview.candidateName}</h4>
                                                <p className="text-gray-600">{selectedInterview.candidateEmail}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    {getStatusBadge(selectedInterview.status)}
                                                    {getPriorityBadge(selectedInterview.priority)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interview Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                                                <div className="flex items-center gap-2">
                                                    <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                                                    <span className="font-semibold text-gray-900">{selectedInterview.jobRole}</span>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Round</label>
                                                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                                    {selectedInterview.interviewRound}
                                                </span>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium text-gray-900">
                                                            {selectedInterview.date.toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ClockIcon className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium text-gray-900">
                                                            {selectedInterview.time} ({selectedInterview.duration} mins)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <UserGroupIcon className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{selectedInterview.interviewerName}</p>
                                                        <p className="text-sm text-gray-600">{selectedInterview.interviewerEmail}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                                                <div className="flex items-center gap-2">
                                                    {selectedInterview.mode === 'Online' ? (
                                                        <>
                                                            <VideoCameraIcon className="w-5 h-5 text-blue-500" />
                                                            <span className="font-medium text-gray-900">Online Meeting</span>
                                                            {selectedInterview.meetingLink && (
                                                                <a
                                                                    href={selectedInterview.meetingLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="ml-auto inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                                                >
                                                                    Join
                                                                    <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MapPinIcon className="w-5 h-5 text-green-500" />
                                                            <span className="font-medium text-gray-900">On-site Interview</span>
                                                            {selectedInterview.location && (
                                                                <span className="ml-auto text-sm text-gray-600">{selectedInterview.location}</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <div className="flex flex-wrap gap-3">
                                            {selectedInterview.mode === 'Online' && selectedInterview.meetingLink && (
                                                <a
                                                    href={selectedInterview.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md cursor-pointer"
                                                >
                                                    <VideoCameraIcon className="w-5 h-5" />
                                                    Join Meeting
                                                </a>
                                            )}

                                            <button
                                                onClick={() => {
                                                    // Navigate to feedback page or open feedback modal
                                                    alert('Feedback feature coming soon');
                                                }}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                                Add Feedback
                                            </button>

                                            <button
                                                onClick={() => {
                                                    // Reschedule functionality
                                                    alert('Reschedule feature coming soon');
                                                }}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                                <CalendarIcon className="w-5 h-5" />
                                                Reschedule
                                            </button>

                                            <button
                                                onClick={() => router.push(`/companyadmin/applications/${selectedInterview.id}`)}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                                View Application
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}