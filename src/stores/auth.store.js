import { defineStore } from 'pinia'
import authApi from '@/services/endpoints/auth.api'
import { STORAGE_KEYS, ROLE_HOME_ROUTE } from '@/utils/constants'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'),
    token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
    isLoading: false,
    error: null,
    fieldErrors: {}
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    role: (state) => state.user?.role || null,
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    avatarUrl: (state) => state.user?.avatar_url || null,
    homeRoute: (state) => ROLE_HOME_ROUTE[state.user?.role] || '/login',
    hasRole: (state) => (roles) => {
      if (!state.user?.role) return false
      const list = Array.isArray(roles) ? roles : [roles]
      return list.includes(state.user.role)
    }
  },

  actions: {
    /** حفظ الجلسة بالحالة والتخزين المحلي */
    setSession({ token, user }) {
      this.token = token
      this.user = user
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    },

    clearSession() {
      this.token = null
      this.user = null
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    },

    // POST /login | body: { email, password }
    // response: { user: { id, name, email, role, must_change_password, ... }, token }
    async login(credentials) {
      this.isLoading = true
      this.error = null
      this.fieldErrors = {}
      try {
        const { data } = await authApi.login(credentials)
        this.setSession({ token: data.token, user: data.user })
        return data.user
      } catch (err) {
        this.error = err.normalized?.message || 'تعذّر تسجيل الدخول'
        this.fieldErrors = err.normalized?.errors || {}
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // POST /logout
    async logout() {
      try {
        await authApi.logout()
      } catch (_) {
        // حتى لو فشل النداء، الجلسة المحلية تُنظَّف
      } finally {
        this.clearSession()
      }
    },

    // GET /me | response: { user }
    /** استعادة الجلسة عند إعادة تحميل الصفحة */
    async fetchCurrentUser() {
      if (!this.token) return null
      try {
        const { data } = await authApi.me()
        const user = data.user || data
        this.user = user
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
        return user
      } catch (err) {
        this.clearSession()
        return null
      }
    },

    // POST /me/change-password | body: { current_password, password, password_confirmation }
    async changePassword(payload) {
      this.isLoading = true
      this.error = null
      this.fieldErrors = {}
      try {
        const { data } = await authApi.changePassword(payload)
        return data
      } catch (err) {
        this.error = err.normalized?.message
        this.fieldErrors = err.normalized?.errors || {}
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // POST /invite/{token}/accept | body: { password, password_confirmation }
    async acceptInvite(token, payload) {
      this.isLoading = true
      this.error = null
      this.fieldErrors = {}
      try {
        const { data } = await authApi.acceptInvite(token, payload)
        return data
      } catch (err) {
        this.error = err.normalized?.message
        this.fieldErrors = err.normalized?.errors || {}
        throw err
      } finally {
        this.isLoading = false
      }
    },

    /**
     * لا يوجد "نسيت كلمة المرور" ذاتي الخدمة بهذا الباك إند (راجع docs/api-reference.html
     * قسم 9 — "أخبار جيدة": كلمات المرور تُدار حصرًا عبر روابط دعوة لمرة واحدة).
     * تُبقى هذه الدالة لتفادي كسر ForgotPasswordPage.vue الحالية، لكنها ترفض دومًا
     * برسالة صريحة بدل مناداة endpoint غير موجود.
     */
    async forgotPassword() {
      const message = 'استعادة كلمة المرور غير متاحة حاليًا — تواصلي مع لجنة الإشراف لإرسال رابط دعوة جديد'
      this.error = message
      throw Object.assign(new Error(message), { normalized: { status: 0, message, errors: {} } })
    }
  }
})
