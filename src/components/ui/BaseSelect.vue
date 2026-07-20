<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="block mb-2 text-label font-semibold text-text-700">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        :class="[
          'w-full h-icon-btn ps-3 pe-9 rounded-sm border bg-surface text-body text-text-900 appearance-none cursor-pointer transition-colors duration-fast',
          error ? 'border-error' : 'border-border focus:border-primary-600',
          disabled && 'bg-border-soft cursor-not-allowed opacity-70'
        ]"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="option in normalizedOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ChevronDown :size="16" class="pointer-events-none absolute top-1/2 -translate-y-1/2 end-3 text-text-400" />
    </div>

    <p v-if="error" class="mt-1.5 text-label text-error">{{ error }}</p>
  </div>
</template>

<script>
import { ChevronDown } from 'lucide-vue-next'

let uid = 0

export default {
  name: 'BaseSelect',

  components: { ChevronDown },

  props: {
    modelValue: { type: [String, Number], default: '' },
    options: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    error: { type: String, default: '' },
    valueKey: { type: String, default: 'value' },
    labelKey: { type: String, default: 'label' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },

  emits: ['update:modelValue'],

  data() {
    uid += 1
    return { selectId: `select-${uid}` }
  },

  computed: {
    normalizedOptions() {
      return this.options.map((option) =>
        typeof option === 'object'
          ? { value: option[this.valueKey], label: option[this.labelKey] }
          : { value: option, label: option }
      )
    }
  }
}
</script>
