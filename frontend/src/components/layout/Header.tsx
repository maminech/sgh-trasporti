'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FaTruck, FaBars, FaTimes, FaGlobe, FaUser, FaSignOutAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');
  
  // Check if user is logged in
  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (e) {
        console.error('Error parsing user cookie:', e);
      }
    }
  }, [pathname]); // Re-check on route change
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'it';
  
  // Get path without locale for language switching
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    router.push(`/${currentLocale}`);
  };

  const navLinks = [
    { href: `/${currentLocale}`, label: t('home') },
    { href: `/${currentLocale}/about`, label: t('about') },
    { href: `/${currentLocale}/services`, label: t('services') },
    { href: `/${currentLocale}/fleet`, label: t('fleet') },
    { href: `/${currentLocale}/tracking`, label: t('tracking') },
    { href: `/${currentLocale}/careers`, label: t('careers') },
    { href: `/${currentLocale}/contact`, label: t('contact') },
  ];

  const languages = [
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center space-x-2">
            <FaTruck className="text-primary-600 text-3xl" />
            <span className="text-2xl font-bold text-primary-600">SGH Trasporti</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-700 hover:text-primary-600 font-medium transition-colors ${
                  pathname === link.href ? 'text-primary-600' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
              >
                <FaGlobe className="text-xl" />
                <span>{currentLocale.toUpperCase()}</span>
              </button>
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}${pathWithoutLocale}`}
                      className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 ${
                        currentLocale === lang.code ? 'bg-primary-50 text-primary-600' : ''
                      }`}
                      onClick={() => setLanguageMenuOpen(false)}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              /* Logged in user menu */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium"
                >
                  <FaUser />
                  <span>{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href={user.role === 'admin' ? `/${currentLocale}/admin/dashboard` : `/${currentLocale}/portal`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaUser className="text-primary-600" />
                      <span>{user.role === 'admin' ? 'Admin Dashboard' : t('dashboard')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in */
              <Link href={`/${currentLocale}/auth/login`} className="text-gray-700 hover:text-primary-600 font-medium">
                {t('login')}
              </Link>
            )}
            
            <Link href={`/${currentLocale}/booking`} className="btn-primary">
              {t('bookNow')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-gray-700 hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="py-3 border-t mt-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-2 text-gray-900 font-semibold">
                    <FaUser className="text-primary-600" />
                    <span>{user.name}</span>
                  </div>
                  <Link
                    href={user.role === 'admin' ? `/${currentLocale}/admin/dashboard` : `/${currentLocale}/portal`}
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {user.role === 'admin' ? 'Admin Dashboard' : t('dashboard')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href={`/${currentLocale}/auth/login`}
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('login')}
                </Link>
              )}
            </div>
            
            <Link
              href={`/${currentLocale}/booking`}
              className="block mt-3 btn-primary text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('bookNow')}
            </Link>
            
            {/* Mobile Language Selector */}
            <div className="py-3 border-t mt-3">
              <p className="text-sm font-semibold text-gray-500 mb-2">Language / Lingua</p>
              {languages.map((lang) => (
                <Link
                  key={lang.code}
                  href={`/${lang.code}${pathWithoutLocale}`}
                  className={`flex items-center space-x-2 py-2 ${
                    currentLocale === lang.code ? 'text-primary-600 font-semibold' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
