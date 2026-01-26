'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  Building,
  FileText,
  Menu,
  Settings,
  Users,
  X,
  Home,
  UserCheck
} from 'lucide-react';
import CompanyAdminHeader from '../components/companyadmin/Header';
import CompanyAdminSidebar from '../components/companyadmin/Sidebar';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Overview', href: '/companyadmin', icon: Home },
  { name: 'Jobs', href: '/companyadmin/jobs', icon: Briefcase },
  { name: 'Applications', href: '/companyadmin/applications', icon: FileText },
  { name: 'Candidates', href: '/companyadmin/candidates', icon: UserCheck },
  { name: 'Analytics', href: '/companyadmin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/companyadmin/settings', icon: Settings },
  { name: 'Team Management', href: '/companyadmin/team', icon: Users },
];

export default function CompanyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CompanyAdminHeader />

      {/* Sidebar */}
      <CompanyAdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="lg:pl-64 pt-16">
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
