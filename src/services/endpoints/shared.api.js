import api from '@/services/api'

/** موارد مشتركة بين كل الأدوار: الفصول الدراسية، الإشعارات، البروفايل */
export default {
  // GET /semesters → [{ id, name, is_active }]
  getSemesters: () => api.get('/semesters'),

  // GET /notifications?page=1
  getNotifications: (params) => api.get('/notifications', { params }),

  // GET /notifications/unread-count → { count }
  getUnreadCount: () => api.get('/notifications/unread-count'),

  // POST /notifications/:id/read
  markAsRead: (id) => api.post(`/notifications/${id}/read`),

  // POST /notifications/read-all
  markAllAsRead: () => api.post('/notifications/read-all'),

  // GET /profile
  getProfile: () => api.get('/profile'),

  // PUT /profile
  updateProfile: (payload) => api.put('/profile', payload)
}
