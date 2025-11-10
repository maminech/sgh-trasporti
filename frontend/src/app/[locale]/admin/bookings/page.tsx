'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { api } from '@/lib/api';
import { FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function AdminBookings() {
  const t = useTranslations('admin');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response: any = await api.bookings.getAll(params);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const openStatusModal = (booking: any) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setShowStatusModal(true);
  };

  const updateBookingStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    try {
      await api.bookings.update(selectedBooking._id, { status: newStatus });
      setShowStatusModal(false);
      fetchBookings();
      alert('Booking status updated successfully!');
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const openDeleteConfirm = (id: string) => {
    setBookingToDelete(id);
    setShowDeleteConfirm(true);
  };

  const deleteBooking = async () => {
    if (!bookingToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.bookings.delete(bookingToDelete);
      setShowDeleteConfirm(false);
      setBookingToDelete(null);
      fetchBookings();
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('bookings')}</h1>
        </div>

        {/* Filter */}
        <div className="flex space-x-2">
          {['all', 'pending', 'confirmed', 'in_transit', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? t('all') : 
               status === 'in_transit' ? t('inTransit') : 
               t(status as any)}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="card">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('trackingCode')}</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('customer')}</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('route')}</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('status')}</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('date')}</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{booking.trackingCode}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{booking.customerInfo.name}</p>
                          <p className="text-sm text-gray-600">{booking.customerInfo.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {booking.origin.city} → {booking.destination.city}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(booking.pickupDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openStatusModal(booking)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title={t('updateStatus')}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => openDeleteConfirm(booking._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title={t('delete')}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {showStatusModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('updateStatus')}</h2>
                <button onClick={() => setShowStatusModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('trackingCode')}</p>
                  <p className="font-semibold">{selectedBooking.trackingCode}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('customer')}</p>
                  <p className="font-semibold">{selectedBooking.customerInfo.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('status')} *</label>
                  <select
                    required
                    className="input-field"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="confirmed">{t('confirmed')}</option>
                    <option value="in_transit">{t('inTransit')}</option>
                    <option value="out_for_delivery">{t('outForDelivery')}</option>
                    <option value="delivered">{t('delivered')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={updateBookingStatus} className="flex-1 btn-primary">
                    {t('updateStatus')}
                  </button>
                  <button 
                    onClick={() => setShowStatusModal(false)} 
                    className="flex-1 btn-secondary"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setBookingToDelete(null);
          }}
          onConfirm={deleteBooking}
          title="Delete Booking"
          message="Are you sure you want to delete this booking? This action cannot be undone and all associated data will be permanently removed."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}
