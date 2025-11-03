'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/lib/api';
import { FaTruck, FaBox, FaUsers, FaClipboardList, FaChartLine } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations('admin');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response: any = await api.dashboard.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="spinner" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: t('activeBookings'),
      value: stats?.stats.activeBookings || 0,
      icon: FaBox,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: t('totalClients'),
      value: stats?.stats.totalClients || 0,
      icon: FaUsers,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: t('availableVehicles'),
      value: stats?.stats.availableVehicles || 0,
      icon: FaTruck,
      color: 'bg-purple-500',
      change: '+5%',
    },
    {
      title: t('pendingQuotes'),
      value: stats?.stats.pendingQuotes || 0,
      icon: FaClipboardList,
      color: 'bg-orange-500',
      change: '+3%',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-600 mt-2">{t('welcomeBack')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-2">{stat.change} {t('fromLastMonth')}</p>
                </div>
                <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('recentBookings')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('trackingCode')}</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('route')}</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('status')}</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.map((booking: any) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{booking.trackingCode}</td>
                    <td className="py-3 px-4">
                      {booking.origin.city} → {booking.destination.city}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'in_transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
