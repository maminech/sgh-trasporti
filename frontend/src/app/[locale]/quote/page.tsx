'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function QuotePage() {
  const t = useTranslations('quotePage');
  const [formData, setFormData] = useState({
    serviceType: '',
    pickupCity: '',
    deliveryCity: '',
    weight: '',
    packageType: '',
    urgent: false,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log('Quote request submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <FiCheckCircle className="mx-auto text-green-600 mb-4" size={64} />
              <h2 className="text-3xl font-bold text-green-800 mb-4">{t('quoteSubmitted')}</h2>
              <p className="text-green-700 mb-4">
                {t('thankYou')}
              </p>
              <p className="text-green-700">
                {t('willContact')}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <FiDollarSign className="mr-2 text-primary-600" />
                {t('title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
              {/* Service Type */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">{t('serviceType')} *</label>
                <select
                  required
                  className="input-field"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                >
                  <option value="">{t('selectService')}</option>
                  <option value="national">{t('nationalTransport')}</option>
                  <option value="international">{t('internationalTransport')}</option>
                  <option value="refrigerated">{t('refrigeratedTransport')}</option>
                  <option value="oversized">{t('oversizedLoad')}</option>
                  <option value="adr">{t('adrTransport')}</option>
                  <option value="logistics">{t('logisticsServices')}</option>
                </select>
              </div>

              {/* Route */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('originCity')} *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder={t('originPlaceholder')}
                    value={formData.pickupCity}
                    onChange={(e) => setFormData({...formData, pickupCity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('destinationCity')} *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder={t('destinationPlaceholder')}
                    value={formData.deliveryCity}
                    onChange={(e) => setFormData({...formData, deliveryCity: e.target.value})}
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('estimatedWeight')} *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-field"
                    placeholder={t('weightPlaceholder')}
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">{t('cargoType')} *</label>
                  <select
                    required
                    className="input-field"
                    value={formData.packageType}
                    onChange={(e) => setFormData({...formData, packageType: e.target.value})}
                  >
                    <option value="">{t('selectType')}</option>
                    <option value="pallet">{t('pallet')}</option>
                    <option value="boxes">{t('boxes')}</option>
                    <option value="bulk">{t('bulk')}</option>
                    <option value="fragile">{t('fragile')}</option>
                    <option value="perishable">{t('perishable')}</option>
                    <option value="other">Altro</option>
                  </select>
                </div>
              </div>

              {/* Urgent */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="urgent"
                  className="mr-3 w-5 h-5 text-primary-600"
                  checked={formData.urgent}
                  onChange={(e) => setFormData({...formData, urgent: e.target.checked})}
                />
                <label htmlFor="urgent" className="text-gray-700 font-semibold">
                  {t('urgentService')}
                </label>
              </div>

              {/* Customer Details */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('yourDetails')}</h3>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">{t('fullName')} *</label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">{t('company')}</label>
                      <input
                        type="text"
                        className="input-field"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        className="input-field"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">{t('phone')} *</label>
                      <input
                        type="tel"
                        required
                        className="input-field"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('additionalDetails')}</label>
                    <textarea
                      rows={4}
                      className="input-field"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={t('additionalDetailsPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-primary-800">
                  <strong>{t('note')}</strong> {t('noteText')}
                </p>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full">
                {t('requestFreeQuote')}
              </button>

              <p className="text-center text-sm text-gray-500">
                {t('responseTime')}
              </p>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
