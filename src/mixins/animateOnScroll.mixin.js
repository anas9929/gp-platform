/**
 * ظهور العناصر تدريجيًا عند التمرير — بدون Options API لكسر الأصول.
 * الاستخدام: mixins: [animateOnScrollMixin]
 * ثم على أي عنصر: <div class="reveal">
 * العناصر تحمل class="reveal" وتُضاف لها "is-visible" عند الظهور.
 */
export default {
  data() {
    return {
      scrollObserver: null
    }
  },

  mounted() {
    // احترام تفضيل تقليل الحركة: إظهار كل شيء فورًا
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !('IntersectionObserver' in window)) {
      this.revealAll()
      return
    }

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            this.scrollObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    this.observeReveals()
  },

  beforeUnmount() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect()
      this.scrollObserver = null
    }
  },

  methods: {
    /** يُستدعى بعد أي تحديث لمكوّنات محجوبة من الـ API */
    observeReveals() {
      if (!this.scrollObserver) return
      this.$nextTick(() => {
        this.$el.querySelectorAll?.('.reveal:not(.is-visible)').forEach((el) => {
          this.scrollObserver.observe(el)
        })
      })
    },

    revealAll() {
      this.$nextTick(() => {
        this.$el.querySelectorAll?.('.reveal').forEach((el) => el.classList.add('is-visible'))
      })
    }
  }
}
