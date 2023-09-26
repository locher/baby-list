import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "@/stores/auth.js";
import {checkToken} from "@/apis/login.js";

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import('../views/ListUser.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/ListAdmin.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/delete-reservation/:uuid',
      name: 'delete-reservation',
      component: () => import('../views/DeleteReservation.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginForm.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/mot-de-passe-oublie',
      name: 'passwordForgot',
      component: () => import('../views/LoginRequestPassword.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/reset-password/:uuid',
      name: 'changePassword',
      component: () => import('../views/LoginChangePassword.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const isAdmin = await auth.isAdmin()

  if (to.meta.requiresAuth && !isAdmin) {
    next('/login')
  } else {
    next()
  }
})

export default router
