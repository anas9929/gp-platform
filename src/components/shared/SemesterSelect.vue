<template>
  <div class="relative">
    <label class="sr-only" for="semester-select">الفصل الدراسي</label>
    <select
      id="semester-select"
      :value="activeSemesterId"
      :disabled="semestersLoading || !semesters.length"
      class="w-full sm:w-auto h-icon-btn ps-3 pe-9 rounded-sm border border-border bg-surface text-body-sm text-text-700 font-medium appearance-none cursor-pointer transition-colors duration-fast hover:border-primary-100 disabled:opacity-60 disabled:cursor-not-allowed"
      @change="onChange"
    >
      <option v-if="semestersLoading" value="">جارٍ التحميل…</option>
      <option v-else-if="!semesters.length" value="">لا توجد فصول</option>
      <option v-for="semester in semesters" :key="semester.id" :value="semester.id">
        {{ semester.name }}
      </option>
    </select>
    <ChevronDown
      :size="16"
      class="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 text-text-400"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { ChevronDown } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui.store'

export default {
  name: 'SemesterSelect',

  components: { ChevronDown },

  emits: ['change'],

  computed: {
    ...mapState(useUiStore, ['semesters', 'activeSemesterId', 'semestersLoading'])
  },

  created() {
    if (!this.semesters.length) {
      // TODO API — GET /semesters | response: [{ id, name, is_active }]
      this.fetchSemesters().catch(() => {})
    }
  },

  methods: {
    ...mapActions(useUiStore, ['fetchSemesters', 'setActiveSemester']),

    onChange(event) {
      this.setActiveSemester(event.target.value)
      this.$emit('change', event.target.value)
      // تغيير الفصل يعيد تحميل بيانات الصفحة الحالية
      this.$router.replace({ query: { ...this.$route.query, _s: event.target.value } })
    }
  }
}
</script>
