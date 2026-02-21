'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    BriefcaseIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    BuildingOfficeIcon,
    ClockIcon,
    FireIcon,
    SparklesIcon,
    StarIcon,
    ArrowRightIcon,
    HeartIcon,
    BookmarkIcon,
    CheckBadgeIcon,
    AcademicCapIcon,
    WifiIcon,
    ComputerDesktopIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { motion, useScroll, useSpring } from 'framer-motion';
import { publicJobsAPI } from '../api/jobs';
import { API_BASE_URL, getFileUrl } from '../api/config';

interface Company {
    _id: string;
    name: string;
    logoUrl?: string;
    verificationStatus: string;
}

interface Job {
    _id: string;
    title: string;
    description: string;
    companyId: Company;
    location: string;
    salary?: string;
    jobType: string;
    experienceLevel: string;
    skills?: string[];
    createdAt: string;
    status: string;
}

export default function FeaturedJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [savedJobs, setSavedJobs] = useState<string[]>([]);
    const [hoveredJob, setHoveredJob] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Filter chips
    const filters = [
        { id: 'all', label: 'All Jobs', icon: BriefcaseIcon },
        { id: 'remote', label: 'Remote', icon: WifiIcon },
        { id: 'full-time', label: 'Full Time', icon: ClockIcon },
        { id: 'fresher', label: 'Fresher', icon: AcademicCapIcon },
        { id: 'internship', label: 'Internship', icon: ComputerDesktopIcon },
    ];

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const data = await publicJobsAPI.getAllJobs();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // Filter jobs based on selected filter
    const filteredJobs = jobs.filter(job => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'remote') return job.location.toLowerCase().includes('remote');
        if (activeFilter === 'full-time') return job.jobType === 'full-time';
        if (activeFilter === 'fresher') return job.experienceLevel === 'entry';
        if (activeFilter === 'internship') return job.jobType === 'internship';
        return true;
    });

    // Format salary
    const formatSalary = (salary?: string) => {
        return salary || 'Competitive Salary';
    };

    // Format time ago
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        if (seconds >= intervals.year) {
            const years = Math.floor(seconds / intervals.year);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
        if (seconds >= intervals.month) {
            const months = Math.floor(seconds / intervals.month);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        }
        if (seconds >= intervals.week) {
            const weeks = Math.floor(seconds / intervals.week);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        }
        if (seconds >= intervals.day) {
            const days = Math.floor(seconds / intervals.day);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
        if (seconds >= intervals.hour) {
            const hours = Math.floor(seconds / intervals.hour);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        if (seconds >= intervals.minute) {
            const minutes = Math.floor(seconds / intervals.minute);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        return 'Just now';
    };

    // Toggle saved job
    const toggleSaveJob = (jobId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSavedJobs(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    // Get full logo URL with fallback
    const getLogoUrl = (job: Job) => {
        const url = job.companyId?.logoUrl;
        const name = job.companyId?.name || 'Company';

        if (url) return getFileUrl(url);

        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1&fontFamily=Arial&fontWeight=bold`;
    };

    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-br from-sky-400 via-sky-500 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
                        <p className="mt-4 text-white/80">Loading featured jobs...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="py-24 relative overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-white"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6"
                    >
                        <SparklesIcon className="w-4 h-4" />
                        Professional Discovery
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight"
                    >
                        Featured <span className="text-sky-200">Opportunities</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-2xl mx-auto font-medium"
                    >
                        Handpicked roles from top-tier companies. Your next career move is just a scroll away.
                    </motion.p>
                </div>

                {/* Filter Chips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap items-center justify-center gap-3 mb-16"
                >
                    {filters.map((filter, index) => {
                        const Icon = filter.icon;
                        const isActive = activeFilter === filter.id;
                        return (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${isActive
                                    ? 'bg-white text-sky-600 shadow-xl scale-105'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-white'}`} />
                                {filter.label}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Horizontal Scroll Container */}
                <div className="relative group">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-3 bg-white text-sky-600 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 hover:scale-110 cursor-pointer hidden md:flex"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-3 bg-white text-sky-600 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 hover:scale-110 cursor-pointer hidden md:flex"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 pb-12 px-2 no-scrollbar snap-x snap-mandatory scroll-smooth"
                    >
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex-none w-[320px] md:w-[400px] snap-center"
                            >
                                <Link
                                    href={`/jobs/${job._id}`}
                                    className="block relative bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-sky-300 transition-all duration-500 overflow-hidden cursor-pointer"
                                    onMouseEnter={() => setHoveredJob(job._id)}
                                    onMouseLeave={() => setHoveredJob(null)}
                                >
                                    {/* Save Button */}
                                    <button
                                        onClick={(e) => toggleSaveJob(job._id, e)}
                                        className="absolute top-5 right-5 z-10 p-2.5 bg-gray-50/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group/save"
                                    >
                                        {savedJobs.includes(job._id) ? (
                                            <HeartIconSolid className="w-5.5 h-5.5 text-red-500" />
                                        ) : (
                                            <HeartIcon className="w-5.5 h-5.5 text-gray-400 group-hover/save:text-red-500 transition-colors" />
                                        )}
                                    </button>

                                    {/* Content */}
                                    <div className="p-8">
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                                                    <img
                                                        src={getLogoUrl(job)}
                                                        alt={job.companyId?.name || 'Company'}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            const name = job.companyId?.name || 'Company';
                                                            target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1`;
                                                        }}
                                                    />
                                                </div>
                                                {job.companyId?.verificationStatus === 'verified' && (
                                                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                                                        <CheckBadgeIcon className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-gray-900 mb-1.5 group-hover:text-sky-600 transition-colors line-clamp-2 leading-tight">
                                                    {job.title}
                                                </h3>
                                                <p className="text-gray-500 font-medium flex items-center gap-1.5">
                                                    <span>{job.companyId?.name || 'Unknown Company'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPinIcon className="w-4.5 h-4.5 text-sky-500" />
                                                <span className="truncate">{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <CurrencyDollarIcon className="w-4.5 h-4.5 text-green-500" />
                                                <span className="font-semibold text-gray-900">{formatSalary(job.salary)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <WifiIcon className="w-4.5 h-4.5 text-indigo-500" />
                                                <span className="capitalize">{job.jobType}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <ClockIcon className="w-4.5 h-4.5 text-orange-500" />
                                                <span className="capitalize">{job.experienceLevel}</span>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {job.skills && job.skills.slice(0, 3).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors hover:bg-sky-100"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.skills && job.skills.length > 3 && (
                                                <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg uppercase">
                                                    +{job.skills.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <span className="text-xs font-medium text-gray-400">
                                                {timeAgo(job.createdAt)}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-sky-600 text-sm font-bold group/apply">
                                                Quick Apply
                                                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover/apply:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hover Progress Bar */}
                                    <div className={`absolute bottom-0 left-0 h-1 bg-sky-600 transition-all duration-700 ${hoveredJob === job._id ? 'w-full' : 'w-0'}`} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* View All */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 mb-8"
                >
                    {/* <Link
                        href="/jobs"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-sky-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                    >
                        <span>Explore All 5,000+ Jobs</span>
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link> */}
                </motion.div>
            </div>

            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
