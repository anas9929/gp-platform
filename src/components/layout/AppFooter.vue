<template>
  <footer class="bg-primary-900 text-white/80 mt-16">
    <div class="max-w-6xl mx-auto px-4 lg:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="font-cairo font-bold text-white">منصة إدارة مشاريع التخرج</p>
      <p class="text-caption">© {{ year }} — جميع الحقوق محفوظة</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>
