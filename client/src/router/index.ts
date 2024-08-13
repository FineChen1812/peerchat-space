import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('~/views/Home/index.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('~/views/login/index.vue')
    }
  ]
})

export default router