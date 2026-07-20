import CommitteeLayout from '@/layouts/CommitteeLayout.vue'
import { ROLES } from '@/utils/constants'

/** مسارات لوحة لجنة الإشراف — تُضاف صفحة بصفحة حسب الوصف */
export default [
  {
    path: '/committee',
    component: CommitteeLayout,
    meta: { requiresAuth: true, roles: [ROLES.COMMITTEE] },
    children: [
      {
        path: '',
        name: 'committee-dashboard',
        component: () => import('@/views/committee/DashboardPage.vue'),
        meta: { title: 'لوحة لجنة الإشراف' }
      }
      // تُضاف بقية الصفحات هنا وقت وصفها
    ]
  }
]
