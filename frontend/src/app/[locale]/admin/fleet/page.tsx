'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/lib/api';
import { FaTruck, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function FleetPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response: any = await api.fleet.getAll();
      setVehicles(response.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.fleet.delete(id);
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      'in-use': 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status as keyof typeof styles] || styles.available;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <button className="btn-primary flex items-center gap-2">
            <FaPlus /> Add Vehicle
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fleet...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaTruck className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No vehicles in fleet</p>
            <button className="mt-4 btn-primary flex items-center gap-2 mx-auto">
              <FaPlus /> Add First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle: any) => (
              <div key={vehicle._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <FaTruck className="text-white text-6xl" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                      <p className="text-gray-600">{vehicle.type}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">License Plate:</span>
                      <span className="font-semibold">{vehicle.licensePlate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-semibold">{vehicle.capacity}</span>
                    </div>
                    {vehicle.pricePerKm && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price/km:</span>
                        <span className="font-semibold">€{vehicle.pricePerKm}</span>
                      </div>
                    )}
                  </div>

                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.map((feature: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                      <FaEdit /> Edit
                    </button>
                    <button 
                      onClick={() => deleteVehicle(vehicle._id)}
                      className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
