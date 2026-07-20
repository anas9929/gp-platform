/**
 * Mixin يغلق أي عنصر منسدل عند الضغط خارجه أو ضغط Escape.
 * الاستخدام:
 *   mixins: [clickOutsideMixin]
 *   data() { return { isOpen: false } }
 *   template: <div ref="clickOutsideRoot"> ... </div>
 * ويمكن تخصيص اسم الـ ref أو الحالة عبر options أدناه.
 */
export default {
  data() {
    return {
      isOpen: false
    }
  },

  mounted() {
    document.addEventListener('mousedown', this.handleOutsideClick)
    document.addEventListener('keydown', this.handleEscapeKey)
  },

  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick)
    document.removeEventListener('keydown', this.handleEscapeKey)
  },

  methods: {
    handleOutsideClick(event) {
      const root = this.$refs.clickOutsideRoot
      if (!this.isOpen || !root) return
      const el = root.$el || root
      if (!el.contains(event.target)) {
        this.isOpen = false
        this.$emit('outside-close')
      }
    },

    handleEscapeKey(event) {
      if (event.key === 'Escape' && this.isOpen) {
        this.isOpen = false
        this.$emit('outside-close')
      }
    },

    toggleOpen() {
      this.isOpen = !this.isOpen
    },

    closeDropdown() {
      this.isOpen = false
    }
  }
}
