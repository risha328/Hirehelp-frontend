'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  Building,
  FileText,
  File,
  Menu,
  Settings,
  Users,
  X,
  Home,
  UserCheck,
  User
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Overview', href: '/companyadmin', icon: Home },
  { name: 'Jobs', href: '/companyadmin/jobs', icon: Briefcase },
  // { name: 'Rounds', href: '/companyadmin/rounds', icon: File },
  { name: 'Interview Management', href: '/companyadmin/interviews', icon: Users },
  { name: 'Applications', href: '/companyadmin/applications', icon: FileText },
  { name: 'Candidates', href: '/companyadmin/candidates', icon: UserCheck },
  { name: 'Analytics', href: '/companyadmin/analytics', icon: BarChart3 },
  // { name: 'Team Management', href: '/companyadmin/team', icon: Users },
];

interface CompanyAdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function CompanyAdminSidebar({ sidebarOpen, setSidebarOpen }: CompanyAdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Company Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = item.href === '/companyadmin'
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'
                    }`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Profile tab at the bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/companyadmin/profile"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${pathname.startsWith('/companyadmin/profile')
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <User className={`mr-3 h-5 w-5 ${pathname.startsWith('/companyadmin/profile') ? 'text-blue-700' : 'text-gray-400'
              }`} />
            Profile
          </Link>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
