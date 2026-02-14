'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, Users, TrendingUp, Shield, Zap } from 'lucide-react';
import Hero from './components/Hero';
import Howitworks from './components/Howitworks';
import WhychooseHirehelp from './components/WhychooseHirehelp';
import Footer from './components/Footer';
import FeaturedJobs from './components/FeaturedJobs';
import SmartDashboardPreview from './components/SmartDashboardPreview';
import TestimonialsSection from './components/TestimonialsSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />


      <Howitworks />
      <FeaturedJobs />

      <WhychooseHirehelp />
      <SmartDashboardPreview />
      <TestimonialsSection />

      <Footer />
    </div>
  );
}