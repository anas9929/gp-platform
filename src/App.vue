<template>
  <div id="app-root" dir="rtl">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useUiStore } from '@/stores/ui.store'
import ToastContainer from '@/components/ui/ToastContainer.vue'

export default {
  name: 'App',

  components: { ToastContainer },

  created() {
    this.initTheme()
  },

  methods: {
    ...mapActions(useUiStore, ['initTheme'])
  }
}
</script>
