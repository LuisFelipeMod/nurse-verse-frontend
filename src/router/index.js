import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Protocolos from '@/views/Protocolos.vue'
import Roteiros from '@/views/Roteiros.vue'
import Upload from '@/views/Upload.vue'
import Anotacoes from '@/views/Anotacoes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Dashboard - NurseVerse'
      }
    },
    {
      path: '/protocolos',
      name: 'protocolos',
      component: Protocolos,
      meta: {
        title: 'Protocolos - NurseVerse'
      }
    },
    {
      path: '/roteiros',
      name: 'roteiros',
      component: Roteiros,
      meta: {
        title: 'Roteiros - NurseVerse'
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload,
      meta: {
        title: 'Upload de Documentos - NurseVerse'
      }
    },
    {
      path: '/anotacoes',
      name: 'anotacoes',
      component: Anotacoes,
      meta: {
        title: 'Anotações - NurseVerse'
      }
    }
  ]
})

// Atualizar título da página
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'NurseVerse'
  next()
})

export default router
