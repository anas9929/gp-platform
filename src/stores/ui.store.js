import { defineStore } from 'pinia'
import sharedApi from '@/services/endpoints/shared.api'
import { STORAGE_KEYS, SIDEBAR_BREAKPOINT } from '@/utils/constants'

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarOpen: false,          // حالة الـ Drawer على الشاشات الصغيرة فقط
    isDesktop: window.innerWidth >= SIDEBAR_BREAKPOINT,
    theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'light',

    semesters: [],
    activeSemesterId: localStorage.getItem(STORAGE_KEYS.SEMESTER) || null,
    semestersLoading: false,
    semestersError: null,

    toasts: []
  }),

  getters: {
    activeSemester: (state) =>
      state.semesters.find((s) => String(s.id) === String(state.activeSemesterId)) || null,
    isDark: (state) => state.theme === 'dark'
  },

  actions: {
    openSidebar() {
      this.sidebarOpen = true
    },
    closeSidebar() {
      this.sidebarOpen = false
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setIsDesktop(value) {
      this.isDesktop = value
      if (value) this.sidebarOpen = false
    },

    setTheme(theme) {
      this.theme = theme
      localStorage.setItem(STORAGE_KEYS.THEME, theme)
      document.documentElement.setAttribute('data-theme', theme)
    },
    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },
    initTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    },

    // TODO API — GET /semesters | response: [{ id, name, is_active }]
    async fetchSemesters() {
      this.semestersLoading = true
      this.semestersError = null
      try {
        const { data } = await sharedApi.getSemesters()
        this.semesters = data.data || data
        if (!this.activeSemesterId && this.semesters.length) {
          const current = this.semesters.find((s) => s.is_active) || this.semesters[0]
          this.setActiveSemester(current.id)
        }
        return this.semesters
      } catch (err) {
        this.semestersError = err.normalized?.message || 'تعذّر تحميل الفصول الدراسية'
        throw err
      } finally {
        this.semestersLoading = false
      }
    },

    setActiveSemester(id) {
      this.activeSemesterId = id
      localStorage.setItem(STORAGE_KEYS.SEMESTER, id)
    },

    /* ---- Toasts ---- */
    pushToast({ type = 'info', message, timeout = 4000 }) {
      const id = Date.now() + Math.random()
      this.toasts.push({ id, type, message })
      if (timeout) setTimeout(() => this.dismissToast(id), timeout)
      return id
    },
    dismissToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    }
  }
})
