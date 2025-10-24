'use client';

import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiTruck, FiPackage, FiGlobe, FiThermometer, FiBox, FiShield } from 'react-icons/fi';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function ServicesPage() {
  const t = useTranslations('services');
  const params = useParams();
  const locale = params.locale as string;

  const services = [
    {
      icon: FiTruck,
      title: t('national'),
      description: t('nationalDesc'),
      features: [t('delivery24'), t('realTimeTracking'), t('insuranceIncluded')]
    },
    {
      icon: FiGlobe,
      title: t('international'),
      description: t('internationalDesc'),
      features: [t('euCoverage'), t('customsProcedures'), t('certifiedPartners')]
    },
    {
      icon: FiThermometer,
      title: t('refrigerated'),
      description: t('refrigeratedDesc'),
      features: [t('constantTemp'), t('monitoring247'), t('haccpCertified')]
    },
    {
      icon: FiBox,
      title: t('oversized'),
      description: t('oversizedDesc'),
      features: [t('specialPermits'), t('dedicatedVehicles'), t('routePlanning')]
    },
    {
      icon: FiPackage,
      title: t('logistics'),
      description: t('logisticsDesc'),
      features: [t('secureWarehouse'), t('integratedWMS'), t('stockManagement')]
    },
    {
      icon: FiShield,
      title: t('adr'),
      description: t('adrDesc'),
      features: [t('adrCertification'), t('maxSecurity'), t('regulatoryCompliance')]
    }
  ];

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
        </section>

        {/* Services Grid */}
        <section className="container-custom mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <Icon className="text-primary-600 mb-4" size={48} />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('needQuote')}
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              {t('needQuoteDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/quote`} className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                {t('requestQuote')}
              </Link>
              <Link href={`/${locale}/contact`} className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200">
                {t('contactUs')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
