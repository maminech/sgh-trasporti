'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiHome, FiPackage, FiFileText, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

interface CustomerLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function CustomerLayout({ children, locale }: CustomerLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('token');
    if (!token) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    try {
      const response = await api.auth.getMe();
      setUser(response.data);
      
      // Allow only clients and admins to access customer portal
      if (response.data.role !== 'client' && response.data.role !== 'admin') {
        router.push(`/${locale}`);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push(`/${locale}/auth/login`);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push(`/${locale}/auth/login`);
  };

  const menuItems = [
    { href: `/${locale}/portal`, icon: FiHome, label: 'Dashboard' },
    { href: `/${locale}/portal/bookings`, icon: FiPackage, label: 'My Bookings' },
    { href: `/${locale}/portal/invoices`, icon: FiFileText, label: 'Invoices' },
    { href: `/${locale}/portal/profile`, icon: FiUser, label: 'Profile' },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Customer Portal</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-600 hover:text-gray-800"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="mr-3" size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="mr-3" size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-800 mr-4"
          >
            <FiMenu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome, {user.name}
          </h2>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
