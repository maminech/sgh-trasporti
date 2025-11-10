'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { api } from '@/lib/api';
import { FaBriefcase, FaCheck, FaTimes, FaEye, FaDownload, FaTrash, FaCalendar, FaUser } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function ApplicationsPage() {
  const t = useTranslations('admin');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const response: any = await api.applications.getAll({ status: filter !== 'all' ? filter : undefined });
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      await api.applications.update(id, { status });
      fetchApplications();
      if (selectedApplication?._id === id) {
        setShowDetailsModal(false);
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status');
    }
  };

  const handleDelete = async () => {
    if (!applicationToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.applications.delete(applicationToDelete);
      fetchApplications();
      setShowDeleteConfirm(false);
      setApplicationToDelete(null);
      if (selectedApplication?._id === applicationToDelete) {
        setShowDetailsModal(false);
        setSelectedApplication(null);
      }
      alert('Application deleted successfully!');
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application');
    } finally {
      setIsDeleting(false);
    }
  };

  const viewDetails = (application: any) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const confirmDelete = (id: string) => {
    setApplicationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      interview_scheduled: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getFullName = (app: any) => {
    if (app.name) return app.name;
    if (app.personalInfo) {
      return `${app.personalInfo.firstName || ''} ${app.personalInfo.lastName || ''}`.trim();
    }
    return 'N/A';
  };

  const getEmail = (app: any) => {
    return app.email || app.personalInfo?.email || 'N/A';
  };

  const getPhone = (app: any) => {
    return app.phone || app.personalInfo?.phone || 'N/A';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Job Applications</h1>
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
              onClick={() => setFilter('reviewing')}
              className={`px-4 py-2 rounded-lg ${filter === 'reviewing' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            >
              Reviewing
            </button>
            <button
              onClick={() => setFilter('interview_scheduled')}
              className={`px-4 py-2 rounded-lg ${filter === 'interview_scheduled' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            >
              Interviews
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBriefcase className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application: any) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{getFullName(application)}</div>
                      <div className="text-sm text-gray-500">{getEmail(application)}</div>
                      <div className="text-sm text-gray-500">{getPhone(application)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{application.position?.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(application.status)}`}>
                        {application.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => viewDetails(application)}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {application.documents?.cv && (
                          <a
                            href={application.documents.cv}
                            download
                            className="text-primary-600 hover:text-primary-900 p-2"
                            title="Download CV"
                          >
                            <FaDownload />
                          </a>
                        )}
                        <button
                          onClick={() => confirmDelete(application._id)}
                          className="text-red-600 hover:text-red-900 p-2"
                          title="Delete"
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

        {/* Details Modal */}
        {showDetailsModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                    <p className="text-gray-600">{getFullName(selectedApplication)}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Update Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Update Status</h3>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'pending')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'reviewing')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Reviewing
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'interview_scheduled')}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                      Schedule Interview
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'accepted')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                  <div className="mt-3">
                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(selectedApplication.status)}`}>
                      Current: {selectedApplication.status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <FaUser className="mr-2" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{getFullName(selectedApplication)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{getEmail(selectedApplication)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{getPhone(selectedApplication)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Position Applied</p>
                      <p className="font-medium capitalize">{selectedApplication.position?.replace('_', ' ')}</p>
                    </div>
                    {selectedApplication.personalInfo?.dateOfBirth && (
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium">{new Date(selectedApplication.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedApplication.personalInfo?.address && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">
                          {selectedApplication.personalInfo.address.street}, {selectedApplication.personalInfo.address.city}, {selectedApplication.personalInfo.address.postalCode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience */}
                {selectedApplication.experience && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Experience</h3>
                    <div className="space-y-2">
                      {selectedApplication.experience.years && (
                        <p><span className="text-gray-600">Years of Experience:</span> <span className="font-medium">{selectedApplication.experience.years}</span></p>
                      )}
                      {selectedApplication.experience.skills && selectedApplication.experience.skills.length > 0 && (
                        <div>
                          <p className="text-gray-600 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.experience.skills.map((skill: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Licenses */}
                {selectedApplication.licenses && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Licenses & Certifications</h3>
                    <div className="space-y-3">
                      {selectedApplication.licenses.drivingLicense?.number && (
                        <div>
                          <p className="text-sm text-gray-600">Driving License</p>
                          <p className="font-medium">
                            {selectedApplication.licenses.drivingLicense.number} - Category: {selectedApplication.licenses.drivingLicense.category}
                          </p>
                        </div>
                      )}
                      {selectedApplication.licenses.commercialLicense?.number && (
                        <div>
                          <p className="text-sm text-gray-600">Commercial License</p>
                          <p className="font-medium">
                            {selectedApplication.licenses.commercialLicense.number} - Type: {selectedApplication.licenses.commercialLicense.type}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Availability */}
                {selectedApplication.availability && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <FaCalendar className="mr-2" /> Availability
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedApplication.availability.startDate && (
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-medium">{new Date(selectedApplication.availability.startDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedApplication.availability.preferredShift && (
                        <div>
                          <p className="text-sm text-gray-600">Preferred Shift</p>
                          <p className="font-medium capitalize">{selectedApplication.availability.preferredShift}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Full Time</p>
                        <p className="font-medium">{selectedApplication.availability.fullTime ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {(selectedApplication.notes || selectedApplication.message) && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Applicant Notes</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedApplication.notes || selectedApplication.message || 'No notes provided'}
                    </p>
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Admin Notes</h3>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    rows={4}
                    placeholder="Add notes about this application..."
                    defaultValue={selectedApplication.adminNotes || ''}
                    onBlur={(e) => {
                      if (e.target.value !== selectedApplication.adminNotes) {
                        api.applications.update(selectedApplication._id, { adminNotes: e.target.value });
                      }
                    }}
                  />
                </div>

                {/* Documents */}
                {selectedApplication.documents && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Documents</h3>
                    <div className="space-y-2">
                      {selectedApplication.documents.cv && (
                        <a
                          href={selectedApplication.documents.cv}
                          download
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <FaDownload /> Download CV
                        </a>
                      )}
                      {selectedApplication.documents.coverLetter && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Cover Letter:</p>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedApplication.documents.coverLetter}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Application Info */}
                <div className="pt-4 border-t text-sm text-gray-500">
                  <p>Applied: {new Date(selectedApplication.createdAt).toLocaleString()}</p>
                  {selectedApplication.updatedAt && (
                    <p>Last Updated: {new Date(selectedApplication.updatedAt).toLocaleString()}</p>
                  )}
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
            setApplicationToDelete(null);
          }}
          onConfirm={handleDelete}
          title="Delete Application"
          message="Are you sure you want to delete this job application? This action cannot be undone and will permanently remove all application data."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </div>
    </AdminLayout>
  );
}
