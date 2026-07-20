import * as v from '@/utils/validators'

/**
 * Mixin تحقق فورمات موحّد بأسلوب Options API.
 * المكوّن يعرّف:
 *   data() { return { form: { email: '' } } }
 *   validationRules() { return { email: [(val) => v.required(val, 'البريد'), v.email] } }
 * ثم يستدعي: this.validateForm() قبل الإرسال، و this.errors.email بالعرض.
 */
export default {
  data() {
    return {
      errors: {},
      touched: {}
    }
  },

  computed: {
    hasErrors() {
      return Object.values(this.errors).some(Boolean)
    }
  },

  methods: {
    /** يُعاد تعريفها بالمكوّن — تُعيد كائن قواعد لكل حقل */
    validationRules() {
      return {}
    },

    validateField(field) {
      const rules = this.validationRules()[field]
      if (!rules) return true
      const value = this.form?.[field]
      for (const rule of rules) {
        const message = rule(value)
        if (message) {
          this.errors = { ...this.errors, [field]: message }
          return false
        }
      }
      this.errors = { ...this.errors, [field]: '' }
      return true
    },

    touchField(field) {
      this.touched = { ...this.touched, [field]: true }
      this.validateField(field)
    },

    validateForm() {
      const rules = this.validationRules()
      let valid = true
      Object.keys(rules).forEach((field) => {
        this.touched = { ...this.touched, [field]: true }
        if (!this.validateField(field)) valid = false
      })
      return valid
    },

    /** عرض أخطاء التحقق القادمة من الباك إند (422) */
    applyServerErrors(fieldErrors = {}) {
      const mapped = {}
      Object.keys(fieldErrors).forEach((key) => {
        mapped[key] = Array.isArray(fieldErrors[key]) ? fieldErrors[key][0] : fieldErrors[key]
      })
      this.errors = { ...this.errors, ...mapped }
    },

    resetValidation() {
      this.errors = {}
      this.touched = {}
    },

    $v: () => v
  }
}
