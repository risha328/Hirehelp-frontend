'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function CompanyAdminHeader() {
  const { user, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-60 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Company Admin</span>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center font-semibold text-white transition-all duration-300"
                  title={user.name}
                >
                  {user.name?.charAt(0).toUpperCase() || 'U'}
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
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left"
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
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
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
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
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
