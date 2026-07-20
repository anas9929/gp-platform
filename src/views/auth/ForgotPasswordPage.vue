<template>
  <div>
    <template v-if="!submitted">
      <h2 class="font-cairo font-extrabold text-[24px] text-text-900 mb-2">نسيت كلمة المرور؟</h2>
      <p class="text-[13px] text-text-600 mb-8">
        أدخل/ي بريدك الإلكتروني المسجّل وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
      </p>

      <form novalidate @submit.prevent="handleSubmit">
        <div class="mb-[18px]">
          <AuthTextField
            v-model="form.email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="name@academy.edu.sa"
            autocomplete="username"
            :icon="Mail"
            :error="errors.email"
            @blur="validateEmail"
          />
        </div>

        <p v-if="authError" class="mb-4 flex items-center gap-2 text-[12.5px] font-semibold text-error">
          <AppIcon name="alertCircle" :size="15" />
          {{ authError }}
        </p>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full h-[50px] rounded-sm bg-gradient-to-bl from-primary-600 to-primary-700 text-white font-cairo font-extrabold text-[14px] shadow-[0_10px_22px_-8px_rgba(37,99,235,.55)] hover:-translate-y-px transition-transform duration-fast disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2.5"
        >
          <LoadingSpinner v-if="isLoading" :size="17" inline class="text-white" />
          <template v-else>
            إرسال رابط إعادة التعيين
            <AppIcon name="chevronStart" :size="16" :stroke-width="2.4" />
          </template>
        </button>
      </form>

      <div class="flex items-center gap-3 my-6">
        <span class="flex-1 h-px bg-border" />
        <span class="text-[11px] text-text-400">أو</span>
        <span class="flex-1 h-px bg-border" />
      </div>

      <router-link
        :to="{ name: 'landing' }"
        class="flex items-center justify-center gap-2 h-icon-btn rounded-sm border border-border bg-surface text-[13px] font-bold text-text-700 hover:-translate-y-px hover:border-primary-200 hover:text-primary-700 hover:bg-primary-50 transition-all duration-fast"
      >
        <AppIcon name="home" :size="16" />
        العودة إلى الصفحة الرئيسية
      </router-link>

      <p class="mt-7 text-center text-[12.5px] text-text-400">لأعضاء لجنة الإشراف والمشرفين الأكاديميين والطلاب</p>
    </template>

    <!-- نجاح الإرسال -->
    <div v-else class="text-center">
      <span class="grid place-items-center w-16 h-16 rounded-pill bg-secondary-50 text-secondary-600 mx-auto mb-5">
        <AppIcon name="mail" :size="28" :stroke-width="2.4" />
      </span>
      <h2 class="font-cairo font-extrabold text-[20px] text-text-900 mb-2.5">تحقق من بريدك الإلكتروني</h2>
      <p class="text-[13px] text-text-600 leading-[1.8] mb-2">
        أرسلنا رابط إعادة تعيين كلمة المرور إلى<br>
        <span class="font-extrabold text-text-900">{{ sentEmail }}</span>
      </p>
      <p class="text-[12px] text-text-400">إن لم يصلك البريد، تحقّق من مجلد الرسائل غير المرغوب فيها</p>

      <button
        type="button"
        class="mt-1.5 text-[12.5px] font-bold text-primary-600 hover:underline disabled:opacity-60 disabled:pointer-events-none"
        :disabled="isLoading || resendCooldown > 0"
        @click="resend"
      >
        {{ resendCooldown > 0 ? `إعادة الإرسال بعد ${resendCooldown} ثانية` : 'إعادة إرسال الرابط' }}
      </button>

      <div class="mt-7">
        <router-link
          :to="{ name: 'login' }"
          class="inline-flex items-center gap-2 text-[12.5px] font-bold text-text-600 hover:text-primary-700 transition-colors duration-fast"
        >
          <AppIcon name="chevronEnd" :size="15" :stroke-width="2.4" />
          العودة إلى تسجيل الدخول
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { Mail } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import { required, email as emailRule } from '@/utils/validators'
import AuthTextField from '@/components/auth/AuthTextField.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

export default {
  name: 'ForgotPasswordPage',

  components: { AuthTextField, LoadingSpinner, AppIcon },

  data() {
    return {
      Mail,
      form: { email: '' },
      errors: { email: '' },
      submitted: false,
      sentEmail: '',
      resendCooldown: 0,
      resendTimer: null
    }
  },

  computed: {
    ...mapState(useAuthStore, { authError: 'error', isLoading: 'isLoading' })
  },

  beforeUnmount() {
    clearInterval(this.resendTimer)
  },

  methods: {
    ...mapActions(useAuthStore, ['forgotPassword']),

    validateEmail() {
      this.errors.email = required(this.form.email, 'البريد الإلكتروني') || emailRule(this.form.email)
      return !this.errors.email
    },

    // TODO API — POST /auth/forgot-password | body: { email }
    async handleSubmit() {
      if (!this.validateEmail()) return

      try {
        await this.forgotPassword({ email: this.form.email })
        this.sentEmail = this.form.email
        this.submitted = true
        this.startCooldown()
      } catch (err) {
        this.errors.email = err.normalized?.errors?.email?.[0] || this.errors.email
      }
    },

    async resend() {
      try {
        await this.forgotPassword({ email: this.sentEmail })
        this.startCooldown()
      } catch (_) {
        // الخطأ يُعرض عبر authError عند العودة لنموذج الإدخال
      }
    },

    startCooldown() {
      this.resendCooldown = 30
      clearInterval(this.resendTimer)
      this.resendTimer = setInterval(() => {
        this.resendCooldown -= 1
        if (this.resendCooldown <= 0) clearInterval(this.resendTimer)
      }, 1000)
    }
  }
}
</script>
