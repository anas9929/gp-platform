import LandingLayout from '@/layouts/LandingLayout.vue'

export default [
  {
    path: '/',
    component: LandingLayout,
    children: [
      {
        path: '',
        name: 'landing',
        component: () => import('@/views/landing/LandingPage.vue'),
        meta: { title: 'الرئيسية' }
      },
      {
        path: 'projects/:id',
        name: 'project-showcase',
        component: () => import('@/views/landing/ProjectShowcasePage.vue'),
        props: true,
        meta: { title: 'عرض المشروع' }
      }
    ]
  }
]
