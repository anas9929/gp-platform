import api from '@/services/api'

/**
 * كل نداءات المصادقة.
 * المسارات مبدئية — تُعدَّل عند تثبيت عقد الـ API النهائي.
 */
export default {
  // POST /auth/login  body: { email, password, remember }
  // response: { token, user: { id, name, email, role, ... } }
  login: (payload) => api.post('/auth/login', payload),

  // POST /auth/logout
  logout: () => api.post('/auth/logout'),

  // GET /auth/me → المستخدم الحالي (تُستخدم لاستعادة الجلسة عند إعادة التحميل)
  me: () => api.get('/auth/me'),

  // POST /auth/forgot-password  body: { email }
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),

  // POST /auth/reset-password  body: { token, email, password, password_confirmation }
  resetPassword: (payload) => api.post('/auth/reset-password', payload),

  // POST /auth/change-password  body: { current_password, password, password_confirmation }
  changePassword: (payload) => api.post('/auth/change-password', payload)
}
