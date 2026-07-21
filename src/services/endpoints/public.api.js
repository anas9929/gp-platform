import api from '@/services/api'

/**
 * نقاط النهاية العامة الحقيقية (بدون مصادقة) — راجعي docs/api-reference.html.
 * ⚠️ /projects/featured هو المسار العام الوحيد المؤكد بهذا الباك إند. لا يوجد:
 * - endpoint عام لإحصائيات المنصة (عدد المشاريع/الطلاب/المشرفين)
 * - endpoint عام لتصفح كل المشاريع بترقيم صفحات/بحث/فلاتر (فقط أفضل 6 مشاريع)
 * - endpoint عام للأقسام/التخصصات (موجود بمسار /departments لكنه يتطلب تسجيل دخول)
 * landing.store.js يعكس هذه الفجوات صراحة بدل بيانات وهمية.
 */
export default {
  // GET /projects/featured → { data: [Project], current_page, last_page, total, per_page }
  // Project: { id, name, description, department_id, specialization_id, department: {id,name}, specialization: {id,name} }
  getFeaturedProjects: (params) => api.get('/projects/featured', { params })
}
