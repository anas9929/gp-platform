<template>
  <section class="py-14 sm:py-20 bg-surface border-y border-border-soft">
    <div class="max-w-content mx-auto px-6">
      <div class="reveal text-center max-w-[640px] mx-auto mb-11">
        <span class="inline-block px-4 py-1.5 rounded-pill bg-primary-50 text-primary-700 text-label font-bold mb-3.5">
          الأقسام والتخصصات
        </span>
        <h2 class="font-cairo font-extrabold text-sec-title-sm sm:text-sec-title text-text-900">تخصصات العمادة</h2>
      </div>

      <!-- تحميل -->
      <div v-if="departmentsLoading" class="grid lg:grid-cols-2 gap-6">
        <div v-for="n in 2" :key="n" class="p-[26px] rounded-lg bg-surface border border-border shadow-card space-y-4">
          <div class="h-10 w-1/2 rounded-sm bg-border-soft animate-pulse" />
          <div class="h-4 w-full rounded-sm bg-border-soft animate-pulse" />
          <div class="h-4 w-4/5 rounded-sm bg-border-soft animate-pulse" />
        </div>
      </div>

      <!-- خطأ / فارغ -->
      <p v-else-if="departmentsError" class="text-center text-body-sm text-text-400 py-8">{{ departmentsError }}</p>
      <p v-else-if="!departments.length" class="text-center text-body-sm text-text-400 py-8">
        لم تُضَف الأقسام بعد.
      </p>

      <!-- المحتوى -->
      <div v-else class="grid lg:grid-cols-2 gap-6">
        <article
          v-for="(department, index) in departments"
          :key="department.id"
          class="reveal p-[26px] rounded-lg bg-surface border border-border shadow-card"
          :style="{ transitionDelay: `${index * 80}ms` }"
        >
          <div class="flex items-center gap-3 mb-[18px]">
            <span class="grid place-items-center w-10 h-10 rounded-md bg-accent-50 text-accent-600 shrink-0">
              <AppIcon :name="index % 2 === 0 ? 'monitor' : 'barChart'" :size="18" />
            </span>
            <h3 class="font-cairo font-extrabold text-[15.5px] text-text-900">{{ department.name }}</h3>
          </div>

          <ul class="flex flex-col gap-3">
            <li
              v-for="program in department.programs || []"
              :key="program.id"
              class="flex items-center gap-2.5 text-body-sm font-semibold text-text-700"
            >
              <AppIcon name="star" :size="14" class="text-primary-500 shrink-0" />
              {{ program.name }}<span v-if="program.degree">&nbsp;"{{ program.degree }}"</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useLandingStore } from '@/stores/landing.store'
import AppIcon from '@/components/icons/AppIcon.vue'

export default {
  name: 'DepartmentsSection',

  components: { AppIcon },

  emits: ['loaded'],

  computed: {
    ...mapState(useLandingStore, ['departments', 'departmentsLoading', 'departmentsError'])
  },

  created() {
    this.loadDepartments()
  },

  methods: {
    ...mapActions(useLandingStore, ['fetchDepartments']),

    // TODO API — GET /public/departments
    // response: { data: [{ id, name, programs: [{ id, name, degree }] }] }
    async loadDepartments() {
      await this.fetchDepartments()
      this.$emit('loaded')
    }
  }
}
</script>
