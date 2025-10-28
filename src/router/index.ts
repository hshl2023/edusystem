import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import TeacherDashboard from '@/views/TeacherDashboard.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: TeacherDashboard,
      meta: { requiresAuth: true, role: 'teacher' }
    },
    {
      path: '/student',
      name: 'student',
      component: StudentDashboard,
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role as string | undefined

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (requiredRole && authStore.user?.role !== requiredRole) {
    if (authStore.user?.role === 'admin') {
      next('/admin')
    } else if (authStore.user?.role === 'teacher') {
      next('/teacher')
    } else if (authStore.user?.role === 'student') {
      next('/student')
    } else {
      next('/login')
    }
    return
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    if (authStore.user?.role === 'admin') {
      next('/admin')
    } else if (authStore.user?.role === 'teacher') {
      next('/teacher')
    } else if (authStore.user?.role === 'student') {
      next('/student')
    } else {
      next()
    }
    return
  }

  next()
})

export default router
