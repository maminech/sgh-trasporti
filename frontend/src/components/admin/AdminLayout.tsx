'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { FaTruck, FaSignOutAlt, FaHome, FaBox, FaUsers, FaClipboardList, FaBriefcase, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'it';

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);
        if (userData.role !== 'admin') {
          router.push(`/${locale}`);
        }
      } catch (error) {
        router.push(`/${locale}/auth/login`);
      }
    } else {
      router.push(`/${locale}/auth/login`);
    }
  }, [router, locale]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push(`/${locale}/auth/login`);
  };

  const menuItems = [
    { href: `/${locale}/admin/dashboard`, label: 'Dashboard', icon: FaHome },
    { href: `/${locale}/admin/bookings`, label: 'Bookings', icon: FaBox },
    { href: `/${locale}/admin/quotes`, label: 'Quotes', icon: FaClipboardList },
    { href: `/${locale}/admin/fleet`, label: 'Fleet', icon: FaTruck },
    { href: `/${locale}/admin/clients`, label: 'Clients', icon: FaUsers },
    { href: `/${locale}/admin/applications`, label: 'Applications', icon: FaBriefcase },
    { href: `/${locale}/admin/contacts`, label: 'Messages', icon: FaEnvelope },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary-900 text-white transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <FaTruck className="text-3xl text-primary-400" />
            <span className="text-2xl font-bold">SGH Admin</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary-800 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="text-xl" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors mt-8 w-full"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-700 text-2xl"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
