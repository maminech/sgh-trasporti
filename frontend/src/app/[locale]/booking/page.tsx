'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiPackage, FiMapPin, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';

export default function BookingPage() {
  const t = useTranslations('bookingPage');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    pickupCity: '',
    pickupPostal: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPostal: '',
    packageType: '',
    weight: '',
    dimensions: '',
    pickupDate: '',
    specialInstructions: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError('');
      
      try {
        // Prepare booking data
        const bookingData = {
          origin: {
            address: formData.pickupAddress,
            city: formData.pickupCity,
            postalCode: formData.pickupPostal,
            country: 'Italia'
          },
          destination: {
            address: formData.deliveryAddress,
            city: formData.deliveryCity,
            postalCode: formData.deliveryPostal,
            country: 'Italia'
          },
          pickupDate: formData.pickupDate,
          packageType: formData.packageType,
          weight: parseInt(formData.weight),
          dimensions: formData.dimensions ? {
            length: 100,
            width: 80,
            height: 120
          } : undefined,
          specialInstructions: formData.specialInstructions,
          customer: {
            name: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone
          }
        };

        // Submit booking to API
        const response: any = await api.bookings.create(bookingData);
        
        if (response.success) {
          setTrackingCode(response.data.trackingCode);
          setSubmitted(true);
        }
      } catch (err: any) {
        console.error('Booking error:', err);
        setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <FiCheckCircle className="mx-auto text-green-600 mb-4" size={64} />
              <h2 className="text-3xl font-bold text-green-800 mb-4">{t('bookingConfirmed')}</h2>
              <p className="text-green-700 mb-2">
                {t('thankYou')}
              </p>
              <p className="text-green-700 mb-6">
                {t('confirmationEmail')}
              </p>
              <div className="bg-white rounded-lg p-6 mb-6">
                <p className="text-gray-700 font-semibold mb-2">
                  {t('bookingCode')}:
                </p>
                <p className="text-3xl font-bold text-primary-600 mb-4">
                  {trackingCode}
                </p>
                <p className="text-sm text-gray-600">
                  Use this code to track your shipment
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`/${(window as any).location.pathname.split('/')[1]}/tracking`}
                  className="btn-primary"
                >
                  Track Shipment
                </a>
                <a
                  href={`/${(window as any).location.pathname.split('/')[1]}`}
                  className="btn-secondary"
                >
                  Back to Home
                </a>
              </div>
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('subtitle')}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between mb-12">
              <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 font-semibold hidden md:inline">{t('step1')}</span>
              </div>
              <div className={`flex-1 h-1 mx-4 mt-5 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 font-semibold hidden md:inline">{t('step2')}</span>
              </div>
              <div className={`flex-1 h-1 mx-4 mt-5 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 font-semibold hidden md:inline">{t('step3')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
                  <FiAlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold">Booking Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Step 1: Addresses */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FiMapPin className="mr-2 text-primary-600" />
                    {t('addresses')}
                  </h2>
                  
                  <div className="border-l-4 border-primary-600 pl-6">
                    <h3 className="font-bold text-lg mb-4">{t('pickup')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('address')} *</label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={formData.pickupAddress}
                          onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">{t('city')} *</label>
                          <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.pickupCity}
                            onChange={(e) => setFormData({...formData, pickupCity: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">{t('postalCode')} *</label>
                          <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.pickupPostal}
                            onChange={(e) => setFormData({...formData, pickupPostal: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-600 pl-6">
                    <h3 className="font-bold text-lg mb-4">{t('delivery')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('address')} *</label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={formData.deliveryAddress}
                          onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">{t('city')} *</label>
                          <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.deliveryCity}
                            onChange={(e) => setFormData({...formData, deliveryCity: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">{t('postalCode')} *</label>
                          <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.deliveryPostal}
                            onChange={(e) => setFormData({...formData, deliveryPostal: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Package Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FiPackage className="mr-2 text-primary-600" />
                    {t('packageDetails')}
                  </h2>

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
                      <option value="refrigerated">{t('refrigeratedCargo')}</option>
                      <option value="other">Altro</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">{t('weight')} *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="input-field"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">{t('dimensions')}</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={t('dimensionsPlaceholder')}
                        value={formData.dimensions}
                        onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                      <FiCalendar className="mr-2" />
                      {t('preferredPickupDate')} *
                    </label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('specialNotes')}</label>
                    <textarea
                      rows={4}
                      className="input-field"
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                      placeholder={t('specialInstructions')}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Contact Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('contactDetails')}
                  </h2>

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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      {t('confirmationNote')}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    {t('back')}
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    step < 3 ? t('continue') : t('confirmBooking')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
