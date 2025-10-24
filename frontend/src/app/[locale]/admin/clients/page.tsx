'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/lib/api';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendar } from 'react-icons/fa';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
                    <button className="w-full btn-primary text-sm">
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
      </div>
    </AdminLayout>
  );
}
