import api from './api';

const adminService = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Categories
  getAllCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.patch(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Businesses
  getAllBusinesses: (params) => api.get('/admin/businesses', { params }),
  verifyBusiness: (id) => api.patch(`/admin/businesses/${id}/verify`),
  suspendBusiness: (id, reason) => api.patch(`/admin/businesses/${id}/suspend`, { reason }),
  unsuspendBusiness: (id) => api.patch(`/admin/businesses/${id}/unsuspend`),
  deleteBusiness: (id) => api.delete(`/admin/businesses/${id}`),

  // Creators
  getAllCreators: (params) => api.get('/admin/creators', { params }),
  getCreatorDetails: (id) => api.get(`/admin/creators/${id}`),
  suspendCreator: (id, reason) => api.patch(`/admin/creators/${id}/suspend`, { reason }),
  unsuspendCreator: (id) => api.patch(`/admin/creators/${id}/unsuspend`),

  // Content
  getAllContent: (params) => api.get('/admin/content', { params }),

  // Reports
  generateReport: (params) => api.get('/admin/reports', { params }),
};

export default adminService;
