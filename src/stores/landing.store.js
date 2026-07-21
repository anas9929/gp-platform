import { defineStore } from 'pinia'
import publicApi from '@/services/endpoints/public.api'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'
import { DEMO_STATS, DEMO_DEPARTMENTS, DEMO_PROJECTS } from '@/utils/demoData'

export const useLandingStore = defineStore('landing', {
  state: () => ({
    /* إحصائيات المنصة */
    stats: null,
    statsLoading: false,
    statsError: null,

    /* أفضل المشاريع (اللاندنج) */
    featured: [],
    featuredTotal: 0,
    featuredLoading: false,
    featuredError: null,

    /* أرشيف المشاريع (صفحة مستقلة) */
    projects: [],
    projectsMeta: null,
    projectsLoading: false,
    projectsError: null,

    /* الأقسام — تُستخدم كفلاتر بالأرشيف */
    departments: [],
    departmentsLoading: false
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
    // TODO API — GET /public/stats
    // response: { departments, teams, supervisors, students, projects, avg_completion? }
    async fetchStats() {
      if (this.statsLoading) return this.stats
      this.statsLoading = true
      this.statsError = null
      try {
        const { data } = await publicApi.getPlatformStats()
        this.stats = data.data || data
        return this.stats
      } catch (_) {
        // لا يوجد باك إند متصل بعد — نعرض بيانات تجريبية مؤقتًا بدل رسالة خطأ للزوار
        this.stats = DEMO_STATS
        return this.stats
      } finally {
        this.statsLoading = false
      }
    },

    // TODO API — GET /public/projects/featured?limit=6
    // response: { data: [Project], meta: { total } }
    async fetchFeaturedProjects(limit = 6) {
      this.featuredLoading = true
      this.featuredError = null
      try {
        const { data } = await publicApi.getFeaturedProjects({ limit })
        this.featured = data.data || data
        this.featuredTotal = data.meta?.total ?? this.featured.length
        return this.featured
      } catch (_) {
        this.featured = DEMO_PROJECTS.slice(0, limit)
        this.featuredTotal = DEMO_PROJECTS.length
        return this.featured
      } finally {
        this.featuredLoading = false
      }
    },

    // TODO API — GET /public/projects?page&per_page&search&department_id&degree
    // response: { data: [Project], meta: { current_page, last_page, total } }
    async fetchProjects(params = {}) {
      this.projectsLoading = true
      this.projectsError = null
      try {
        const { data } = await publicApi.getProjects({
          per_page: DEFAULT_PAGE_SIZE,
          ...params
        })
        this.projects = data.data || data
        this.projectsMeta = data.meta || null
        return this.projects
      } catch (_) {
        const page = Number(params.page) || 1
        const perPage = DEFAULT_PAGE_SIZE
        this.projects = DEMO_PROJECTS.slice((page - 1) * perPage, page * perPage)
        this.projectsMeta = {
          current_page: page,
          last_page: Math.ceil(DEMO_PROJECTS.length / perPage),
          total: DEMO_PROJECTS.length
        }
        return this.projects
      } finally {
        this.projectsLoading = false
      }
    },

    // TODO API — GET /public/departments
    // response: { data: [{ id, name, programs: [{ id, name, degree }] }] }
    async fetchDepartments() {
      if (this.departments.length) return this.departments
      this.departmentsLoading = true
      try {
        const { data } = await publicApi.getDepartments()
        this.departments = data.data || data
        return this.departments
      } catch (_) {
        this.departments = DEMO_DEPARTMENTS
        return this.departments
      } finally {
        this.departmentsLoading = false
      }
    }
  }
})
