'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, User, Menu, X, Bell, Search, Settings } from 'lucide-react';
import { authAPI } from '../../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SuperAdminHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }

      const token = localStorage.getItem('access_token');

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const userData = await authAPI.getProfile();
        if (userData && userData.id) {
          const user = {
            id: userData.id || userData._id,
            name: userData.name || 'User',
            email: userData.email || '',
            role: userData.role || 'SUPERADMIN',
          };
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.warn('Could not fetch user profile from backend:', error);
      }
    };

    const timer = setTimeout(fetchUser, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-60 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-transparent.png"
                alt="HireHelp Logo"
                width={300}
                height={80}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-lg font-semibold text-gray-900">Super Admin</span>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates, companies..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* Notifications */}
            {/* <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center font-semibold text-white transition-all duration-300 cursor-pointer"
                  title={user.name}
                >
                  {user.name?.charAt(0).toUpperCase() || 'S'}
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        setUser(null);
                        setIsProfileDropdownOpen(false);
                        window.location.href = '/';
                      }}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 py-4 bg-white rounded-xl border border-gray-200 shadow-lg mx-2">
            {user ? (
              <>
                <div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setUser(null);
                    setIsMobileMenuOpen(false);
                    window.location.href = '/';
                  }}
                  className="block w-full px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
