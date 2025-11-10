'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { api } from '@/lib/api';
import { FaTruck, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function FleetPage() {
  const t = useTranslations('admin');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'van',
    licensePlate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: {
      weight: 0,
      volume: 0
    },
    status: 'available'
  });

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

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      type: 'van',
      licensePlate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      capacity: { weight: 0, volume: 0 },
      status: 'available'
    });
    setShowModal(true);
  };

  const openEditModal = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      capacity: vehicle.capacity || { weight: 0, volume: 0 },
      status: vehicle.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await api.fleet.update(editingVehicle._id, formData);
        alert('Vehicle updated successfully!');
      } else {
        await api.fleet.create(formData);
        alert('Vehicle added successfully!');
      }
      setShowModal(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Error saving vehicle. Please try again.');
    }
  };

  const openDeleteConfirm = (id: string) => {
    setVehicleToDelete(id);
    setShowDeleteConfirm(true);
  };

  const deleteVehicle = async () => {
    if (!vehicleToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.fleet.delete(vehicleToDelete);
      setShowDeleteConfirm(false);
      setVehicleToDelete(null);
      fetchVehicles();
      alert('Vehicle deleted successfully!');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle. Please try again.');
    } finally {
      setIsDeleting(false);
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
          <h1 className="text-3xl font-bold">{t('fleet')}</h1>
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <FaPlus /> {t('vehicle')}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaTruck className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">{t('noDataFound')}</p>
            <button className="mt-4 btn-primary flex items-center gap-2 mx-auto">
              <FaPlus /> {t('vehicle')}
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
                      <span className="text-gray-600">{t('plateNumber')}:</span>
                      <span className="font-semibold">{vehicle.licensePlate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('capacity')}:</span>
                      <span className="font-semibold">
                        {vehicle.capacity?.weight ? `${vehicle.capacity.weight} kg` : ''}
                        {vehicle.capacity?.weight && vehicle.capacity?.volume ? ' / ' : ''}
                        {vehicle.capacity?.volume ? `${vehicle.capacity.volume} m³` : ''}
                      </span>
                    </div>
                    {vehicle.pricePerKm && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t('price')}/km:</span>
                        <span className="font-semibold">€{vehicle.pricePerKm}</span>
                      </div>
                    )}
                  </div>

                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">{t('description')}:</p>
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
                    <button 
                      onClick={() => openEditModal(vehicle)}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                      <FaEdit /> {t('edit')}
                    </button>
                    <button 
                      onClick={() => openDeleteConfirm(vehicle._id)}
                      className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaTrash /> {t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Vehicle Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingVehicle ? t('edit') : t('vehicle')}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('vehicle')} *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('vehicleType')} *</label>
                    <select
                      required
                      className="input-field"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="van">Van</option>
                      <option value="truck">Truck</option>
                      <option value="semi_truck">Semi Truck</option>
                      <option value="refrigerated">Refrigerated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('plateNumber')} *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('company')} *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('model')} *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('date')} *</label>
                    <input
                      type="number"
                      required
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      className="input-field"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('weight')} (kg) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="input-field"
                      value={formData.capacity.weight}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        capacity: { ...formData.capacity, weight: parseInt(e.target.value) }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('capacity')} (m³) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="input-field"
                      value={formData.capacity.volume}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        capacity: { ...formData.capacity, volume: parseInt(e.target.value) }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('status')} *</label>
                    <select
                      required
                      className="input-field"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="available">{t('available')}</option>
                      <option value="in-use">{t('inUse')}</option>
                      <option value="maintenance">{t('maintenance')}</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 btn-primary">
                    {editingVehicle ? t('save') : t('vehicle')}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 btn-secondary"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setVehicleToDelete(null);
          }}
          onConfirm={deleteVehicle}
          title="Delete Vehicle"
          message="Are you sure you want to delete this vehicle? This action cannot be undone and will permanently remove the vehicle from your fleet."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}
