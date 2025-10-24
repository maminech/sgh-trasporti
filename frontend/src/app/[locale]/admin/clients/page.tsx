'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/lib/api';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response: any = await api.users.getAll({ role: 'client' });
      setClients(response.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client: any) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewClientDetails = (client: any) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clients</h1>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No clients found matching your search' : 'No clients registered yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client: any) => (
              <div key={client._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                  <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4 mx-auto">
                    <FaUser className="text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-center">{client.name}</h3>
                  {client.company && (
                    <p className="text-center text-primary-100 mt-1">{client.company}</p>
                  )}
                </div>
                
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaEnvelope className="text-primary-600" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  
                  {client.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaPhone className="text-primary-600" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  )}
                  
                  {client.company && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaBuilding className="text-primary-600" />
                      <span className="text-sm">{client.company}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-gray-700 pt-3 border-t">
                    <FaCalendar className="text-primary-600" />
                    <span className="text-sm">
                      Joined: {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <button 
                      onClick={() => viewClientDetails(client)}
                      className="w-full btn-primary text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Client Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{clients.length}</div>
              <div className="text-gray-600 mt-1">Total Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {clients.filter((c: any) => c.emailVerified).length}
              </div>
              <div className="text-gray-600 mt-1">Verified Emails</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {clients.filter((c: any) => c.isActive !== false).length}
              </div>
              <div className="text-gray-600 mt-1">Active Accounts</div>
            </div>
          </div>
        </div>

        {/* Client Details Modal */}
        {showModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedClient.name}</h2>
                    {selectedClient.company && (
                      <p className="text-primary-100 flex items-center gap-2">
                        <FaBuilding /> {selectedClient.company}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-primary-600 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="font-medium text-gray-900">{selectedClient.email}</p>
                      </div>
                    </div>
                    
                    {selectedClient.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaPhone className="text-primary-600 flex-shrink-0" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Phone</p>
                          <p className="font-medium text-gray-900">{selectedClient.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company & Address */}
                {(selectedClient.company || selectedClient.address) && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Company Details</h3>
                    <div className="space-y-3">
                      {selectedClient.company && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FaBuilding className="text-primary-600 flex-shrink-0" size={20} />
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Company Name</p>
                            <p className="font-medium text-gray-900">{selectedClient.company}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedClient.address && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <FaMapMarkerAlt className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Address</p>
                            <p className="font-medium text-gray-900">{selectedClient.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Account Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase mb-1">Member Since</p>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <FaCalendar className="text-primary-600" />
                        {new Date(selectedClient.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase mb-1">Account Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedClient.isActive !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedClient.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase mb-1">Email Verified</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedClient.emailVerified 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedClient.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase mb-1">Role</p>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 capitalize">
                        {selectedClient.role || 'Client'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedClient.notes && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Notes</h3>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedClient.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <a
                    href={`mailto:${selectedClient.email}`}
                    className="flex-1 btn-primary text-center"
                  >
                    Send Email
                  </a>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
