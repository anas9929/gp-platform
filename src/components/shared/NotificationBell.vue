<template>
  <div ref="clickOutsideRoot" class="relative">
    <button
      type="button"
      class="relative grid place-items-center w-icon-btn h-icon-btn rounded-sm border border-border text-text-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-colors duration-fast"
      :aria-expanded="isOpen"
      aria-label="الإشعارات"
      @click="toggleOpen"
    >
      <Bell :size="20" />
      <span
        v-if="unreadCount"
        class="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-pill bg-error text-white text-[10px] font-bold"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <transition
      enter-active-class="transition duration-base"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-fast"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 mt-2 w-[320px] max-w-[calc(100vw-2rem)] rounded-md bg-surface border border-border shadow-dropdown z-dropdown overflow-hidden"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-border-soft">
          <h2 class="font-cairo font-bold text-h4 text-text-900">الإشعارات</h2>
          <button
            v-if="hasUnread"
            type="button"
            class="text-caption text-primary-600 hover:text-primary-700 font-medium"
            @click="handleMarkAll"
          >
            تعليم الكل كمقروء
          </button>
        </div>

        <div class="max-h-[360px] overflow-y-auto scrollbar-thin">
          <LoadingSpinner v-if="isLoading" class="py-8" />

          <p v-else-if="error" class="px-4 py-6 text-center text-body-sm text-error">
            {{ error }}
          </p>

          <p v-else-if="!items.length" class="px-4 py-8 text-center text-body-sm text-text-400">
            لا توجد إشعارات بعد
          </p>

          <ul v-else class="divide-y divide-border-soft">
            <li
              v-for="item in items"
              :key="item.id"
              :class="['px-4 py-3 cursor-pointer transition-colors duration-fast hover:bg-border-soft', !item.is_read && 'bg-primary-50/60']"
              @click="handleRead(item)"
            >
              <p class="text-body-sm font-semibold text-text-900">{{ item.title }}</p>
              <p class="text-caption text-text-600 mt-0.5 line-clamp-2">{{ item.body }}</p>
              <p class="text-label text-text-400 mt-1">{{ formatRelativeTime(item.created_at) }}</p>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { Bell } from 'lucide-vue-next'
import clickOutsideMixin from '@/mixins/clickOutside.mixin'
import { useNotificationsStore } from '@/stores/notifications.store'
import { formatRelativeTime } from '@/utils/formatters'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

export default {
  name: 'NotificationBell',

  components: { Bell, LoadingSpinner },

  mixins: [clickOutsideMixin],

  computed: {
    ...mapState(useNotificationsStore, ['items', 'unreadCount', 'isLoading', 'error', 'hasUnread'])
  },

  watch: {
    isOpen(open) {
      // TODO API — GET /notifications?page=1
      if (open && !this.items.length) this.fetchNotifications().catch(() => {})
    }
  },

  created() {
    // TODO API — GET /notifications/unread-count | response: { count }
    this.fetchUnreadCount()
  },

  methods: {
    ...mapActions(useNotificationsStore, ['fetchNotifications', 'fetchUnreadCount', 'markAsRead', 'markAllAsRead']),
    formatRelativeTime,

    // TODO API — POST /notifications/:id/read
    async handleRead(item) {
      if (!item.is_read) await this.markAsRead(item.id)
      if (item.link) this.$router.push(item.link)
      this.closeDropdown()
    },

    // TODO API — POST /notifications/read-all
    async handleMarkAll() {
      try {
        await this.markAllAsRead()
        this.$toast?.success('تم تعليم كل الإشعارات كمقروءة')
      } catch (err) {
        this.$toast?.error(err.normalized?.message || 'تعذّر تنفيذ العملية')
      }
    }
  }
}
</script>
