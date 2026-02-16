'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    MapPin,
    Users,
    Briefcase,
    Globe,
    CheckCircle,
    Building,
    Mail,
    Phone,
    Calendar,
    ExternalLink,
    Sparkles
} from 'lucide-react';
import { companiesAPI, jobsAPI } from '../../api/companies';
import Footer from '../../components/Footer';

interface Company {
    _id: string;
    name: string;
    industry: string;
    size?: string;
    location?: string;
    website?: string;
    description?: string;
    logoUrl?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    createdAt: string;
    email?: string;
    phone?: string;
}

interface Job {
    _id: string;
    title: string;
    type: string;
    location: string;
    salary?: {
        min: number;
        max: number;
        currency: string;
    };
    createdAt: string;
}

export default function CompanyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = params.id as string;

    const [company, setCompany] = useState<Company | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (companyId) {
            fetchCompanyDetails();
            fetchCompanyJobs();
        }
    }, [companyId]);

    const fetchCompanyDetails = async () => {
        try {
            const data = await companiesAPI.getCompanyById(companyId);
            setCompany(data);
        } catch (err: any) {
            console.error('Failed to fetch company details:', err);
            setError(err.message || 'Failed to load company details');
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyJobs = async () => {
        try {
            const data = await jobsAPI.getJobsByCompany(companyId);
            setJobs(data);
        } catch (err) {
            console.error('Failed to fetch company jobs:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading company details...</p>
                </div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The company you are looking for does not exist.'}</p>
                    <button
                        onClick={() => router.push('/companies')}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Companies
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-16 lg:pt-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 -left-20 w-[600px] h-[600px] bg-white/20 rounded-full mix-blend-soft-light filter blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, -5, 0],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 -right-20 w-[600px] h-[600px] bg-sky-200/20 rounded-full mix-blend-soft-light filter blur-[120px]"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-0 py-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/companies')}
                        className="inline-flex items-center text-white hover:text-white/80 transition-colors mb-6"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Companies
                    </button>

                    {/* Company Header */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Logo */}
                            <div className="w-32 h-32 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-4 border-white/50 shadow-xl flex-shrink-0">
                                <img
                                    src={company.logoUrl
                                        ? `http://localhost:3001${company.logoUrl}`
                                        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}&backgroundColor=6366f1`
                                    }
                                    alt={company.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}`;
                                    }}
                                />
                            </div>

                            {/* Company Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h1 className="text-4xl font-bold text-white mb-2">{company.name}</h1>
                                        <p className="text-xl text-white/90">{company.industry || 'Industry not specified'}</p>
                                    </div>
                                    {company.verificationStatus === 'verified' && (
                                        <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-300/30 backdrop-blur-md text-white rounded-full text-sm font-medium">
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Verified Company
                                        </div>
                                    )}
                                </div>

                                {/* Quick Stats */}
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {company.location && (
                                        <div className="flex items-center text-white/90">
                                            <MapPin className="h-5 w-5 mr-2" />
                                            <span>{company.location}</span>
                                        </div>
                                    )}
                                    {company.size && (
                                        <div className="flex items-center text-white/90">
                                            <Users className="h-5 w-5 mr-2" />
                                            <span>{company.size}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center text-white/90">
                                        <Briefcase className="h-5 w-5 mr-2" />
                                        <span>{jobs.length} active {jobs.length === 1 ? 'job' : 'jobs'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-0 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        {company.description && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                    <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
                                    About {company.name}
                                </h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{company.description}</p>
                            </motion.div>
                        )}

                        {/* Open Positions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
                                Open Positions ({jobs.length})
                            </h2>

                            {jobs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-600">No open positions at the moment</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {jobs.map((job) => (
                                        <div
                                            key={job._id}
                                            className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                            onClick={() => router.push(`/jobs/${job._id}`)}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                    {job.type}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {job.location}
                                                </div>
                                                {job.salary && job.salary.min !== undefined && job.salary.max !== undefined && (
                                                    <div className="flex items-center">
                                                        <span className="font-medium">
                                                            {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Column - Company Details */}
                    <div className="space-y-6">
                        {/* Company Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Company Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Industry</p>
                                    <p className="text-sm font-medium text-gray-900">{company.industry || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Company Size</p>
                                    <p className="text-sm font-medium text-gray-900">{company.size || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Location</p>
                                    <p className="text-sm font-medium text-gray-900">{company.location || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Member Since</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(company.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Information Card */}
                        {(company.website || company.email || company.phone) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    {company.website && (
                                        <a
                                            href={company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="text-sm truncate">Visit Website</span>
                                            <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                                        </a>
                                    )}
                                    {company.email && (
                                        <a
                                            href={`mailto:${company.email}`}
                                            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                                        >
                                            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="text-sm truncate">{company.email}</span>
                                        </a>
                                    )}
                                    {company.phone && (
                                        <a
                                            href={`tel:${company.phone}`}
                                            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                                        >
                                            <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="text-sm">{company.phone}</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
