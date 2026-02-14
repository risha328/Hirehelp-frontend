'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  ArrowRight,
  Sparkles,
  Users,
  Building,
  CheckCircle
} from 'lucide-react';
import TypingAnimation from './TypingAnimation';
import SearchBar from './SearchBar';

import { motion, AnimatePresence } from 'framer-motion';
import SplitText from './animations/SplitText';

export default function Hero() {
  const stats = [
    { value: '50K+', label: 'Active Jobs' },
    { value: '10K+', label: 'Companies' },
    { value: '200K+', label: 'Candidates' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-white">
      {/* Background Elements */}
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

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:30px_30px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md mb-8 shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
              AI-POWERED RECRUITMENT EXCELLENCE
            </span>
          </motion.div>

          {/* Main Heading */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-md">
              <SplitText
                text="Find Your"
                className="mr-4"
                delay={0.2}
              />
              <TypingAnimation
                words={['Dream Career', 'Perfect Role', 'Next Opportunity', 'Future Path']}
                className="block text-white pb-2"
                cursorClassName="text-white"
              />
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Discover opportunities that align with your passion and skill set.
              The future of your career starts here.
            </motion.p>
          </div>

          {/* Professional Search Bar */}
          <div className="mb-16">
            <SearchBar
              onSearch={(data) => {
                console.log('Hero Search:', data);
                // Handle search routing here if needed
              }}
            />
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/auth/register"
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-sky-600 font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95"
            >
              <span className="relative z-10 text-lg">Start Hiring</span>
              <motion.div
                className="absolute inset-0 bg-sky-50 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <Link
              href="/companies"
              className="inline-flex items-center justify-center px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/40 backdrop-blur-md transition-all duration-300 group shadow-lg active:scale-95 hover:border-white/60"
            >
              <Building className="h-6 w-6 mr-2 group-hover:rotate-6 transition-transform" />
              <span className="text-lg">View Companies</span>
            </Link>
          </motion.div>
        </div>
      </div>

    </div>
  );
}