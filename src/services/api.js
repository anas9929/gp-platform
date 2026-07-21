import axios from 'axios'
import { STORAGE_KEYS } from '@/utils/constants'

/**
 * Instance مركزي واحد لكل طلبات المشروع.
 * لا يُستدعى axios مباشرة بأي مكان آخر.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

/* ---------------- Request interceptor: إرفاق التوكن تلقائيًا ---------------- */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // الفصل الدراسي: يُرسل كـ ?term_id= فقط إن كان محددًا صراحة — بدونه الباك إند
    // يفترض تلقائيًا الفصل الحالي (is_current: true)، فلا داعي لإرساله دائمًا
    const term = localStorage.getItem(STORAGE_KEYS.SEMESTER)
    if (term && !(config.params && 'term_id' in config.params)) {
      config.params = { ...config.params, term_id: term }
    }
    // FormData يحدد Content-Type بنفسه (boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => Promise.reject(error)
)

/* ---------------- Response interceptor: توحيد الأخطاء + معالجة 401 ---------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const data = error.response?.data

    // تجميع رسالة عربية موحّدة يستهلكها أي store/مكوّن
    let message = 'حدث خطأ غير متوقع، حاولي مرة أخرى'
    if (!error.response) {
      message = 'تعذّر الاتصال بالخادم، تحقّقي من الإنترنت'
    } else if (status === 401) {
      message = 'انتهت الجلسة، سجّلي الدخول من جديد'
    } else if (status === 403) {
      message = 'لا تملكين صلاحية للوصول إلى هذا المورد'
    } else if (status === 404) {
      message = 'المورد المطلوب غير موجود'
    } else if (status === 422) {
      message = data?.message || 'تحقّقي من البيانات المدخلة'
    } else if (status === 423) {
      message = data?.message || 'يجب تغيير كلمة المرور أولاً'
    } else if (status === 429) {
      message = 'محاولات كثيرة جدًا، حاولي بعد قليل'
    } else if (status >= 500) {
      message = 'خطأ في الخادم، حاولي لاحقًا'
    } else if (data?.message) {
      message = data.message
    }

    error.normalized = {
      status: status || 0,
      message,
      // أخطاء التحقق لكل حقل: { email: ['...'], password: ['...'] }
      errors: data?.errors || {},
      // 423: الحساب لازم يغيّر كلمة المرور قبل أي طلب آخر (عدا /logout و /me/change-password)
      mustChangePassword: status === 423
    }

    // 401 → تنظيف الجلسة وإعادة التوجيه لصفحة الدخول (مرة واحدة فقط)
    if (status === 401 && !isRedirectingToLogin) {
      isRedirectingToLogin = true
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      const current = window.location.pathname + window.location.search
      const isOnAuthPage = window.location.pathname.startsWith('/login')
      if (!isOnAuthPage) {
        window.location.replace(`/login?redirect=${encodeURIComponent(current)}`)
      } else {
        isRedirectingToLogin = false
      }
    }

    return Promise.reject(error)
  }
)

let isRedirectingToLogin = false

export default api
