'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    ChatBubbleLeftRightIcon,
    StarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    BuildingOfficeIcon,
    UserCircleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    type: 'hr' | 'founder' | 'candidate';
    avatar?: string;
    content: string;
    rating: number;
    date: string;
    highlights?: string[];
}

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const testimonialRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<ReturnType<typeof setInterval>>(undefined);

    // Realistic testimonials data
    const testimonials: Testimonial[] = [
        {
            id: '1',
            name: 'Priya Sharma',
            role: 'HR Manager',
            company: 'TechSolutions Pvt Ltd',
            type: 'hr',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
            content: "We've reduced our time-to-hire by about 40% since using this platform. The candidate screening tools are particularly useful - they help us focus on the right profiles instead of going through hundreds of resumes manually. It's been a solid addition to our recruitment process.",
            rating: 4,
            date: '2 months ago',
            highlights: ['Reduced time-to-hire by 40%', 'Better candidate screening']
        },
        {
            id: '2',
            name: 'Rahul Mehta',
            role: 'Founder',
            company: 'GrowthLabs',
            type: 'founder',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
            content: "As a startup, we needed something that wouldn't break our budget but still gave us access to quality candidates. The platform strikes a good balance - reasonable pricing and we've actually made some key hires through it. The interview scheduling feature saves us a lot of back-and-forth emails.",
            rating: 5,
            date: '1 week ago',
            highlights: ['Budget-friendly', 'Quality candidates', 'Easy scheduling']
        },
        {
            id: '3',
            name: 'Ananya Desai',
            role: 'Product Designer',
            company: 'Creative Studio',
            type: 'candidate',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
            content: "Found my current role through this platform. The application process was straightforward - didn't have to fill endless forms, just uploaded my portfolio and answered a few questions. Heard back within a week. Pretty good experience overall.",
            rating: 4,
            date: '3 weeks ago',
            highlights: ['Simple application', 'Quick response', 'Good experience']
        }
    ];

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying) {
            autoPlayRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % testimonials.length);
            }, 5000);
        }
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isAutoPlaying, testimonials.length]);

    // Navigation handlers
    const handlePrevious = () => {
        setIsAutoPlaying(false);
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setIsAutoPlaying(false);
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    // Get avatar background color based on type
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'hr': return 'from-blue-500 to-indigo-500';
            case 'founder': return 'from-purple-500 to-pink-500';
            case 'candidate': return 'from-green-500 to-emerald-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    // Get type label
    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'hr': return 'HR Professional';
            case 'founder': return 'Startup Founder';
            case 'candidate': return 'Job Seeker';
            default: return '';
        }
    };

    // Type mapping for colors
    const typeStyles = {
        hr: {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            icon: 'text-blue-500'
        },
        founder: {
            bg: 'bg-purple-100',
            text: 'text-purple-700',
            icon: 'text-purple-500'
        },
        candidate: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            icon: 'text-green-500'
        }
    };

    return (
        <section className="py-24 bg-gradient-to-b from-white via-sky-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md text-gray-900 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-white/40">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-600" />
                        <span>Real Stories, Real Experiences</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        What People Are{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Saying
                        </span>
                    </h2>

                    <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
                        No fluff, just honest feedback from people who've actually used our platform
                    </p>
                </div>

                {/* Main Testimonial Display */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>

                    {/* Testimonial Card */}
                    <div
                        ref={testimonialRef}
                        className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10"
                    >
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-8 text-6xl font-serif text-gray-200 select-none">
                            "
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                i < testimonials[activeIndex].rating ? (
                                    <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
                                ) : (
                                    <StarIcon key={i} className="w-5 h-5 text-gray-300" />
                                )
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                                {testimonials[activeIndex].rating}.0
                            </span>
                        </div>

                        {/* Testimonial Content */}
                        <blockquote className="text-xl text-gray-800 leading-relaxed mb-8 relative z-10">
                            "{testimonials[activeIndex].content}"
                        </blockquote>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {testimonials[activeIndex].highlights?.map((highlight, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-200"
                                >
                                    <SparklesIcon className="w-4 h-4 text-blue-500" />
                                    {highlight}
                                </span>
                            ))}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getTypeColor(testimonials[activeIndex].type)} p-0.5`}>
                                    <div className="w-full h-full rounded-full bg-white overflow-hidden">
                                        {testimonials[activeIndex].avatar ? (
                                            <img
                                                src={testimonials[activeIndex].avatar}
                                                alt={testimonials[activeIndex].name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">
                                        {testimonials[activeIndex].name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>{testimonials[activeIndex].role}</span>
                                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        <span>{testimonials[activeIndex].company}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeStyles[testimonials[activeIndex].type].bg} ${typeStyles[testimonials[activeIndex].type].text}`}>
                                            {getTypeLabel(testimonials[activeIndex].type)}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {testimonials[activeIndex].date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Company Icon */}
                            <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                                <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={handlePrevious}
                            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 cursor-pointer group"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 cursor-pointer group"
                            aria-label="Next testimonial"
                        >
                            <ChevronRightIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        </button>
                    </div>

                    {/* Progress Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setActiveIndex(index);
                                    setIsAutoPlaying(false);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === activeIndex
                                    ? 'w-8 bg-gradient-to-r from-blue-600 to-indigo-600'
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Auto-play Toggle */}
                    <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                    >
                        <span className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        {isAutoPlaying ? 'Auto-playing' : 'Paused'}
                    </button>
                </div>
            </div>
        </section>
    );
}