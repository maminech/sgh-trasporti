import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        // Only redirect to login if it's a protected route AND token exists but is invalid
        if (error.response?.status === 401 && Cookies.get('token')) {
          // Check if this is not a public route
          const currentPath = window.location.pathname;
          const publicRoutes = ['/booking', '/contact', '/quote', '/tracking'];
          const isPublicRoute = publicRoutes.some(route => currentPath.includes(route));
          
          if (!isPublicRoute) {
            Cookies.remove('token');
            Cookies.remove('user');
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  auth = {
    register: (data: any) => this.client.post('/auth/register', data),
    login: (data: any) => this.client.post('/auth/login', data),
    getMe: () => this.client.get('/auth/me'),
    updateProfile: (data: any) => this.client.put('/auth/updatedetails', data),
    updatePassword: (data: any) => this.client.put('/auth/updatepassword', data),
  };

  // Booking endpoints
  bookings = {
    create: (data: any) => this.client.post('/bookings', data),
    getAll: (params?: any) => this.client.get('/bookings', { params }),
    getById: (id: string) => this.client.get(`/bookings/${id}`),
    update: (id: string, data: any) => this.client.put(`/bookings/${id}`, data),
    delete: (id: string) => this.client.delete(`/bookings/${id}`),
    getMyBookings: (params?: any) => this.client.get('/bookings/my-bookings', { params }),
  };

  // Tracking endpoints
  tracking = {
    track: (code: string) => this.client.get(`/tracking/${code}`),
    updateLocation: (id: string, data: any) =>
      this.client.put(`/tracking/${id}/location`, data),
  };

  // Quote endpoints
  quotes = {
    create: (data: any) => this.client.post('/quotes', data),
    getAll: (params?: any) => this.client.get('/quotes', { params }),
    getById: (id: string) => this.client.get(`/quotes/${id}`),
    update: (id: string, data: any) => this.client.put(`/quotes/${id}`, data),
    delete: (id: string) => this.client.delete(`/quotes/${id}`),
    respond: (id: string, data: any) => this.client.post(`/quotes/${id}/respond`, data),
  };

  // Fleet endpoints
  fleet = {
    getAll: (params?: any) => this.client.get('/fleet', { params }),
    getById: (id: string) => this.client.get(`/fleet/${id}`),
    create: (data: any) => this.client.post('/fleet', data),
    update: (id: string, data: any) => this.client.put(`/fleet/${id}`, data),
    delete: (id: string) => this.client.delete(`/fleet/${id}`),
  };

  // Application endpoints
  applications = {
    submit: (data: any) => this.client.post('/applications', data),
    getAll: (params?: any) => this.client.get('/applications', { params }),
    getById: (id: string) => this.client.get(`/applications/${id}`),
    update: (id: string, data: any) => this.client.put(`/applications/${id}`, data),
    delete: (id: string) => this.client.delete(`/applications/${id}`),
  };

  // Contact endpoints
  contact = {
    submit: (data: any) => this.client.post('/contact', data),
    getAll: (params?: any) => this.client.get('/contact', { params }),
    update: (id: string, data: any) => this.client.put(`/contact/${id}`, data),
    delete: (id: string) => this.client.delete(`/contact/${id}`),
  };

  // Dashboard endpoints
  dashboard = {
    getStats: () => this.client.get('/dashboard/stats'),
  };

  // GPS tracking endpoints
  gps = {
    getBookingHistory: (bookingId: string, params?: any) =>
      this.client.get(`/gps/booking/${bookingId}`, { params }),
    getCurrentLocation: (bookingId: string) =>
      this.client.get(`/gps/booking/${bookingId}/current`),
    getVehicleHistory: (vehicleId: string, params?: any) =>
      this.client.get(`/gps/vehicle/${vehicleId}`, { params }),
    getActiveFleet: () => this.client.get('/gps/fleet/active'),
    startSimulation: (bookingId: string, options?: any) =>
      this.client.post(`/gps/simulate/${bookingId}/start`, options),
    stopSimulation: (bookingId: string) =>
      this.client.post(`/gps/simulate/${bookingId}/stop`),
    getActiveSimulations: () => this.client.get('/gps/simulate/active'),
    recordLocation: (data: any) => this.client.post('/gps/location', data),
  };

  // Invoice endpoints
  invoices = {
    create: (data: any) => this.client.post('/invoices', data),
    getAll: (params?: any) => this.client.get('/invoices', { params }),
    getById: (id: string) => this.client.get(`/invoices/${id}`),
    update: (id: string, data: any) => this.client.put(`/invoices/${id}`, data),
    delete: (id: string) => this.client.delete(`/invoices/${id}`),
    downloadPDF: (id: string) => this.client.get(`/invoices/${id}/pdf`, {
      responseType: 'blob'
    }),
    getStats: () => this.client.get('/invoices/stats'),
  };

  // User endpoints
  users = {
    getAll: (params?: any) => this.client.get('/users', { params }),
    getById: (id: string) => this.client.get(`/users/${id}`),
    update: (id: string, data: any) => this.client.put(`/users/${id}`, data),
    delete: (id: string) => this.client.delete(`/users/${id}`),
  };
}

export const api = new ApiClient();
