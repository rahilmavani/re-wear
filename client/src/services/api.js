import axios from 'axios';

// Create an axios instance with base URL and default headers
const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.get('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getUserItems: () => api.get('/users/items'),
  getUserSwaps: () => api.get('/users/swaps'),
  getReceivedRequests: () => api.get('/users/requests'),
};

// Item services
export const itemService = {
  getAllItems: (params) => api.get('/items', { params }),
  getItem: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => api.post('/items', itemData),
  updateItem: (id, itemData) => api.put(`/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/${id}`),
};

// Swap services
export const swapService = {
  createSwapRequest: (swapData) => api.post('/swaps', swapData),
  getSwapRequests: () => api.get('/swaps'),
  getSwapRequest: (id) => api.get(`/swaps/${id}`),
  updateSwapStatus: (id, statusData) => api.put(`/swaps/${id}`, statusData),
  cancelSwapRequest: (id) => api.delete(`/swaps/${id}`),
};

// Upload services
export const uploadService = {
  uploadImage: (formData) => {
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultipleImages: (formData) => {
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Admin services
export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPendingItems: () => api.get('/admin/items/pending'),
  approveRejectItem: (id, approvalData) => api.put(`/admin/items/${id}`, approvalData),
  getAllSwapRequests: () => api.get('/admin/swaps'),
  getDashboardStats: () => api.get('/admin/stats'),
};

export default api; 