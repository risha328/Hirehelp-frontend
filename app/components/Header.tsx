'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function TransparentHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isCompaniesDropdownOpen, setIsCompaniesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const currentUser = user;

  // Handle scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  // Don't render header on auth pages, profile page, and companyadmin pages
  if (pathname.startsWith('/auth') || pathname === '/profile' || pathname.startsWith('/companyadmin')) {
    return null;
  }

  // Check if current page has blue background theme
  const hasBlueBackground = pathname === '/about' || pathname === '/contactus';

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/', current: pathname === '/' },
    { 
      name: 'Jobs', 
      href: '/jobs',
      current: pathname.startsWith('/jobs'),
      dropdown: [
        { name: 'Browse Jobs', href: '/jobs', description: 'Find your next opportunity' },
        { name: 'Remote Jobs', href: '/jobs?type=remote', description: 'Work from anywhere' },
        { name: 'Full-time Jobs', href: '/jobs?type=full-time', description: 'Permanent positions' },
        { name: 'Part-time Jobs', href: '/jobs?type=part-time', description: 'Flexible schedules' },
        { name: 'Contract Jobs', href: '/jobs?type=contract', description: 'Project-based work' },
        { name: 'Internships', href: '/jobs?type=internship', description: 'Entry-level positions' },
      ]
    },
    { 
      name: 'Company Lists', 
      href: '/companies',
      current: pathname.startsWith('/companies'),
      dropdown: [
        { name: 'Top Companies', href: '/companies/top', description: 'Best places to work' },
        { name: 'Tech Companies', href: '/companies/tech', description: 'Technology sector' },
        { name: 'Startups', href: '/companies/startups', description: 'Innovative companies' },
        { name: 'Remote-first', href: '/companies/remote-first', description: 'Remote-friendly' },
        { name: 'Hiring Now', href: '/companies/hiring', description: 'Actively recruiting' },
      ]
    },
    { name: 'About', href: '/about', current: pathname.startsWith('/about') },
    { name: 'Contact Us', href: '/contactus', current: pathname.startsWith('/contact') },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || isMenuOpen
        ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20'
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className={`w-10 h-10 ${
                  isScrolled || isMenuOpen
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                    : 'bg-white/20 backdrop-blur-sm'
                } rounded-xl flex items-center justify-center shadow-lg transition-all duration-300`}>
                  <Briefcase className={`h-6 w-6 ${
                    isScrolled || isMenuOpen ? 'text-white' : 'text-white'
                  }`} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                  isScrolled || isMenuOpen ? 'text-gray-900' : 'text-white'
                }`}>
                  Hire<span className={isScrolled || isMenuOpen ? 'text-blue-600' : 'text-blue-300'}>Help</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {!(hasBlueBackground && isScrolled) && (
              <nav className="hidden lg:flex lg:ml-12 lg:items-center lg:space-x-1">
                {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <div
                      className="group"
                      onMouseEnter={() => item.name === 'Jobs' ? setIsJobsDropdownOpen(true) : setIsCompaniesDropdownOpen(true)}
                      onMouseLeave={() => item.name === 'Jobs' ? setIsJobsDropdownOpen(false) : setIsCompaniesDropdownOpen(false)}
                    >
                      <button
                        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          item.current
                            ? 'bg-white/20 text-white backdrop-blur-sm'
                            : isScrolled || isMenuOpen
                              ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                              : 'text-white hover:text-gray-100 hover:bg-white/10'
                        }`}
                      >
                        {item.name}
                        <ChevronDown className={`ml-1.5 h-4 w-4 transition-transform duration-200 ${
                          (item.name === 'Jobs' && isJobsDropdownOpen) || 
                          (item.name === 'Company Lists' && isCompaniesDropdownOpen)
                            ? 'rotate-180'
                            : ''
                        } ${isScrolled || isMenuOpen ? 'text-gray-600' : 'text-white/70'}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {(item.name === 'Jobs' && isJobsDropdownOpen) || 
                       (item.name === 'Company Lists' && isCompaniesDropdownOpen) ? (
                        <div className="absolute left-0 mt-1 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100/50">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Explore opportunities</p>
                          </div>
                          <div className="py-2">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="flex flex-col px-4 py-3 hover:bg-blue-50/50 transition-colors group/item"
                              >
                                <span className="font-medium text-gray-900 group-hover/item:text-blue-700">
                                  {subItem.name}
                                </span>
                                <span className="text-xs text-gray-500 mt-0.5">
                                  {subItem.description}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="px-4 py-3 border-t border-gray-100/50">
                            <Link
                              href={item.href}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                            >
                              View all {item.name.toLowerCase()}
                              <ChevronDown className="h-4 w-4 ml-1 rotate-90" />
                            </Link>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        item.current
                          ? 'bg-white/20 text-white backdrop-blur-sm'
                          : isScrolled || isMenuOpen
                            ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                            : 'text-white hover:text-gray-100 hover:bg-white/10'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            )}
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {currentUser ? (
              // User Avatar Dropdown for logged-in users
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white transition-all duration-300 ${
                    isScrolled || isMenuOpen
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                  }`}
                  title={currentUser.name}
                >
                  {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100/50">
                      <p className="font-semibold text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{currentUser.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                        router.push('/');
                      }}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isScrolled || isMenuOpen
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                      : 'text-gray-900 hover:text-gray-700 hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isScrolled || isMenuOpen
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/register?role=company"
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isScrolled || isMenuOpen
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                  }`}
                >
                  Post a Job
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled || isMenuOpen
                ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                : 'text-gray-900 hover:text-gray-700 hover:bg-white/10'
            }`}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 py-4 animate-in slide-in-from-top-5 bg-white/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl mx-2">
            {/* Navigation Links */}
            <div className="space-y-1 px-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          if (item.name === 'Jobs') setIsJobsDropdownOpen(!isJobsDropdownOpen);
                          if (item.name === 'Company Lists') setIsCompaniesDropdownOpen(!isCompaniesDropdownOpen);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                          item.current
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                        }`}
                      >
                        {item.name}
                        <ChevronDown className={`h-5 w-5 transition-transform ${
                          (item.name === 'Jobs' && isJobsDropdownOpen) || 
                          (item.name === 'Company Lists' && isCompaniesDropdownOpen)
                            ? 'rotate-180'
                            : ''
                        }`} />
                      </button>
                      
                      {/* Mobile Dropdown */}
                      {(item.name === 'Jobs' && isJobsDropdownOpen) || 
                       (item.name === 'Company Lists' && isCompaniesDropdownOpen) ? (
                        <div className="ml-6 mt-1 space-y-1 border-l border-gray-200/50 pl-4">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-lg transition-colors"
                            >
                              <div className="font-medium">{subItem.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{subItem.description}</div>
                            </Link>
                          ))}
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-blue-600 font-medium hover:text-blue-700 hover:bg-blue-50/50 rounded-lg transition-colors"
                          >
                            View all {item.name.toLowerCase()}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        item.current
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile CTA Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200/50 space-y-3 px-4">
              {currentUser ? (
                <>
                  <div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-200/50">
                    <p className="font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{currentUser.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg border border-gray-300/50 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg border border-gray-300/50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      router.push('/');
                    }}
                    className="block w-full px-4 py-3 text-center font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-lg border border-red-300/50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg border border-gray-300/50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/auth/register?role=company"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Post a Job
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}