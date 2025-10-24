'use client';

import { useState, useEffect } from 'react';
import { FiMapPin, FiTruck, FiPackage, FiClock } from 'react-icons/fi';

interface GPSTrackingMapProps {
  bookingId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface LocationData {
  booking: {
    trackingCode: string;
    status: string;
    origin: any;
    destination: any;
    vehicle?: any;
    driver?: any;
  };
  currentLocation: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    speed: number;
    status: string;
    timestamp: string;
  };
  progress: {
    percentage: number;
    totalDistance: number;
    coveredDistance: number;
    remainingDistance: number;
    estimatedArrival: string;
  };
}

export default function GPSTrackingMap({
  bookingId,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}: GPSTrackingMapProps) {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocation();

    if (autoRefresh) {
      const interval = setInterval(fetchLocation, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [bookingId, autoRefresh, refreshInterval]);

  const fetchLocation = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gps/booking/${bookingId}/current`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const result = await response.json();
      setLocationData(result.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load tracking data');
      console.error('GPS fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tracking data...</p>
      </div>
    );
  }

  if (error || !locationData) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-red-600">{error || 'No tracking data available'}</p>
      </div>
    );
  }

  const { booking, currentLocation, progress } = locationData;

  return (
    <div className="space-y-6">
      {/* Map Placeholder - Replace with actual map library like Leaflet or Google Maps */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div
          className="relative bg-gradient-to-br from-blue-100 to-blue-200"
          style={{ height: '400px' }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FiMapPin size={64} className="mx-auto text-blue-600 mb-4" />
              <p className="text-gray-700 font-medium">
                {currentLocation.coordinates.latitude.toFixed(6)},{' '}
                {currentLocation.coordinates.longitude.toFixed(6)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                📍 Map integration ready (use Leaflet or Google Maps API)
              </p>
            </div>
          </div>

          {/* Origin marker */}
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg">
            <FiMapPin className="inline mr-1" />
            Origin: {booking.origin.city}
          </div>

          {/* Destination marker */}
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg">
            <FiMapPin className="inline mr-1" />
            Destination: {booking.destination.city}
          </div>

          {/* Current vehicle position */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
            <FiTruck className="inline mr-2" />
            Current Position
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-blue-600">
              {progress.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                Speed
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {currentLocation.speed} km/h
              </p>
            </div>
            <FiTruck className="text-blue-600" size={32} />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Status: <span className="font-medium">{currentLocation.status}</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                Distance Remaining
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {progress.remainingDistance.toFixed(1)} km
              </p>
            </div>
            <FiPackage className="text-orange-600" size={32} />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Covered: {progress.coveredDistance.toFixed(1)} km
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                Est. Arrival
              </p>
              <p className="text-2xl font-bold text-green-600">
                {new Date(progress.estimatedArrival).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <FiClock className="text-green-600" size={32} />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {new Date(progress.estimatedArrival).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Vehicle & Driver Info */}
      {(booking.vehicle || booking.driver) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Vehicle & Driver Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {booking.vehicle && (
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium mb-2">
                  Vehicle
                </p>
                <p className="font-bold text-gray-900">{booking.vehicle.name}</p>
                <p className="text-sm text-gray-600">
                  {booking.vehicle.licensePlate}
                </p>
              </div>
            )}
            {booking.driver && (
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium mb-2">
                  Driver
                </p>
                <p className="font-bold text-gray-900">{booking.driver.name}</p>
                <p className="text-sm text-gray-600">{booking.driver.phone}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Last Update Time */}
      <p className="text-center text-sm text-gray-500">
        Last updated: {new Date(currentLocation.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
