'use client';

import { use, useState, useEffect } from 'react';
import CustomerLayout from '@/components/portal/CustomerLayout';
import { FiMapPin, FiTruck, FiPackage } from 'react-icons/fi';
import { api } from '@/lib/api';
import Link from 'next/link';

interface BookingsPageProps {
  params: Promise<{ locale: string }>;
}

export default function BookingsPage({ params }: BookingsPageProps) {
  const { locale } = use(params);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const query: any = { limit: 100 };
      if (filter !== 'all') {
        query.status = filter;
      }
      const response = await api.bookings.getMyBookings(query);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <CustomerLayout locale={locale}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          
          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
            
            <Link
              href={`/${locale}/booking`}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Booking
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiPackage size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-2">No bookings found</p>
            <p className="text-sm text-gray-500 mb-6">Create your first booking to get started</p>
            <Link
              href={`/${locale}/booking`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Booking
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking: any) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {booking.trackingCode}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[booking.status]
                        }`}
                      >
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        €{booking.price?.toFixed(2) || 'TBD'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.pickupDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <FiMapPin className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Origin</p>
                        <p className="font-medium">{booking.origin.city}</p>
                        <p className="text-sm text-gray-600">{booking.origin.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <FiMapPin className="text-red-600 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Destination</p>
                        <p className="font-medium">{booking.destination.city}</p>
                        <p className="text-sm text-gray-600">{booking.destination.address}</p>
                      </div>
                    </div>
                  </div>

                  {booking.assignedVehicle && (
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <FiTruck className="text-blue-600" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium">Vehicle</p>
                        <p className="font-medium">{booking.assignedVehicle.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Package:</span> {booking.packageDetails.type}
                      {' • '}
                      {booking.packageDetails.weight}kg
                    </div>
                    <div className="space-x-2">
                      {booking.status === 'in_transit' && (
                        <Link
                          href={`/${locale}/tracking/${booking.trackingCode}`}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                        >
                          Track Live
                        </Link>
                      )}
                      <Link
                        href={`/${locale}/portal/bookings/${booking._id}`}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
