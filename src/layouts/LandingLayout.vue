<template>
  <div class="min-h-screen bg-bg flex flex-col">
    <NavBar />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import NavBar from '@/components/landing/NavBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

export default {
  name: 'LandingLayout',
  components: { NavBar, AppFooter }
}
</script>
