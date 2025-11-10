'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomerLayout from '@/components/portal/CustomerLayout';
import { FiDownload, FiArrowLeft, FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';
import { FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { api } from '@/lib/api';

interface InvoiceDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { locale, id } = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await api.invoices.getById(id);
      setInvoice(response.data);
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      alert('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!invoice) return;
    
    try {
      const response: any = await api.invoices.downloadPDF(invoice._id);
      const blob = response instanceof Blob ? response : new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice PDF');
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  if (loading) {
    return (
      <CustomerLayout locale={locale}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (!invoice) {
    return (
      <CustomerLayout locale={locale}>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Invoice not found</p>
          <button
            onClick={() => router.push(`/${locale}/portal/invoices`)}
            className="mt-4 btn-primary"
          >
            Back to Invoices
          </button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout locale={locale}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/${locale}/portal/invoices`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
              <p className="text-gray-600">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={downloadPDF}
            className="btn-primary flex items-center gap-2"
          >
            <FiDownload /> Download PDF
          </button>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">SGH Trasporti</h2>
                <p className="text-primary-100">Professional Transport & Logistics</p>
                <p className="text-primary-100 text-sm mt-2">Via Example, 123</p>
                <p className="text-primary-100 text-sm">Milan, Italy</p>
                <p className="text-primary-100 text-sm">VAT: IT12345678901</p>
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-bold mb-2">INVOICE</h3>
                <p className="text-primary-100">#{invoice.invoiceNumber}</p>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium mt-4 ${
                    statusColors[invoice.status]
                  }`}
                >
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Bill To */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiFileText /> Bill To
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{invoice.customerDetails.name}</p>
                  {invoice.customerDetails.company && (
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaBuilding /> {invoice.customerDetails.company}
                    </p>
                  )}
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaEnvelope /> {invoice.customerDetails.email}
                  </p>
                  {invoice.customerDetails.phone && (
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaPhone /> {invoice.customerDetails.phone}
                    </p>
                  )}
                  {invoice.customerDetails.address && (
                    <div className="text-gray-600 flex items-start gap-2 mt-3">
                      <FaMapMarkerAlt className="mt-1" />
                      <div>
                        {invoice.customerDetails.address.street && (
                          <p>{invoice.customerDetails.address.street}</p>
                        )}
                        <p>
                          {invoice.customerDetails.address.postalCode} {invoice.customerDetails.address.city}
                        </p>
                        {invoice.customerDetails.address.country && (
                          <p>{invoice.customerDetails.address.country}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {invoice.customerDetails.vatNumber && (
                    <p className="text-gray-600 text-sm mt-2">VAT: {invoice.customerDetails.vatNumber}</p>
                  )}
                </div>
              </div>

              {/* Invoice Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCalendar /> Invoice Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(invoice.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {invoice.paymentDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="font-medium text-green-600">
                        {new Date(invoice.paymentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {invoice.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                  {invoice.booking && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Reference:</span>
                      <span className="font-medium text-blue-600">
                        {invoice.booking.trackingCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Tax Rate
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 text-center">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 text-right">
                          €{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 text-right">{item.taxRate}%</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                          €{item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full md:w-1/2 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">€{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax:</span>
                  <span className="font-medium">€{invoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2">
                  <span>Total:</span>
                  <span className="text-primary-600">€{invoice.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-8 border-t text-center">
              <p className="text-gray-600 text-sm">Thank you for your business!</p>
              <p className="text-gray-500 text-xs mt-2">
                For any questions regarding this invoice, please contact us at info@sghtrasporti.com
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/${locale}/portal/invoices`)}
            className="flex-1 btn-secondary"
          >
            <FiArrowLeft className="inline mr-2" /> Back to Invoices
          </button>
          <button onClick={downloadPDF} className="flex-1 btn-primary">
            <FiDownload className="inline mr-2" /> Download PDF
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
}
