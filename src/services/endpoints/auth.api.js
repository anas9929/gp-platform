import api from '@/services/api'

/**
 * نداءات المصادقة — مطابقة لعقد الباك إند الفعلي (docs/api-reference.html).
 * لا يوجد "نسيت كلمة المرور" ذاتي الخدمة بهذا الباك إند: كلمات المرور لا تُرسل
 * أبدًا صراحة، فقط روابط دعوة لمرة واحدة (invite/accept) يحددها المستخدم بنفسه.
 */
export default {
  // POST /login  body: { email, password }
  // response: { user: { id, name, email, role, whatsapp, university_number,
  //                      specialization_id, term_id, status, must_change_password }, token }
  login: (payload) => api.post('/login', payload),

  // POST /logout
  logout: () => api.post('/logout'),

  // GET /me → المستخدم الحالي (استعادة الجلسة عند إعادة التحميل)
  me: () => api.get('/me'),

  // POST /me/change-password  body: { current_password, password, password_confirmation }
  // معفى من بوابة 423 (يجب أن يعمل حتى إذا كان must_change_password: true)
  changePassword: (payload) => api.post('/me/change-password', payload),

  // POST /invite/{token}/accept  body: { password, password_confirmation }
  // يُستخدم لأول تسجيل دخول بعد استيراد/دعوة — الرابط صالح لمرة واحدة، 3 أيام
  acceptInvite: (token, payload) => api.post(`/invite/${token}/accept`, payload)
}
