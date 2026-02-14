'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    SparklesIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ClockIcon,
    UserGroupIcon,
    CalendarIcon,
    ChartBarIcon,
    DocumentTextIcon,
    BriefcaseIcon,
    ChatBubbleLeftRightIcon,
    StarIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    CpuChipIcon,
    BoltIcon,
    RectangleGroupIcon,
    QueueListIcon,
    UserIcon,
    XMarkIcon,
    PlayCircleIcon,
    PauseCircleIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import {
    CheckBadgeIcon,
    BuildingOfficeIcon,
    UsersIcon,
    DocumentCheckIcon
} from '@heroicons/react/24/solid';

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    gradient: string;
    stats?: {
        label: string;
        value: string;
    };
}

export default function SmartDashboardPreview() {
    const [activeTab, setActiveTab] = useState<'kanban' | 'interview' | 'candidate'>('kanban');
    const [isPlaying, setIsPlaying] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    // Mock demo data for preview
    const demoData = {
        kanban: {
            columns: [
                {
                    title: 'Applied',
                    count: 24,
                    color: 'blue',
                    items: [
                        { name: 'Sarah Johnson', role: 'Frontend Dev', time: '2h ago', avatar: 'SJ' },
                        { name: 'Michael Chen', role: 'UX Designer', time: '3h ago', avatar: 'MC' },
                        { name: 'Emma Wilson', role: 'Product Manager', time: '5h ago', avatar: 'EW' },
                    ]
                },
                {
                    title: 'Screening',
                    count: 12,
                    color: 'yellow',
                    items: [
                        { name: 'James Brown', role: 'Backend Dev', time: '1d ago', avatar: 'JB' },
                        { name: 'Lisa Anderson', role: 'DevOps', time: '1d ago', avatar: 'LA' },
                    ]
                },
                {
                    title: 'Interview',
                    count: 8,
                    color: 'purple',
                    items: [
                        { name: 'David Lee', role: 'Full Stack', time: 'Today', avatar: 'DL' },
                        { name: 'Anna Kim', role: 'Data Scientist', time: 'Tomorrow', avatar: 'AK' },
                    ]
                },
                {
                    title: 'Offer',
                    count: 3,
                    color: 'green',
                    items: [
                        { name: 'Robert Taylor', role: 'Tech Lead', time: 'Offered', avatar: 'RT' },
                    ]
                }
            ]
        },
        interview: {
            today: [
                { time: '10:00 AM', candidate: 'John Smith', role: 'Senior Dev', interviewer: 'Alex', status: 'scheduled' },
                { time: '11:30 AM', candidate: 'Maria Garcia', role: 'Product Designer', interviewer: 'Sarah', status: 'in-progress' },
                { time: '2:00 PM', candidate: 'Tom Wilson', role: 'QA Engineer', interviewer: 'Mike', status: 'scheduled' },
                { time: '3:30 PM', candidate: 'Priya Patel', role: 'Data Analyst', interviewer: 'James', status: 'scheduled' },
            ],
            completed: 18,
            pending: 7,
            total: 25
        },
        candidate: {
            recent: [
                { name: 'Emily Zhang', role: 'Frontend Dev', stage: 'Technical Interview', score: 92, avatar: 'EZ' },
                { name: 'Carlos Mendez', role: 'Backend Dev', stage: 'HR Round', score: 88, avatar: 'CM' },
                { name: 'Sophie Turner', role: 'Product Manager', stage: 'Final Round', score: 95, avatar: 'ST' },
                { name: 'Omar Hassan', role: 'DevOps', stage: 'Screening', score: 78, avatar: 'OH' },
            ]
        }
    };

    // Color style mapper for Tailwind
    const colorStyles = {
        blue: {
            bg: 'bg-blue-500/20',
            text: 'text-blue-300',
            border: 'border-blue-500/30',
            gradient: 'from-blue-500 to-blue-600'
        },
        yellow: {
            bg: 'bg-yellow-500/20',
            text: 'text-yellow-300',
            border: 'border-yellow-500/30',
            gradient: 'from-yellow-500 to-yellow-600'
        },
        purple: {
            bg: 'bg-purple-500/20',
            text: 'text-purple-300',
            border: 'border-purple-500/30',
            gradient: 'from-purple-500 to-purple-600'
        },
        green: {
            bg: 'bg-green-500/20',
            text: 'text-green-300',
            border: 'border-green-500/30',
            gradient: 'from-green-500 to-green-600'
        }
    };

    // Features list
    const features: Feature[] = [
        {
            id: 'visual',
            title: 'Visual Workflow',
            description: 'Drag-and-drop kanban boards for intuitive pipeline management',
            icon: RectangleGroupIcon,
            color: 'blue',
            gradient: 'from-blue-500 to-indigo-500',
            stats: { label: 'Active pipelines', value: '12' }
        },
        {
            id: 'scheduling',
            title: 'Smart Scheduling',
            description: 'AI-powered interview scheduling with calendar integration',
            icon: CalendarIcon,
            color: 'purple',
            gradient: 'from-purple-500 to-pink-500',
            stats: { label: 'Scheduled today', value: '8' }
        },
        {
            id: 'tracking',
            title: 'Candidate Tracking',
            description: 'Real-time updates on candidate progress and engagement',
            icon: UserGroupIcon,
            color: 'green',
            gradient: 'from-green-500 to-emerald-500',
            stats: { label: 'Active candidates', value: '47' }
        }
    ];

    // Mouse move effect for interactive preview
    const handleMouseMove = (e: React.MouseEvent) => {
        if (previewRef.current) {
            const rect = previewRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            setMousePosition({ x, y });
        }
    };

    // Auto-rotate through tabs
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setActiveTab(prev => {
                if (prev === 'kanban') return 'interview';
                if (prev === 'interview') return 'candidate';
                return 'kanban';
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-white">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-black/10">
                        <BoltIcon className="w-4 h-4 text-amber-500" />
                        <span className="bg-gradient-to-r from-blue-700 to-purple-700 text-transparent bg-clip-text font-bold">
                            POWER YOUR RECRUITMENT
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Smart Dashboard{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Preview
                        </span>
                    </h2>

                    <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
                        Experience the future of recruitment with our intelligent dashboard.
                        Manage candidates, schedule interviews, and track progress in real-time.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        const isHovered = hoveredFeature === feature.id;

                        return (
                            <div
                                key={feature.id}
                                className="relative group cursor-pointer"
                                onMouseEnter={() => setHoveredFeature(feature.id)}
                                onMouseLeave={() => setHoveredFeature(null)}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`}></div>
                                <div className="relative bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl p-6 hover:bg-white/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-500/10 hover:border-white">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-4 shadow-lg`}>
                                        <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-gray-900" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>

                                    <p className="text-gray-700 mb-4 text-sm font-medium">
                                        {feature.description}
                                    </p>

                                    {feature.stats && (
                                        <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                            <span className="text-gray-500 text-sm font-semibold">{feature.stats.label}</span>
                                            <span className="text-gray-900 font-black text-lg">{feature.stats.value}</span>
                                        </div>
                                    )}

                                    {/* Hover Effect Arrow */}
                                    <div className={`absolute bottom-6 right-6 transform transition-all duration-300 ${isHovered ? 'translate-x-1 opacity-100' : 'opacity-0'
                                        }`}>
                                        <ArrowRightIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Interactive Dashboard Preview */}
                <div
                    ref={previewRef}
                    className="relative bg-gray-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 overflow-hidden shadow-2xl shadow-blue-900/20"
                    onMouseMove={handleMouseMove}
                    style={{
                        transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                >
                    {/* Preview Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-white/60 text-sm">Smart Dashboard • Live Preview</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Tab Navigation */}
                            <div className="flex bg-white/10 rounded-lg p-1">
                                {(['kanban', 'interview', 'candidate'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 cursor-pointer ${activeTab === tab
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {tab === 'kanban' && 'Kanban Board'}
                                        {tab === 'interview' && 'Interview Schedule'}
                                        {tab === 'candidate' && 'Candidate Tracking'}
                                    </button>
                                ))}
                            </div>

                            {/* Play/Pause Button */}
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 cursor-pointer"
                                title={isPlaying ? 'Pause Demo' : 'Play Demo'}
                            >
                                {isPlaying ? (
                                    <PauseCircleIcon className="w-5 h-5" />
                                ) : (
                                    <PlayCircleIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className="min-h-[400px]">
                        {/* Kanban Board Preview */}
                        {activeTab === 'kanban' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {demoData.kanban.columns.map((column, idx) => (
                                    <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-white font-semibold">{column.title}</h4>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorStyles[column.color as keyof typeof colorStyles].bg} ${colorStyles[column.color as keyof typeof colorStyles].text} border ${colorStyles[column.color as keyof typeof colorStyles].border}`}>
                                                {column.count}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {column.items.map((item, itemIdx) => (
                                                <div key={itemIdx} className="bg-white/10 rounded-lg p-3 border border-white/10 hover:bg-white/20 transition-all cursor-pointer group">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorStyles[column.color as keyof typeof colorStyles].gradient} flex items-center justify-center text-white font-semibold text-sm`}>
                                                            {item.avatar}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-sm font-medium truncate">{item.name}</p>
                                                            <p className="text-gray-400 text-xs truncate">{item.role}</p>
                                                            <p className="text-gray-500 text-xs mt-1">{item.time}</p>
                                                        </div>
                                                        <BoltIcon className="w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Interview Schedule Preview */}
                        {activeTab === 'interview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-4">
                                    <h4 className="text-white font-semibold mb-4">Today's Schedule</h4>
                                    {demoData.interview.today.map((interview, idx) => (
                                        <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 text-center">
                                                    <span className="text-white font-bold">{interview.time.split(' ')[0]}</span>
                                                    <span className="text-gray-500 text-xs block">{interview.time.split(' ')[1]}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-medium">{interview.candidate}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${interview.status === 'in-progress'
                                                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                                            }`}>
                                                            {interview.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm">{interview.role} • Interviewer: {interview.interviewer}</p>
                                                </div>
                                                <VideoCameraIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                                        <h4 className="text-white font-semibold mb-4">Quick Stats</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-400">Completed</span>
                                                    <span className="text-white font-bold">{demoData.interview.completed}</span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-400">Pending</span>
                                                    <span className="text-white font-bold">{demoData.interview.pending}</span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-white/10">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Total interviews</span>
                                                    <span className="text-2xl font-bold text-white">{demoData.interview.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon className="w-5 h-5 text-blue-400" />
                                            <div>
                                                <p className="text-white text-sm">Next interview in</p>
                                                <p className="text-gray-400 text-xs">45 minutes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Candidate Tracking Preview */}
                        {activeTab === 'candidate' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                <UserGroupIcon className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Total Candidates</p>
                                                <p className="text-white text-2xl font-bold">156</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                <DocumentCheckIcon className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">In Review</p>
                                                <p className="text-white text-2xl font-bold">42</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                                <ClockIcon className="w-5 h-5 text-yellow-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Interview Stage</p>
                                                <p className="text-white text-2xl font-bold">28</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                                <CheckBadgeIcon className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Offers Sent</p>
                                                <p className="text-white text-2xl font-bold">12</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                    <div className="px-6 py-4 bg-white/10 border-b border-white/10">
                                        <h4 className="text-white font-semibold">Recent Candidates</h4>
                                    </div>
                                    <div className="divide-y divide-white/10">
                                        {demoData.candidate.recent.map((candidate, idx) => (
                                            <div key={idx} className="px-6 py-4 hover:bg-white/5 transition-all cursor-pointer group">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                            {candidate.avatar}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                                                {candidate.name}
                                                            </p>
                                                            <p className="text-gray-400 text-sm">{candidate.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-gray-400 text-sm">{candidate.stage}</span>
                                                        <div className="flex items-center gap-1">
                                                            <StarIcon className="w-4 h-4 text-yellow-400" />
                                                            <span className="text-white font-bold">{candidate.score}%</span>
                                                        </div>
                                                        <ArrowRightIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Footer */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-white/60 text-sm">Live data • Updated in real-time</span>
                            </div>
                            <div className="h-4 w-px bg-white/10"></div>
                            <span className="text-white/60 text-sm">v2.4.0</span>
                        </div>

                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer group"
                        >
                            <span>Launch Dashboard</span>
                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Bottom CTA */}
                {/* <div className="mt-20 text-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-8 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-sky-500/5">
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700 font-semibold">No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700 font-semibold">Free 14-day trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700 font-semibold">Cancel anytime</span>
                        </div>
                        <Link
                            href="/signup"
                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-200 hover:-translate-y-0.5 cursor-pointer"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div> */}
            </div>
        </section>
    );
}