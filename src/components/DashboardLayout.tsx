'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import Image from 'next/image';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  LogOut,
  Menu,
  X,
  Settings,
  UserCheck,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface NavigationItem {
  name: string;
  icon: typeof Users;
  href: string;
  current: boolean;
  roles: UserRole[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function DashboardLayout({ children, currentPage = 'dashboard' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  if (!user) return null;

  const allNavigationItems: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      icon: Users, 
      href: '/dashboard', 
      current: currentPage === 'dashboard',
      roles: ['STUDENT', 'ADVISOR', 'SECRETARY', 'DEAN', 'STUDENT_AFFAIRS']
    },
    { 
      name: 'Mezuniyet Başvurusu', 
      icon: CheckCircle, 
      href: '/dashboard/student-graduation', 
      current: currentPage === 'student-graduation',
      roles: ['STUDENT']
    },
    { 
      name: 'Mezuniyet Yönetimi', 
      icon: Award, 
      href: '/dashboard/graduation', 
      current: currentPage === 'graduation',
      roles: ['SECRETARY', 'DEAN']
    },
    { 
      name: 'Öğrenci Başvuruları', 
      icon: UserCheck, 
      href: '/dashboard/student-applications', 
      current: currentPage === 'student-applications',
      roles: ['ADVISOR', 'SECRETARY', 'DEAN', 'STUDENT_AFFAIRS']
    },
    { 
      name: 'Mezuniyet Onayları', 
      icon: Award, 
      href: '/dashboard/graduation-approvals', 
      current: currentPage === 'graduation-approvals',
      roles: ['SECRETARY', 'DEAN', 'STUDENT_AFFAIRS']
    },
    { 
      name: 'Diploma ve Sertifika', 
      icon: FileText, 
      href: '/dashboard/diploma-certificate', 
      current: currentPage === 'diploma-certificate',
      roles: ['STUDENT_AFFAIRS']
    },
    { 
      name: 'Mezuniyet İstatistikleri', 
      icon: Users, 
      href: '/dashboard/graduation-statistics', 
      current: currentPage === 'graduation-statistics',
      roles: ['STUDENT_AFFAIRS']
    },
    { 
      name: 'Sistem Ayarları', 
      icon: Settings, 
      href: '/dashboard/settings', 
      current: currentPage === 'settings',
      roles: ['STUDENT_AFFAIRS']
    }
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'STUDENT': return 'Öğrenci';
      case 'ADVISOR': return 'Danışman';
      case 'SECRETARY': return 'Sekreterlik';
      case 'DEAN': return 'Dekanlık';
      case 'STUDENT_AFFAIRS': return 'Öğrenci İşleri';
      default: return role;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getPageTitle = () => {
    const item = allNavigationItems.find(item => item.current);
    return item?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <Image
              src="/iyte-logo.png"
              alt="IYTE Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="ml-2 text-lg font-semibold text-gray-900">IYTE GMS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>
        
        <nav className="mt-8">
          <div className="px-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {getRoleDisplayName(user.role)} Menüsü
            </p>
          </div>
          <div className="mt-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-red-100 text-red-700 border-r-4 border-red-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-4 py-2 text-sm font-medium`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-3 w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6 text-gray-400" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user.department}</span>
              {user.studentId && <span className="text-sm text-gray-500">#{user.studentId}</span>}
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
} 