'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FaTruck, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const params = useParams();
  const locale = params?.locale || 'it';
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaTruck className="text-primary-400 text-3xl" />
              <span className="text-2xl font-bold">SGH Trasporti</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('companyDesc')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/about`} className="text-gray-400 hover:text-primary-400 transition-colors">{nav('about')}</Link></li>
              <li><Link href={`/${locale}/services`} className="text-gray-400 hover:text-primary-400 transition-colors">{nav('services')}</Link></li>
              <li><Link href={`/${locale}/fleet`} className="text-gray-400 hover:text-primary-400 transition-colors">{nav('fleet')}</Link></li>
              <li><Link href={`/${locale}/careers`} className="text-gray-400 hover:text-primary-400 transition-colors">{nav('careers')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-gray-400 hover:text-primary-400 transition-colors">{nav('contact')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('servicesTitle')}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/services#local`} className="text-gray-400 hover:text-primary-400 transition-colors">{t('localTransport')}</Link></li>
              <li><Link href={`/${locale}/services#national`} className="text-gray-400 hover:text-primary-400 transition-colors">{t('nationalTransport')}</Link></li>
              <li><Link href={`/${locale}/services#refrigerated`} className="text-gray-400 hover:text-primary-400 transition-colors">{t('refrigeratedTransport')}</Link></li>
              <li><Link href={`/${locale}/services#oversized`} className="text-gray-400 hover:text-primary-400 transition-colors">{t('specialCargo')}</Link></li>
              <li><Link href={`/${locale}/tracking`} className="text-gray-400 hover:text-primary-400 transition-colors">{t('tracking')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contactInfo')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1" />
                <span className="text-gray-400">Via Fratelli Rosselli, 32, 43017 San Secondo Parmense (PR), Italia</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary-400" />
                <a href="tel:+393450544226" className="text-gray-400 hover:text-primary-400">+39 345 054 4226</a>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400" />
                <a href="mailto:service.sgh.trasporti@hotmail.com" className="text-gray-400 hover:text-primary-400">service.sgh.trasporti@hotmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SGH Trasporti. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
