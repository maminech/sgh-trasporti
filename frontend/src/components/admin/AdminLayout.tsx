'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import { FaTruck, FaSignOutAlt, FaHome, FaBox, FaUsers, FaClipboardList, FaBriefcase, FaEnvelope, FaBars, FaTimes, FaGlobe } from 'react-icons/fa';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string || 'it';
  const t = useTranslations('admin');

  const languages = [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname?.replace(`/${locale}`, `/${newLocale}`) || `/${newLocale}`;
    setShowLangMenu(false);
    router.push(newPath);
  };

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
    { href: `/${locale}/admin/dashboard`, label: t('dashboard'), icon: FaHome },
    { href: `/${locale}/admin/bookings`, label: t('bookings'), icon: FaBox },
    { href: `/${locale}/admin/quotes`, label: t('quotes'), icon: FaClipboardList },
    { href: `/${locale}/admin/fleet`, label: t('fleet'), icon: FaTruck },
    { href: `/${locale}/admin/clients`, label: t('clients'), icon: FaUsers },
    { href: `/${locale}/admin/applications`, label: t('applications'), icon: FaBriefcase },
    { href: `/${locale}/admin/contacts`, label: t('messages'), icon: FaEnvelope },
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
            <span>{t('logout')}</span>
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
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <FaGlobe className="text-gray-600" />
                  <span className="text-lg">{currentLanguage.flag}</span>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {currentLanguage.code.toUpperCase()}
                  </span>
                </button>

                {/* Language Dropdown */}
                {showLangMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLangMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => switchLanguage(lang.code)}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                            locale === lang.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                          {locale === lang.code && (
                            <span className="ml-auto text-primary-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* User Info */}
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
