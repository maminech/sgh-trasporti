'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import CustomerLayout from '@/components/portal/CustomerLayout';
import { FiPackage, FiFileText, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { api } from '@/lib/api';

interface DashboardProps {
  params: { locale: string };
}

export default function CustomerDashboard({ params }: DashboardProps) {
  const t = useTranslations();
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedBookings: 0,
    pendingInvoices: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, invoicesRes] = await Promise.all([
        api.bookings.getMyBookings({ limit: 5 }),
        api.invoices.getAll({ limit: 100 })
      ]);

      const bookings = bookingsRes.data;
      const invoices = invoicesRes.data;

      // Calculate stats
      const active = bookings.filter((b: any) => 
        ['pending', 'in_transit', 'pickup'].includes(b.status)
      ).length;
      
      const completed = bookings.filter((b: any) => 
        b.status === 'delivered'
      ).length;

      const pendingInv = invoices.filter((inv: any) => 
        inv.status === 'sent' || inv.status === 'overdue'
      ).length;

      const totalSpent = invoices
        .filter((inv: any) => inv.status === 'paid')
        .reduce((sum: number, inv: any) => sum + inv.totalAmount, 0);

      setStats({
        activeBookings: active,
        completedBookings: completed,
        pendingInvoices: pendingInv,
        totalSpent
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_transit: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <CustomerLayout locale={params.locale}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Bookings</p>
                <p className="text-3xl font-bold text-blue-600">
                  {loading ? '...' : stats.activeBookings}
                </p>
              </div>
              <FiTruck className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {loading ? '...' : stats.completedBookings}
                </p>
              </div>
              <FiPackage className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Invoices</p>
                <p className="text-3xl font-bold text-orange-600">
                  {loading ? '...' : stats.pendingInvoices}
                </p>
              </div>
              <FiAlertCircle className="text-orange-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-purple-600">
                  €{loading ? '...' : stats.totalSpent.toFixed(2)}
                </p>
              </div>
              <FiFileText className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No bookings yet. Create your first booking!
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tracking Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pickup Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBookings.map((booking: any) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                        {booking.trackingCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium">{booking.origin.city}</div>
                          <div className="text-gray-500">to {booking.destination.city}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[booking.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.pickupDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        €{booking.price?.toFixed(2) || 'TBD'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href={`/${params.locale}/booking`}
            className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            <FiPackage size={32} className="mb-3" />
            <h3 className="text-xl font-bold mb-2">New Booking</h3>
            <p className="text-blue-100">Create a new transport booking</p>
          </a>

          <a
            href={`/${params.locale}/quote`}
            className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition-colors"
          >
            <FiFileText size={32} className="mb-3" />
            <h3 className="text-xl font-bold mb-2">Get Quote</h3>
            <p className="text-green-100">Request a price estimate</p>
          </a>
        </div>
      </div>
    </CustomerLayout>
  );
}
