'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiTruck, FiMapPin, FiRefreshCw, FiActivity } from 'react-icons/fi';
import { api } from '@/lib/api';

interface FleetTrackingPageProps {
  params: { locale: string };
}

export default function FleetTrackingPage({ params }: FleetTrackingPageProps) {
  const [activeFleet, setActiveFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchFleetData();
    const interval = setInterval(fetchFleetData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchFleetData = async () => {
    try {
      const response = await api.gps.getActiveFleet();
      setActiveFleet(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch fleet data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fleet Tracking</h1>
            <p className="text-gray-600 mt-1">Real-time GPS tracking of active vehicles</p>
          </div>
          <button
            onClick={fetchFleetData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Vehicles</p>
                <p className="text-3xl font-bold text-blue-600">
                  {loading ? '...' : activeFleet.length}
                </p>
              </div>
              <FiTruck className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-3xl font-bold text-green-600">
                  {loading
                    ? '...'
                    : activeFleet.filter(
                        (f: any) => f.booking?.status === 'in_transit'
                      ).length}
                </p>
              </div>
              <FiActivity className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pickup Phase</p>
                <p className="text-3xl font-bold text-orange-600">
                  {loading
                    ? '...'
                    : activeFleet.filter(
                        (f: any) => f.booking?.status === 'pickup'
                      ).length}
                </p>
              </div>
              <FiMapPin className="text-orange-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="text-lg font-bold text-gray-900">
                  {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <FiRefreshCw className="text-gray-600" size={32} />
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-bold text-gray-900">Fleet Map View</h2>
          </div>
          <div
            className="relative bg-gradient-to-br from-blue-50 to-green-50"
            style={{ height: '500px' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <FiMapPin size={64} className="mx-auto text-blue-600 mb-4" />
                <p className="text-gray-700 font-medium text-lg mb-2">
                  Fleet Map Integration Ready
                </p>
                <p className="text-sm text-gray-600">
                  Integrate with Google Maps API or Leaflet for interactive map
                </p>
              </div>
            </div>

            {/* Simulated vehicle markers */}
            {!loading && activeFleet.slice(0, 5).map((item: any, index: number) => (
              <div
                key={item.booking?.id}
                className="absolute bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg text-xs"
                style={{
                  top: `${20 + index * 80}px`,
                  left: `${100 + index * 120}px`,
                }}
              >
                <FiTruck className="inline mr-1" />
                {item.vehicle?.licensePlate || 'Vehicle'}
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Active Vehicles</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : activeFleet.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No active vehicles at the moment
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Driver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tracking Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Speed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Last Update
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeFleet.map((item: any) => (
                    <tr key={item.booking?.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiTruck className="text-blue-600 mr-2" size={20} />
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.vehicle?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.vehicle?.licensePlate || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {item.driver?.name || 'Not assigned'}
                        </p>
                        {item.driver?.phone && (
                          <p className="text-sm text-gray-500">{item.driver.phone}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600">
                        {item.booking?.trackingCode || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">
                          {item.booking?.origin?.city || 'N/A'} →{' '}
                          {item.booking?.destination?.city || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">
                          {item.location?.speed || 0} km/h
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.location?.status === 'moving'
                              ? 'bg-green-100 text-green-800'
                              : item.location?.status === 'stopped'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.location?.status || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.location?.timestamp
                          ? new Date(item.location.timestamp).toLocaleTimeString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
