'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiTruck, FiPackage, FiCheckCircle } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function FleetPage() {
  const t = useTranslations('fleet');

  const vehicles = [
    {
      type: t('vans'),
      capacity: t('vansCapacity'),
      count: 15,
      description: t('vansDesc'),
      image: '🚐'
    },
    {
      type: t('trucks'),
      capacity: t('trucksCapacity'),
      count: 20,
      description: t('trucksDesc'),
      image: '🚚'
    },
    {
      type: t('semis'),
      capacity: t('semisCapacity'),
      count: 12,
      description: t('semisDesc'),
      image: '🚛'
    },
    {
      type: t('refrigerated'),
      capacity: t('refrigeratedCapacity'),
      count: 8,
      description: t('refrigeratedDesc'),
      image: '❄️'
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

        {/* Fleet Grid */}
        <section className="container-custom mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {vehicles.map((vehicle, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-6xl mb-4">{vehicle.image}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.type}</h3>
                <p className="text-primary-600 font-semibold mb-3">{vehicle.capacity}</p>
                <p className="text-gray-600 mb-4">{vehicle.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FiTruck className="mr-2" />
                  <span>{vehicle.count} {t('vehiclesAvailable')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {t('fleetFeatures')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <FiCheckCircle className="mx-auto text-primary-600 mb-4" size={48} />
                <h3 className="font-bold text-xl mb-2">{t('gpsTracking')}</h3>
                <p className="text-gray-600">{t('gpsTrackingDesc')}</p>
              </div>
              <div className="text-center">
                <FiCheckCircle className="mx-auto text-primary-600 mb-4" size={48} />
                <h3 className="font-bold text-xl mb-2">{t('certifiedMaintenance')}</h3>
                <p className="text-gray-600">{t('certifiedMaintenanceDesc')}</p>
              </div>
              <div className="text-center">
                <FiCheckCircle className="mx-auto text-primary-600 mb-4" size={48} />
                <h3 className="font-bold text-xl mb-2">{t('euro6')}</h3>
                <p className="text-gray-600">{t('euro6Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container-custom py-16">
          <div className="bg-primary-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-8">{t('fleetInNumbers')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">55</div>
                <div className="text-primary-100">{t('totalVehicles')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-primary-100">{t('avgAvailability')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-primary-100">{t('avgAge')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-primary-100">{t('gpsTracked')}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
