import { defineStore } from 'pinia'
import publicApi from '@/services/endpoints/public.api'

/**
 * لا توجد بيانات وهمية بهذا الـ store. /projects/featured هو المسار العام
 * الحقيقي الوحيد المتاح (راجعي docs/api-reference.html). الإحصائيات، تصفح
 * كل المشاريع بترقيم صفحات، والأقسام — لا يوجد لها API عام حاليًا، فتُضبط
 * حالة خطأ صريحة فورًا بدل مناداة endpoint غير موجود أو عرض أرقام مصطنعة.
 */
const NO_PUBLIC_STATS_API = 'إحصائيات المنصة العامة غير متوفرة بالباك إند الحالي'
const NO_PUBLIC_DEPARTMENTS_API = 'قائمة الأقسام العامة غير متوفرة بالباك إند الحالي (يتطلب المسار الحقيقي تسجيل دخول)'
const NO_PUBLIC_ARCHIVE_API = 'تصفح كل المشاريع بترقيم صفحات وفلاتر غير متوفر بالباك إند الحالي — المتاح فقط أفضل 6 مشاريع'

export const useLandingStore = defineStore('landing', {
  state: () => ({
    /* إحصائيات المنصة — لا يوجد API عام لها */
    stats: null,
    statsLoading: false,
    statsError: null,

    /* أفضل المشاريع (اللاندنج) — GET /projects/featured، حقيقي */
    featured: [],
    featuredTotal: 0,
    featuredLoading: false,
    featuredError: null,

    /* أرشيف المشاريع (صفحة مستقلة) — لا يوجد API عام لتصفح كل المشاريع */
    projects: [],
    projectsMeta: null,
    projectsLoading: false,
    projectsError: null,

    /* الأقسام — لا يوجد API عام لها */
    departments: [],
    departmentsLoading: false,
    departmentsError: null
  }),

  getters: {
    /** إحصائيات الهيرو الثلاث بالترتيب الظاهر بالتصميم */
    heroStats: (state) => [
      { key: 'projects', label: 'مشروع', value: state.stats?.projects ?? null },
      { key: 'supervisors', label: 'مشرف', value: state.stats?.supervisors ?? null },
      { key: 'students', label: 'طالب', value: state.stats?.students ?? null }
    ],

    /** بطاقات شريط الإحصائيات الخمس */
    bannerStats: (state) => [
      { key: 'departments', label: 'قسم', icon: 'monitor', value: state.stats?.departments ?? null },
      { key: 'teams', label: 'فريق', icon: 'teams', value: state.stats?.teams ?? null },
      { key: 'supervisors', label: 'مشرف', icon: 'users', value: state.stats?.supervisors ?? null },
      { key: 'students', label: 'طالب', icon: 'user', value: state.stats?.students ?? null },
      { key: 'projects', label: 'مشروع', icon: 'briefcase', value: state.stats?.projects ?? null }
    ],

    hasFeatured: (state) => state.featured.length > 0,

    /** إحصائيات لوحة الهوية بصفحات المصادقة (تسجيل الدخول/استعادة كلمة المرور) */
    authBrandStats: (state) => [
      { key: 'projects', label: 'مشروع نشط', value: state.stats?.projects ?? null, suffix: '' },
      { key: 'students', label: 'طالب مسجل', value: state.stats?.students ?? null, suffix: '' },
      { key: 'avg_completion', label: 'متوسط الإنجاز', value: state.stats?.avg_completion ?? null, suffix: '%' }
    ]
  },

  actions: {
    /** لا يوجد endpoint عام للإحصائيات — تُضبط حالة الفجوة فورًا بدل نداء وهمي */
    async fetchStats() {
      this.statsError = NO_PUBLIC_STATS_API
      this.stats = null
      return null
    },

    // GET /projects/featured → { data: [Project], total, current_page, last_page, per_page }
    async fetchFeaturedProjects() {
      this.featuredLoading = true
      this.featuredError = null
      try {
        const { data } = await publicApi.getFeaturedProjects()
        this.featured = data.data || data
        this.featuredTotal = data.total ?? this.featured.length
        return this.featured
      } catch (err) {
        this.featuredError = err.normalized?.message || 'تعذّر تحميل المشاريع المميزة'
        throw err
      } finally {
        this.featuredLoading = false
      }
    },

    /** لا يوجد endpoint عام لتصفح كل المشاريع بترقيم صفحات — تُضبط حالة الفجوة فورًا */
    async fetchProjects() {
      this.projectsError = NO_PUBLIC_ARCHIVE_API
      this.projects = []
      this.projectsMeta = null
      return []
    },

    /** لا يوجد endpoint عام للأقسام — تُضبط حالة الفجوة فورًا */
    async fetchDepartments() {
      this.departmentsError = NO_PUBLIC_DEPARTMENTS_API
      this.departments = []
      return []
    }
  }
})
