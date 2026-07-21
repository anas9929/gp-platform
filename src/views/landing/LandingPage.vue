<template>
  <div>
    <HeroSection />
    <FeaturedProjects @loaded="observeReveals" />
    <div id="features" class="scroll-mt-20">
      <RolesSection />
    </div>
    <HowItWorksSection />
    <div id="departments" class="scroll-mt-20">
      <DepartmentsSection @loaded="observeReveals" />
    </div>
    <StatsBanner />
    <CtaSection />
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useLandingStore } from '@/stores/landing.store'
import animateOnScrollMixin from '@/mixins/animateOnScroll.mixin'

import HeroSection from '@/components/landing/HeroSection.vue'
import FeaturedProjects from '@/components/landing/FeaturedProjects.vue'
import RolesSection from '@/components/landing/RolesSection.vue'
import HowItWorksSection from '@/components/landing/HowItWorksSection.vue'
import DepartmentsSection from '@/components/landing/DepartmentsSection.vue'
import StatsBanner from '@/components/landing/StatsBanner.vue'
import CtaSection from '@/components/landing/CtaSection.vue'

export default {
  name: 'LandingPage',

  components: {
    HeroSection,
    FeaturedProjects,
    RolesSection,
    HowItWorksSection,
    DepartmentsSection,
    StatsBanner,
    CtaSection
  },

  mixins: [animateOnScrollMixin],

  created() {
    // TODO API — GET /public/stats
    // تُجلب مرة واحدة وتُستخدم في الهيرو وشريط الإحصائيات معًا
    this.fetchStats().catch(() => {})
  },

  methods: {
    ...mapActions(useLandingStore, ['fetchStats'])
  }
}
</script>
