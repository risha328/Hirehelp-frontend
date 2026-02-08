'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { roundsAPI, Round } from '../../../../../api/rounds';
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

    const [isEditable, setIsEditable] = useState(false);

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
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
