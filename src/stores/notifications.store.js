import { defineStore } from 'pinia'
import sharedApi from '@/services/endpoints/shared.api'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [],
    unreadCount: 0,
    isLoading: false,
    error: null
  }),

  getters: {
    hasUnread: (state) => state.unreadCount > 0,
    latest: (state) => state.items.slice(0, 6)
  },

  actions: {
    // TODO API — GET /notifications?page=1
    // response: { data: [{ id, title, body, type, is_read, created_at }], meta }
    async fetchNotifications(params = {}) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await sharedApi.getNotifications(params)
        this.items = data.data || data
        return this.items
      } catch (err) {
        this.error = err.normalized?.message || 'تعذّر تحميل الإشعارات'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // TODO API — GET /notifications/unread-count | response: { count }
    async fetchUnreadCount() {
      try {
        const { data } = await sharedApi.getUnreadCount()
        this.unreadCount = data.count ?? 0
      } catch (_) {
        this.unreadCount = 0
      }
    },

    // TODO API — POST /notifications/:id/read | response: 204
    async markAsRead(id) {
      await sharedApi.markAsRead(id)
      const item = this.items.find((n) => n.id === id)
      if (item && !item.is_read) {
        item.is_read = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      }
    },

    // TODO API — POST /notifications/read-all | response: 204
    async markAllAsRead() {
      await sharedApi.markAllAsRead()
      this.items.forEach((n) => {
        n.is_read = true
      })
      this.unreadCount = 0
    },

    reset() {
      this.items = []
      this.unreadCount = 0
    }
  }
})
