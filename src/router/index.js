import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Protocolos from '@/views/Protocolos.vue'
import Roteiros from '@/views/Roteiros.vue'
import Upload from '@/views/Upload.vue'
import Anotacoes from '@/views/Anotacoes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'Login - NurseVerse',
        guest: true
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Dashboard - NurseVerse',
        requiresAuth: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Home,
      meta: {
        title: 'Dashboard - NurseVerse',
        requiresAuth: true
      }
    },
    {
      path: '/protocolos',
      name: 'protocolos',
      component: Protocolos,
      meta: {
        title: 'Protocolos - NurseVerse',
        requiresAuth: true
      }
    },
    {
      path: '/roteiros',
      name: 'roteiros',
      component: Roteiros,
      meta: {
        title: 'Roteiros - NurseVerse',
        requiresAuth: true
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload,
      meta: {
        title: 'Upload de Documentos - NurseVerse',
        requiresAuth: true
      }
    },
    {
      path: '/anotacoes',
      name: 'anotacoes',
      component: Anotacoes,
      meta: {
        title: 'Anotações - NurseVerse',
        requiresAuth: true
      }
    }
  ]
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  // Atualizar título
  document.title = to.meta.title || 'NurseVerse'

  const authStore = useAuthStore()

  // Verificar se precisa de autenticação
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
  // Verificar se é rota de convidado (login) e usuário já está logado
  else if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'home' })
  }
  else {
    next()
  }
})

export default router
