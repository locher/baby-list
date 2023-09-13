import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import('../views/ListUser.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/ListAdmin.vue')
    },
    {
      path: '/delete-reservation/:uuid',
      name: 'delete-reservation',
      component: () => import('../views/DeleteReservation.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
