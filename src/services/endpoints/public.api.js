import api from '@/services/api'

/**
 * نقاط النهاية العامة (بدون مصادقة) — تخدم الواجهة بوج + أرشيف المشاريع.
 * ملاحظة: الـ interceptor يرفق التوكن إن وُجد، والباك إند يتجاهله لهذه المسارات.
 */
export default {
  // GET /public/stats
  // response: { departments, teams, supervisors, students, projects, avg_completion? }
  // avg_completion: نسبة مئوية 0-100 (اختياري) — تُستخدم بلوحة هوية صفحات المصادقة
  getPlatformStats: () => api.get('/public/stats'),

  // GET /public/projects/featured?limit=6
  // response: { data: [Project], meta: { total } }
  getFeaturedProjects: (params) => api.get('/public/projects/featured', { params }),

  // GET /public/projects?page=1&per_page=9&search=&department_id=&degree=
  // response: { data: [Project], meta: { current_page, last_page, total } }
  getProjects: (params) => api.get('/public/projects', { params }),

  // GET /public/projects/:id
  // response: { data: Project }
  getProject: (id) => api.get(`/public/projects/${id}`),

  // GET /public/departments
  // response: { data: [{ id, name, programs: [{ id, name, degree }] }] }
  getDepartments: () => api.get('/public/departments')
}

/**
 * شكل قائمة Project المتوقع من الباك إند:
 * {
 *   id: number,
 *   title: string,              // "نظام إدارة عيادات طبية"
 *   supervisor_name: string,    // "د. يوسف الجندي"
 *   department_name: string,    // "قسم البرمجيات"
 *   program_name: string,       // "قواعد البيانات"
 *   degree: string,             // "دبلوم" | "بكالوريوس"
 *   youtube_id: string|null,    // معرّف فيديو يوتيوب فقط، لا رابط كامل
 *   thumbnail_url: string|null, // صورة مصغّرة بديلة إن لا يوجد فيديو
 *   year: number|null
 * }
 */
