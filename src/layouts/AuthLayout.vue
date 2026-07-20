<template>
  <div class="min-h-screen bg-bg grid lg:grid-cols-2">
    <!-- لوحة الهوية — تظهر على الشاشات الكبيرة فقط -->
    <aside class="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-bl from-primary-900 via-primary-700 to-accent-600 text-white">
      <router-link to="/" class="flex items-center gap-3 w-fit">
        <span class="grid place-items-center w-11 h-11 rounded-md bg-white/15 backdrop-blur font-cairo font-extrabold text-h3">م</span>
        <span class="font-cairo font-bold text-h3">منصة مشاريع التخرج</span>
      </router-link>

      <div class="max-w-md">
        <h2 class="font-cairo font-extrabold text-[34px] leading-tight">
          مشاريع التخرج كلها في مكان واحد
        </h2>
        <p class="mt-4 text-body text-white/80 leading-relaxed">
          تقديم المقترحات، توزيع المشرفين، متابعة التسليمات، والتقييم — بمسار واضح لكل طالب ولجنة ومشرف.
        </p>
      </div>

      <p class="text-caption text-white/60">© {{ year }} — جميع الحقوق محفوظة</p>
    </aside>

    <!-- الفورم -->
    <main class="flex items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-[420px]">
        <router-link to="/" class="lg:hidden flex items-center gap-3 mb-8">
          <span class="grid place-items-center w-11 h-11 rounded-md bg-gradient-to-bl from-primary-600 to-accent-500 text-white font-cairo font-extrabold">م</span>
          <span class="font-cairo font-bold text-h3 text-text-900">منصة مشاريع التخرج</span>
        </router-link>

        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>
