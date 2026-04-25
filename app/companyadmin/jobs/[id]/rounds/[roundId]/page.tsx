'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { roundsAPI, Round, MCQResponse, TopPerformer } from '../../../../../api/rounds';
import {
    ArrowLeftIcon,
    EyeIcon,
    LinkIcon,
    TableCellsIcon,
    Bars3Icon,
    QueueListIcon,
    PencilSquareIcon,
    CodeBracketIcon,
    ClockIcon,
    DocumentTextIcon,
    VideoCameraIcon,
    MapPinIcon,
    UserGroupIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

export default function RoundDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;
    const roundId = params.roundId as string;

    const [round, setRound] = useState<Round | null>(null);
    const [loading, setLoading] = useState(true);
    const [googleSheetLink, setGoogleSheetLink] = useState('');
    const [saving, setSaving] = useState(false);
    const [mcqResponses, setMcqResponses] = useState<MCQResponse[]>([]);
    const [responsesLoading, setResponsesLoading] = useState(false);
    const [responsesError, setResponsesError] = useState<string | null>(null);
    const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
    const [topPerformersError, setTopPerformersError] = useState<string | null>(null);

    const [isEditable, setIsEditable] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [roundQuestions, setRoundQuestions] = useState<any[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<MCQResponse | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (roundId) {
            fetchRound();
        }
    }, [roundId]);

    const fetchRound = async () => {
        try {
            setLoading(true);
            const data = await roundsAPI.getRoundById(roundId);
            setRound(data);
            setGoogleSheetLink(data.googleSheetLink || '');
            setIsEditable(!data.googleSheetLink);
        } catch (error) {
            console.error('Failed to fetch round:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!roundId || !round) return;

        const roundType = String(round.type || '').toLowerCase();
        // Fetch responses for MCQ rounds, or any round that might have assessment data
        const shouldFetch = roundType === 'mcq' || round.questionSetId || (round.mcqQuestions && round.mcqQuestions.length > 0) || round.googleFormLink || round.googleSheetLink;
        
        if (!shouldFetch) return;

        const fetchResponses = async () => {
            try {
                setResponsesLoading(true);
                setResponsesError(null);
                setTopPerformersError(null);
                const [data, questions] = await Promise.all([
                    roundsAPI.getMcqResponses(roundId),
                    roundsAPI.getRoundQuestions(roundId)
                ]);
                setMcqResponses(data);
                setRoundQuestions(questions);
                try {
                    const ranked = await roundsAPI.getTopPerformers(roundId, jobId, 10);
                    setTopPerformers(ranked);
                } catch (error) {
                    console.error('Failed to fetch top performers:', error);
                    setTopPerformers([]);
                    setTopPerformersError('Top performer ranking is temporarily unavailable.');
                }
            } catch (error) {
                console.error('Failed to fetch MCQ responses:', error);
                setResponsesError('Failed to load candidate MCQ submissions.');
            } finally {
                setResponsesLoading(false);
            }
        };

        void fetchResponses();
    }, [roundId, round]);

    const getAnswerLabel = (answerIndex: number) => {
        if (answerIndex === null || answerIndex === undefined || answerIndex < 0) {
            return 'Not answered';
        }
        return `Option ${answerIndex + 1}`;
    };

    const completedResponses = mcqResponses.filter((response) => {
        return Boolean(response.isSubmitted || response.submittedAt);
    });

    const topScore = topPerformers.length ? topPerformers[0].score : null;
    const topPerformerApplicationIds = new Set(
        topPerformers
            .filter((performer) => topScore !== null && performer.score === topScore)
            .map((performer) => performer.applicationId),
    );

    const saveSheetLink = async () => {
        if (!round) return;
        try {
            setSaving(true);
            let linkToSave = googleSheetLink.trim();

            // Basic URL validation/correction
            if (linkToSave && !linkToSave.match(/^https?:\/\//)) {
                linkToSave = `https://${linkToSave}`;
                setGoogleSheetLink(linkToSave);
            }

            // If empty string, send null to clear the field
            const payload = { googleSheetLink: linkToSave || null };

            await roundsAPI.updateRound(round._id, payload);

            // Update local state
            setRound({ ...round, googleSheetLink: linkToSave || null });
            setIsEditable(false);
            alert('Google Sheet link saved successfully!');
        } catch (error: any) {
            console.error('Failed to update google sheet link:', error);
            alert(`Failed to save Google Sheet link: ${error.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSync = async () => {
        if (!round || !googleSheetLink) return;
        try {
            setIsSyncing(true);
            const result = await roundsAPI.syncExternalRound(round._id, googleSheetLink);
            alert(`Sync completed! ${result.synced} responses processed.`);
            // Refresh the page data
            fetchRound();
            // Re-fetch responses (this is handled by the useEffect watching roundId and round)
        } catch (error: any) {
            console.error('Failed to sync round:', error);
            alert(`Failed to sync: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSyncing(false);
        }
    };

    const renderMcqSubmissionHistory = () => {
        if (!round) return null;
        const passPercentage = round.passPercentage ?? 60;

        return (
            <div className="space-y-6">
                {topPerformers.length > 0 && topScore !== null && (
                    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                        <p className="text-sm font-semibold text-indigo-900">
                            Top Performer{topPerformers.filter((performer) => performer.score === topScore).length > 1 ? 's' : ''} ({topScore.toFixed(2)}%)
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {topPerformers
                                .filter((performer) => performer.score === topScore)
                                .map((performer) => (
                                    <span
                                        key={`${performer.applicationId}-${performer.rank}`}
                                        className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-800"
                                    >
                                        {performer.candidateName} ({performer.candidateEmail || 'No email'})
                                    </span>
                                ))}
                        </div>
                    </div>
                )}

                {responsesLoading ? (
                    <div className="py-8 text-center text-sm text-gray-500">Loading candidate submissions...</div>
                ) : responsesError ? (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {responsesError}
                    </div>
                ) : completedResponses.length === 0 ? (
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        No candidate has completed this MCQ test yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="border-b border-gray-200 px-3 py-2 font-semibold text-gray-700">Candidate</th>
                                    <th className="border-b border-gray-200 px-3 py-2 font-semibold text-gray-700">Email</th>
                                    <th className="border-b border-gray-200 px-3 py-2 font-semibold text-gray-700">Submitted At</th>
                                    <th className="border-b border-gray-200 px-3 py-2 font-semibold text-gray-700">Score</th>
                                    <th className="border-b border-gray-200 px-3 py-2 font-semibold text-gray-700">Auto Evaluation</th>
                                    <th className="border-b border-gray-200 px-3 py-2 font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedResponses.map((response) => {
                                    const score = response.score ?? 0;
                                    const passed = score >= passPercentage;
                                    const rawApplicationId = response.applicationId?._id;
                                    const applicationId = rawApplicationId?.toString?.() ?? rawApplicationId;
                                    const isTopPerformer = Boolean(applicationId && topPerformerApplicationIds.has(applicationId));

                                    return (
                                        <tr
                                            key={response._id}
                                            className={`align-top hover:bg-gray-50 ${isTopPerformer ? 'bg-indigo-50/60' : ''}`}
                                        >
                                            <td className="border-b border-gray-100 px-3 py-3 font-medium text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <span>{(response.applicationId as any)?.candidateId?.name || 'Unknown Candidate'}</span>
                                                    {isTopPerformer && (
                                                        <span className="inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                                                            Top Performer
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border-b border-gray-100 px-3 py-3 text-gray-700">
                                                {(response.applicationId as any)?.candidateId?.email || '-'}
                                            </td>
                                            <td className="border-b border-gray-100 px-3 py-3 text-gray-700">
                                                {response.submittedAt
                                                    ? new Date(response.submittedAt).toLocaleString()
                                                    : '-'}
                                            </td>
                                            <td className="border-b border-gray-100 px-3 py-3 text-gray-800">
                                                {response.correctAnswersCount !== undefined && response.totalQuestions !== undefined
                                                    ? `${response.correctAnswersCount} / ${response.totalQuestions} (${score.toFixed(2)}%)`
                                                    : `${score.toFixed(2)}%`}
                                            </td>
                                            <td className="border-b border-gray-100 px-3 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${passed
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {passed ? `Passed (>= ${passPercentage}%)` : `Failed (< ${passPercentage}%)`}
                                                </span>
                                            </td>
                                            <td className="border-b border-gray-100 px-3 py-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubmission(response);
                                                        setShowModal(true);
                                                    }}
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    <EyeIcon className="w-4 h-4 mr-1" />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500">Loading round details...</p>
                </div>
            </div>
        );
    }

    if (!round) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Round Not Found</h2>
                    <button
                        onClick={() => router.push(`/companyadmin/jobs/${jobId}/rounds`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Back to Rounds
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header & Back Button */}
            <div className="w-full mb-6">
                <button
                    onClick={() => router.push(`/companyadmin/jobs/${jobId}/rounds`)}
                    className="inline-flex items-center text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-sm px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to Rounds
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{round.name}</h1>
                        <p className="text-gray-500 mt-1">Round details and configuration</p>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full uppercase tracking-wide">
                        {round.type}
                    </div>
                </div>
            </div>

            <div className="w-full bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Round Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-100">
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <QueueListIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Round Order</label>
                                <div className="text-lg font-semibold text-gray-900">{round.order}</div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <Bars3Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                    {round.description || 'No description provided for this round.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Links Section */}
                    {round.type === 'coding' ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 transition-all hover:shadow-md">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                            <CodeBracketIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                            Coding Platform
                                        </h3>
                                    </div>
                                    <p className="text-gray-800 font-medium text-lg pl-1">
                                        {round.platform || 'Not specified'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 pl-1">Platform used for this test</p>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 transition-all hover:shadow-md">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                                            <ClockIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                            Test Duration
                                        </h3>
                                    </div>
                                    <p className="text-gray-800 font-medium text-lg pl-1">
                                        {round.duration || 'Not specified'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 pl-1">Allocated time for candidates</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 transition-all hover:shadow-md">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-gray-600">
                                        <DocumentTextIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                        Instructions
                                    </h3>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-white p-5 rounded-xl border border-gray-200 shadow-sm leading-relaxed">
                                    {round.instructions || 'No special instructions provided.'}
                                </div>
                            </div>
                        </div>
                    ) : round.type === 'interview' || round.type === 'technical' || round.type === 'hr' ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 transition-all hover:shadow-md">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                            {round.interviewMode === 'online' ? (
                                                <VideoCameraIcon className="w-6 h-6" />
                                            ) : (
                                                <MapPinIcon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                            Interview Mode
                                        </h3>
                                    </div>
                                    <p className="text-gray-800 font-medium text-lg pl-1 capitalize">
                                        {round.interviewMode || 'Not specified'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 pl-1">
                                        {round.interviewMode === 'online' ? 'Conducted remotely' : 'Conducted in-person'}
                                    </p>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 transition-all hover:shadow-md">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                                            <UserGroupIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                            Interview Type
                                        </h3>
                                    </div>
                                    <p className="text-gray-800 font-medium text-lg pl-1 capitalize">
                                        {(round.interviewType || 'one-to-one').replace('-', ' ')}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 pl-1">Format of the interview</p>
                                </div>
                            </div>

                            {/* Schedule & Timing */}
                            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 transition-all hover:shadow-md">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                        <CalendarIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                        Schedule & Timing
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-1">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="text-gray-900 font-medium text-base">
                                            {round.scheduledAt
                                                ? new Date(round.scheduledAt).toLocaleString(undefined, {
                                                    dateStyle: 'full',
                                                    timeStyle: 'short'
                                                })
                                                : 'Not scheduled yet'}
                                        </p>
                                    </div>
                                    {round.duration && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="text-gray-900 font-medium text-base">{round.duration}</p>
                                        </div>
                                    )}
                                    {round.interviewMode === 'offline' && round.scheduling?.reportingTime && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Reporting Time</p>
                                            <p className="text-gray-900 font-medium text-base">{round.scheduling.reportingTime}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Online: Meeting Link */}
                            {round.interviewMode === 'online' && (
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <LinkIcon className="w-5 h-5 mr-2 text-gray-500" />
                                        Meeting Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Platform</p>
                                            <p className="text-gray-900 font-medium">{round.platform || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Meeting Link</p>
                                            {round.meetingLink ? (
                                                <a
                                                    href={round.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 font-medium underline break-all"
                                                >
                                                    {round.meetingLink}
                                                </a>
                                            ) : (
                                                <p className="text-gray-500 italic">No meeting link provided</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Offline: Location Details */}
                            {round.interviewMode === 'offline' && round.locationDetails && (
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />
                                        Location Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Venue Name</p>
                                            <p className="text-gray-900 font-medium">{round.locationDetails.venueName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">City</p>
                                            <p className="text-gray-900 font-medium">{round.locationDetails.city}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-gray-500 mb-1">Address</p>
                                            <p className="text-gray-900 font-medium whitespace-pre-wrap">{round.locationDetails.address}</p>
                                        </div>
                                        {round.locationDetails.landmark && (
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-gray-500 mb-1">Landmark</p>
                                                <p className="text-gray-900 font-medium">{round.locationDetails.landmark}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Interviewers List */}
                            {round.interviewers && round.interviewers.length > 0 && (
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <UserGroupIcon className="w-5 h-5 mr-2 text-gray-500" />
                                        Interview Panel
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {round.interviewers.map((interviewer, idx) => (
                                            <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                                                    {interviewer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{interviewer.name}</p>
                                                    <p className="text-xs text-gray-500">{interviewer.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            {round.instructions && (
                                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <DocumentTextIcon className="w-5 h-5 mr-2 text-yellow-600" />
                                        Instructions
                                    </h3>
                                    <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {round.instructions}
                                    </div>
                                </div>
                            )}

                            {/* MCQ Submission History for Interview/Technical Rounds */}
                            {(mcqResponses.length > 0 || round.questionSetId || (round.mcqQuestions && round.mcqQuestions.length > 0) || round.googleFormLink) && (
                                <div className="mt-12 pt-12 border-t border-gray-100">
                                    <h3 className="mb-6 text-xl font-bold text-gray-900 flex items-center">
                                        <TableCellsIcon className="w-6 h-6 mr-2 text-indigo-600" />
                                        Candidate MCQ Submission History
                                    </h3>
                                    {renderMcqSubmissionHistory()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
                                Assessment Resources
                            </h3>

                            <div className="space-y-6">
                                {/* Google Form Link */}
                                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Google Form Link</label>
                                    {round.googleFormLink ? (
                                        <div className="flex items-center justify-between bg-white border border-gray-300 rounded-md p-3">
                                            <span className="text-gray-600 truncate flex-1 mr-4 select-all text-sm">{round.googleFormLink}</span>
                                            <a
                                                href={round.googleFormLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                            >
                                                Open Form <LinkIcon className="ml-1.5 w-3 h-3" />
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">No Google Form link provided.</p>
                                    )}
                                </div>

                                {/* Google Sheet Link */}
                                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                                    <label htmlFor="googleSheetLink" className="block text-sm font-semibold text-blue-900 mb-2">
                                        Google Sheet Link (Responses) <span className="font-normal text-blue-600 ml-1">- Editable</span>
                                    </label>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-grow rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <TableCellsIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="url"
                                                name="googleSheetLink"
                                                id="googleSheetLink"
                                                readOnly={!isEditable}
                                                className={`block w-full rounded-md border-gray-300 pl-10 pr-32 focus:ring-blue-500 sm:text-sm py-2.5 ${isEditable
                                                    ? 'focus:border-blue-500 bg-white'
                                                    : 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                                                    }`}
                                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                                value={googleSheetLink}
                                                onChange={(e) => setGoogleSheetLink(e.target.value)}
                                            />
                                            {googleSheetLink && (
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleSync}
                                                        disabled={isSyncing || saving}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                                                    >
                                                        {isSyncing ? 'Syncing...' : 'Sync Now'} <ClockIcon className="ml-1.5 w-3 h-3" />
                                                    </button>
                                                    <a
                                                        href={googleSheetLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                    >
                                                        Open Sheet <LinkIcon className="ml-1.5 w-3 h-3" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {isEditable ? (
                                                <button
                                                    type="button"
                                                    onClick={saveSheetLink}
                                                    disabled={saving}
                                                    className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors min-w-[80px]"
                                                >
                                                    {saving ? 'Saving...' : 'Save'}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditable(true)}
                                                    className="inline-flex items-center justify-center p-2.5 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-10 sm:w-auto"
                                                    title="Edit Link"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-blue-700">
                                        Paste the link to the Google Sheet where form responses are collected. This allows direct access to candidate submissions.
                                    </p>
                                </div>
                            </div>

                            {/* Internal/External MCQ Submission Table */}
                            <div className="rounded-lg border border-gray-200 bg-white p-5">
                                <h3 className="mb-4 text-lg font-bold text-gray-900">Candidate MCQ Submission History</h3>

                                {topPerformersError && (
                                    <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                                        {topPerformersError}
                                    </div>
                                )}

                                {renderMcqSubmissionHistory()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Submission Details Modal */}
            {showModal && selectedSubmission && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                                                Submission Details: {(selectedSubmission.applicationId as any)?.candidateId?.name}
                                            </h3>
                                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                                <span className="sr-only">Close</span>
                                                <ArrowLeftIcon className="h-6 w-6 rotate-180" />
                                            </button>
                                        </div>

                                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                                            {roundQuestions.length > 0 ? (
                                                roundQuestions.map((q, idx) => {
                                                    const selectedAnswerIndex = selectedSubmission.answers?.[idx];
                                                    const isCorrect = selectedSubmission.isCorrect?.[idx];
                                                    const correctAnswerIndex = q.correctAnswer;

                                                    return (
                                                        <div key={q._id || idx} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : selectedAnswerIndex === -1 ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}>
                                                            <p className="font-semibold text-gray-900 mb-3">
                                                                Q{idx + 1}: {q.questionText || q.question}
                                                            </p>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {q.options.map((option: string, optIdx: number) => {
                                                                    const isSelected = selectedAnswerIndex === optIdx;
                                                                    const isCorrectOption = correctAnswerIndex === optIdx;

                                                                    return (
                                                                        <div
                                                                            key={optIdx}
                                                                            className={`p-3 rounded-md border text-sm ${isSelected && isCorrectOption
                                                                                    ? 'bg-green-100 border-green-500 text-green-900 font-medium'
                                                                                    : isSelected
                                                                                        ? 'bg-red-100 border-red-500 text-red-900 font-medium'
                                                                                        : isCorrectOption
                                                                                            ? 'bg-green-50 border-green-300 text-green-800'
                                                                                            : 'bg-white border-gray-200 text-gray-600'
                                                                                }`}
                                                                        >
                                                                            <span className="mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                                                                            {option}
                                                                            {isSelected && <span className="ml-2 font-bold">(Selected)</span>}
                                                                            {isCorrectOption && <span className="ml-2 font-bold text-green-600">✓ Correct</span>}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-8 text-gray-500 italic">
                                                    Question details are not available for this submission.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
