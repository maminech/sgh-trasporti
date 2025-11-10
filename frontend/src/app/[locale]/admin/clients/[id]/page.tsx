'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/lib/api';
import { useTranslations } from 'next-intl';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaFileInvoice,
  FaPlus,
  FaDownload,
  FaPaperPlane,
  FaTimes,
  FaBox,
  FaFileAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUpload,
} from 'react-icons/fa';

export default function ClientDetailPage() {
  const t = useTranslations('admin');
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const locale = params.locale as string;

  const [client, setClient] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [invoiceFormData, setInvoiceFormData] = useState({
    dueDate: '',
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ],
    tax: 22,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      // Fetch client details
      const clientResponse: any = await api.users.getById(clientId);
      setClient(clientResponse.data);

      // Fetch client's bookings
      const bookingsResponse: any = await api.bookings.getAll({ 
        customerId: clientId 
      });
      setBookings(bookingsResponse.data || []);

      // Fetch client's invoices
      const invoicesResponse: any = await api.invoices.getByCustomer(clientId);
      setInvoices(invoicesResponse.data || []);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openInvoiceModal = (booking?: any) => {
    if (booking) {
      setSelectedBooking(booking);
      // Pre-fill invoice with booking data
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      
      setInvoiceFormData({
        dueDate: defaultDate.toISOString().split('T')[0],
        items: [
          {
            description: `Transport Service - ${booking.origin?.city} to ${booking.destination?.city}`,
            quantity: 1,
            unitPrice: booking.price || 0,
            total: booking.price || 0,
          },
        ],
        tax: 22,
        notes: `Invoice for booking ${booking.trackingCode}`,
      });
    } else {
      setSelectedBooking(null);
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      
      setInvoiceFormData({
        dueDate: defaultDate.toISOString().split('T')[0],
        items: [
          {
            description: '',
            quantity: 1,
            unitPrice: 0,
            total: 0,
          },
        ],
        tax: 22,
        notes: '',
      });
    }
    setShowInvoiceModal(true);
  };

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedBooking(null);
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
    setUploadFile(null);
    setUploadNotes('');
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadNotes('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only');
        return;
      }
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setUploadFile(file);
    }
  };

  const handleUploadInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a PDF file');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('invoice', uploadFile);
      formData.append('customerId', clientId);
      formData.append('notes', uploadNotes);

      await api.invoices.uploadInvoice(formData);

      alert('Invoice uploaded and sent successfully!');
      closeUploadModal();
      fetchClientData();
    } catch (error) {
      console.error('Error uploading invoice:', error);
      alert('Failed to upload invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const addInvoiceItem = () => {
    setInvoiceFormData({
      ...invoiceFormData,
      items: [
        ...invoiceFormData.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ],
    });
  };

  const removeInvoiceItem = (index: number) => {
    const newItems = invoiceFormData.items.filter((_, i) => i !== index);
    setInvoiceFormData({
      ...invoiceFormData,
      items: newItems.length > 0 ? newItems : [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const newItems = [...invoiceFormData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate total for this item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setInvoiceFormData({
      ...invoiceFormData,
      items: newItems,
    });
  };

  const calculateInvoiceTotals = () => {
    const subtotal = invoiceFormData.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * invoiceFormData.tax) / 100;
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  };

  const handleGenerateAndSendInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { subtotal, taxAmount, total } = calculateInvoiceTotals();

      await api.invoices.generateAndSend({
        customerId: clientId,
        bookingId: selectedBooking?._id,
        dueDate: invoiceFormData.dueDate,
        items: invoiceFormData.items,
        subtotal,
        tax: invoiceFormData.tax,
        taxAmount,
        total,
        notes: invoiceFormData.notes,
        status: 'pending',
      });

      alert('Invoice generated and sent successfully!');
      closeInvoiceModal();
      fetchClientData();
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadInvoicePDF = async (invoiceId: string) => {
    try {
      const response: any = await api.invoices.downloadPDF(invoiceId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Client not found</p>
          <button onClick={() => router.back()} className="mt-4 btn-primary">
            Go Back
          </button>
        </div>
      </AdminLayout>
    );
  }

  const { subtotal, taxAmount, total } = calculateInvoiceTotals();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/${locale}/admin/clients`)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaArrowLeft size={20} />
            </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">{t('customer')} Details</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openInvoiceModal()}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> Generate Invoice
          </button>
          <button
            onClick={openUploadModal}
            className="btn-secondary flex items-center gap-2"
          >
            <FaUpload /> Upload Invoice
          </button>
        </div>
      </div>        {/* Client Information Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-primary-600 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
              <p className="text-gray-600">{client.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <FaEnvelope className="text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">{t('email')}</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>

              {client.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaPhone className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">{t('phone')}</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>
              )}

              {client.company && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaBuilding className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">{t('company')}</p>
                    <p className="font-medium">{client.company}</p>
                  </div>
                </div>
              )}

              {client.address && (
                <div className="flex items-center gap-3 text-gray-700">
                  <FaMapMarkerAlt className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">{t('address')}</p>
                    <p className="font-medium">{client.address}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings and Invoices */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{t('bookings')}</p>
                    <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                  <FaBox className="text-4xl text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Invoices</p>
                    <p className="text-3xl font-bold text-gray-900">{invoices.length}</p>
                  </div>
                  <FaFileInvoice className="text-4xl text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      €{invoices.reduce((sum, inv) => sum + (inv.total || 0), 0).toFixed(2)}
                    </p>
                  </div>
                  <FaMoneyBillWave className="text-4xl text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold">{t('bookings')}</h3>
              </div>
              <div className="p-6">
                {bookings.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">{t('noDataFound')}</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{booking.trackingCode}</p>
                          <p className="text-sm text-gray-600">
                            {booking.origin?.city} → {booking.destination?.city}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.pickupDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'in_transit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                          <button
                            onClick={() => openInvoiceModal(booking)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                            title="Generate Invoice"
                          >
                            <FaFileInvoice />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold">Invoices</h3>
              </div>
              <div className="p-6">
                {invoices.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No invoices yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-gray-700 font-semibold">Invoice #</th>
                          <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('date')}</th>
                          <th className="text-left py-3 px-4 text-gray-700 font-semibold">Due Date</th>
                          <th className="text-left py-3 px-4 text-gray-700 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('status')}</th>
                          <th className="text-left py-3 px-4 text-gray-700 font-semibold">{t('actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr key={invoice._id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{invoice.invoiceNumber}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(invoice.issueDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 font-semibold">€{invoice.total?.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(invoice.status)}`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => downloadInvoicePDF(invoice._id)}
                                className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                                title="Download PDF"
                              >
                                <FaDownload />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Generation Modal */}
        {showInvoiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold">Generate Invoice</h2>
                <button onClick={closeInvoiceModal} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleGenerateAndSendInvoice} className="p-6">
                <div className="space-y-6">
                  {/* Invoice Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('customer')}</p>
                        <p className="font-semibold">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.email}</p>
                      </div>
                      {selectedBooking && (
                        <div>
                          <p className="text-sm text-gray-600">Booking</p>
                          <p className="font-semibold">{selectedBooking.trackingCode}</p>
                          <p className="text-sm text-gray-600">
                            {selectedBooking.origin?.city} → {selectedBooking.destination?.city}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={invoiceFormData.dueDate}
                      onChange={(e) => setInvoiceFormData({ ...invoiceFormData, dueDate: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  {/* Invoice Items */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Invoice Items *
                      </label>
                      <button
                        type="button"
                        onClick={addInvoiceItem}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                      >
                        <FaPlus size={12} /> Add Item
                      </button>
                    </div>

                    <div className="space-y-4">
                      {invoiceFormData.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-5">
                              <label className="block text-xs text-gray-600 mb-1">{t('description')}</label>
                              <input
                                type="text"
                                required
                                value={item.description}
                                onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                                className="input-field text-sm"
                                placeholder="Service description"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                              <input
                                type="number"
                                required
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value))}
                                className="input-field text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-gray-600 mb-1">Unit Price (€)</label>
                              <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseFloat(e.target.value))}
                                className="input-field text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-gray-600 mb-1">Total (€)</label>
                              <input
                                type="number"
                                value={item.total.toFixed(2)}
                                readOnly
                                className="input-field text-sm bg-gray-100"
                              />
                            </div>
                            <div className="col-span-1 flex items-end">
                              {invoiceFormData.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeInvoiceItem(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tax */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={invoiceFormData.tax}
                      onChange={(e) => setInvoiceFormData({ ...invoiceFormData, tax: parseFloat(e.target.value) })}
                      className="input-field"
                    />
                  </div>

                  {/* Invoice Totals */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax ({invoiceFormData.tax}%):</span>
                      <span className="font-semibold">€{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-primary-600">€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('notes')}
                    </label>
                    <textarea
                      rows={3}
                      value={invoiceFormData.notes}
                      onChange={(e) => setInvoiceFormData({ ...invoiceFormData, notes: e.target.value })}
                      className="input-field"
                      placeholder="Additional notes for the client..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <FaPaperPlane />
                      {submitting ? 'Generating...' : 'Generate & Send Invoice'}
                    </button>
                    <button
                      type="button"
                      onClick={closeInvoiceModal}
                      className="flex-1 btn-secondary"
                      disabled={submitting}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upload Invoice Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FaUpload size={24} />
                    <h2 className="text-2xl font-bold">Upload Invoice</h2>
                  </div>
                  <button
                    onClick={closeUploadModal}
                    className="text-white hover:text-gray-200"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <p className="text-primary-100 mt-2">Upload a pre-made invoice PDF for {client.name}</p>
              </div>

              <form onSubmit={handleUploadInvoice} className="p-6">
                <div className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice PDF File <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="invoice-upload"
                        required
                      />
                      <label htmlFor="invoice-upload" className="cursor-pointer">
                        <FaUpload className="mx-auto text-4xl text-gray-400 mb-3" />
                        {uploadFile ? (
                          <div className="space-y-2">
                            <p className="text-green-600 font-medium">
                              {uploadFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Size: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <button
                              type="button"
                              onClick={() => setUploadFile(null)}
                              className="text-red-500 text-sm hover:underline"
                            >
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-700 font-medium mb-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF files only (Max 10MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={uploadNotes}
                      onChange={(e) => setUploadNotes(e.target.value)}
                      className="input-field"
                      placeholder="Add any notes about this invoice..."
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FaFileAlt className="text-blue-600 mt-1" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Upload Instructions:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                          <li>Only PDF files are accepted</li>
                          <li>Maximum file size is 10MB</li>
                          <li>Invoice will be automatically sent to {client.email}</li>
                          <li>Invoice will appear in the client's invoice history</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting || !uploadFile}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <FaPaperPlane />
                      {submitting ? 'Uploading...' : 'Upload & Send Invoice'}
                    </button>
                    <button
                      type="button"
                      onClick={closeUploadModal}
                      className="flex-1 btn-secondary"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
