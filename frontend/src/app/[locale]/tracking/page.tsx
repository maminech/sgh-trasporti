'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GPSTrackingMap from '@/components/tracking/GPSTrackingMap';
import { FiSearch, FiPackage } from 'react-icons/fi';
import { api } from '@/lib/api';

interface TrackingPageProps {
  params: { locale: string };
}

export default function TrackingPage({ params }: TrackingPageProps) {
  const t = useTranslations('trackingPage');
  const [trackingCode, setTrackingCode] = useState('');
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingCode.trim()) {
      setError(t('enterCode'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.tracking.track(trackingCode.trim());
      setBookingData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || t('notFound'));
      setBookingData(null);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    pickup: 'bg-purple-100 text-purple-800 border-purple-300',
    in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleTrack} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="trackingCode" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('trackingCode')}
                  </label>
                  <div className="relative">
                    <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="trackingCode"
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      placeholder={t('trackingCodePlaceholder')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FiSearch size={20} />
                    <span>{loading ? t('searching') : t('track')}</span>
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Tracking Results */}
          {bookingData && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Booking Info Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {t('tracking')}: {bookingData.trackingCode}
                    </h2>
                    <p className="text-gray-600">
                      {t('bookedOn')} {new Date(bookingData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-medium border-2 ${
                        statusColors[bookingData.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {bookingData.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Origin */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-600 uppercase mb-2">{t('origin')}</p>
                    <p className="font-bold text-gray-900">{bookingData.origin.city}</p>
                    <p className="text-sm text-gray-600">{bookingData.origin.address}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('pickup')}: {new Date(bookingData.pickupDate).toLocaleString()}
                    </p>
                  </div>

                  {/* Destination */}
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs font-medium text-red-600 uppercase mb-2">{t('destination')}</p>
                    <p className="font-bold text-gray-900">{bookingData.destination.city}</p>
                    <p className="text-sm text-gray-600">{bookingData.destination.address}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('estDelivery')}: {new Date(bookingData.estimatedDeliveryDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Package Details */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">{t('packageDetails')}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">{t('type')}</p>
                      <p className="font-medium capitalize">{bookingData.packageDetails?.type || 'Standard'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t('weight')}</p>
                      <p className="font-medium">{bookingData.packageDetails?.weight || 'N/A'} {bookingData.packageDetails?.weight ? 'kg' : ''}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t('dimensions')}</p>
                      <p className="font-medium">
                        {bookingData.packageDetails?.dimensions?.length 
                          ? `${bookingData.packageDetails.dimensions.length}x${bookingData.packageDetails.dimensions.width}x${bookingData.packageDetails.dimensions.height} cm`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t('value')}</p>
                      <p className="font-medium">{bookingData.packageDetails?.value ? `€${bookingData.packageDetails.value}` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* GPS Tracking Map */}
              {bookingData.status === 'in_transit' && (
                <GPSTrackingMap bookingId={bookingData._id} autoRefresh={true} />
              )}

              {/* Status History */}
              {bookingData.statusHistory && bookingData.statusHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('shipmentHistory')}</h3>
                  <div className="space-y-4">
                    {bookingData.statusHistory.map((history: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                        </div>
                        <div className="flex-1 border-l-2 border-gray-200 pl-4 pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">
                                {history.status.replace('_', ' ').toUpperCase()}
                              </p>
                              {history.location && (
                                <p className="text-sm text-gray-600">{history.location}</p>
                              )}
                              {history.notes && (
                                <p className="text-sm text-gray-500 mt-1">{history.notes}</p>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(history.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
