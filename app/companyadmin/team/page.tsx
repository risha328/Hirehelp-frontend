'use client';

import { useState, useEffect } from 'react';
import { companiesAPI } from '../../api/companies';
import { Plus, X, User, Mail, Shield, Users, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Loader from '../../components/Loader';

interface TeamMember {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    lastActive?: string;
    avatar?: string;
}

export default function TeamManagementPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [companyId, setCompanyId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Invite Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'INTERVIEWER'
    });
    const [inviteLoading, setInviteLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { company } = await companiesAPI.getMyCompany();
            if (company && company._id) {
                setCompanyId(company._id);
                const admins = await companiesAPI.getCompanyAdmins(company._id);
                setMembers(admins);
            }
        } catch (error) {
            console.error('Failed to fetch team data:', error);
            setNotification({
                type: 'error',
                message: 'Failed to load team members. Please refresh the page.'
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors: { name?: string; email?: string } = {};
        if (!formData.name.trim()) {
            errors.name = 'Full name is required';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInviteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId || !validateForm()) return;

        setInviteLoading(true);
        try {
            await companiesAPI.inviteMember(companyId, formData);

            setFormData({ name: '', email: '', role: 'INTERVIEWER' });
            setShowInviteModal(false);
            setFormErrors({});

            const admins = await companiesAPI.getCompanyAdmins(companyId);
            setMembers(admins);

            setNotification({
                type: 'success',
                message: 'Invitation sent successfully! The team member will be notified via email.'
            });
        } catch (error: any) {
            console.error('Invite failed:', error);
            setNotification({
                type: 'error',
                message: error.message || 'Failed to send invitation. Please try again.'
            });
        } finally {
            setInviteLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'COMPANY_ADMIN':
                return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm shadow-purple-200';
            case 'INTERVIEWER':
                return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-200';
            default:
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm shadow-gray-200';
        }
    };

    if (loading) {
        return <Loader variant="container" text="Team Management" subText="Loading your organization chart..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-6 right-6 z-50 animate-slide-in">
                    <div className={`flex items-center p-4 rounded-xl shadow-xl backdrop-blur-sm ${notification.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                        }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        )}
                        <p className="text-sm font-medium">{notification.message}</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-200">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Team Management
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                                Manage your organization's administrators and interviewers
                                <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                                <span className="text-gray-700 font-medium">{members.length} members</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                        <span className="font-semibold">Invite Team Member</span>
                    </button>
                </div>

                {/* Members Grid/Table */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm backdrop-filter">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span>Team Member</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span>Email</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <Shield className="w-4 h-4 text-gray-500" />
                                            <span>Role</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            </div>
                                            <span>Status</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {members.length > 0 ? (
                                    members.map((member, index) => (
                                        <tr
                                            key={member._id}
                                            className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="relative">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-blue-200">
                                                            {member.avatar ? (
                                                                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-xl object-cover" />
                                                            ) : (
                                                                getInitials(member.name)
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                            {member.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            Joined {new Date(member.createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                                                    {member.email}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                    {member.role === 'COMPANY_ADMIN' ? 'Company Admin' : 'Interviewer'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="relative">
                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                        <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                                        Active
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16">
                                            <div className="text-center">
                                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                                    <Users className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
                                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                                    Start building your team by inviting administrators and interviewers to join your organization.
                                                </p>
                                                <button
                                                    onClick={() => setShowInviteModal(true)}
                                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-200"
                                                >
                                                    <Plus className="w-5 h-5 mr-2" />
                                                    Invite Your First Member
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Invite Modal - Enhanced */}
                {showInviteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-in">
                            {/* Modal Header */}
                            <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Invite Team Member</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Send an invitation to join your organization
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowInviteModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
                                    >
                                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleInviteSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${formErrors.name
                                                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                                                : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                            placeholder="e.g., John Smith"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                                            }}
                                        />
                                    </div>
                                    {formErrors.name && (
                                        <p className="mt-1.5 text-xs text-rose-600 flex items-center">
                                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Email Address <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${formErrors.email
                                                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                                                : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                            placeholder="e.g., john@company.com"
                                            value={formData.email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, email: e.target.value });
                                                if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                                            }}
                                        />
                                    </div>
                                    {formErrors.email && (
                                        <p className="mt-1.5 text-xs text-rose-600 flex items-center">
                                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                                            {formErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Role & Permissions
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                                        <select
                                            className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none bg-white text-gray-900"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="INTERVIEWER">Interviewer - Limited Access</option>
                                            <option value="COMPANY_ADMIN">Company Admin - Full Access</option>
                                        </select>
                                        <div className="absolute right-3.5 top-3 text-gray-400 pointer-events-none">
                                            <ChevronRight className="w-5 h-5 rotate-90" />
                                        </div>
                                    </div>

                                    {/* Role Description Card */}
                                    <div className={`mt-3 p-3 rounded-xl ${formData.role === 'COMPANY_ADMIN'
                                        ? 'bg-purple-50 border border-purple-100'
                                        : 'bg-emerald-50 border border-emerald-100'
                                        }`}>
                                        <div className="flex items-start space-x-2">
                                            <Shield className={`w-4 h-4 mt-0.5 ${formData.role === 'COMPANY_ADMIN' ? 'text-purple-600' : 'text-emerald-600'
                                                }`} />
                                            <div>
                                                <p className={`text-xs font-medium ${formData.role === 'COMPANY_ADMIN' ? 'text-purple-800' : 'text-emerald-800'
                                                    }`}>
                                                    {formData.role === 'COMPANY_ADMIN'
                                                        ? 'Administrator Access'
                                                        : 'Interviewer Access'}
                                                </p>
                                                <p className={`text-xs ${formData.role === 'COMPANY_ADMIN' ? 'text-purple-600' : 'text-emerald-600'
                                                    } mt-0.5`}>
                                                    {formData.role === 'COMPANY_ADMIN'
                                                        ? 'Can manage team, jobs, candidates, and company settings'
                                                        : 'Can conduct interviews and view assigned candidates'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowInviteModal(false)}
                                        className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all font-medium hover:shadow-md active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={inviteLoading}
                                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center min-w-[140px] justify-center active:scale-95"
                                    >
                                        {inviteLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Invitation'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-slide-in {
                    animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                
                .animate-scale-in {
                    animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
}