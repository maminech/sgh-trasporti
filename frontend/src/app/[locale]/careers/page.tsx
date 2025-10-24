'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiBriefcase, FiTruck, FiUsers, FiSend } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function CareersPage() {
  const t = useTranslations('careers');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
    cv: null as File | null
  });
  const [submitted, setSubmitted] = useState(false);

  const positions = [
    {
      title: t('driverPosition'),
      type: t('fullTime'),
      location: 'Italia',
      description: t('driverDesc')
    },
    {
      title: t('coordinatorPosition'),
      type: t('fullTime'),
      location: t('headquarters'),
      description: t('coordinatorDesc')
    },
    {
      title: t('mechanicPosition'),
      type: t('fullTime'),
      location: t('workshop'),
      description: t('mechanicDesc')
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log('Application submitted:', formData);
    setSubmitted(true);
  };

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

        {/* Why Work With Us */}
        <section className="container-custom mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('whyChooseUs')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FiBriefcase className="mx-auto text-primary-600 mb-4" size={48} />
              <h3 className="font-bold text-xl mb-2">{t('professionalGrowth')}</h3>
              <p className="text-gray-600">{t('professionalGrowthDesc')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FiTruck className="mx-auto text-primary-600 mb-4" size={48} />
              <h3 className="font-bold text-xl mb-2">{t('modernFleet')}</h3>
              <p className="text-gray-600">{t('modernFleetDesc')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FiUsers className="mx-auto text-primary-600 mb-4" size={48} />
              <h3 className="font-bold text-xl mb-2">{t('cohesiveTeam')}</h3>
              <p className="text-gray-600">{t('cohesiveTeamDesc')}</p>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('openPositions')}</h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              {positions.map((position, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{position.title}</h3>
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                      {position.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{position.location}</p>
                  <p className="text-gray-700">{position.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="container-custom py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('applyNow')}</h2>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <FiSend className="mx-auto text-green-600 mb-4" size={48} />
                <h3 className="text-2xl font-bold text-green-800 mb-2">{t('applicationSubmitted')}</h3>
                <p className="text-green-700">{t('willContactSoon')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('fullName')} *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('phone')} *</label>
                    <input
                      type="tel"
                      required
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('position')} *</label>
                    <select
                      required
                      className="input-field"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                    >
                      <option value="">{t('selectPosition')}</option>
                      <option value="driver">{t('driver')}</option>
                      <option value="coordinator">{t('coordinator')}</option>
                      <option value="mechanic">{t('mechanic')}</option>
                      <option value="other">{t('other')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('message')}</label>
                  <textarea
                    rows={4}
                    className="input-field"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder={t('aboutExperience')}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('cvUpload')} *</label>
                  <input
                    type="file"
                    required
                    accept=".pdf"
                    className="input-field"
                    onChange={(e) => setFormData({...formData, cv: e.target.files?.[0] || null})}
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  <FiSend className="inline mr-2" />
                  {t('submitApplication')}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
