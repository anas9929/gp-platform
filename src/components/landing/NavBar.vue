<template>
  <header class="sticky top-0 z-sticky-header bg-surface/90 backdrop-blur border-b border-border">
    <nav class="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 lg:px-6 h-16">
      <router-link to="/" class="flex items-center gap-3">
        <span class="grid place-items-center w-10 h-10 rounded-md bg-gradient-to-bl from-primary-600 to-accent-500 text-white font-cairo font-extrabold">م</span>
        <span class="font-cairo font-bold text-h4 text-text-900 hidden sm:block">منصة مشاريع التخرج</span>
      </router-link>

      <div class="flex items-center gap-2">
        <BaseButton v-if="isAuthenticated" :to="homeRoute" variant="primary" size="sm">لوحة التحكم</BaseButton>
        <BaseButton v-else :to="{ name: 'login' }" variant="primary" size="sm">تسجيل الدخول</BaseButton>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  name: 'NavBar',
  components: { BaseButton },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'homeRoute'])
  }
}
</script>
