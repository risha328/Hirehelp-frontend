'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, Users, TrendingUp, Shield, Zap } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Howitworks from './components/Howitworks';
import WhychooseHirehelp from './components/WhychooseHirehelp';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <Hero />

      <Howitworks />

      <WhychooseHirehelp />

      <Footer />
    </div>
  );
}