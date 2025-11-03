'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/lib/api';
import { FaFileInvoice, FaCheck, FaTimes, FaEye, FaReply } from 'react-icons/fa';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({
    amount: '',
    currency: 'EUR',
    validUntil: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, [filter]);

  const fetchQuotes = async () => {
    try {
      const response: any = await api.quotes.getAll({ status: filter !== 'all' ? filter : undefined });
      setQuotes(response.data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      await api.quotes.update(id, { status });
      fetchQuotes();
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  const openResponseModal = (quote: any) => {
    setSelectedQuote(quote);
    setShowResponseModal(true);
    // Set default valid until date (7 days from now)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setResponseData({
      amount: '',
      currency: 'EUR',
      validUntil: defaultDate.toISOString().split('T')[0],
      notes: '',
    });
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
    setSelectedQuote(null);
    setResponseData({
      amount: '',
      currency: 'EUR',
      validUntil: '',
      notes: '',
    });
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.quotes.respond(selectedQuote._id, {
        amount: parseFloat(responseData.amount),
        currency: responseData.currency,
        validUntil: responseData.validUntil,
        notes: responseData.notes,
      });
      
      alert('Quote response sent successfully to customer!');
      closeResponseModal();
      fetchQuotes();
    } catch (error) {
      console.error('Error sending quote response:', error);
      alert('Failed to send quote response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quote Requests</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            >
              Approved
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading quotes...</p>
          </div>
        ) : quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaFileInvoice className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No quotes found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote: any) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quote.customerInfo?.name}</div>
                      <div className="text-sm text-gray-500">{quote.customerInfo?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quote.origin?.city}, {quote.origin?.country}</div>
                      <div className="text-sm text-gray-500">→ {quote.destination?.city}, {quote.destination?.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quote.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quote.packageDetails?.weight ? `${quote.packageDetails.weight} kg` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {quote.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openResponseModal(quote)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Send Quote"
                            >
                              <FaReply />
                            </button>
                            <button
                              onClick={() => updateQuoteStatus(quote._id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        <button className="text-primary-600 hover:text-primary-900" title="View">
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quote Response Modal */}
        {showResponseModal && selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Send Quote Response</h2>
                  <button
                    onClick={closeResponseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                {/* Quote Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Quote Request Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Customer:</p>
                      <p className="font-medium">{selectedQuote.customerInfo?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-medium">{selectedQuote.customerInfo?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">From:</p>
                      <p className="font-medium">{selectedQuote.origin?.city}, {selectedQuote.origin?.country}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">To:</p>
                      <p className="font-medium">{selectedQuote.destination?.city}, {selectedQuote.destination?.country}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Service Type:</p>
                      <p className="font-medium">{selectedQuote.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Weight:</p>
                      <p className="font-medium">{selectedQuote.packageDetails?.weight ? `${selectedQuote.packageDetails.weight} kg` : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Response Form */}
                <form onSubmit={handleResponseSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quoted Price *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={responseData.amount}
                          onChange={(e) => setResponseData({ ...responseData, amount: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={responseData.currency}
                          onChange={(e) => setResponseData({ ...responseData, currency: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="EUR">EUR (€)</option>
                          <option value="USD">USD ($)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valid Until *
                      </label>
                      <input
                        type="date"
                        required
                        value={responseData.validUntil}
                        onChange={(e) => setResponseData({ ...responseData, validUntil: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={responseData.notes}
                        onChange={(e) => setResponseData({ ...responseData, notes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Add any additional information for the customer (e.g., delivery time, special conditions, etc.)"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeResponseModal}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sending...' : 'Send Quote to Customer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
