'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, Filter, ChevronDown, Sparkles } from 'lucide-react';

interface SearchBarProps {
    onSearch?: (data: { query: string; location: string; category: string }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [isFocused, setIsFocused] = useState<string | null>(null);

    const categories = [
        'Software Development',
        'Design',
        'Marketing',
        'Sales',
        'Customer Support',
        'Product Management',
        'Data Science',
        'Human Resources'
    ];

    const popularSearches = [
        'Frontend Developer',
        'UI/UX Designer',
        'Remote',
        'Marketing Manager',
        'Full Stack'
    ];

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        if (onSearch) {
            onSearch({ query, location, category });
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
            >
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                <form
                    onSubmit={handleSubmit}
                    className="relative flex flex-col md:flex-row items-stretch bg-white/95 backdrop-blur-2xl p-2 rounded-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
                >
                    {/* Query Input */}
                    <div className={`flex-[1.2] flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isFocused === 'query' ? 'bg-sky-50/50 shadow-inner' : 'bg-transparent'}`}>
                        <Search className={`h-5 w-5 mr-3 transition-all duration-300 ${isFocused === 'query' ? 'text-sky-600 scale-110' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="Job title, keywords..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused('query')}
                            onBlur={() => setIsFocused(null)}
                            aria-label="Job title or keywords"
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 text-lg font-medium"
                        />
                    </div>

                    <div className="hidden md:block w-px h-8 self-center bg-gray-200/60 mx-1" />

                    {/* Location Input */}
                    <div className={`flex-1 flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isFocused === 'location' ? 'bg-sky-50/50 shadow-inner' : 'bg-transparent'}`}>
                        <MapPin className={`h-5 w-5 mr-3 transition-all duration-300 ${isFocused === 'location' ? 'text-sky-600 scale-110' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="City or Remote"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onFocus={() => setIsFocused('location')}
                            onBlur={() => setIsFocused(null)}
                            aria-label="Location"
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 text-lg font-medium"
                        />
                    </div>

                    <div className="hidden md:block w-px h-8 self-center bg-gray-200/60 mx-1" />

                    {/* Category Select */}
                    <div className={`flex-[0.8] flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isFocused === 'category' ? 'bg-sky-50/50 shadow-inner' : 'bg-transparent'}`}>
                        <Briefcase className={`h-5 w-5 mr-3 transition-all duration-300 ${isFocused === 'category' ? 'text-sky-600 scale-110' : 'text-gray-400'}`} />
                        <div className="relative w-full">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                onFocus={() => setIsFocused('category')}
                                onBlur={() => setIsFocused(null)}
                                aria-label="Job category"
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 text-lg font-medium appearance-none cursor-pointer pr-8"
                            >
                                <option value="">Any Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Search Button */}
                    <motion.button
                        disabled={isLoading}
                        whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="md:ml-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 group transition-all duration-300 relative overflow-hidden disabled:opacity-80"
                    >
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                />
                            ) : (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2"
                                >
                                    <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                    <span>Search</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.div
                            className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                        />
                    </motion.button>
                </form>
            </motion.div>

            {/* Popular Searches */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
                <span className="text-white/70 text-sm font-semibold uppercase tracking-wider">Trending:</span>
                {popularSearches.map((item, idx) => (
                    <motion.button
                        key={item}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + idx * 0.1 }}
                        whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                        onClick={() => setQuery(item)}
                        className="px-5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:border-white/50 transition-all duration-200 shadow-sm"
                    >
                        {item}
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
}
