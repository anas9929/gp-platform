<template>
  <nav
    :class="[
      'sticky top-0 z-sticky-header backdrop-blur-md border-b transition-all duration-base',
      isScrolled
        ? 'bg-surface/90 border-border shadow-[0_4px_20px_-12px_rgba(15,23,42,.15)]'
        : 'bg-bg/85 border-transparent'
    ]"
  >
    <div class="max-w-content mx-auto flex items-center justify-between gap-4 px-6 py-4">
      <router-link to="/" class="flex items-center gap-2.5 font-cairo font-extrabold text-[15px] text-text-900">
        <span class="grid place-items-center w-[34px] h-[34px] rounded-sm bg-gradient-to-bl from-primary-600 to-accent-500 text-white shrink-0">
          <AppIcon name="graduation" :size="17" :stroke-width="2.2" />
        </span>
        <span class="hidden sm:block">منصة إدارة مشاريع التخرج</span>
      </router-link>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="grid place-items-center w-[38px] h-[38px] rounded-pill border border-border bg-surface text-text-600 hover:-translate-y-px hover:text-primary-700 transition-transform duration-fast"
          :aria-label="isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'"
          @click="toggleTheme"
        >
          <AppIcon :name="isDark ? 'sun' : 'moon'" :size="16" />
        </button>

        <router-link
          :to="loginTarget"
          class="flex items-center gap-2 h-10 px-5 rounded-pill bg-gradient-to-bl from-primary-600 to-primary-700 text-white font-bold text-caption shadow-[0_8px_18px_-8px_rgba(37,99,235,.5)] hover:-translate-y-px transition-transform duration-fast"
        >
          <AppIcon name="login" :size="14" :stroke-width="2.4" />
          {{ isAuthenticated ? 'لوحة التحكم' : 'تسجيل الدخول' }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useUiStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import AppIcon from '@/components/icons/AppIcon.vue'

export default {
  name: 'LandingNavBar',

  components: { AppIcon },

  data() {
    return {
      isScrolled: false
    }
  },

  computed: {
    ...mapState(useUiStore, ['isDark']),
    ...mapState(useAuthStore, ['isAuthenticated', 'homeRoute']),

    loginTarget() {
      return this.isAuthenticated ? this.homeRoute : { name: 'login' }
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    this.handleScroll()
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    ...mapActions(useUiStore, ['toggleTheme']),

    handleScroll() {
      this.isScrolled = window.scrollY > 10
    }
  }
}
</script>
