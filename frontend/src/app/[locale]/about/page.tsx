'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiTruck, FiAward, FiUsers, FiMapPin } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-16">
        {/* Hero Section */}
        <section className="container-custom mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('ourStory')}</h2>
              <p className="text-gray-600 mb-4">
                {t('story1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('story2')}
              </p>
              <p className="text-gray-600">
                {t('story3')}
              </p>
            </div>
            <div className="bg-primary-600 p-8 rounded-xl text-white">
              <h3 className="text-2xl font-bold mb-6">{t('ourValues')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FiAward className="mr-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <strong>{t('reliability')}:</strong> {t('reliabilityDesc')}
                  </div>
                </li>
                <li className="flex items-start">
                  <FiTruck className="mr-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <strong>{t('innovation')}:</strong> {t('innovationDesc')}
                  </div>
                </li>
                <li className="flex items-start">
                  <FiUsers className="mr-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <strong>{t('professionalism')}:</strong> {t('professionalismDesc')}
                  </div>
                </li>
                <li className="flex items-start">
                  <FiMapPin className="mr-3 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <strong>{t('coverage')}:</strong> {t('coverageDesc')}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">20+</div>
                <div className="text-gray-600">{t('yearsExperience')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
                <div className="text-gray-600">{t('vehicles')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-gray-600">{t('happyClients')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">15</div>
                <div className="text-gray-600">{t('countriesServed')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="container-custom py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('certifications')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FiAward className="mx-auto mb-4 text-primary-600" size={48} />
              <h3 className="font-bold text-xl mb-2">ISO 9001:2015</h3>
              <p className="text-gray-600">Certificazione Qualità</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FiAward className="mx-auto mb-4 text-primary-600" size={48} />
              <h3 className="font-bold text-xl mb-2">ISO 14001</h3>
              <p className="text-gray-600">Gestione Ambientale</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FiAward className="mx-auto mb-4 text-primary-600" size={48} />
              <h3 className="font-bold text-xl mb-2">HACCP</h3>
              <p className="text-gray-600">Trasporto Alimentare</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
