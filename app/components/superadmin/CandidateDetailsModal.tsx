'use client';

import { getFileUrl } from '../../api/config';
import {
    X,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    GraduationCap,
    User,
    FileText,
    Globe
} from 'lucide-react';

interface Candidate {
    _id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    dateOfBirth: string;
    gender?: string;
    phone?: string;
    title?: string;
    company?: string;
    companyId?: string;
    location?: string;
    website?: string;
    bio?: string;
    resumeUrl?: string;
    createdAt: string;
    updatedAt: string;
    skills?: string[];
    experience?: number;
    education?: string;
    status?: 'active' | 'inactive' | 'interviewing';
}

interface CandidateDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: Candidate | null;
}

export default function CandidateDetailsModal({ isOpen, onClose, candidate }: CandidateDetailsModalProps) {
    if (!isOpen || !candidate) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'interviewing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 z-70 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Candidate Profile
                        </h3>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">

                        {/* Top Section: Avatar & Basic Info */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 border-b border-gray-100 pb-8">
                            <div className="flex-shrink-0">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-md text-3xl font-bold text-indigo-600">
                                    {candidate.name.charAt(0)}
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status || 'inactive')}`}>
                                        {(candidate.status || 'inactive').charAt(0).toUpperCase() + (candidate.status || 'inactive').slice(1)}
                                    </span>
                                </div>
                                <p className="text-lg text-gray-600 font-medium">{candidate.title || 'No Title'}</p>

                                {candidate.bio && (
                                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                                        {candidate.bio}
                                    </p>
                                )}

                                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                                    {candidate.location && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                            {candidate.location}
                                        </div>
                                    )}
                                    {candidate.company && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                                            {candidate.company}
                                        </div>
                                    )}
                                    {candidate.experience !== undefined && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                            {candidate.experience} Years Exp.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Grid Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Contact Info */}
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Contact Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium text-gray-900">Email</p>
                                            <p className="text-sm text-gray-600 truncate" title={candidate.email}>{candidate.email}</p>
                                        </div>
                                    </div>
                                    {candidate.phone && (
                                        <div className="flex items-start">
                                            <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Phone</p>
                                                <p className="text-sm text-gray-600">{candidate.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    {candidate.website && (
                                        <div className="flex items-start">
                                            <Globe className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Website</p>
                                                <a href={candidate.website} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                                                    {candidate.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Education & Other Info */}
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Additional Details</h4>
                                <div className="space-y-3">
                                    {candidate.education && (
                                        <div className="flex items-start">
                                            <GraduationCap className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Education</p>
                                                <p className="text-sm text-gray-600">{candidate.education}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start">
                                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                                            <p className="text-sm text-gray-600">{formatDate(candidate.dateOfBirth)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Joined</p>
                                            <p className="text-sm text-gray-600">{formatDate(candidate.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        {candidate.skills && candidate.skills.length > 0 && (
                            <div className="mb-8">
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Skills & Expertise</h4>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resume Action */}
                        {candidate.resumeUrl && (
                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                        <FileText className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-900">Resume/CV</h5>
                                        <p className="text-xs text-gray-500">View candidate's resume</p>
                                    </div>
                                </div>
                                <a
                                    href={getFileUrl(candidate.resumeUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    View Resume
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse border-t border-gray-100">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
